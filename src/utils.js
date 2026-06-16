// Spaced repetition intervals in days
export const REVISION_INTERVALS = [1, 3, 7, 15, 30];

// Generate a unique ID
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Add N days to a date string (YYYY-MM-DD) and return a new date string
export function addDays(dateStr, days) {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Get today's date string YYYY-MM-DD
export function today() {
  return new Date().toISOString().split('T')[0];
}

// Compare two date strings
export function isBeforeToday(dateStr) {
  return dateStr < today();
}

export function isToday(dateStr) {
  return dateStr === today();
}

export function isFuture(dateStr) {
  return dateStr > today();
}

// Format a date string for display
export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Format short: "Jun 17"
export function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    day: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  };
}

// Days remaining until a date
export function daysUntil(dateStr) {
  const todayMs = new Date(today() + 'T00:00:00').getTime();
  const targetMs = new Date(dateStr + 'T00:00:00').getTime();
  return Math.round((targetMs - todayMs) / (1000 * 60 * 60 * 24));
}

// Generate all revision dates for a problem
export function generateRevisions(solvedDate) {
  return REVISION_INTERVALS.map((day) => ({
    day,
    date: addDays(solvedDate, day),
    completed: false,
  }));
}

// Get revision status for display
export function getRevisionStatus(revision) {
  if (revision.completed) return 'completed';
  if (isToday(revision.date)) return 'due-today';
  if (isBeforeToday(revision.date)) return 'overdue';
  return 'pending';
}

// Topics for the dropdown
export const TOPICS = [
  'Arrays',
  'Strings',
  'Hash Map',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Recursion',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Linked List',
  'Stack',
  'Queue',
  'Trees',
  'Binary Search Tree',
  'Graphs',
  'BFS',
  'DFS',
  'Heap / Priority Queue',
  'Trie',
  'Bit Manipulation',
  'Math',
  'Design',
  'Other',
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
