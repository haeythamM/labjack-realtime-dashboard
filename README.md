# LabJack U3-HV Realtime Dashboard

LabJack U3-HV Realtime Dashboard is a completed full-stack IoT and data acquisition software project designed for real-time telemetry monitoring, sensor data processing, storage, and interactive visualization.

The system integrates a Python/Flask backend, SQLite database, Socket.IO communication, and a React dashboard. It supports simulated telemetry for development and demonstration, with an optional integration path for LabJack U3-HV hardware.

## Project Status

**Completed**

The core software system has been developed, including:

- A React dashboard for real-time telemetry visualization
- A Python/Flask backend with REST API endpoints
- Real-time sensor updates using Flask-SocketIO
- SQLite database integration for recording sensor measurements
- Historical data analysis and visualization
- Simulated sensor data for testing and demonstration
- Optional LabJack U3-HV connection logic for hardware-based acquisition

The project demonstrates a complete telemetry workflow, from generating or acquiring sensor readings to storing, processing, and displaying measurements.

The hosted demonstration operates using simulated sensor data, allowing the application to function without physical LabJack hardware.

## Problem

Data acquisition applications require more than displaying sensor readings. Effective monitoring systems need structured data collection, communication between system components, historical storage, and accessible visualization.

This project addresses these requirements through a modular architecture separating the data acquisition layer, backend services, database operations, and frontend monitoring interface.

## Project Objectives

The project was developed to demonstrate the integration of hardware-oriented data acquisition principles with modern full-stack web technologies.

Its objectives include:

- Building a structured telemetry monitoring system
- Implementing real-time communication between backend and frontend
- Storing sensor measurements for historical analysis
- Providing interactive visualization of telemetry data
- Supporting hardware-independent testing through simulated data
- Establishing an optional integration path for LabJack U3-HV hardware

## Features

- Real-time telemetry dashboard
- Python/Flask REST API
- Flask-SocketIO live data streaming
- SQLite sensor data storage
- Historical measurement analysis
- Interactive React frontend
- Time-series charts and monitoring interface
- Simulated telemetry generation
- Optional LabJack U3-HV acquisition logic
- Modular frontend and backend architecture

## Tech Stack

**Hardware and Instrumentation**
- LabJack U3-HV
- Data acquisition concepts
- Analog input monitoring

**Backend**
- Python
- Flask
- Flask-SocketIO
- REST API
- SQLite
- Socket.IO

**Frontend**
- React
- Vite
- Tailwind CSS
- Chart.js

## Repository Structure

```text
labjack-realtime-dashboard/
├── LABJACK-Mock-API/
│   └── Flask backend, REST APIs,
│       SQLite and telemetry simulation
├── LABJACK_FRONTEND/
│   └── React telemetry dashboard
└── README.md
```

Each directory includes documentation and setup instructions.

## System Architecture

```text
LabJack U3-HV / Simulated Sensor Data
                 |
                 v
       Python/Flask Backend
                 |
          Data Processing
                 |
          +------+------+
          |             |
          v             v
     SQLite DB     Socket.IO / API
          |             |
          +------+------+
                 |
                 v
         React Dashboard
                 |
                 v
       Realtime Visualization
       and Historical Analysis
```

## How It Works

1. The backend generates simulated telemetry readings or attempts to acquire measurements from a connected LabJack device when hardware mode is enabled.
2. Sensor values are processed into a structured format.
3. Flask-SocketIO transmits live measurements to connected frontend clients.
4. Measurements are recorded in a local SQLite database.
5. REST API endpoints provide access to current sensor values and stored-data analysis.
6. The React dashboard presents telemetry measurements through interactive monitoring components and charts.

## Implementation

The completed software implementation includes separate frontend and backend components.

**Backend Implementation**

- Flask application with REST API endpoints
- Socket.IO communication for live telemetry updates
- SQLite database initialization and measurement storage
- Sensor simulation for hardware-independent operation
- Optional LabJack connection and acquisition functions
- Historical measurement analysis using stored data

**Frontend Implementation**

- React-based telemetry dashboard
- Live measurement visualization
- Sensor monitoring interface
- Chart-based data presentation
- Integration with backend telemetry services

## Hardware Integration

The backend includes connection logic for the LabJack U3-HV using the Python `u3` library.

When configured for hardware operation, the application attempts to read measurements from the connected device.

When hardware access is unavailable, the application can operate using simulated readings.

This architecture allows the software dashboard, API communication, database, and visualization workflow to be demonstrated independently of physical hardware.

## Possible Future Enhancements

The completed project can be extended with additional capabilities, including:

- Hardware calibration workflows
- Configurable alert thresholds
- Advanced data export functionality
- Expanded historical reporting
- Additional sensor channels
- Enhanced deployment and monitoring options

These enhancements are optional and are not required for the current software implementation.

## Setup

Installation and configuration instructions are available in the individual project directories:

- `LABJACK-Mock-API/README.md`
- `LABJACK_FRONTEND/README.md`

## Live Demo

**Frontend Dashboard:**  
https://labjack-frontend.vercel.app/

**IoT Portfolio:**  
https://iot.haeytham.dev/projects/labjack

The hosted demo uses simulated telemetry data.

## Author

Haeytham Almalak

## Notice

LabJack and LabJack U3-HV are trademarks or product names of their respective owner.

This is an independent engineering and software development portfolio project and is not affiliated with or endorsed by LabJack.
