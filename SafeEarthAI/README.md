# SafeEarth AI

**Predict. Prepare. Protect.** A disaster-monitoring dashboard (React + Vite) with a Flask backend.

> SafeEarth AI is an engineering project, **not an official warning system**. In an emergency call **112** (India) and follow your local authorities.

## Folder structure

```
SafeEarthAI/
├── README.md
├── frontend/                      React + Vite
│   ├── index.html · package.json · vite.config.js · .env.example
│   └── src/
│       ├── main.jsx · App.jsx     entry + routes
│       ├── pages/                 Home, MapPage, AlertsPage, WeatherPage, AssistantPage, EmergencyPage
│       ├── components/
│       │   ├── layout/            Header, LocPicker (search + GPS), BottomNav, Layout
│       │   ├── ui/                Prov (live/cached/demo badge), RiskCard, TrendChart, AlertsDonut, Section
│       │   ├── map/LeafMap.jsx    Leaflet + OpenStreetMap
│       │   ├── alerts/ weather/ chat/ emergency/
│       ├── services/api.js        the only file that does network calls
│       ├── hooks/useFetch.js      loading / live / cached / error states
│       ├── context/AppContext.jsx location, backend status, shared data
│       ├── data/                  cities.js, demo.js (all demo data lives here)
│       └── styles/global.css
└── backend/                       Flask
    ├── run.py · config.py · requirements.txt · .env.example · pytest.ini
    ├── app/
    │   ├── __init__.py            app factory
    │   ├── routes/                health, assistant, geo (geocode + places), wildfires
    │   ├── services/              llm.py (Gemini), geo.py (Nominatim/Overpass), firms.py (NASA FIRMS)
    │   └── utils/                 errors.py, provenance.py, cache.py
    └── tests/test_api.py
```

## Prerequisites
Python 3.11+, Node.js 18+ (20 LTS recommended), VS Code.

## 1. Backend (terminal 1)

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1      macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env          # Windows: copy .env.example .env
```

Edit `backend/.env`:

| Variable | Needed for | Where to get it |
|---|---|---|
| `LLM_API_KEY`, `LLM_MODEL` | Gemini assistant | https://aistudio.google.com (use a current model name from Google's docs) |
| `FIRMS_MAP_KEY` | Wildfire hotspots | https://firms.modaps.eosdis.nasa.gov/api/map_key/ (free) |
| `APP_USER_AGENT` | Search + hospitals | Put a real contact email (OpenStreetMap policy) |

Everything works without the keys; the related features just show "Not configured".

```bash
pytest          # optional: runs the API tests
python run.py   # http://127.0.0.1:5000/api/health
```

## 2. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** on your laptop. The dev server proxies `/api` to Flask, so no CORS setup is needed.

## 3. Open it on your Android phone (same Wi-Fi)

1. Keep `npm run dev` running. It prints a `Network:` URL such as `http://192.168.1.23:5173`.
2. Open that URL in Chrome on the phone. If it does not load, allow Node.js through the Windows firewall for private networks.
3. **GPS note:** Chrome only allows location on `https://` or `localhost`. Over plain `http://192.168…` the GPS button will be blocked (city search still works). Options: (a) connect the phone by USB, run `adb reverse tcp:5173 tcp:5173`, and open `http://localhost:5173` on the phone; (b) deploy over HTTPS (below).

## 4. Deploy online

**Backend (Render, Railway, Fly.io, etc.):** build `pip install -r requirements.txt`, start `gunicorn "app:create_app()"`. Set the same variables as `.env` in the host's dashboard, plus `APP_ENV=production` and `CORS_ORIGINS=https://your-frontend-url`.

**Frontend (Netlify, Vercel, Cloudflare Pages):** root `frontend`, build `npm run build`, output `dist`. Set `VITE_API_BASE=https://your-backend-url`. Add a rewrite of all paths to `/index.html` so React Router deep links work.

## What is live, cached, demo, or unavailable

| Feature | Source | Status |
|---|---|---|
| Weather | Open-Meteo (browser → API) | Live / cached; sample values only if unreachable, labelled **Demo** |
| Earthquakes | USGS FDSN (browser → API) | Live / cached; otherwise "Unavailable", nothing invented |
| Hospitals, shelters | OpenStreetMap via Flask (Overpass) | Live / cached. Community data, **not verified**, shelters are often missing |
| Wildfire hotspots | NASA FIRMS via Flask | Needs free key. Satellite detections, **not confirmed fires** |
| City search | Built-in list, then Nominatim | Live |
| AI assistant | Gemini via Flask | Needs key; otherwise offline tips library, labelled |
| Risk scores, 7-day trends, sample alerts, flood zones | none yet | **Demo only** and labelled. Not forecasts |
| SOS | Opens your dialer (`tel:112`) and prepares a message | Never contacts anyone by itself |

## Known limitations / next steps
- No real flood, cyclone, or official-alert (IMD, CWC, NDMA/SACHET) feed yet; add one in `backend/app/services/` and show it with the same provenance badge.
- Risk scores need a trained, validated model (`ml_models/` in the original plan) before they can be called predictions.
- In-memory cache and rate limit suit one server process; use Redis for several.
