import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useSensor } from "../context/SensorContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function LiveChart() {
  const { labels, deviceTemp, airTemp, light, latest } = useSensor();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#cbd5e1" } } },
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
    },
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Device Temp (°C)",
        data: deviceTemp,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14,165,233,0.3)",
        tension: 0.4,
      },
      {
        label: "Air Temp (°C)",
        data: airTemp,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.3)",
        tension: 0.4,
      },
      {
        label: "Light (%)",
        data: light,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.3)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      { label: "Device Temp (°C)", data: deviceTemp, backgroundColor: "#0ea5e9" },
      { label: "Air Temp (°C)", data: airTemp, backgroundColor: "#10b981" },
      { label: "Light (%)", data: light, backgroundColor: "#facc15" },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-4 text-white space-y-10">
      <h1 className="text-3xl font-bold text-center mb-6">Live Sensor Data</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="text-xl mb-2">Device Temp</h2>
          <p className="text-3xl text-cyan-400">{latest.device_temperature} °C</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="text-xl mb-2">Air Temp</h2>
          <p className="text-3xl text-emerald-400">{latest.air_temperature} °C</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="text-xl mb-2">Light</h2>
          <p className="text-3xl text-yellow-400">{latest.light} %</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded shadow" style={{ height: "400px" }}>
        <h2 className="text-xl mb-2">Line Chart (All Sensors)</h2>
        <Line data={lineData} options={chartOptions} />
      </div>

      <div className="bg-gray-800 p-6 rounded shadow" style={{ height: "400px" }}>
        <h2 className="text-xl mb-2">Bar Chart (All Sensors)</h2>
        <Bar data={barData} options={chartOptions} />
      </div>
    </div>
  );
}

export default LiveChart;
