import { ArrowLeft, Home, Search } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export function ProgressBar({ value }) {
  return (
    <div className="progress-track" aria-label={`Progress ${value}%`}>
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

export function RiskBadge({ level }) {
  const normalized = (level || "").toLowerCase().replaceAll(" ", "-");
  return <span className={`badge badge-${normalized}`}>{level}</span>;
}

export function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase().replaceAll(" ", "-");
  return <span className={`status status-${normalized}`}>{status}</span>;
}

export function MetricCard({ label, value, note }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </header>
  );
}

export function BackControls() {
  const navigate = useNavigate();

  return (
    <div className="back-controls">
      <button className="ghost-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Previous Page
      </button>
      <Link className="ghost-button" to="/">
        <Home size={16} />
        Home
      </Link>
    </div>
  );
}

export function Layout({ children, role, setRole, search, setSearch }) {
  const location = useLocation();

  const navigation = [
    { path: "/", label: "Portfolio Home" },
    { path: "/my-work", label: "My Work" },
    { path: "/lead-workspace", label: "Lead Workspace" },
    { path: "/team-capacity", label: "Team Capacity" },
    { path: "/risk-review", label: "Risk Review" },
    { path: "/executive", label: "Executive Summary" }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span>DP</span>
          <div>
            <strong>DeliveryPulse</strong>
            <small>Project delivery workspace</small>
          </div>
        </Link>

        <nav>
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <label>Demo Role</label>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option>Executive</option>
            <option>Project Manager</option>
            <option>Team Lead</option>
            <option>Team Member</option>
          </select>
          <p>Role switching changes the workspace lens for the portfolio demo.</p>
        </div>
      </aside>

      <main className="main-panel">
        <div className="topbar">
          <div>
            <span className="breadcrumb">Home {location.pathname !== "/" ? ` / ${location.pathname.replace("/", "")}` : ""}</span>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects or leads" />
            </div>
            <span className="role-pill">{role}</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

export function LoadingState() {
  return <div className="empty-state">Loading DeliveryPulse workspace...</div>;
}

export function ErrorState({ message }) {
  return <div className="error-state">{message}</div>;
}