export function generateStakeholderUpdate(project, riskProfile, tasks) {
  const blocked = tasks.filter((task) => task.projectId === project.id && task.blocked);
  const urgent = tasks.filter((task) => task.projectId === project.id && ["High", "Critical"].includes(task.priority));

  const opening =
    `${project.name} is currently ${project.progress}% complete and is in the ${project.phase} phase. ` +
    `The delivery health score is ${riskProfile.healthScore}/100 with a ${riskProfile.riskLevel.toLowerCase()} status.`;

  const blockerText = blocked.length
    ? `The main delivery concern is ${blocked.length} blocked task(s), especially ${blocked[0].title}.`
    : "No major blockers are currently stopping delivery.";

  const actionText =
    riskProfile.overallRisk >= 55
      ? "Recommended action: hold a focused delivery review, resolve blockers, and protect team capacity for priority work."
      : "Recommended action: continue current execution rhythm and monitor upcoming milestones.";

  const priorityText = urgent.length
    ? `Priority work this week includes ${urgent.slice(0, 2).map((task) => task.title).join(" and ")}.`
    : "Priority workload is stable this week.";

  return `${opening} ${blockerText} ${priorityText} ${actionText}`;
}