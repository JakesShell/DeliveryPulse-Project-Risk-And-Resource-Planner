import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildPortfolio, calculateProjectRisk, simulateScenario } from "./services/riskEngine.js";
import { findLeadPortfolio, findUserTasks, summarizeTeamCapacity } from "./services/resourcePlanner.js";
import { generateStakeholderUpdate } from "./services/updateGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

function readJson(relativePath) {
  const fullPath = path.join(__dirname, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function loadData() {
  return {
    projects: readJson("data/projects.json"),
    tasks: readJson("data/tasks.json"),
    teams: readJson("data/teams.json")
  };
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "DeliveryPulse Project Risk And Resource Planner",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/portfolio", (req, res) => {
  const { projects, tasks, teams } = loadData();
  res.json({
    ...buildPortfolio(projects, tasks, teams),
    teams: summarizeTeamCapacity(teams)
  });
});

app.get("/api/projects", (req, res) => {
  const { projects, tasks, teams } = loadData();
  res.json(buildPortfolio(projects, tasks, teams).projects);
});

app.get("/api/projects/:projectId", (req, res) => {
  const { projects, tasks, teams } = loadData();
  const project = projects.find((item) => item.id === req.params.projectId);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const involvedTeams = teams.filter((team) => projectTasks.some((task) => task.team === team.name));
  const riskProfile = calculateProjectRisk(project, tasks, teams);

  res.json({
    project: {
      ...project,
      riskProfile
    },
    tasks: projectTasks,
    teams: summarizeTeamCapacity(involvedTeams),
    stakeholderUpdate: generateStakeholderUpdate(project, riskProfile, projectTasks)
  });
});

app.post("/api/projects/:projectId/scenario", (req, res) => {
  const { projects, tasks, teams } = loadData();
  const project = projects.find((item) => item.id === req.params.projectId);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.json(simulateScenario(project, tasks, teams, req.body.scenario));
});

app.get("/api/workspaces/member", (req, res) => {
  const { tasks, projects } = loadData();
  const user = req.query.user || "Sam Rivera";
  const userTasks = findUserTasks(tasks, user);

  res.json({
    user,
    tasks: userTasks.map((task) => ({
      ...task,
      projectName: projects.find((project) => project.id === task.projectId)?.name || "Unknown Project"
    })),
    blockedTasks: userTasks.filter((task) => task.blocked),
    dueSoon: userTasks.filter((task) => new Date(task.dueDate) <= new Date("2026-05-13T00:00:00Z"))
  });
});

app.get("/api/workspaces/lead", (req, res) => {
  const { projects, tasks } = loadData();
  const lead = req.query.lead || "Maya Chen";
  res.json(findLeadPortfolio(projects, tasks, lead));
});

app.get("/api/executive", (req, res) => {
  const { projects, tasks, teams } = loadData();
  const portfolio = buildPortfolio(projects, tasks, teams);
  const capacity = summarizeTeamCapacity(teams);
  const highestRisk = [...portfolio.projects].sort((a, b) => b.riskProfile.overallRisk - a.riskProfile.overallRisk)[0];

  res.json({
    metrics: portfolio.metrics,
    highestRiskProject: highestRisk,
    atRiskProjects: portfolio.projects.filter((project) => project.riskProfile.overallRisk >= 35),
    overloadedTeams: capacity.filter((team) => ["High", "Critical"].includes(team.pressureLevel)),
    executiveActions: [
      "Resolve blocked compliance and mobile delivery dependencies within 48 hours.",
      "Reduce Frontend and Compliance capacity pressure before the next milestone cycle.",
      "Protect QA time for mobile claims and client portal regression testing.",
      "Review budget exposure on projects above 75% spend before approving new scope."
    ]
  });
});

const clientDist = path.resolve(__dirname, "../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`DeliveryPulse API running at http://localhost:${PORT}`);
});