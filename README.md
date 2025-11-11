# AyurSync – Ayurvedic Dietitian Platform (Minimal Deployment)

AyurSync is a single-file frontend with a minimal Node backend to manage Ayurvedic patient data and generate diet charts with modern nutritional analysis and Ayurvedic properties.

This repo keeps files minimal:
- `index.html` – Full SPA with embedded CSS/JS
- `backend/server.js` – Minimal Express REST API (in-memory)
- `package.json` – Scripts and backend deps
- `README.md` – Documentation

## Quick Start

Prerequisites (any one option for frontend):
- Option A: Python 3 (for a static server)
- Option B: Node.js (for `npx serve`)

Backend prerequisites:
- Node.js 18+

### Frontend (dedicated)

- Using Python (PowerShell):
  - `python -m http.server 5173`
  - Open `http://localhost:5173/`

- Using Node (PowerShell):
  - `npm run frontend:npx`
  - Open `http://localhost:5173/`

### Backend (dedicated)

1) Install dependencies:
   - `npm install`
2) Start backend:
   - `npm run backend`
3) Backend runs on `http://localhost:3000/`
   - Health: `GET /api/health`
   - Foods: `GET /api/foods`, `POST /api/foods/import`
   - Patients: `GET /api/patients`, `POST /api/patients`, `PUT /api/patients/:id`
   - Charts: `GET /api/charts?patientId=...&date=YYYY-MM-DD`, `POST /api/charts`
   - Recipes: `GET /api/recipes`, `POST /api/recipes`
   - Appointments: `GET /api/appointments`, `POST /api/appointments`

Note: The backend also serves the frontend (optional) at `/` so you can run only the backend and visit `http://localhost:3000/`. For strict separation, run frontend on 5173 and backend on 3000.

## Deployment

- Static hosting: Upload `index.html` to any static host (Netlify, GitHub Pages, S3, Firebase Hosting). All data persists in-browser via `localStorage`.
- Server hosting: Deploy `backend/server.js` to any Node host (Render, Railway, Fly.io, Heroku) and optionally serve `index.html` statically from the same server.

## Data Model (Browser / Demo)

- Patients: basic info + Ayurvedic assessment values
- Diet Charts: day-level charts keyed by patient and date
- Recipes: ingredients list with calculated macros
- Appointments: simple scheduler and progress notes storage
- Foods: starter dataset (extendable via JSON import)

## Using the App

- Login or create an account (demo-only, browser local storage)
- Patients tab: create/search patients and store assessments
- Diet Charts tab:
  - Select patient/date and meal
  - Type to search foods (suggestions)
  - See dual analysis (calories/macros + Pitta/Vata/Kapha profile)
  - Save meals and finalize the day plan with notes
- Recipes tab: build multi-ingredient recipes and save them
- Recipes tab also supports importing a JSON file of recipes (e.g. `normalized_recipes_1_50.json`). Click "Import Recipes JSON" and select the file.
- Reports tab: generate printable PDF-like day plan summaries
- Progress tab: track weight and well-being notes by date
 - Planner tab: select a patient and start date, click "Generate Weekly Plan" to auto-create a 7-day meal plan tuned to the patient's Vikriti (current imbalance) and Agni (digestive fire). Click "Save Weekly Plan" to persist to daily charts.

## API Overview (Backend)

All endpoints return JSON. The backend is in-memory and for demo purposes only.

- `GET /api/health` → `{ status: 'ok' }`
- `GET /api/foods` → array of food items
- `POST /api/foods/import` → append foods (array in body)
- `GET /api/patients` → array of patients
- `POST /api/patients` → create patient
- `PUT /api/patients/:id` → update patient
- `GET /api/charts?patientId&date` → chart for day
- `POST /api/charts` → create/update chart
- `GET /api/recipes` → array of recipes
- `POST /api/recipes` → create recipe
- `GET /api/appointments` → array of appts/progress
- `POST /api/appointments` → create appt/progress

## Features Included

- Login & Dashboard: metrics (active, new patients, upcoming appts) and quick actions
- Patient Management: modern metrics + Ayurvedic assessment (Prakriti, Vikriti, Agni, habits)
- Diet Chart Creation: meal builder with food suggestions and dual analysis (modern + Ayurvedic)
- Automated Feedback: highlights nutrient shortfalls and dosha aggravation trends
- Recipe Integration: build recipes and add them to meals
- Recipe Import: map arbitrary JSON recipe formats into the app and analyze by ingredients
- Reporting & Handouts: printable PDF-ready daily plan with notes
- Ongoing Management: progress tracking (weight, well-being notes), easy edits to charts
- Import Foods: extend food database via JSON upload
- Weekly Planner: auto-generate a 7-day plan considering dosha balance and agni

## Notes

- The frontend currently uses `localStorage` for persistence; backend endpoints are provided for future integration if you prefer server-side storage.
- Keep credentials demo-only; no real auth is implemented.
 - The recipe importer is resilient to different JSON shapes (looks for `name/title`, and ingredient properties such as `name/ingredient/ingredient_name` with quantities like `qty/quantity_g/weight_g`).