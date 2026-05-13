import { Link } from "react-router-dom";
import { BackControls, PageHeader, ProgressBar, RiskBadge } from "../components/Shared.jsx";

export default function RiskReview({ projects }) {
  const ordered = [...projects].sort((a, b) => b.riskProfile.overallRisk - a.riskProfile.overallRisk);

  return (
    <>
      <BackControls />
      <PageHeader
        eyebrow="Delivery Intelligence"
        title="Risk Review"
        description="Compare delivery risk across schedule, dependencies, resources, budget, and stakeholder communication."
      />

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Portfolio Risk Stack</p>
            <h2>Project Risk Profiles</h2>
          </div>
        </div>

        <div className="risk-review-list">
          {ordered.map((project) => (
            <article key={project.id} className="risk-review-card">
              <div>
                <Link to={`/projects/${project.id}`}><h3>{project.name}</h3></Link>
                <p>{project.lead} Â· {project.phase}</p>
              </div>
              <RiskBadge level={project.riskProfile.riskLevel} />
              <div>
                <span>Overall Risk</span>
                <strong>{project.riskProfile.overallRisk}/100</strong>
                <ProgressBar value={project.riskProfile.overallRisk} />
              </div>
              <div>
                <span>Health</span>
                <strong>{project.riskProfile.healthScore}/100</strong>
                <ProgressBar value={project.riskProfile.healthScore} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}