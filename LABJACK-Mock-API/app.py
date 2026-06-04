# app.py
import os
import time
import math
import random
import sqlite3
from threading import Lock

from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flasgger import Swagger
from flask_socketio import SocketIO, emit

from database import init_db, insert_reading

# ========================== Optional LabJack U3 ==========================
U3_AVAILABLE = True
try:
    import u3  # LabJack library (usually NOT available on Render)
except Exception:
    U3_AVAILABLE = False

# ========================== Config ==========================
APP_ENV = os.getenv("APP_ENV", "production").lower()
# If running on Render, u3 غالباً غير متوفر، فخلي Mock افتراضي
MOCK_MODE = os.getenv("MOCK_MODE", "1").lower() in ("1", "true", "yes", "on")
SENSOR_INTERVAL = float(os.getenv("SENSOR_INTERVAL", "1.0"))

# ========================== Flask Initialization ==========================
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Swagger (docs)
swagger = Swagger(app)

# SocketIO
# على Render الأفضل eventlet + websocket/polling
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode=os.getenv("SOCKETIO_ASYNC_MODE", None)  # leave None (auto) unless you force eventlet
)

# ========================== Global Variables ==========================
d = None
thread = None
thread_lock = Lock()

# ========================== Initialize Database ==========================
init_db()

# ========================== LabJack Connection ==========================
def connect_labjack():
    """
    Try to connect to a real LabJack U3 if:
    - u3 library is available
    - MOCK_MODE is False
    """
    global d

    if d is not None:
        return

    if MOCK_MODE:
        print("🟡 MOCK_MODE enabled -> skipping LabJack connection")
        return

    if not U3_AVAILABLE:
        print("🟠 u3 library not available -> falling back to MOCK_MODE")
        return

    try:
        d = u3.U3()
        print("✅ LabJack U3 Connected")
    except Exception as e:
        print("❌ LabJack connection error:", e)
        d = None

@app.before_request
def connect_labjack_once():
    # This runs before any request; safe to call (won't reconnect repeatedly)
    connect_labjack()

# ========================== Sensor Reading Helpers ==========================
def read_from_labjack():
    """Read real sensor values from LabJack."""
    # Device temp in Kelvin -> Celsius
    temp_device = d.getTemperature() - 273.15
    # Example conversions from your code:
    temp_air = (d.getAIN(0) * 100) / 10
    light = (d.getAIN(1) / 5.0) * 100
    return float(temp_device), float(temp_air), float(light)

def read_mock_values():
    """
    Generate mock sensor values that change smoothly over time.
    This gives you a 'real' live feeling on Render.
    """
    t = time.time()

    # Smooth oscillations + small noise
    temp_device = 28 + 2.0 * math.sin(t / 8) + random.uniform(-0.2, 0.2)
    temp_air = 23 + 3.0 * math.sin(t / 10) + random.uniform(-0.3, 0.3)
    light = 60 + 25.0 * math.sin(t / 6) + random.uniform(-1.5, 1.5)

    # Clamp light between 0 and 100
    light = max(0, min(100, light))
    return float(temp_device), float(temp_air), float(light)

def get_sensor_values():
    """
    Returns (device_temp, air_temp, light) with fallback logic.
    """
    global d

    # Prefer real device if available
    if d is not None and not MOCK_MODE:
        try:
            return read_from_labjack()
        except Exception as e:
            print("❌ Sensor read error (LabJack):", e)
            # If real device fails, fallback mock
            return read_mock_values()

    # Otherwise mock
    return read_mock_values()

# ========================== Background Sensor Thread ==========================
def background_sensor_thread():
    print("🟣 background_sensor_thread() started")
    while True:
        try:
            temp_device, temp_air, light = get_sensor_values()

            payload = {
                "device_temperature": round(temp_device, 2),
                "air_temperature": round(temp_air, 2),
                "light": round(light, 2),
            }

            # Emit to all connected clients
            socketio.emit("sensor_update", payload)

            # Store in DB
            insert_reading(temp_device, temp_air, light)

        except Exception as e:
            print("❌ Background thread error:", e)
            socketio.emit("sensor_error", {"error": str(e)})

        time.sleep(SENSOR_INTERVAL)

