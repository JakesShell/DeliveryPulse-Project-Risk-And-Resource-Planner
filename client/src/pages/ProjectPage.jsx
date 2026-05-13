import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BackControls, MetricCard, PageHeader, ProgressBar, RiskBadge, StatusBadge } from "../components/Shared.jsx";

const tabs = ["Overview", "Timeline", "Tasks", "Team", "Risks", "Updates"];

export default function ProjectPage() {
  const { projectId } = useParams();
  const [projectBundle, setProjectBundle] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [scenario, setScenario] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${projectId}`).then((response) => response.json()),
      fetch("/api/projects").then((response) => response.json())
    ]).then(([projectData, projectsData]) => {
      setProjectBundle(projectData);
      setAllProjects(projectsData);
      setScenario(null);
      setActiveTab("Overview");
    });
  }, [projectId]);

  const phases = useMemo(
    () => ["Discovery", "Design", "Build", "Integration", "QA", "Launch", "Review"],
    []
  );

  if (!projectBundle) {
    return <div className="empty-state">Loading project workspace...</div>;
  }

  const { project, tasks, teams, stakeholderUpdate } = projectBundle;

  async function runScenario(option) {
    const response = await fetch(`/api/projects/${project.id}/scenario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: option })
    });
    setScenario(await response.json());
  }

  return (
    <>
      <BackControls />

      <PageHeader
        eyebrow="Project Workspace"
        title={project.name}
        description={project.summary}
      >
        <select className="project-switcher" value={project.id} onChange={(event) => (window.location.href = `/projects/${event.target.value}`)}>
          {allProjects.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </PageHeader>

      <section className="project-detail-hero">
        <MetricCard label="Progress" value={`${project.progress}%`} note={project.phase} />
        <MetricCard label="Health Score" value={`${project.riskProfile.healthScore}/100`} note={project.riskProfile.riskLevel} />
        <MetricCard label="End Date" value={project.endDate} note={`Projected ${project.riskProfile.projectedCompletionDate}`} />
        <MetricCard label="Blocked Tasks" value={project.riskProfile.blockedTasks} note="Current blockers" />
      </section>

      <div className="tab-row">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? "active-tab" : ""} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <section className="two-column">
          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Delivery Snapshot</p>
                <h2>Project Overview</h2>
              </div>
              <RiskBadge level={project.riskProfile.riskLevel} />
            </div>

            <dl className="detail-list">
              <div><dt>Lead</dt><dd>{project.lead}</dd></div>
              <div><dt>Department</dt><dd>{project.department}</dd></div>
              <div><dt>Client</dt><dd>{project.client}</dd></div>
              <div><dt>Team Size</dt><dd>{project.teamSize}</dd></div>
              <div><dt>Next Milestone</dt><dd>{project.nextMilestone}</dd></div>
              <div><dt>Milestone Date</dt><dd>{project.nextMilestoneDate}</dd></div>
            </dl>

            <div className="progress-row">
              <span>Delivery Progress</span>
              <strong>{project.progress}%</strong>
            </div>
            <ProgressBar value={project.progress} />
          </div>

          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Recommended Focus</p>
                <h2>Risk Explanation</h2>
              </div>
            </div>
            <ul className="reason-list">
              {project.riskProfile.reasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          </div>
        </section>
      )}

      {activeTab === "Timeline" && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Milestones</p>
              <h2>Timeline And Delivery Path</h2>
            </div>
          </div>
          <div className="timeline">
            {phases.map((phase, index) => {
              const completed = index < Math.floor((project.progress / 100) * phases.length);
              const current = project.phase.toLowerCase().includes(phase.toLowerCase());
              return (
                <div className={`timeline-item ${completed ? "complete" : ""} ${current ? "current" : ""}`} key={phase}>
                  <span>{index + 1}</span>
                  <strong>{phase}</strong>
                  <small>{current ? "Current phase" : completed ? "Completed" : "Upcoming"}</small>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "Tasks" && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Team Execution</p>
              <h2>Task Board</h2>
            </div>
            <Link className="ghost-button" to="/my-work">Open My Work</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Owner</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due</th>
                  <th>Dependency</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td><strong>{task.id}</strong><br />{task.title}</td>
                    <td>{task.owner}<br /><span>{task.role}</span></td>
                    <td><RiskBadge level={task.priority} /></td>
                    <td><StatusBadge status={task.status} /></td>
                    <td>{task.dueDate}</td>
                    <td>{task.blocked ? "Blocked: " : ""}{task.dependency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "Team" && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Resources</p>
              <h2>Team Capacity</h2>
            </div>
          </div>
          <div className="capacity-grid">
            {teams.map((team) => (
              <article className="capacity-card" key={team.name}>
                <div>
                  <h3>{team.name}</h3>
                  <p>{team.lead} Â· {team.members} members</p>
                </div>
                <strong>{team.capacity}%</strong>
                <ProgressBar value={team.capacity} />
                <span>{team.recommendation}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "Risks" && (
        <section className="two-column">
          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Risk Engine</p>
                <h2>Delivery Risk Breakdown</h2>
              </div>
            </div>
            {[
              ["Schedule Risk", project.riskProfile.scheduleRisk],
              ["Dependency Risk", project.riskProfile.dependencyRisk],
              ["Resource Risk", project.riskProfile.resourceRisk],
              ["Budget Risk", project.riskProfile.budgetRisk],
              ["Communication Risk", project.riskProfile.communicationRisk]
            ].map(([label, value]) => (
              <div className="risk-row" key={label}>
                <span>{label}</span>
                <strong>{value}/100</strong>
                <ProgressBar value={value} />
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">What-If Planning</p>
                <h2>Scenario Simulator</h2>
              </div>
            </div>
            <div className="scenario-buttons">
              <button onClick={() => runScenario("add-developer")}>Add 1 Developer</button>
              <button onClick={() => runScenario("extend-deadline")}>Move Deadline +5 Days</button>
              <button onClick={() => runScenario("resolve-blockers")}>Resolve Blockers</button>
            </div>
            {scenario && (
              <div className="scenario-result">
                <p>Before Risk: <strong>{scenario.before.overallRisk}/100</strong></p>
                <p>After Risk: <strong>{scenario.after.overallRisk}/100</strong></p>
                <p>Risk Improvement: <strong>{scenario.improvement}</strong></p>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "Updates" && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Stakeholder Ready</p>
              <h2>Generated Project Update</h2>
            </div>
          </div>
          <div className="generated-update">{stakeholderUpdate}</div>
        </section>
      )}
    </>
  );
}