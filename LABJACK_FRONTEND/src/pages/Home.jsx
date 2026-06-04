import { Link } from "react-router-dom";
import labjackImage from "../assets/images/labjack-u3-hv-726670.webp";

function Home() {
  return (
    <div className="flex flex-col flex-grow bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white pt-16 sm:pt-24">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
          Welcome to the LabJack Sensor Dashboard
        </h2>

        <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Monitor real-time environmental data using our smart sensor system
          powered by Flask and LabJack U3-HV.
        </p>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md sm:max-w-lg">
            <img
              src={labjackImage}
              alt="LabJack U3-HV Device"
              className="rounded-2xl shadow-lg w-full h-auto object-contain bg-white/60 dark:bg-black/20 p-2"
              loading="lazy"
            />
          </div>
        </div>

        <p className="text-sm sm:text-base max-w-xl mx-auto mb-10 text-gray-600 dark:text-gray-300">
          This project collects sensor data (temperature, light) using LabJack
          U3-HV, streams it live with Socket.IO, and visualizes insights through
          a modern dashboard.
        </p>

        <div className="flex justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg transition font-medium shadow"
          >
            Go to Dashboard →
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
