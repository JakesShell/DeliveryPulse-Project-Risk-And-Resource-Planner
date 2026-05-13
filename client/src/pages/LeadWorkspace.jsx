import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BackControls, MetricCard, PageHeader, RiskBadge, StatusBadge } from "../components/Shared.jsx";

const leads = ["Maya Chen", "Jordan Patel", "Nora Williams", "Elias Morgan", "Avery Stone", "Leo Ramirez"];

export default function LeadWorkspace() {
  const [lead, setLead] = useState("Maya Chen");
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    fetch(`/api/workspaces/lead?lead=${encodeURIComponent(lead)}`)
      .then((response) => response.json())
      .then(setWorkspace);
  }, [lead]);

  return (
    <>
      <BackControls />
      <PageHeader
        eyebrow="Project Lead Workspace"
        title="Lead Workspace"
        description="A project manager view for owned projects, blocked tasks, approvals, and milestone pressure."
      >
        <select className="project-switcher" value={lead} onChange={(event) => setLead(event.target.value)}>
          {leads.map((name) => <option key={name}>{name}</option>)}
        </select>
      </PageHeader>

      <section className="metrics-grid">
        <MetricCard label="Projects Led" value={workspace?.projects?.length || 0} note="Active ownership" />
        <MetricCard label="Blocked Tasks" value={workspace?.blockedTasks?.length || 0} note="Need escalation" />
        <MetricCard label="High Priority" value={workspace?.highPriorityTasks?.length || 0} note="Critical or high tasks" />
        <MetricCard label="Due This Week" value={workspace?.dueThisWeek?.length || 0} note="Milestone pressure" />
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Owned Projects</p>
              <h2>Portfolio Slice</h2>
            </div>
          </div>
          <div className="stack-list">
            {workspace?.projects?.map((project) => (
              <Link className="stack-item" to={`/projects/${project.id}`} key={project.id}>
                <strong>{project.name}</strong>
                <span>{project.phase} Â· {project.progress}% complete</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Escalation</p>
              <h2>Blocked Work</h2>
            </div>
          </div>
          <div className="stack-list">
            {workspace?.blockedTasks?.map((task) => (
              <div className="stack-item" key={task.id}>
                <strong>{task.title}</strong>
                <span>{task.dependency}</span>
                <div>
                  <RiskBadge level={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}