import React, { useMemo } from 'react';
import { today, isToday, isBeforeToday, formatDate, formatDateShort, daysUntil, REVISION_INTERVALS } from '../utils.js';

function StatCard({ icon, value, label, accentColor, glowColor, id, sublabel }) {
  return (
    <div
      id={id}
      className="stat-card"
      style={{
        '--card-accent': accentColor,
        '--card-glow': glowColor,
      }}
    >
      <div className="stat-card-top">
        <span className="stat-icon">{icon}</span>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-label">{label}</div>
      {sublabel && <div className="stat-sublabel">{sublabel}</div>}
    </div>
  );
}

function ProblemLink({ problem }) {
  if (problem.url) {
    return (
      <a
        href={problem.url}
        target="_blank"
        rel="noopener noreferrer"
        className="problem-name-link"
        title={`Open ${problem.name} on LeetCode`}
        onClick={(e) => e.stopPropagation()}
      >
        {problem.name}
        <span className="ext-link-icon">↗</span>
      </a>
    );
  }
  return <span className="problem-name">{problem.name}</span>;
}

function DueRevisionCard({ problem, revision, onMarkDone }) {
  const overdue = isBeforeToday(revision.date);
  const done = revision.completed;

  return (
    <div className={`due-card ${overdue && !done ? 'overdue' : ''} ${done ? 'completed' : ''}`}>
      <div className="due-card-left">
        <div className="due-card-name-row">
          <ProblemLink problem={problem} />
        </div>
        <div className="due-card-meta">
          <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span className="badge-topic">{problem.topic}</span>
          <span className="revision-day-badge">Day {revision.day}</span>
          {overdue && !done && (
            <span className="overdue-badge">Overdue · {revision.date}</span>
          )}
          {!overdue && !done && (
            <span className="today-badge">Due Today</span>
          )}
        </div>
      </div>
      {done ? (
        <button className="btn-complete done" disabled aria-label="Revision completed">
          ✅ Done
        </button>
      ) : (
        <button
          className="btn-complete"
          onClick={() => onMarkDone(problem.id, revision.day)}
          aria-label={`Mark Day ${revision.day} revision of ${problem.name} as completed`}
          id={`mark-done-${problem.id}-day${revision.day}`}
        >
          ✓ Mark Done
        </button>
      )}
    </div>
  );
}

function UpcomingCard({ problem, revision }) {
  const { day: dateDay, month } = formatDateShort(revision.date);
  const daysLeft = daysUntil(revision.date);

  return (
    <div className="upcoming-card">
      <div className="upcoming-date-block">
        <div className="upcoming-date-day">{dateDay}</div>
        <div className="upcoming-date-month">{month}</div>
      </div>
      <div className="upcoming-card-body">
        <ProblemLink problem={problem} />
        <div className="due-card-meta" style={{ marginTop: '4px' }}>
          <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span className="badge-topic">{problem.topic}</span>
          <span className="revision-day-badge">Day {revision.day}</span>
        </div>
      </div>
      <div className="upcoming-days-left">
        {daysLeft === 1 ? '🌅 Tomorrow' : `${daysLeft}d away`}
      </div>
    </div>
  );
}

