import { useEffect, useState } from "react";
import { BackControls, PageHeader, RiskBadge, StatusBadge } from "../components/Shared.jsx";

const users = ["Sam Rivera", "Grace Kim", "Priya Nair", "Mina Hart", "Avery Stone", "Leo Ramirez", "Nora Williams"];

export default function MyWork() {
  const [user, setUser] = useState("Sam Rivera");
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    fetch(`/api/workspaces/member?user=${encodeURIComponent(user)}`)
      .then((response) => response.json())
      .then(setWorkspace);
  }, [user]);

  return (
    <>
      <BackControls />
      <PageHeader
        eyebrow="Team Member Workspace"
        title="My Work"
        description="A focused view for assigned tasks, blockers, due dates, and update needs."
      >
        <select className="project-switcher" value={user} onChange={(event) => setUser(event.target.value)}>
          {users.map((name) => <option key={name}>{name}</option>)}
        </select>
      </PageHeader>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Assigned Work</p>
            <h2>{workspace?.user || user}</h2>
          </div>
          <span>{workspace?.tasks?.length || 0} tasks</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Task</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Blocker</th>
              </tr>
            </thead>
            <tbody>
              {workspace?.tasks?.map((task) => (
                <tr key={task.id}>
                  <td>{task.projectName}</td>
                  <td><strong>{task.id}</strong><br />{task.title}</td>
                  <td><RiskBadge level={task.priority} /></td>
                  <td><StatusBadge status={task.status} /></td>
                  <td>{task.dueDate}</td>
                  <td>{task.blocked ? task.dependency : "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}