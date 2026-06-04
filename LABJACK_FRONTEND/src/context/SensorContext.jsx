// src/context/SensorContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { socket } from "../lib/socket";

const SensorContext = createContext(null);

export function SensorProvider({ children }) {
  const [labels, setLabels] = useState([]);
  const [deviceTemp, setDeviceTemp] = useState([]);
  const [airTemp, setAirTemp] = useState([]);
  const [light, setLight] = useState([]);

  const [latest, setLatest] = useState({
    device_temperature: "--",
    air_temperature: "--",
    light: "--",
  });

  useEffect(() => {
    const onConnect = () => console.log("✅ socket connected:", socket.id);
    const onConnectError = (err) => console.log("❌ socket error:", err.message);

    const onSensorUpdate = (data) => {
      const timestamp = new Date().toLocaleTimeString();

      setLabels((prev) => [...prev.slice(-29), timestamp]);
      setDeviceTemp((prev) => [...prev.slice(-29), data.device_temperature]);
      setAirTemp((prev) => [...prev.slice(-29), data.air_temperature]);
      setLight((prev) => [...prev.slice(-29), data.light]);
      setLatest(data);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("sensor_update", onSensorUpdate);


    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("sensor_update", onSensorUpdate);
    };
  }, []);

  const value = useMemo(
    () => ({ labels, deviceTemp, airTemp, light, latest }),
    [labels, deviceTemp, airTemp, light, latest]
  );

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>;
}

export function useSensor() {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error("useSensor must be used inside SensorProvider");
  return ctx;
}
