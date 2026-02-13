# Meeting Action Items Tracker — Frontend

A modern React frontend for extracting and managing action items from meeting transcripts using AI.

## Live Demo
- **Frontend:** https://meeting-recorder-frontend.vercel.app
- **Backend API:** https://meeting-tracker-backend.onrender.com
- **API Docs:** https://meeting-tracker-backend.onrender.com/docs

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| HTTP Client | Axios |
| Hosting | Vercel |

---

## How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/karantec/MeetingRecorderFrontend.git
cd MeetingRecorderFrontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
```

For production:
```
VITE_API_URL=https://meeting-tracker-backend.onrender.com
```

### 4. Start development server
```bash
npm run dev
```

App runs at: `http://localhost:5173`

### 5. Build for production
```bash
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── TranscriptInput.jsx   # Textarea + Extract button
│   ├── ActionItemList.jsx    # List with edit/delete/done/filter
│   ├── HistoryPanel.jsx      # Last 5 transcripts sidebar
│   └── StatusPage.jsx        # Backend/DB/LLM health check
├── api.js                    # Axios instance with base URL
├── App.jsx                   # Main layout and routing
├── main.jsx                  # React entry point
└── index.css                 # Tailwind imports + custom styles
```

---

## Features

### Core Features
- ✅ Paste meeting transcript → AI extracts action items
- ✅ Each item shows task, owner, and due date
- ✅ Mark items as done (checkbox with strikethrough)
- ✅ Edit any item inline (task, owner, due date, tags)
- ✅ Delete items
- ✅ Add items manually
- ✅ Filter by All / Open / Done
- ✅ Tags support with purple badge display
- ✅ Last 5 transcript history in sidebar
- ✅ Click history item to reload its action items
- ✅ Progress bar showing % of tasks completed

### UX Features
- ✅ Dark theme with violet/indigo accent colors
- ✅ Ambient glow background effects
- ✅ Hover-reveal edit/delete buttons
- ✅ Animated loading spinner during extraction
- ✅ Word count display on textarea
- ✅ Skeleton loading in history panel
- ✅ Error messages for empty/short input
- ✅ Sticky history sidebar

### Status Page
- ✅ Real-time health check for Backend, Database, LLM
- ✅ Refresh button to re-check
- ✅ Overall status banner (all ok vs error)

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://meeting-tracker-backend.onrender.com` |

---

## Pages

### Home (`/`)
Main page with:
- Transcript input textarea
- Extract Action Items button
- Action items list with filters
- Recent transcripts history panel

### Status (`/status`)
System health page showing:
- Backend API status
- Database connection status
- LLM connection status

---

## API Integration

All API calls go through `src/api.js`:

```js
import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "https://meeting-tracker-backend.onrender.com";
export const api = axios.create({ baseURL: BASE });
```

### Endpoints used
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/transcripts` | Extract action items |
| GET | `/transcripts` | Get last 5 transcripts |
| PATCH | `/items/:id` | Update action item |
| DELETE | `/items/:id` | Delete action item |
| POST | `/items` | Add item manually |
| GET | `/status` | Health check |

---

## Deployment (Vercel)

### Steps
1. Push code to GitHub
2. Go to **vercel.com** → Import repo
3. Set **Root Directory** → `/` (already frontend repo)
4. Add **Environment Variable**:
```
VITE_API_URL = https://meeting-tracker-backend.onrender.com
```
5. Click **Deploy**

### Auto-deploy
Every push to `main` branch triggers automatic redeployment on Vercel.

---

## What is Done
- ✅ Full UI for transcript input and action item management
- ✅ All CRUD operations (create, read, update, delete)
- ✅ Filter system (all/open/done)
- ✅ Tags with visual badges
- ✅ History panel with progress bars
- ✅ Status page with live health checks
- ✅ Input validation with user-friendly error messages
- ✅ Production build optimized with Vite
- ✅ Responsive layout
- ✅ Dark theme with custom animations

## What is Not Done
- ❌ Authentication / login
- ❌ Mobile-optimized layout (works but not fully responsive)
- ❌ Export action items to CSV/PDF
- ❌ Drag and drop reordering
- ❌ Real-time collaboration

---

## Screenshots

### Home Page
- Dark themed interface with transcript input
- Action items list with owner and due date badges
- History sidebar with progress indicators

### Status Page
- Green operational badges for all services
- Refresh button for live health checks

---

## Related Repos
- **Backend:** https://github.com/karantec/Meeting-summarizer
