import { BackControls, PageHeader, ProgressBar, RiskBadge } from "../components/Shared.jsx";

export default function TeamCapacity({ teams }) {
  return (
    <>
      <BackControls />
      <PageHeader
        eyebrow="Resource Planning"
        title="Team Capacity"
        description="Identify overloaded teams, overdue review pressure, and recommended resource moves."
      />

      <section className="capacity-grid wide">
        {teams.map((team) => (
          <article className="capacity-card" key={team.name}>
            <div>
              <h3>{team.name}</h3>
              <p>{team.lead} Â· {team.members} members Â· {team.activeTasks} active tasks</p>
            </div>
            <RiskBadge level={team.pressureLevel} />
            <div className="progress-row">
              <span>Capacity</span>
              <strong>{team.capacity}%</strong>
            </div>
            <ProgressBar value={team.capacity} />
            <p>{team.overdueTasks} overdue tasks</p>
            <span>{team.recommendation}</span>
          </article>
        ))}
      </section>
    </>
  );
}