def start_background_thread():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_sensor_thread)
            print("✅ Background sensor thread started")

# ========================== WebSocket Events ==========================
@socketio.on("connect")
def on_connect():
    start_background_thread()
    emit("connected", {"data": "Connected ✅ (live stream ready)"})
    print("🟢 WebSocket client connected")

@socketio.on("disconnect")
def on_disconnect():
    print("🔴 WebSocket client disconnected")

# ========================== HTTP Routes ==========================
@app.route("/")
@app.route("/home")
@app.route("/index")
def home():
    return render_template("index.html.j2")

@app.route("/terms")
def terms():
    return render_template("terms.html.j2")

@app.route("/privacy")
def privacy():
    return render_template("privacy.html.j2")

@app.route("/Documentation")
def documentation():
    return render_template("Documentation.html.j2")

# ========================== API Routes ==========================
@app.route("/api/sensors")
def api_sensors():
    """
    Get current sensor values
    ---
    responses:
      200:
        description: Current sensor readings
    """
    try:
        temp_device, temp_air, light = get_sensor_values()
        return jsonify({
            "device_temperature": round(temp_device, 2),
            "air_temperature": round(temp_air, 2),
            "light": round(light, 2),
            "mock_mode": bool(MOCK_MODE or not U3_AVAILABLE),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/temperature/air")
def api_air_temperature():
    """
    Get air temperature only
    ---
    responses:
      200:
        description: Air temperature in Celsius
    """
    try:
        _, temp_air, _ = get_sensor_values()
        return jsonify({"air_temperature": round(temp_air, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/temperature/device")
def api_device_temperature():
    """
    Get internal device temperature
    ---
    responses:
      200:
        description: Device temperature in Celsius
    """
    try:
        temp_device, _, _ = get_sensor_values()
        return jsonify({"device_temperature": round(temp_device, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/light")
def api_light():
    """
    Get light level percentage
    ---
    responses:
      200:
        description: Light level
    """
    try:
        _, _, light = get_sensor_values()
        return jsonify({"light": round(light, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/analyze")
def analyze_page():
    """
    Analyze sensor data (min, max, range) and show HTML page
    """
    conn = sqlite3.connect("sensors.db")
    c = conn.cursor()

    c.execute("SELECT MIN(device_temp), MAX(device_temp), MAX(device_temp)-MIN(device_temp) FROM sensor_data")
    device_stats = c.fetchone()

    c.execute("SELECT MIN(air_temp), MAX(air_temp), MAX(air_temp)-MIN(air_temp) FROM sensor_data")
    air_stats = c.fetchone()

    c.execute("SELECT MIN(light), MAX(light), MAX(light)-MIN(light) FROM sensor_data")
    light_stats = c.fetchone()

    conn.close()

    return render_template(
        "analyze.html.j2",
        device=device_stats,
        air=air_stats,
        light=light_stats
    )

@app.route("/api/analyze")
def api_analyze_data():
    """
    Analyze stored sensor data (min, max, range)
    ---
    responses:
      200:
        description: Min, Max, and Range values for each sensor type
    """
    conn = sqlite3.connect("sensors.db")
    c = conn.cursor()

    c.execute("SELECT MIN(device_temp), MAX(device_temp), MAX(device_temp)-MIN(device_temp) FROM sensor_data")
    device_stats = c.fetchone()

    c.execute("SELECT MIN(air_temp), MAX(air_temp), MAX(air_temp)-MIN(air_temp) FROM sensor_data")
    air_stats = c.fetchone()

    c.execute("SELECT MIN(light), MAX(light), MAX(light)-MIN(light) FROM sensor_data")
    light_stats = c.fetchone()

    conn.close()

    return jsonify({
        "device": device_stats,
        "air": air_stats,
        "light": light_stats
    })

# ========================== Run App (Local) ==========================
if __name__ == "__main__":
    # For local dev only
    start_background_thread()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
