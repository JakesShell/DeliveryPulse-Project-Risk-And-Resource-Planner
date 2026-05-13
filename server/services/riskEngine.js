const TODAY = new Date("2026-05-06T12:00:00Z");

function daysBetween(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const milliseconds = endDate.getTime() - startDate.getTime();
  return Math.ceil(milliseconds / (1000 * 60 * 60 * 24));
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function calculateProjectRisk(project, tasks, teams) {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const blockedTasks = projectTasks.filter((task) => task.blocked).length;
  const criticalTasks = projectTasks.filter((task) => task.priority === "Critical").length;
  const overdueTasks = projectTasks.filter((task) => new Date(task.dueDate) < TODAY && task.status !== "Done").length;
  const daysRemaining = daysBetween(TODAY, project.endDate);
  const budgetUsage = project.budgetTotal > 0 ? (project.budgetUsed / project.budgetTotal) * 100 : 0;

  const involvedTeams = [...new Set(projectTasks.map((task) => task.team))];
  const teamCapacityScores = teams
    .filter((team) => involvedTeams.includes(team.name))
    .map((team) => team.capacity);

  const avgCapacity = teamCapacityScores.length
    ? teamCapacityScores.reduce((sum, value) => sum + value, 0) / teamCapacityScores.length
    : 55;

  const scheduleRisk = clamp((100 - project.progress) * 0.45 + (daysRemaining < 14 ? 20 : daysRemaining < 30 ? 10 : 0) + overdueTasks * 9);
  const dependencyRisk = clamp(blockedTasks * 20 + criticalTasks * 8);
  const resourceRisk = clamp(avgCapacity - 50 + overdueTasks * 5);
  const budgetRisk = clamp(budgetUsage - project.progress + (budgetUsage > 85 ? 15 : 0));
  const communicationRisk = clamp((project.risk === "High" ? 28 : project.risk === "Moderate" ? 16 : 6) + blockedTasks * 6);

  const overallRisk = clamp(
    scheduleRisk * 0.28 +
      dependencyRisk * 0.24 +
      resourceRisk * 0.2 +
      budgetRisk * 0.16 +
      communicationRisk * 0.12
  );

  const healthScore = clamp(100 - overallRisk);
  const projectedCompletionDate = new Date(project.endDate);
  projectedCompletionDate.setDate(projectedCompletionDate.getDate() + Math.round(overallRisk / 12));

  const riskLevel =
    overallRisk >= 70 ? "Executive Review Needed" :
    overallRisk >= 55 ? "Delayed" :
    overallRisk >= 35 ? "At Risk" :
    "Healthy";

  const reasons = [];
  if (blockedTasks > 0) reasons.push(`${blockedTasks} blocked task(s) are creating dependency pressure.`);
  if (overdueTasks > 0) reasons.push(`${overdueTasks} overdue task(s) require follow-up.`);
  if (avgCapacity >= 85) reasons.push(`Team capacity is high at ${Math.round(avgCapacity)}%.`);
  if (daysRemaining < 14) reasons.push(`The delivery date is within ${Math.max(daysRemaining, 0)} day(s).`);
  if (budgetUsage > 80) reasons.push(`Budget usage is elevated at ${Math.round(budgetUsage)}%.`);
  if (reasons.length === 0) reasons.push("Delivery indicators are stable with no major blockers detected.");

  return {
    projectId: project.id,
    projectName: project.name,
    healthScore: Math.round(healthScore),
    overallRisk: Math.round(overallRisk),
    riskLevel,
    scheduleRisk: Math.round(scheduleRisk),
    dependencyRisk: Math.round(dependencyRisk),
    resourceRisk: Math.round(resourceRisk),
    budgetRisk: Math.round(budgetRisk),
    communicationRisk: Math.round(communicationRisk),
    blockedTasks,
    overdueTasks,
    criticalTasks,
    daysRemaining,
    budgetUsage: Math.round(budgetUsage),
    projectedCompletionDate: projectedCompletionDate.toISOString().slice(0, 10),
    reasons
  };
}

export function buildPortfolio(projects, tasks, teams) {
  const enrichedProjects = projects.map((project) => ({
    ...project,
    riskProfile: calculateProjectRisk(project, tasks, teams)
  }));

  const atRiskProjects = enrichedProjects.filter((project) =>
    ["At Risk", "Delayed", "Executive Review Needed"].includes(project.riskProfile.riskLevel)
  );

  const averageProgress = Math.round(
    projects.reduce((sum, project) => sum + project.progress, 0) / projects.length
  );

  const averageHealth = Math.round(
    enrichedProjects.reduce((sum, project) => sum + project.riskProfile.healthScore, 0) / enrichedProjects.length
  );

  const upcomingDeadlines = enrichedProjects
    .filter((project) => project.riskProfile.daysRemaining <= 21)
    .sort((a, b) => a.riskProfile.daysRemaining - b.riskProfile.daysRemaining);

  return {
    metrics: {
      activeProjects: projects.length,
      projectsAtRisk: atRiskProjects.length,
      upcomingDeadlines: upcomingDeadlines.length,
      averageProgress,
      averageHealth
    },
    projects: enrichedProjects,
    upcomingDeadlines
  };
}

export function simulateScenario(project, tasks, teams, scenario) {
  const adjustedProject = { ...project };
  const adjustedTasks = tasks.map((task) => ({ ...task }));
  const adjustedTeams = teams.map((team) => ({ ...team }));

  if (scenario === "add-developer") {
    adjustedTeams.forEach((team) => {
      if (["Frontend", "Backend", "Mobile"].includes(team.name)) {
        team.capacity = clamp(team.capacity - 10);
      }
    });
  }

  if (scenario === "extend-deadline") {
    const end = new Date(adjustedProject.endDate);
    end.setDate(end.getDate() + 5);
    adjustedProject.endDate = end.toISOString().slice(0, 10);
  }

  if (scenario === "resolve-blockers") {
    adjustedTasks.forEach((task) => {
      if (task.projectId === project.id && task.blocked) {
        task.blocked = false;
        task.status = "Ready";
      }
    });
  }

  const before = calculateProjectRisk(project, tasks, teams);
  const after = calculateProjectRisk(adjustedProject, adjustedTasks, adjustedTeams);

  return {
    scenario,
    before,
    after,
    improvement: before.overallRisk - after.overallRisk
  };
}