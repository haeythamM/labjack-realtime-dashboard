# LabJack U3-HV Realtime Dashboard

LabJack U3-HV Realtime Dashboard is an in-progress full-stack IoT and data acquisition project focused on telemetry monitoring, structured sensor data flow, and dashboard-ready time-series visualization.

The project is designed to move beyond simple data display by separating the data acquisition layer, validation logic, API flow, and frontend monitoring interface.

## Project Status

In progress.

This repository currently includes:

* A frontend dashboard for telemetry visualization
* A backend / mock API layer for development and testing
* A data flow designed for future LabJack U3-HV hardware integration

The current implementation uses simulated telemetry during development so the dashboard, data shape, and monitoring workflow can be refined before final hardware capture.

## Problem

Many data acquisition demos show raw readings without a clear structure for sampling, validation, calibration, state handling, logging, or long-term monitoring.

This project explores how telemetry data can be structured from the start so the system can later support persistence, alerts, calibration workflows, and remote monitoring.

## Goal

Build an engineering-style telemetry platform where LabJack U3-HV readings can be collected, normalized, validated, stored, and displayed through a clean realtime dashboard interface.

## Features

* Realtime-style telemetry dashboard
* Mock API for frontend development and testing
* Structured data acquisition workflow
* Live sensor update flow
* Time-series-ready data model
* Dashboard UI for monitoring sensor and channel values
* Designed for future logging, calibration, alerting, and export workflows

## Tech Stack

* LabJack U3-HV
* Python
* Flask
* Flask-SocketIO
* SQLite
* REST API
* Socket.IO
* React
* Vite
* Tailwind CSS
* Chart.js
* Data acquisition workflow
* Time-series telemetry structure

## Repository Structure

```text
labjack-realtime-dashboard/
├── LABJACK-Mock-API/      # Backend / mock API for telemetry simulation and analysis
├── LABJACK_FRONTEND/      # Frontend dashboard interface
└── README.md
```

Each folder contains its own README with setup instructions and implementation details.

## Architecture

```text
Sensors / LabJack U3-HV / Mock Input
        ↓
Acquisition API / Backend
        ↓
Validation + Normalized Readings
        ↓
Stored + Live Telemetry Data
        ↓
Frontend Dashboard
        ↓
Time-Series Visualization / Monitoring UI
```

## How It Works

1. The backend either generates mock readings or reads from a LabJack device when hardware mode is enabled.
2. Sensor values are normalized into a consistent telemetry data shape.
3. Live readings are emitted to the frontend through Socket.IO.
4. Readings can be stored in a local SQLite database.
5. The frontend displays current values, live updates, and chart-based analysis.
6. The dashboard is structured so future calibration, alerting, logging, and export features can be added cleanly.

## Current Implementation

The project currently focuses on the frontend dashboard and backend/mock API workflow.

This allows the interface, data structure, realtime behavior, and monitoring logic to be developed before final LabJack U3-HV hardware integration.

## Planned Improvements

* Connect directly to LabJack U3-HV hardware
* Add calibration workflow
* Add persistent logging improvements
* Add alert thresholds
* Add exportable telemetry records
* Improve deployment workflow
* Add final screenshots and demo documentation

## Setup

See the README files inside each project folder for setup details:

* `LABJACK-Mock-API/README.md`
* `LABJACK_FRONTEND/README.md`

## Demo

The project is documented as part of my dedicated IoT portfolio:

```text
https://iot.haeytham.dev/projects/labjack
```

## Author

Haeytham Almalak

## Notice

LabJack and LabJack U3-HV are product names of their respective owner.

This project is an independent portfolio project and is not affiliated with or endorsed by LabJack.
