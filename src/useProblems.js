import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lc_revision_problems';

function loadProblems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProblems(problems) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
}

export function useProblems() {
  const [problems, setProblems] = useState(loadProblems);

  // Persist whenever problems change
  useEffect(() => {
    saveProblems(problems);
  }, [problems]);

  const addProblem = useCallback((problem) => {
    setProblems((prev) => [problem, ...prev]);
  }, []);

  const deleteProblem = useCallback((id) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const markRevisionDone = useCallback((problemId, revisionDay) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === problemId
          ? {
              ...p,
              revisions: p.revisions.map((r) =>
                r.day === revisionDay ? { ...r, completed: true } : r
              ),
            }
          : p
      )
    );
  }, []);

  return { problems, addProblem, deleteProblem, markRevisionDone };
}
