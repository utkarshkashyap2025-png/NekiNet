# NekiNet 🤝
> **AI-Powered Hyperlocal Volunteer Assistance Platform**

NekiNet connects vulnerable neighbors (seniors, individuals with mobility challenges, families facing sudden emergencies) with nearby verified local volunteers for immediate, practical aid—from prescription pharmacy pickups to heavy groceries and digital literacy mentorship.

---

## Key Features

- **Kindness in Minutes**: Hyperlocal radius matching (1 km, 3 km, 5 km, 10 km).
- **Google Gemini AI Request Understanding**: Natural language input translated into structured task categories, urgency levels, concise titles, and required volunteer skills.
- **Privacy-First Spatial Fuzzing**: Exact home addresses and door coordinates are **never publicized**. Public Leaflet maps display randomized ~300m–500m neighborhood circles.
- **Requester Portal**: Form creation with AI suggestion review & edit flow, multi-step progress tracking (`Broadcasted` &rarr; `Matched` &rarr; `In Progress` &rarr; `Completed`), and mutual feedback.
- **Volunteer Portal**: Skill registration, coverage radius configuration, active availability toggle, and one-click task claim workflow.
- **Interactive OpenStreetMap + Leaflet**: Responsive split map/list view with distance-sorted feed, mobile tab toggle, and browser geolocation with manual neighborhood fallback.
- **Supabase PostgreSQL & Row Level Security (RLS)**: Enforces strict data access rules; volunteers only see private contact numbers after mutually accepting a request.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React icons, CSS variables
- **Mapping**: Leaflet 1.9, OpenStreetMap tiles
- **Backend & Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **AI Processing**: Google Gemini API (`gemini-2.5-flash`) via Supabase Edge Function
- **Testing & Quality**: Vitest, Oxlint, TypeScript Compiler (`tsc`)

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x+ recommended)
- `npm` (v9.x or higher)
- [Git](https://git-scm.com/)

### 2. Installation
Clone or navigate to the repository folder:
```bash
cd NekiNet
npm install
```

### 3. Environment Variables Configuration
Copy the template to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` to configure your Supabase project credentials:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **CRITICAL SECURITY NOTE**: Never commit `.env` or `.env.local` to Git. The repository's `.gitignore` explicitly prevents environment files and secrets from being committed.
> `GEMINI_API_KEY` is kept **strictly server-side** in Supabase Edge Function secrets and is never exposed in client-side bundles.

---

## Setting Up Supabase & Database Migrations

1. Create a free Supabase project at [supabase.com](https://supabase.com).
2. Go to **Project Settings &rarr; API** and copy your **Project URL** and **`anon` public key** into `.env.local`.
3. In the Supabase Dashboard, open **SQL Editor &rarr; New Query**.
4. Paste the contents of [`supabase/migrations/20261024000000_init_nekinet_schema.sql`](supabase/migrations/20261024000000_init_nekinet_schema.sql).
5. Click **Run**.
6. Detailed walkthrough available in [`supabase/README.md`](supabase/README.md).

---

## Setting Up Google Gemini AI Edge Function

1. Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Add the secret to your Supabase project:
   - Via Supabase Dashboard: **Project Settings &rarr; Edge Functions &rarr; Secrets** &rarr; add `GEMINI_API_KEY`.
   - Or via CLI: `supabase secrets set GEMINI_API_KEY="your-key"`
3. Deploy the function from the project root:
   ```bash
   supabase functions deploy parse-help-request --no-verify-jwt
   ```
4. Detailed instructions available in [`supabase/functions/README.md`](supabase/functions/README.md).

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR at `http://localhost:5173` |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and Vite production bundle |
| `npm test` | Executes unit and integration tests via Vitest |
| `npm run lint` | Runs Oxlint linter across all source files |
| `npm run preview` | Previews the production build locally |

---

## Running Automated Tests

To run the Vitest test suite:
```bash
npm test
```
The test suite covers:
- **Haversine Geo-Calculations & Spatial Privacy**: Confirms coordinate fuzzing applies non-zero jitter (300m–600m).
- **Gemini AI Service**: Validates schema compliance, keyword classification, and graceful heuristic fallback.
- **Data Models & Contracts**: Verifies request lifecycle states, ratings, and volunteer profiles.

---

## Current Status & Known Limitations

- **Demo / Local Fallback Mode**: When Supabase credentials or Gemini secrets are not configured, NekiNet runs in safe **Demo Fallback Mode** with labeled mock data. This allows full evaluation of navigation, dashboards, map interactions, and request workflows without cloud dependencies.
- **Spatial Jittering**: Approximate neighborhood locations are displayed intentionally on public maps. Raw address unlocking occurs only upon mutual task assignment.
