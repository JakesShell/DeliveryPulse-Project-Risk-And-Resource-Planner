# DeliveryPulse Project Risk And Resource Planner

DeliveryPulse is a clean project delivery workspace for monitoring project progress, deadlines, team ownership, delivery risk, resource capacity, blockers, and stakeholder-ready updates.

This project upgrades the original static timeline dashboard into a multi-page internal planning application with a React frontend, Express API, JSON-backed project data, risk scoring logic, resource planning views, and role-based workspace pages.

## What It Does

DeliveryPulse helps a company answer practical delivery questions:

- Which projects are on track?
- Which projects are slipping?
- Who owns each project?
- What is blocking delivery?
- Which teams are overloaded?
- What actions should project leads or executives take next?

## Core Features

- Portfolio home page showing all projects, leads, progress, risk, and end dates.
- Individual project pages with Overview, Timeline, Tasks, Team, Risks, and Updates sections.
- Project switcher and clear Back, Home, and navigation controls.
- Team member workspace for assigned tasks and blockers.
- Project lead workspace for owned projects, blocked tasks, and due-soon work.
- Executive summary with portfolio health and recommended actions.
- Team capacity view with workload pressure and resource recommendations.
- Risk review page comparing schedule, dependency, resource, budget, and communication risk.
- Scenario simulator for testing delivery improvements such as resolving blockers or extending deadlines.
- Stakeholder update generator based on project status and risk profile.

## Tech Stack

- React
- Vite
- Node.js
- Express
- JavaScript
- JSON data layer
- CSS custom UI system

## Project Structure

```text
DeliveryPulse-Project-Risk-And-Resource-Planner/
â”œâ”€â”€ client/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ App.jsx
â”‚   â”‚   â””â”€â”€ styles.css
â”‚   â””â”€â”€ vite.config.js
â”œâ”€â”€ server/
â”‚   â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ tests/
â”‚   â””â”€â”€ index.js
â”œâ”€â”€ screenshots/
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

## Run Locally

From the project root:

```powershell
npm run install:all
npm run dev
```

Open:

```text
http://localhost:5173
```

The API runs at:

```text
http://localhost:8080
```

## Test The Risk Engine

```powershell
npm run test
```

## Build Frontend

```powershell
npm run build
```

## Production-Style Local Run

After building the client:

```powershell
npm start
```

Then open:

```text
http://localhost:8080
```

## Screenshot Checklist

Recommended screenshots for the GitHub README:

```text
screenshots/portfolio-home-overview.png
screenshots/project-detail-overview.png
screenshots/project-task-board.png
screenshots/project-risk-and-scenario-simulator.png
screenshots/team-member-workspace.png
screenshots/project-lead-workspace.png
screenshots/team-capacity-planner.png
screenshots/executive-summary.png
```

## Demo Data

The system uses fictional project data for portfolio demonstration purposes. It includes projects across digital products, mobile operations, data platform work, AI enablement, compliance reporting, and service delivery.

## Notes

This is a portfolio project designed to demonstrate full-stack project planning, delivery risk modeling, resource planning, and clean business-focused UI/UX.