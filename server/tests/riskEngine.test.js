import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildPortfolio, calculateProjectRisk, simulateScenario } from "../services/riskEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(__dirname, relativePath), "utf8"));
}

const projects = readJson("../data/projects.json");
const tasks = readJson("../data/tasks.json");
const teams = readJson("../data/teams.json");

const portfolio = buildPortfolio(projects, tasks, teams);

assert.equal(
  portfolio.metrics.activeProjects,
  projects.length,
  "Portfolio should include all projects"
);

assert.ok(
  portfolio.metrics.projectsAtRisk >= 1,
  "Portfolio should identify at-risk projects"
);

const highRiskProject = projects.find(
  (project) => project.id === "mobile-claims-launch"
);

const risk = calculateProjectRisk(highRiskProject, tasks, teams);

assert.ok(
  risk.overallRisk >= 35,
  "Mobile claims launch should have meaningful delivery risk"
);

assert.ok(
  risk.blockedTasks >= 1,
  "Blocked tasks should be counted"
);

const scenario = simulateScenario(
  highRiskProject,
  tasks,
  teams,
  "resolve-blockers"
);

assert.ok(
  scenario.after.overallRisk <= scenario.before.overallRisk,
  "Resolving blockers should not increase delivery risk"
);

console.log("DeliveryPulse risk engine tests passed.");