# ⚡ LeetCode Revision Planner

A sleek, dark-mode React app to track LeetCode problems and automatically schedule revisions using **spaced repetition**.

## Features

- 📝 **Add Problems** — Log name, topic, difficulty & solved date
- 🔁 **Auto-Scheduled Revisions** — Day 1, 3, 7, 15, 30 via spaced repetition
- 📊 **Dashboard** — Stats, due-today, overdue & upcoming revisions
- 🔍 **Search & Filter** — By name, topic, difficulty, status
- ✅ **Mark Done** — Check off individual revision sessions
- 💾 **LocalStorage** — No backend needed, data persists in browser
- 🌙 **Modern Dark UI** — Glassmorphism, gradients, micro-animations
- 📱 **Responsive** — Mobile-friendly layout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy** 🚀

The `vercel.json` already configures SPA routing so page refreshes work correctly.

## Tech Stack

- **React 19** + **Vite 8**
- **Vanilla CSS** with CSS custom properties
- **LocalStorage** for persistence
- **No external UI library** — fully custom design

## Author

**Bhoomi Agrawal** · [Digital Heroes Co](https://digitalheroesco.com)
