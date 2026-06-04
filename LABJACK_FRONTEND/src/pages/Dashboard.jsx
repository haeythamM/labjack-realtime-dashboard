import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Bar, Line, Pie, Radar } from "react-chartjs-2";
import LiveChart from "../components/LiveChart";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  // ChartDataLabels
);

const baseColors = {
  min: "#facc15",
  max: "#3b82f6",
  range: "#ef4444",
};

const API = import.meta.env.VITE_API_BASE;

function normalizeBaseUrl(url) {
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function safeNum(v, digits = 1) {
  return typeof v === "number" && Number.isFinite(v) ? v.toFixed(digits) : "--";
}

function Dashboard() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);        // فقط أول تحميل
  const [refreshing, setRefreshing] = useState(false); // تحديثات بدون قطع

  const REFRESH_MS = 7000;

  const apiBase = useMemo(() => normalizeBaseUrl(API), []);
  const abortRef = useRef(null);
  const inFlightRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const lastKeyRef = useRef(""); // لمقارنة القيم ومنع إعادة الرسم إذا ماكو تغيير

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,

      // ✅ أهم شي لمنع “رمش” الشارت
      animation: false,

      plugins: {
        legend: { labels: { color: "#cbd5e1" } },
        tooltip: { enabled: true },
        datalabels: { display: false },
      },
      scales: {
        x: { ticks: { color: "#cbd5e1" }, grid: { color: "#475569" } },
        y: { ticks: { color: "#cbd5e1" }, grid: { color: "#475569" } },
        r: {
          angleLines: { color: "#475569" },
          grid: { color: "#475569" },
          pointLabels: { color: "#cbd5e1" },
          ticks: { color: "#cbd5e1", backdropColor: "transparent", z: 1 },
        },
      },
    }),
    []
  );

  const buildChartData = useCallback((json) => {
    return {
      labels: ["Device Temp", "Air Temp", "Light"],
      datasets: [
        {
          label: "Min",
          data: [json.device[0], json.air[0], json.light[0]],
          backgroundColor: baseColors.min,
          borderColor: baseColors.min,
          borderWidth: 2,
        },
        {
          label: "Max",
          data: [json.device[1], json.air[1], json.light[1]],
          backgroundColor: baseColors.max,
          borderColor: baseColors.max,
          borderWidth: 2,
        },
        {
          label: "Range",
          data: [json.device[2], json.air[2], json.light[2]],
          backgroundColor: baseColors.range,
          borderColor: baseColors.range,
          borderWidth: 2,
        },
      ],
    };
  }, []);

  const loadAnalyze = useCallback(async () => {
    if (!apiBase) {
      setError(
        "VITE_API_BASE is missing. Add it in .env and Vercel Environment Variables."
      );
      setLoading(false);
      setRefreshing(false);
      return;
    }

    // ✅ لا تبدأ طلب جديد إذا واحد شغال (يقلل jitter)
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    // Abort أي طلب سابق (احتياط)
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const isFirstLoad = !hasLoadedRef.current;

    try {
      setError("");
      if (isFirstLoad) setLoading(true);
      else setRefreshing(true);

      const res = await fetch(`${apiBase}/api/analyze`, {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const hasAll = json?.device && json?.air && json?.light;
      if (!hasAll) throw new Error("Invalid response (missing device/air/light).");

      // ✅ امنع setData إذا نفس القيم (حتى الشارت ما يعيد رسم بلا داعي)
      const key = `${json.device.join(",")}|${json.air.join(",")}|${json.light.join(",")}`;
      if (key !== lastKeyRef.current) {
        lastKeyRef.current = key;
        setData(buildChartData(json));
      }

      hasLoadedRef.current = true;
    } catch (err) {
      if (err?.name === "AbortError") return;

      console.error("Error loading /api/analyze:", err);
      setError(`Error loading /api/analyze: ${err.message}`);

      // ✅ لا تمسح data حتى ما يصير قطع
    } finally {
      setLoading(false);
      setRefreshing(false);
      inFlightRef.current = false;
    }
  }, [apiBase, buildChartData]);

  useEffect(() => {
    if (tab !== "dashboard") return;

    loadAnalyze();
    const t = setInterval(loadAnalyze, REFRESH_MS);

    return () => {
      clearInterval(t);
      if (abortRef.current) abortRef.current.abort();
      inFlightRef.current = false;
    };
  }, [tab, loadAnalyze]);

  const renderNumericSummary =
    data?.datasets?.length === 3 && data?.datasets?.[0]?.data?.length === 3 ? (
      <div className="text-sm text-slate-300 mt-4 sm:mt-6 mb-4 text-center space-y-1">
        <p>
          Device: Min {safeNum(data.datasets[0].data[0])}, Max{" "}
          {safeNum(data.datasets[1].data[0])}, Range{" "}
          {safeNum(data.datasets[2].data[0])}
        </p>
        <p>
          Air: Min {safeNum(data.datasets[0].data[1])}, Max{" "}
          {safeNum(data.datasets[1].data[1])}, Range{" "}
          {safeNum(data.datasets[2].data[1])}
        </p>
        <p>
          Light: Min {safeNum(data.datasets[0].data[2])}, Max{" "}
          {safeNum(data.datasets[1].data[2])}, Range{" "}
          {safeNum(data.datasets[2].data[2])}
        </p>
      </div>
    ) : null;

  return (
    <div className="max-w-6xl mx-auto p-4 text-white mt-6 sm:mt-10">
      {/* <div className="flex flex-col items-center gap-3 mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold text-center">
          LabJack Sensors Dashboard
        </h1>

        <div className="text-xs text-slate-400 text-center break-all">
          API: {apiBase || "—"}
        </div>
      </div> */}

      <div className="flex flex-col sm:flex-row justify-center mb-5 sm:mb-6 gap-3">
        <button
          className={`px-4 py-2 rounded transition ${
            tab === "dashboard"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setTab("dashboard")}
        >
          Collected Data
        </button>

        <button
          className={`px-4 py-2 rounded transition ${
            tab === "live" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setTab("live")}
        >
          Live
        </button>
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-500 text-red-200 p-3 rounded mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span>{error}</span>
            <button
              onClick={loadAnalyze}
              className="px-3 py-2 rounded bg-red-600 hover:bg-red-500 transition text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {tab === "dashboard" && (
        <>
          {loading && !data && (
            <p className="text-center text-slate-200">
              Loading sensor analysis...
            </p>
          )}

          {/* ✅ مكان ثابت حتى لا يصير layout shift */}
          <div
            className="h-5 mb-3 text-center text-slate-400 text-sm transition-opacity duration-200"
            style={{ opacity: refreshing && data ? 1 : 0 }}
          >
            Updating…
          </div>

          {data && (
            <>
              {renderNumericSummary}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-5 sm:mt-6">
                <div className="bg-gray-800 p-4 rounded shadow">
                  <h2 className="text-xl mb-2">Bar Chart</h2>
                  <div className="h-[320px] sm:h-[360px]">
                    <Bar data={data} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded shadow">
                  <h2 className="text-xl mb-2">Line Chart</h2>
                  <div className="h-[320px] sm:h-[360px]">
                    <Line data={data} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded shadow">
                  <h2 className="text-xl mb-2">Pie Chart (Max)</h2>
                  <div className="h-[320px] sm:h-[360px]">
                    <Pie
                      data={{
                        labels: data.labels,
                        datasets: [
                          {
                            label: "Max",
                            data: data.datasets[1].data,
                            backgroundColor: ["#facc15", "#3b82f6", "#ef4444"],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: false, // ✅ مهم
                        plugins: {
                          legend: { labels: { color: "#cbd5e1" } },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded shadow">
                  <h2 className="text-xl mb-2">Radar Chart</h2>
                  <div className="h-[320px] sm:h-[360px]">
                    <Radar data={data} options={chartOptions} />
                  </div>
                </div>
              </div>
            </>
          )}

          {!loading && !data && !error && (
            <p className="text-center text-slate-300">No data available yet.</p>
          )}
        </>
      )}

      {tab === "live" && <LiveChart />}
    </div>
  );
}

export default Dashboard;
