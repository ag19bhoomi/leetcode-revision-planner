import React, { useState, useMemo } from 'react';
import Dashboard from './components/Dashboard.jsx';
import AddProblem from './components/AddProblem.jsx';
import ProblemsList from './components/ProblemsList.jsx';
import Footer from './components/Footer.jsx';
import { useProblems } from './useProblems.js';
import { isToday, isBeforeToday } from './utils.js';

function Header({ activeTab, setActiveTab, dueCount, totalProblems }) {
  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        {/* Logo */}
        <div className="logo" aria-label="LeetCode Revision Planner">
          <div className="logo-icon">⚡</div>
          <span className="logo-text">LC Revision Planner</span>
        </div>

        {/* Nav Tabs */}
        <nav className="nav-tabs" role="navigation" aria-label="Main navigation">
          <button
            id="tab-dashboard"
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
          >
            📊 <span className="tab-label">Dashboard</span>
            {dueCount > 0 && <span className="tab-badge">{dueCount}</span>}
          </button>

          <button
            id="tab-add"
            className={`nav-tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
            aria-current={activeTab === 'add' ? 'page' : undefined}
          >
            ➕ <span className="tab-label">Add Problem</span>
          </button>

          <button
            id="tab-problems"
            className={`nav-tab ${activeTab === 'problems' ? 'active' : ''}`}
            onClick={() => setActiveTab('problems')}
            aria-current={activeTab === 'problems' ? 'page' : undefined}
          >
            📚 <span className="tab-label">Problems</span>
            {totalProblems > 0 && <span className="tab-badge">{totalProblems}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { problems, addProblem, deleteProblem, markRevisionDone } = useProblems();

  // Count due + overdue revisions for badge
  const dueCount = useMemo(() => {
    return problems.reduce((acc, p) => {
      return acc + p.revisions.filter((r) => !r.completed && (isToday(r.date) || isBeforeToday(r.date))).length;
    }, 0);
  }, [problems]);

  function handleAdd(problem) {
    addProblem(problem);
    setActiveTab('dashboard');
  }

  function renderPage() {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            problems={problems}
            onMarkDone={markRevisionDone}
          />
        );
      case 'add':
        return <AddProblem onAdd={handleAdd} />;
      case 'problems':
        return (
          <ProblemsList
            problems={problems}
            onDelete={deleteProblem}
            onMarkDone={markRevisionDone}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="app-wrapper">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dueCount={dueCount}
        totalProblems={problems.length}
      />

      <main className="main-content" role="main" id="main-content">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}
