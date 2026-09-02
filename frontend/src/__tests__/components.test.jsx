import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProgressBar } from '../components/Common/ProgressBar';
import { StatCard } from '../components/Dashboard/StatCard';
import { GoalCard } from '../components/Dashboard/GoalCard';
import { SessionCard } from '../components/Dashboard/SessionCard';
import { Footer } from '../components/Layout/Footer';

describe('ProgressBar', () => {
  it('renders the given percentage', () => {
    render(<ProgressBar value={42} label="پیشرفت" />);
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
  });
});

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="جلسات" value={5} />);
    expect(screen.getByText('جلسات')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

describe('GoalCard', () => {
  it('renders goal title and progress', () => {
    const goal = { id: 1, title: 'یادگیری React', current_value: 3, target_value: 10 };
    render(<GoalCard goal={goal} />);
    expect(screen.getByText('یادگیری React')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });
});

describe('SessionCard', () => {
  it('renders session title and status', () => {
    const session = { id: 1, title: 'جلسه اول', status: 'completed' };
    render(<SessionCard session={session} />);
    expect(screen.getByText('جلسه اول')).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders quick links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('داشبورد')).toBeInTheDocument();
    expect(screen.getByText('پروفایل')).toBeInTheDocument();
  });
});
