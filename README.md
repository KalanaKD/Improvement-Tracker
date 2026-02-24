# Improvement Tracker 📊

A modern, full-stack time-management application focused on tracking four distinct areas of life with beautiful visualizations and interactive calendars.

![React](https://img.shields.io/badge/React-18.3-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e)

## ✨ Features

- **4 Tracking Categories**: Athikramana, Career Development, Daily Checkpoints, and Custom
- **Interactive Calendars**: Click any day to log activities and tasks
- **Visual Progress**: Pie charts showing completion rates for each tracker
- **Task Management**: Add multiple tasks/works per day with completion tracking
- **Modern UI**: Glassmorphism effects, smooth animations, dark/light mode
- **Color-Coded Days**: Gray (empty), Green (completed), Red (missed)

## 🛠️ Tech Stack

### Frontend
- **React + Vite** - Fast development and build
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful data visualizations
- **Lucide React** - Modern icons
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - RESTful API
- **Supabase (PostgreSQL)** - Database with real-time capabilities
- **CORS** - Cross-origin support

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
cd "c:\Private - Working Dir\AntiGrvt"
```

### 2. Set Up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the contents of `database/schema.sql` and run it
5. Verify the 4 trackers are created in the **Table Editor**

### 3. Configure Backend

```bash
cd backend

# Create .env file
copy .env.example .env

# Edit .env and add your Supabase credentials:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key
# PORT=3000
```

**Where to find Supabase credentials:**
- Go to your Supabase project → **Settings** → **API**
- Copy **Project URL** → paste as `SUPABASE_URL`
- Copy **anon public** key → paste as `SUPABASE_ANON_KEY`

### 4. Configure Frontend

```bash
cd ../frontend

# The .env file is already created with:
# VITE_API_URL=http://localhost:3000/api
```

### 5. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open your browser to `http://localhost:5173` 🎉

## 📁 Project Structure

```
AntiGrvt/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalendarGrid.jsx
│   │   │   ├── TrackerCard.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   ├── DayModal.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── services/
│   │   │   ├── trackerService.js
│   │   │   ├── entryService.js
│   │   │   ├── taskService.js
│   │   │   └── statsService.js
│   │   ├── controllers/
│   │   │   ├── trackerController.js
│   │   │   ├── entryController.js
│   │   │   ├── taskController.js
│   │   │   └── statsController.js
│   │   ├── routes/
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js
│   │   └── app.js
│   ├── package.json
│   └── .env
└── database/
    └── schema.sql
```

## 🎨 Usage Guide

### Adding Daily Tasks

1. Click on any day in a tracker's calendar
2. Modal opens with the selected date
3. Add task title and optional description
4. Click "Add Task"
5. Toggle tasks complete/incomplete
6. Mark the entire day as "Complete" to turn it green

### Viewing Progress

- The top section shows a pie chart with completion rates for all 4 trackers
- Each tracker card shows:
  - Completion percentage (large number)
  - Completed, Missed, and Empty day counts
  - Monthly calendar with color-coded days

### Customizing Tracker Colors

The default colors are:
- Athikramana: Purple (#8B5CF6)
- Career: Blue (#3B82F6)
- Daily: Green (#10B981)
- Custom: Orange (#F59E0B)

To customize, use the API endpoint:
```bash
PUT http://localhost:3000/api/trackers/{tracker_id}
Body: { "color": "#FF5733" }
```

## 🔌 API Endpoints

### Trackers
- `GET /api/trackers` - Get all trackers
- `GET /api/trackers/:id` - Get tracker by ID
- `PUT /api/trackers/:id` - Update tracker

### Entries
- `GET /api/trackers/:trackerId/entries?year=2026&month=2` - Get monthly entries
- `POST /api/entries` - Create/update entry
- `PUT /api/entries/:id/status` - Update entry status
- `DELETE /api/entries/:id` - Delete entry

### Tasks
- `GET /api/entries/:entryId/tasks` - Get tasks for entry
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Stats
- `GET /api/stats/tracker/:trackerId?year=2026&month=2` - Get tracker stats
- `GET /api/stats/all?tracker_ids=id1,id2&year=2026&month=2` - Get all stats

## 🚢 Deployment

### Frontend (Vercel - Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `VITE_API_URL=<your-backend-url>/api`
4. Deploy!

### Backend (Render)
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
4. Deploy!

### Alternative: GitHub Pages + Railway
- Frontend: Use `gh-pages` package
- Backend: Deploy to Railway

## 🔐 Adding Authentication (Future)

The schema includes commented RLS policies. To enable auth:
1. Uncomment RLS policies in `schema.sql`
2. Install `@supabase/auth-ui-react` in frontend
3. Add authentication flow to `App.jsx`
4. Update API calls to include user context

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using React, Tailwind, and Supabase
