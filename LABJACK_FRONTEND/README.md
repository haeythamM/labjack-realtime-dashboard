# LabJack Realtime Dashboard — Frontend

This directory contains the client-side dashboard for the LabJack U3-HV Realtime Dashboard project.

The frontend is a React application built with Vite. It displays live and collected telemetry data from the backend using HTTP requests and Socket.IO.

## Overview

The frontend is responsible for the user-facing monitoring interface. It visualizes live sensor readings, keeps a short time-series history in memory, and displays analysis data returned by the backend.

This frontend does not read LabJack hardware directly and does not write sensor readings to the database. Hardware access, data collection, persistence, and analysis are handled by the backend.

## What the Frontend Does

* Displays the latest device temperature, air temperature, and light level
* Receives live sensor readings through the `sensor_update` Socket.IO event
* Keeps the latest 30 live readings for time-series charts
* Requests stored-data statistics from `GET /api/analyze`
* Visualizes minimum, maximum, and range values with bar, line, pie, and radar charts
* Provides pages for the dashboard, live readings, documentation, privacy, and terms

## Technologies

* React 19
* Vite
* React Router
* Tailwind CSS
* Chart.js
* React Chart.js 2
* Socket.IO Client
* Vercel Speed Insights

## Requirements

* Node.js 18 or newer
* pnpm
* A running backend that exposes the required HTTP and Socket.IO services

## Configuration

Create a `.env` file inside this frontend directory:

```env
VITE_API_BASE=http://localhost:5000
```

`VITE_API_BASE` must contain the backend base URL without an API path.

The same value is used for:

* HTTP requests
* Socket.IO connection

When deploying the frontend, add `VITE_API_BASE` to the hosting provider's environment variables and set it to the deployed backend URL.

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Vite will print the local development URL in the terminal.

## Production Build

```bash
pnpm build
```

The generated production files are placed in:

```text
dist/
```

To preview the production build locally:

```bash
pnpm preview
```

## Linting

```bash
pnpm lint
```

## Frontend Data Flow

1. `src/main.jsx` starts the React application and provides the sensor state.
2. `src/lib/socket.js` creates the shared Socket.IO connection using `VITE_API_BASE`.
3. `src/context/SensorContext.jsx` listens for `sensor_update` events and stores the latest readings.
4. Dashboard components render live values and charts.
5. The collected-data dashboard requests `/api/analyze` every seven seconds.
6. Charts are redrawn only when the returned values change.

## Main Source Structure

```text
src/
├── components/     Reusable navigation, layout, and chart components
├── context/        Shared Socket.IO and sensor state
├── layouts/        Shared page layout
├── lib/            Socket.IO client initialization
├── pages/          Application pages
├── App.jsx         Routes and top-level UI structure
└── main.jsx        React application entry point
```

## Expected Backend Interface

The frontend expects the backend to provide:

* A Socket.IO event named `sensor_update`
* Live event payloads containing:

  * `device_temperature`
  * `air_temperature`
  * `light`
* `GET /api/analyze` returning:

  * `device`
  * `air`
  * `light`

Each returned analysis array should include minimum, maximum, and range values used by the dashboard charts.

## Notes

This frontend is designed to stay separate from the hardware and data acquisition layers. That separation makes it easier to test the UI with mock data, connect to a local backend during development, and later point the dashboard to a deployed backend or real LabJack data source.
