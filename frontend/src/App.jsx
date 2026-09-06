import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { AuthRoute } from './routes/AuthRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CoachingPage } from './pages/CoachingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SessionHistoryPage } from './pages/SessionHistoryPage';

/**
 * Root application component: layout shell + route definitions.
 * Protected pages are wrapped with `AuthRoute`, which redirects
 * unauthenticated users to /login.
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/coaching"
            element={
              <AuthRoute>
                <CoachingPage />
              </AuthRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <DashboardPage />
              </AuthRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthRoute>
                <ProfilePage />
              </AuthRoute>
            }
          />
          <Route
            path="/sessions"
            element={
              <AuthRoute>
                <SessionHistoryPage />
              </AuthRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
