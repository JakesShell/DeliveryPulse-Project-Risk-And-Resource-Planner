import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Clock3,
  Layers3,
  ShieldAlert,
  Sparkles,
  UserRound
} from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard, ProgressBar, RiskBadge, StatusBadge } from "../components/Shared.jsx";

function JsaLogo() {
  return (
    <div className="jsa-brand-lockup">
      <div className="jsa-logo-mark" aria-label="JSA Enterprise logo">
        <span>J</span>
        <span>S</span>
        <span>A</span>
      </div>

      <div>
        <p className="jsa-logo-kicker">JSA Enterprise</p>
        <h1>DeliveryPulse</h1>
        <span>Project Risk & Resource Planner</span>
      </div>
    </div>
  );
}

function PortfolioSignal({ icon: Icon, label, value, note }) {
  return (
    <div className="portfolio-signal">
      <div className="signal-icon">
        <Icon size={18} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

export default function HomePage({ portfolio, search }) {
  const filteredProjects = portfolio.projects.filter((project) => {
    const query = search.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.lead.toLowerCase().includes(query) ||
      project.department.toLowerCase().includes(query) ||
      project.client.toLowerCase().includes(query)
    );
  });

  const highestRiskProject = [...portfolio.projects].sort(
    (a, b) => b.riskProfile.overallRisk - a.riskProfile.overallRisk
  )[0];

  const nearestDeadlineProject = [...portfolio.projects].sort(
    (a, b) => new Date(a.endDate) - new Date(b.endDate)
  )[0];

  return (
    <>
      <section className="jsa-hero">
        <div className="jsa-hero-main">
          <JsaLogo />

          <div className="jsa-hero-copy">
            <p className="eyebrow">Enterprise Delivery Portfolio</p>
            <h2>Clean project visibility for deadlines, risk, teams, and execution.</h2>
            <p>
              JSA Enterprise uses DeliveryPulse to review active work, identify delivery pressure,
              track project ownership, and keep leaders aligned before timelines slip.
            </p>

            <div className="jsa-hero-actions">
              <a href="#portfolio-projects" className="primary-link">
                View Active Projects
                <ChevronRight size={16} />
              </a>

              <Link to="/executive-summary" className="ghost-button">
                Executive Summary
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <aside className="jsa-hero-card">
          <div className="hero-card-topline">
            <Sparkles size={18} />
            <span>Portfolio Pulse</span>
          </div>

          <h3>{portfolio.metrics.averageHealth}/100</h3>
          <p>Average risk-adjusted delivery health across the current portfolio.</p>

          <div className="hero-card-mini-grid">
            <div>
              <span>At Risk</span>
              <strong>{portfolio.metrics.projectsAtRisk}</strong>
            </div>
            <div>
              <span>Avg Progress</span>
              <strong>{portfolio.metrics.averageProgress}%</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="portfolio-signals-grid">
        <PortfolioSignal
          icon={BriefcaseBusiness}
          label="Active Projects"
          value={portfolio.metrics.activeProjects}
          note="Live delivery work"
        />

        <PortfolioSignal
          icon={ShieldAlert}
          label="Highest Risk"
          value={highestRiskProject?.name ?? "None"}
          note={highestRiskProject ? `${highestRiskProject.riskProfile.riskLevel} delivery risk` : "No active risk"}
        />

        <PortfolioSignal
          icon={Clock3}
          label="Upcoming Deadlines"
          value={portfolio.metrics.upcomingDeadlines}
          note="Due within 21 days"
        />

        <PortfolioSignal
          icon={CalendarDays}
          label="Nearest End Date"
          value={nearestDeadlineProject?.endDate ?? "N/A"}
          note={nearestDeadlineProject?.name ?? "No active project"}
        />
      </section>

      <section className="metrics-grid">
        <MetricCard label="Active Projects" value={portfolio.metrics.activeProjects} note="Across business units" />
        <MetricCard label="Projects At Risk" value={portfolio.metrics.projectsAtRisk} note="Need delivery attention" />
        <MetricCard label="Upcoming Deadlines" value={portfolio.metrics.upcomingDeadlines} note="Due within 21 days" />
        <MetricCard label="Average Progress" value={`${portfolio.metrics.averageProgress}%`} note="Portfolio completion" />
        <MetricCard label="Average Health" value={`${portfolio.metrics.averageHealth}/100`} note="Risk-adjusted score" />
      </section>

      <section className="panel portfolio-board" id="portfolio-projects">
        <div className="section-heading portfolio-board-heading">
          <div>
            <p className="eyebrow">Main Workspace</p>
            <h2>Project Portfolio</h2>
            <p className="portfolio-board-subtitle">
              Review project ownership, progress, risk, milestones, and target delivery dates.
            </p>
          </div>

          <span>{filteredProjects.length} visible</span>
        </div>

        <div className="premium-project-grid">
          {filteredProjects.map((project) => (
            <article className="premium-project-card" key={project.id}>
              <div className="premium-project-header">
                <div className="project-lead-avatar">{project.leadInitials}</div>

                <div>
                  <p>{project.department}</p>
                  <h3>{project.name}</h3>
                </div>

                <RiskBadge level={project.riskProfile.riskLevel} />
              </div>

              <p className="premium-project-summary">{project.summary}</p>

              <div className="premium-project-meta">
                <div>
                  <span>Team Lead</span>
                  <strong>
                    <UserRound size={15} />
                    {project.lead}
                  </strong>
                </div>

                <div>
                  <span>End Date</span>
                  <strong>
                    <CalendarDays size={15} />
                    {project.endDate}
                  </strong>
                </div>

                <div>
                  <span>Current Phase</span>
                  <strong>
                    <Layers3 size={15} />
                    {project.phase}
                  </strong>
                </div>

                <div>
                  <span>Team Size</span>
                  <strong>{project.teamSize} people</strong>
                </div>
              </div>

              <div className="premium-progress-block">
                <div className="progress-row">
                  <span>Progress</span>
                  <strong>{project.progress}%</strong>
                </div>
                <ProgressBar value={project.progress} />
              </div>

              <div className="premium-project-footer">
                <div>
                  <span>Next Milestone</span>
                  <strong>{project.nextMilestone}</strong>
                  <small>{project.nextMilestoneDate}</small>
                </div>

                <StatusBadge status={project.status} />
              </div>

              <Link className="primary-link premium-open-link" to={`/projects/${project.id}`}>
                Open Project Workspace
                <ChevronRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}