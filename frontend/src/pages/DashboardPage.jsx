import React from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/Dashboard/StatCard';
import { SessionCard } from '../components/Dashboard/SessionCard';
import { GoalCard } from '../components/Dashboard/GoalCard';
import { useSessions } from '../hooks/useSessions';
import { useGoals } from '../hooks/useGoals';
import { GOAL_STATUS, SESSION_STATUS } from '../utils/constants';

/**
 * Dashboard page: user stats, recent sessions, active goals & quick actions.
 */
export const DashboardPage = () => {
  const { sessions, loading: sessionsLoading } = useSessions();
  const { goals, loading: goalsLoading } = useGoals();

  const completedSessions = sessions.filter((s) => s.status === SESSION_STATUS.COMPLETED).length;
  const achievedGoals = goals.filter((g) => g.status === GOAL_STATUS.COMPLETED).length;
  const activeGoals = goals.filter((g) => g.status === GOAL_STATUS.ACTIVE);
  const recentSessions = sessions.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">داشبورد</h1>
        <div className="flex gap-3">
          <Link to="/coaching" className="btn-primary">
            + جلسه جدید
          </Link>
          <Link to="/goals/new" className="btn-secondary">
            + هدف جدید
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="جلسات تکمیل شده" value={completedSessions} icon="📅" />
        <StatCard label="اهداف محقق شده" value={achievedGoals} icon="🎯" />
        <StatCard label="جلسات کل" value={sessions.length} icon="💬" />
        <StatCard label="اهداف فعال" value={activeGoals.length} icon="🚀" />
      </div>

      {/* Active goals */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">اهداف فعال</h2>
          <Link to="/goals" className="text-sm text-blue-600 hover:underline">
            مشاهده همه
          </Link>
        </div>
        {goalsLoading ? (
          <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
        ) : activeGoals.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">هنوز هدفی ثبت نشده است.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </section>

      {/* Recent sessions */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">جلسات اخیر</h2>
          <Link to="/sessions" className="text-sm text-blue-600 hover:underline">
            مشاهده همه
          </Link>
        </div>
        {sessionsLoading ? (
          <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
        ) : recentSessions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">هنوز جلسه‌ای برگزار نشده است.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {recentSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
