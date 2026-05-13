export function summarizeTeamCapacity(teams) {
  return teams.map((team) => ({
    ...team,
    pressureLevel: team.capacity >= 90 ? "Critical" : team.capacity >= 80 ? "High" : team.capacity >= 70 ? "Moderate" : "Stable"
  }));
}

export function findUserTasks(tasks, userName) {
  return tasks
    .filter((task) => task.owner === userName)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export function findLeadPortfolio(projects, tasks, leadName) {
  const ownedProjects = projects.filter((project) => project.lead === leadName);
  const ownedProjectIds = ownedProjects.map((project) => project.id);
  const relatedTasks = tasks.filter((task) => ownedProjectIds.includes(task.projectId));

  return {
    lead: leadName,
    projects: ownedProjects,
    blockedTasks: relatedTasks.filter((task) => task.blocked),
    highPriorityTasks: relatedTasks.filter((task) => ["High", "Critical"].includes(task.priority)),
    dueThisWeek: relatedTasks.filter((task) => {
      const due = new Date(task.dueDate);
      return due >= new Date("2026-05-06T00:00:00Z") && due <= new Date("2026-05-13T00:00:00Z");
    })
  };
}