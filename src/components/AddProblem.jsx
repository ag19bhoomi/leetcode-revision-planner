import React, { useState, useMemo } from 'react';
import { generateId, generateRevisions, today, addDays, TOPICS, DIFFICULTIES, REVISION_INTERVALS } from '../utils.js';

function RevisionDatePreview({ solvedDate }) {
  const dates = useMemo(() => {
    if (!solvedDate) return [];
    return REVISION_INTERVALS.map((day) => ({
      day,
      date: addDays(solvedDate, day),
    }));
  }, [solvedDate]);

  if (!solvedDate) return null;

  return (
    <div className="revision-preview">
      <div className="revision-preview-title">📅 Auto-Scheduled Revision Dates</div>
      <div className="revision-preview-dates">
        {dates.map(({ day, date }) => (
          <span key={day} className="revision-chip" title={`Day ${day}: ${date}`}>
            <span className="chip-day">D{day}</span>
            <span className="chip-date">{date}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AddProblem({ onAdd }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [solvedDate, setSolvedDate] = useState(today());
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Problem name is required';
    if (!topic) e.topic = 'Please select a topic';
    if (!difficulty) e.difficulty = 'Please select a difficulty';
    if (!solvedDate) e.solvedDate = 'Please select a solved date';
    if (url.trim() && !url.trim().startsWith('http')) {
      e.url = 'URL must start with http:// or https://';
    }
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const problem = {
      id: generateId(),
      name: name.trim(),
      url: url.trim(),
      topic,
      difficulty,
      solvedDate,
      notes: notes.trim(),
      revisions: generateRevisions(solvedDate),
      createdAt: new Date().toISOString(),
    };

    onAdd(problem);
    setSuccess(true);

    // Reset form
    setName('');
    setUrl('');
    setTopic('');
    setDifficulty('');
    setSolvedDate(today());
    setNotes('');
    setErrors({});

    setTimeout(() => setSuccess(false), 3500);
  }

  function handleChange(setter, field) {
    return (e) => {
      setter(e.target.value);
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  return (
    <div className="form-container page-enter">
      <div className="form-card">
        <div className="form-glow" />

        <div className="form-header">
          <div className="form-header-icon">➕</div>
          <div>
            <h1 className="form-title">Add New Problem</h1>
            <p className="form-subtitle">
              Log a solved problem and get revision dates auto-generated via spaced repetition.
            </p>
          </div>
        </div>

        {success && (
          <div className="success-toast" role="alert" aria-live="polite">
            <span className="toast-icon">🎉</span>
            <div>
              <div className="toast-title">Problem added successfully!</div>
              <div className="toast-desc">Revision schedule created for Day 1, 3, 7, 15 &amp; 30.</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate id="add-problem-form">
          {/* Problem Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="problem-name">
              Problem Name <span className="required-star">*</span>
            </label>
            <input
              id="problem-name"
              type="text"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Two Sum, Longest Palindromic Substring"
              value={name}
              onChange={handleChange(setName, 'name')}
              autoComplete="off"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <div id="name-error" className="field-error">⚠ {errors.name}</div>
            )}
          </div>

          {/* Problem URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="problem-url">
              LeetCode URL <span className="optional-tag">optional</span>
            </label>
            <div className="input-with-icon">
              <span className="input-prefix-icon">🔗</span>
              <input
                id="problem-url"
                type="url"
                className={`form-input has-prefix ${errors.url ? 'input-error' : ''}`}
                placeholder="https://leetcode.com/problems/two-sum/"
                value={url}
                onChange={handleChange(setUrl, 'url')}
                autoComplete="off"
                aria-invalid={!!errors.url}
                aria-describedby={errors.url ? 'url-error' : undefined}
              />
            </div>
            {errors.url && (
              <div id="url-error" className="field-error">⚠ {errors.url}</div>
            )}
          </div>

          {/* Topic & Difficulty */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="problem-topic">
                Topic <span className="required-star">*</span>
              </label>
              <div className="form-select-wrapper">
                <select
                  id="problem-topic"
                  className={`form-select ${errors.topic ? 'input-error' : ''}`}
                  value={topic}
                  onChange={handleChange(setTopic, 'topic')}
                  aria-required="true"
                  aria-invalid={!!errors.topic}
                >
                  <option value="">Select Topic</option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {errors.topic && (
                <div id="topic-error" className="field-error">⚠ {errors.topic}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="problem-difficulty">
                Difficulty <span className="required-star">*</span>
              </label>
              <div className="form-select-wrapper">
                <select
                  id="problem-difficulty"
                  className={`form-select ${errors.difficulty ? 'input-error' : ''}`}
                  value={difficulty}
                  onChange={handleChange(setDifficulty, 'difficulty')}
                  aria-required="true"
                  aria-invalid={!!errors.difficulty}
                >
                  <option value="">Select Difficulty</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              {errors.difficulty && (
                <div id="diff-error" className="field-error">⚠ {errors.difficulty}</div>
              )}
            </div>
          </div>

          {/* Solved Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="solved-date">
              Solved Date <span className="required-star">*</span>
            </label>
            <input
              id="solved-date"
              type="date"
              className="form-input"
              value={solvedDate}
              max={today()}
              onChange={handleChange(setSolvedDate, 'solvedDate')}
              aria-required="true"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Notes (optional) */}
          <div className="form-group">
            <label className="form-label" htmlFor="problem-notes">
              Notes <span className="optional-tag">optional</span>
            </label>
            <textarea
              id="problem-notes"
              className="form-input form-textarea"
              placeholder="Key insights, approach, time complexity…"
              value={notes}
              onChange={handleChange(setNotes, 'notes')}
              rows={3}
            />
          </div>

          {/* Live Preview */}
          <RevisionDatePreview solvedDate={solvedDate} />

          <button type="submit" className="btn-submit" id="submit-problem-btn">
            <span>⚡</span>
            Add Problem &amp; Schedule Revisions
          </button>
        </form>
      </div>
    </div>
  );
}
