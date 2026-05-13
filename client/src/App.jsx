import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ErrorState, Layout, LoadingState } from "./components/Shared.jsx";
import ExecutiveSummary from "./pages/ExecutiveSummary.jsx";
import HomePage from "./pages/HomePage.jsx";
import LeadWorkspace from "./pages/LeadWorkspace.jsx";
import MyWork from "./pages/MyWork.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import RiskReview from "./pages/RiskReview.jsx";
import TeamCapacity from "./pages/TeamCapacity.jsx";

export default function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [role, setRole] = useState("Executive");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((response) => {
        if (!response.ok) {
          throw new Error("DeliveryPulse API is not responding.");
        }
        return response.json();
      })
      .then(setPortfolio)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!portfolio) {
    return <LoadingState />;
  }

  return (
    <Layout role={role} setRole={setRole} search={search} setSearch={setSearch}>
      <Routes>
        <Route path="/" element={<HomePage portfolio={portfolio} search={search} />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="/my-work" element={<MyWork />} />
        <Route path="/lead-workspace" element={<LeadWorkspace />} />
        <Route path="/team-capacity" element={<TeamCapacity teams={portfolio.teams} />} />
        <Route path="/risk-review" element={<RiskReview projects={portfolio.projects} />} />
        <Route path="/executive" element={<ExecutiveSummary />} />
      </Routes>
    </Layout>
  );
}