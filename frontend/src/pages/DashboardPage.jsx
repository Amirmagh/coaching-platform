import { useEffect, useState } from "react";
import { coaching } from "../api/client";

function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionsRes, goalsRes] = await Promise.all([
          coaching.listSessions(),
          coaching.listGoals(),
        ]);
        setSessions(sessionsRes.data.results || sessionsRes.data);
        setGoals(goalsRes.data.results || goalsRes.data);
      } catch {
        setError("برای مشاهده داشبورد ابتدا وارد حساب کاربری خود شوید.");
      }
    };
    loadData();
  }, []);

  return (
    <div className="container">
      <h1>داشبورد من</h1>
      {error && <p className="crisis-resources">{error}</p>}

      <div className="dashboard-grid">
        <div className="card">
          <h2>جلسات ({sessions.length})</h2>
          <ul>
            {sessions.map((s) => (
              <li key={s.id}>
                وضعیت: {s.status} — مرحله: {s.grow_stage}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>اهداف ({goals.length})</h2>
          <ul>
            {goals.map((g) => (
              <li key={g.id}>{g.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
