import React, { useState, useMemo } from 'react';
import { formatDate, getRevisionStatus, TOPICS, DIFFICULTIES, isToday, isBeforeToday, daysUntil } from '../utils.js';

function RevisionPill({ revision }) {
  const status = getRevisionStatus(revision);

  const iconMap = {
    completed: '✓',
    'due-today': '🔥',
    overdue: '!',
    pending: '○',
  };

  const titleMap = {
    completed: `Day ${revision.day} — Done (${revision.date})`,
    'due-today': `Day ${revision.day} — Due Today!`,
    overdue: `Day ${revision.day} — Overdue since ${revision.date}`,
    pending: `Day ${revision.day} — Scheduled ${revision.date} (${daysUntil(revision.date)}d away)`,
  };

  return (
    <span className={`revision-pill ${status}`} title={titleMap[status]}>
      <span className="pill-icon">{iconMap[status]}</span>
      <span className="pill-label">D{revision.day}</span>
    </span>
  );
}

function ProblemLink({ name, url, className = 'problem-card-name' }) {
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} problem-name-link`}
        title={`Open on LeetCode ↗`}
        onClick={(e) => e.stopPropagation()}
      >
        {name}
        <span className="ext-link-icon">↗</span>
      </a>
    );
  }
  return <div className={className}>{name}</div>;
}

function ProblemCard({ problem, onDelete, onMarkDone }) {
  const [expanded, setExpanded] = useState(false);

  const progress = useMemo(() => {
    const done = problem.revisions.filter((r) => r.completed).length;
    return { done, total: problem.revisions.length };
  }, [problem.revisions]);

  const progressPct = (progress.done / progress.total) * 100;

  const pendingDue = problem.revisions.filter(
    (r) => !r.completed && (isToday(r.date) || isBeforeToday(r.date))
  );

  const diffColor = {
    easy: 'var(--clr-easy)',
    medium: 'var(--clr-medium)',
    hard: 'var(--clr-hard)',
  }[problem.difficulty.toLowerCase()];

  return (
    <article
      className="problem-card"
      aria-label={`Problem: ${problem.name}`}
      style={{ '--diff-color': diffColor }}
    >
      {/* Left accent bar based on difficulty */}
      <div className="problem-card-accent" />

      <div className="problem-card-header">
        <div className="problem-card-title-area">
          <ProblemLink name={problem.name} url={problem.url} />
          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lc-link-btn"
              title="Open on LeetCode"
              aria-label={`Open ${problem.name} on LeetCode`}
            >
              <span>🔗</span> LeetCode
            </a>
          )}
        </div>
        <div className="problem-card-badges">
          <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span className="badge-topic">{problem.topic}</span>
        </div>
      </div>

      <div className="problem-card-info-row">
        <span className="solved-date">
          <span>📅</span> Solved {formatDate(problem.solvedDate)}
        </span>
        <span className="progress-text">
          {progress.done}/{progress.total} revisions
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={progress.done}
        aria-valuemin={0}
        aria-valuemax={progress.total}
        aria-label={`${progress.done} of ${progress.total} revisions completed`}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Revision pills */}
      <div className="revision-track" role="list" aria-label="Revision schedule">
        {problem.revisions.map((r) => (
          <RevisionPill key={r.day} revision={r} />
        ))}
      </div>

      {/* Notes (if any) */}
      {problem.notes && (
        <div className="problem-notes">
          <span className="notes-icon">📝</span>
          <span className="notes-text">{problem.notes}</span>
        </div>
      )}

      {/* Actions */}
      <div className="problem-card-actions">
        {pendingDue.length > 0 && (
          <button
            className="btn-complete"
            onClick={() => onMarkDone(problem.id, pendingDue[0].day)}
            aria-label={`Mark Day ${pendingDue[0].day} revision of ${problem.name} as done`}
            id={`card-mark-done-${problem.id}-day${pendingDue[0].day}`}
          >
            ✓ Mark Day {pendingDue[0].day} Done
            {pendingDue.length > 1 && (
              <span className="pending-count">+{pendingDue.length - 1} more</span>
            )}
          </button>
        )}

        <div className="action-right">
          <button
            className="btn-delete"
            onClick={() => {
              if (window.confirm(`Delete "${problem.name}"? This cannot be undone.`)) {
                onDelete(problem.id);
              }
            }}
            aria-label={`Delete problem ${problem.name}`}
            id={`delete-problem-${problem.id}`}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProblemsList({ problems, onDelete, onMarkDone }) {
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filtered = useMemo(() => {
    let list = [...problems];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.topic.toLowerCase().includes(q) ||
          (p.notes && p.notes.toLowerCase().includes(q))
      );
    }

    if (filterDifficulty !== 'All') {
      list = list.filter((p) => p.difficulty === filterDifficulty);
    }

    if (filterTopic !== 'All') {
      list = list.filter((p) => p.topic === filterTopic);
    }

    if (filterStatus === 'Has Due') {
      list = list.filter((p) =>
        p.revisions.some((r) => !r.completed && (isToday(r.date) || isBeforeToday(r.date)))
      );
    } else if (filterStatus === 'All Done') {
      list = list.filter((p) => p.revisions.every((r) => r.completed));
    } else if (filterStatus === 'In Progress') {
      list = list.filter(
        (p) =>
          p.revisions.some((r) => r.completed) &&
          !p.revisions.every((r) => r.completed)
      );
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'difficulty') {
      const order = { Easy: 0, Medium: 1, Hard: 2 };
      list.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }

    return list;
  }, [problems, search, filterDifficulty, filterTopic, filterStatus, sortBy]);

  const usedTopics = useMemo(() => {
    const s = new Set(problems.map((p) => p.topic));
    return ['All', ...TOPICS.filter((t) => s.has(t))];
  }, [problems]);

  const activeFilters = [
    filterDifficulty !== 'All',
    filterTopic !== 'All',
    filterStatus !== 'All',
    search.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <div className="page-enter">
      <div className="list-page-header">
        <h1 className="section-title" style={{ fontSize: '1.4rem', margin: 0 }}>
          <span className="title-dot" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}></span>
          All Problems
        </h1>
        {problems.length > 0 && (
          <div className="results-info" style={{ margin: 0 }}>
            {filtered.length} / {problems.length} shown
            {activeFilters > 0 && (
              <span className="active-filter-tag">{activeFilters} filter{activeFilters > 1 ? 's' : ''} active</span>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="controls-bar" role="search" aria-label="Search and filter problems">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="search-problems"
            type="search"
            className="search-input"
            placeholder="Search by name, topic or notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search problems"
          />
        </div>

        <select id="filter-difficulty" className="filter-select" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} aria-label="Filter by difficulty">
          <option value="All">All Difficulties</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select id="filter-topic" className="filter-select" value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} aria-label="Filter by topic">
          {usedTopics.map((t) => <option key={t} value={t}>{t === 'All' ? 'All Topics' : t}</option>)}
        </select>

        <select id="filter-status" className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Filter by status">
          <option value="All">All Status</option>
          <option value="Has Due">Has Due</option>
          <option value="In Progress">In Progress</option>
          <option value="All Done">All Done</option>
        </select>

        <select id="sort-problems" className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort problems">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A–Z</option>
          <option value="difficulty">By Difficulty</option>
        </select>
      </div>

      {problems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧩</div>
          <div className="empty-title">No problems yet</div>
          <div className="empty-desc">Click "Add Problem" to log your first solved problem!</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No matches found</div>
          <div className="empty-desc">Try adjusting your search or filters.</div>
        </div>
      ) : (
        <div className="problems-grid" role="list" aria-label="Problems list">
          {filtered.map((p) => (
            <ProblemCard
              key={p.id}
              problem={p}
              onDelete={onDelete}
              onMarkDone={onMarkDone}
            />
          ))}
        </div>
      )}
    </div>
  );
}
