import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./styles/tailwind.css";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { SensorProvider } from "./context/SensorContext.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <SensorProvider>
      <App />
      <SpeedInsights />
    </SensorProvider>
  </HashRouter>
);