export default function Dashboard({ problems, onMarkDone }) {
  const stats = useMemo(() => {
    const allRevisions = problems.flatMap((p) =>
      p.revisions.map((r) => ({ ...r, problem: p }))
    );

    const dueToday = allRevisions.filter((r) => isToday(r.date) && !r.completed);
    const overdue = allRevisions.filter((r) => isBeforeToday(r.date) && !r.completed);
    const upcoming7 = allRevisions
      .filter((r) => {
        const days = daysUntil(r.date);
        return days > 0 && days <= 7 && !r.completed;
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 10);

    const completedCount = allRevisions.filter((r) => r.completed).length;
    const totalRevisions = allRevisions.length;
    const completionRate = totalRevisions > 0 ? Math.round((completedCount / totalRevisions) * 100) : 0;

    return { dueToday, overdue, upcoming7, completedCount, total: problems.length, completionRate, totalRevisions };
  }, [problems]);

  const todayAndOverdue = useMemo(() => {
    const allRevisions = problems.flatMap((p) =>
      p.revisions.map((r) => ({ ...r, problem: p }))
    );
    return [
      ...allRevisions
        .filter((r) => isBeforeToday(r.date) && !r.completed)
        .sort((a, b) => a.date.localeCompare(b.date)),
      ...allRevisions
        .filter((r) => isToday(r.date) && !r.completed)
        .sort((a, b) => (a.completed ? 1 : -1)),
    ];
  }, [problems]);

  return (
    <div className="page-enter">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-banner-content">
          <h1 className="hero-title">Master DSA with Spaced Repetition 🧠</h1>
          <p className="hero-subtitle">
            Never forget what you've solved. Problems are automatically scheduled for review using
            proven spaced repetition intervals — so your hard work sticks.
          </p>
          <div className="spaced-rep-info">
            {REVISION_INTERVALS.map((d) => (
              <span key={d} className="sr-chip">Day {d}</span>
            ))}
          </div>
        </div>
        {problems.length > 0 && (
          <div className="hero-stat-ring">
            <svg viewBox="0 0 80 80" className="ring-svg">
              <circle cx="40" cy="40" r="34" className="ring-bg" />
              <circle
                cx="40" cy="40" r="34"
                className="ring-fill"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - stats.completionRate / 100)}`}
              />
            </svg>
            <div className="ring-label">
              <div className="ring-pct">{stats.completionRate}%</div>
              <div className="ring-text">complete</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" role="region" aria-label="Statistics overview">
        <StatCard
          id="stat-total"
          icon="📚"
          value={stats.total}
          label="Total Problems"
          sublabel={`${stats.totalRevisions} revisions total`}
          accentColor="linear-gradient(135deg, #6366f1, #8b5cf6)"
          glowColor="rgba(99,102,241,0.12)"
        />
        <StatCard
          id="stat-due"
          icon="🔥"
          value={stats.dueToday.length + stats.overdue.length}
          label="Due / Overdue"
          sublabel={stats.overdue.length > 0 ? `${stats.overdue.length} overdue` : 'All on track!'}
          accentColor="linear-gradient(135deg, #f97316, #ef4444)"
          glowColor="rgba(249,115,22,0.12)"
        />
        <StatCard
          id="stat-upcoming"
          icon="📅"
          value={stats.upcoming7.length}
          label="Upcoming (7 days)"
          sublabel="in the next week"
          accentColor="linear-gradient(135deg, #06b6d4, #3b82f6)"
          glowColor="rgba(6,182,212,0.12)"
        />
        <StatCard
          id="stat-completed"
          icon="✅"
          value={stats.completedCount}
          label="Revisions Done"
          sublabel={`${stats.completionRate}% completion rate`}
          accentColor="linear-gradient(135deg, #22c55e, #10b981)"
          glowColor="rgba(34,197,94,0.12)"
        />
      </div>

      {/* Due Today & Overdue */}
      <section aria-label="Due today and overdue revisions">
        <h2 className="section-title">
          <span className="title-dot"></span>
          Due Today &amp; Overdue
          {todayAndOverdue.length > 0 && (
            <span className="section-count due-count">
              {todayAndOverdue.length}
            </span>
          )}
        </h2>

        {todayAndOverdue.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <div className="empty-title">You're all caught up!</div>
            <div className="empty-desc">No revisions due today. Keep solving problems!</div>
          </div>
        ) : (
          <div className="due-list" role="list">
            {todayAndOverdue.map((r) => (
              <DueRevisionCard
                key={`${r.problem.id}-${r.day}`}
                problem={r.problem}
                revision={r}
                onMarkDone={onMarkDone}
              />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Revisions */}
      <section aria-label="Upcoming revisions in the next 7 days">
        <h2 className="section-title" style={{ marginTop: 'var(--sp-10)' }}>
          <span className="title-dot" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}></span>
          Upcoming — Next 7 Days
          {stats.upcoming7.length > 0 && (
            <span className="section-count upcoming-count">
              {stats.upcoming7.length}
            </span>
          )}
        </h2>

        {stats.upcoming7.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No upcoming revisions</div>
            <div className="empty-desc">Add more problems to build your revision queue!</div>
          </div>
        ) : (
          <div className="upcoming-list" role="list">
            {stats.upcoming7.map((r) => (
              <UpcomingCard
                key={`${r.problem.id}-${r.day}`}
                problem={r.problem}
                revision={r}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
