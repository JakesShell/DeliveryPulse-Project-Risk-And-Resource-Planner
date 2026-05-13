import { useEffect, useState } from "react";
import { BackControls, MetricCard, PageHeader, RiskBadge } from "../components/Shared.jsx";

export default function ExecutiveSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("/api/executive")
      .then((response) => response.json())
      .then(setSummary);
  }, []);

  if (!summary) {
    return <div className="empty-state">Loading executive summary...</div>;
  }

  return (
    <>
      <BackControls />
      <PageHeader
        eyebrow="Leadership View"
        title="Executive Summary"
        description="A portfolio-level view of delivery health, risk exposure, overloaded teams, and recommended leadership actions."
      />

      <section className="metrics-grid">
        <MetricCard label="Active Projects" value={summary.metrics.activeProjects} note="Portfolio volume" />
        <MetricCard label="At Risk" value={summary.metrics.projectsAtRisk} note="Need attention" />
        <MetricCard label="Average Health" value={`${summary.metrics.averageHealth}/100`} note="Delivery health" />
        <MetricCard label="Upcoming Deadlines" value={summary.metrics.upcomingDeadlines} note="Within 21 days" />
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Highest Risk</p>
              <h2>{summary.highestRiskProject.name}</h2>
            </div>
            <RiskBadge level={summary.highestRiskProject.riskProfile.riskLevel} />
          </div>
          <p className="large-copy">{summary.highestRiskProject.summary}</p>
          <ul className="reason-list">
            {summary.highestRiskProject.riskProfile.reasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Leadership Actions</p>
              <h2>Recommended Next Steps</h2>
            </div>
          </div>
          <ol className="action-list">
            {summary.executiveActions.map((action) => <li key={action}>{action}</li>)}
          </ol>
        </div>
      </section>
    </>
  );
}