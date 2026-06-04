import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";

function Live() {
  const socket = useSocket();

  const [data, setData] = useState({
    device_temperature: "--",
    air_temperature: "--",
    light: "--",
  });

  useEffect(() => {
    if (!socket) return;

    const onSensorUpdate = (sensorData) => setData(sensorData);

    socket.on("sensor_update", onSensorUpdate);

    return () => {
      // Remove listener only; keep the socket alive globally
      socket.off("sensor_update", onSensorUpdate);
    };
  }, [socket]);

  return (
    <div className="max-w-xl mx-auto p-8 bg-gray-900 text-white rounded shadow mt-16">
      <h1 className="text-3xl font-bold mb-6">Live Sensor Data</h1>

      <div className="grid gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg">Device Temperature</h2>
          <p className="text-2xl">{data.device_temperature} °C</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg">Air Temperature</h2>
          <p className="text-2xl">{data.air_temperature} °C</p>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-lg">Light Level</h2>
          <p className="text-2xl">{data.light} %</p>
        </div>
      </div>
    </div>
  );
}

export default Live;
