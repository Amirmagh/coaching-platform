import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import CoachingPage from "./pages/CoachingPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="navbar">
          <Link className="brand" to="/">
            پلتفرم کوچینگ
          </Link>
          <nav>
            <Link to="/">خانه</Link>
            <Link to="/coaching">جلسه کوچینگ</Link>
            <Link to="/dashboard">داشبورد</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/coaching" element={<CoachingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
