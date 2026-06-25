# LabJack Realtime Dashboard — Backend

This directory contains the server-side application for acquiring, simulating, storing, and serving LabJack sensor readings.

The backend is built with Flask and Flask-SocketIO. It can run in mock mode for development or connect to a LabJack U3 / U3-HV device when real-hardware mode is enabled.

## Overview

The backend is responsible for the data acquisition layer of the LabJack Realtime Dashboard project.

It reads or simulates sensor values, broadcasts live updates to connected frontend clients, stores readings in a local SQLite database, and exposes HTTP endpoints for current readings and stored-data analysis.

This backend does not render or manage the React dashboard. Its responsibility ends at acquiring, storing, analyzing, and serving sensor data.

## What the Backend Does

* Connects to a LabJack U3 / U3-HV device when real-hardware mode is enabled
* Generates smooth mock readings when mock mode is enabled or hardware is unavailable
* Reads device temperature, air temperature, and light level
* Broadcasts live readings through the `sensor_update` Socket.IO event
* Stores every generated or collected reading in a local SQLite database
* Exposes HTTP endpoints for current readings and stored-data analysis
* Serves Swagger API documentation through Flasgger

## Technologies

* Python
* Flask
* Flask-SocketIO
* SQLite
* Flasgger
* Flask-CORS
* LabJackPython (`u3`) for optional LabJack U3 / U3-HV access

## Requirements

* Python 3.10 or newer
* A virtual environment is recommended
* LabJack drivers and a connected LabJack U3 / U3-HV device are required only for real-hardware mode

## Installation

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Activate it on macOS or Linux:

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

For a lightweight hosted deployment without hardware libraries:

```bash
pip install -r requirements.render.txt
```

## Configuration

The application reads the following environment variables:

| Variable              | Default      | Purpose                                         |
| --------------------- | ------------ | ----------------------------------------------- |
| `APP_ENV`             | `production` | Identifies the application environment          |
| `MOCK_MODE`           | `1`          | Uses simulated readings when enabled            |
| `SENSOR_INTERVAL`     | `1.0`        | Seconds between sensor readings                 |
| `SOCKETIO_ASYNC_MODE` | automatic    | Optionally forces the Flask-SocketIO async mode |

Example for local mock mode in PowerShell:

```powershell
$env:MOCK_MODE="1"
$env:SENSOR_INTERVAL="1.0"
python app.py
```

The server listens on:

```text
http://localhost:5000
```

## Real LabJack Mode

To run with a real LabJack device, install the required LabJack drivers and Python package, connect the LabJack U3 / U3-HV, then disable mock mode:

```powershell
$env:MOCK_MODE="0"
python app.py
```

The current hardware mapping is:

* Device temperature: LabJack internal temperature converted from Kelvin to Celsius
* Air temperature: analog input `AIN0`
* Light level: analog input `AIN1`, converted to a percentage

If the device cannot be read, the application falls back to generated mock values.

## How Data Processing Works

1. The application initializes the `sensors.db` SQLite database.
2. A background task starts when the server starts or when the first Socket.IO client connects.
3. The task reads the LabJack device or generates mock values.
4. Values are rounded and emitted to all connected clients as `sensor_update`.
5. The unrounded values are inserted into the `sensor_data` table.
6. The process repeats according to `SENSOR_INTERVAL`.

Each Socket.IO payload has this shape:

```json
{
  "device_temperature": 28.15,
  "air_temperature": 23.42,
  "light": 64.8
}
```

## API Endpoints

| Method | Endpoint                  | Description                                                     |
| ------ | ------------------------- | --------------------------------------------------------------- |
| `GET`  | `/api/sensors`            | Returns all current sensor values and mock-mode status          |
| `GET`  | `/api/temperature/air`    | Returns the current air temperature                             |
| `GET`  | `/api/temperature/device` | Returns the current device temperature                          |
| `GET`  | `/api/light`              | Returns the current light level                                 |
| `GET`  | `/api/analyze`            | Returns minimum, maximum, and range values from stored readings |
| `GET`  | `/analyze`                | Displays the stored-data analysis as an HTML page               |

Flasgger exposes interactive Swagger documentation at:

```text
/apidocs/
```

## Database

The application creates `sensors.db` automatically in this directory.

The `sensor_data` table contains:

* `id`
* `timestamp`
* `device_temp`
* `air_temp`
* `light`

To inspect the record count and latest five readings:

```bash
python check_db.py
```

## Main Files

```text
app.py          Flask application, APIs, Socket.IO, and sensor loop
database.py     SQLite initialization and reading insertion
check_db.py     Small database inspection utility
templates/      Server-rendered HTML pages
static/         CSS and JavaScript for server-rendered pages
```

## Notes

This backend is designed to support both development and hardware-connected workflows.

Mock mode makes it possible to test the dashboard, API, Socket.IO events, and database flow without connecting physical hardware. Real LabJack mode can be enabled later or locally when a LabJack U3 / U3-HV device is available.

LabJack and LabJack U3-HV are product names of their respective owner. This project is an independent portfolio project and is not affiliated with or endorsed by LabJack.
