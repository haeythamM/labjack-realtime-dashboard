import { Link } from "react-router-dom";

function Documentation() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl shadow p-5 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Documentation
              </h1>
              <p className="mt-2 text-gray-400 text-sm">
                Last updated: May 21, 2025
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 transition px-4 py-2 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="mt-8 space-y-10">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold">
                1. Security Best Practices
              </h2>
              <p className="mt-3 text-gray-300">
                To enhance the security of this project, consider the following:
              </p>
              <ul className="mt-4 list-disc list-inside text-gray-300 space-y-2">
                <li>Use HTTPS in production to encrypt communication between the client and server.</li>
                <li>Sanitize and validate all user inputs to prevent injection attacks.</li>
                <li>Implement proper CORS policies and secure API endpoints with authentication if required.</li>
                <li>Update dependencies regularly and avoid exposing sensitive data in public repositories.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold">
                2. Hardware & Circuit Documentation
              </h2>
              <p className="mt-3 text-gray-300">
                The project uses LabJack U3-HV as the main data acquisition device. Three sensors are connected:
              </p>

              <ul className="mt-4 list-disc list-inside text-gray-300 space-y-3">
                <li>
                  <strong>Air Temperature Sensor:</strong> connected to AIN0. Voltage is converted to °C using the formula:{" "}
                  <code className="ml-1 px-2 py-1 rounded bg-gray-800 text-gray-100 text-xs overflow-x-auto inline-block align-middle">
                    (Voltage * 100) / 10
                  </code>
                  .
                </li>
                <li>
                  <strong>Light Sensor:</strong> connected to AIN1. Converted to percentage with:{" "}
                  <code className="ml-1 px-2 py-1 rounded bg-gray-800 text-gray-100 text-xs overflow-x-auto inline-block align-middle">
                    (Voltage / 5.0) * 100
                  </code>
                  .
                </li>
                <li>
                  <strong>Internal Temperature:</strong> read directly from LabJack’s internal sensor and converted from Kelvin to Celsius.
                </li>
              </ul>

              <p className="mt-4 text-gray-300">
                If using resistive sensors (e.g., thermistors or photoresistors), consider placing a fixed resistor in a voltage divider configuration and apply Ohm’s law to calculate resistance.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold">
                3. About LabJack U3-HV
              </h2>
              <p className="mt-3 text-gray-300">
                The LabJack U3-HV is a USB-based data acquisition device with analog and digital I/O. It supports high-voltage (HV) analog inputs for direct sensor interfacing. Ideal for learning and small automation projects.
              </p>
            </section>

            <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Haeytham Almalak - All rights reserved.
              </p>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition px-4 py-2 text-sm font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;
