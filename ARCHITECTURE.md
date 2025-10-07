# 🏗️ SoilSense AI - System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (Next.js + React + TypeScript)               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │ MapComponent │    │  Dashboard   │    │  API Client  │    │
│  │              │    │              │    │              │    │
│  │ - Mapbox GL  │    │ - Metrics    │    │ - REST calls │    │
│  │ - Drawing    │    │ - Charts     │    │ - Types      │    │
│  │ - Polygon    │    │ - AI Recs    │    │ - Errors     │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ CORS Enabled
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND API LAYER                         │
│                         (FastAPI)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Endpoints:                                                      │
│  ├─ POST /api/analyze        → Soil degradation analysis       │
│  ├─ POST /api/recommendations → AI restoration advice          │
│  ├─ POST /api/predict        → 6-month risk forecast           │
│  ├─ POST /api/time-series    → Historical NDVI data            │
│  └─ GET  /api/locations      → Monitored locations list        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Earth Engine    │  │  Degradation    │  │   AI Service    │ │
│  │    Service      │  │    Analyzer     │  │                 │ │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤ │
│  │ • Sentinel-2    │  │ • Multi-factor  │  │ • Claude 3.5    │ │
│  │ • NDVI calc     │  │ • Scoring       │  │ • Context aware │ │
│  │ • NDMI calc     │  │ • Classification│  │ • Personalized  │ │
│  │ • BSI calc      │  │ • Risk factors  │  │ • Fallbacks     │ │
│  │ • Time series   │  │ • Confidence    │  │ • Prompts       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │  Prediction     │  │   Database      │                       │
│  │    Service      │  │    Service      │                       │
│  ├─────────────────┤  ├─────────────────┤                       │
│  │ • Trend analysis│  │ • Supabase      │                       │
│  │ • Risk scoring  │  │ • PostGIS       │                       │
│  │ • 6-mo forecast │  │ • History       │                       │
│  │ • Key drivers   │  │ • Locations     │                       │
│  │ • Confidence    │  │ • Upserts       │                       │
│  └─────────────────┘  └─────────────────┘                       │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                    │           │           │
                    ▼           ▼           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Google     │  │  Anthropic   │  │   Supabase   │          │
│  │ Earth Engine │  │    Claude    │  │  PostgreSQL  │          │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤          │
│  │ • Sentinel-2 │  │ • GPT-4 class│  │ • Database   │          │
│  │ • 10m pixels │  │ • Streaming  │  │ • PostGIS    │          │
│  │ • Free tier  │  │ • Context 200K│ │ • Auth       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐                                                │
│  │   Mapbox     │                                                │
│  │   GL JS      │                                                │
│  ├──────────────┤                                                │
│  │ • Satellite  │                                                │
│  │ • Drawing    │                                                │
│  │ • Navigation │                                                │
│  └──────────────┘                                                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

                          DATA FLOW

1. User draws polygon on map
            ↓
2. Frontend sends coordinates to /api/analyze
            ↓
3. Earth Engine Service queries Sentinel-2
            ↓
4. Calculate NDVI, NDMI, BSI indicators
            ↓
5. Degradation Analyzer computes composite score
            ↓
6. Database Service saves to Supabase
            ↓
7. AI Service generates recommendations via Claude
            ↓
8. Prediction Service forecasts 6-month trends
            ↓
9. Results returned to frontend as JSON
            ↓
10. Dashboard displays metrics, charts, and AI advice

═══════════════════════════════════════════════════════════════════

                      TECHNOLOGY STACK

┌─────────────────────────────────────────────────────────────────┐
│ Frontend Stack                                                   │
├─────────────────────────────────────────────────────────────────┤
│ • Next.js 14 - React framework                                  │
│ • TypeScript - Type safety                                      │
│ • Mapbox GL JS - Interactive maps                               │
│ • Recharts - Data visualization                                 │
│ • TailwindCSS - Utility-first styling                           │
│ • @mapbox/mapbox-gl-draw - Drawing tools                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Backend Stack                                                    │
├─────────────────────────────────────────────────────────────────┤
│ • FastAPI - Modern Python web framework                         │
│ • Uvicorn - ASGI server                                         │
│ • Pydantic - Data validation                                    │
│ • Python-dotenv - Environment variables                         │
│ • NumPy/Pandas - Data processing                                │
│ • Scikit-learn - Machine learning                               │
│ • XGBoost - Gradient boosting                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ External APIs                                                    │
├─────────────────────────────────────────────────────────────────┤
│ • Google Earth Engine - Satellite data                          │
│ • Anthropic Claude - AI recommendations                         │
│ • Supabase - Database & Auth                                    │
│ • Mapbox - Maps & Geolocation                                   │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

                      DEPLOYMENT ARCHITECTURE

┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────┐         ┌────────────┐         ┌────────────┐  │
│  │  Vercel    │         │  Railway   │         │  Supabase  │  │
│  │            │         │   or       │         │   Cloud    │  │
│  │  Frontend  │◄───────►│  Render    │◄───────►│            │  │
│  │  Hosting   │         │            │         │  Database  │  │
│  │            │         │  Backend   │         │            │  │
│  └────────────┘         └────────────┘         └────────────┘  │
│       │                      │                       │          │
│       │                      │                       │          │
│       └──────────────────────┼───────────────────────┘          │
│                              │                                   │
│                              ▼                                   │
│                    ┌──────────────────┐                         │
│                    │  External APIs   │                         │
│                    │                  │                         │
│                    │  • Earth Engine  │                         │
│                    │  • Claude API    │                         │
│                    │  • Mapbox        │                         │
│                    └──────────────────┘                         │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

                      SECURITY CONSIDERATIONS

┌─────────────────────────────────────────────────────────────────┐
│ • API keys stored in environment variables                      │
│ • CORS configured for specific origins                          │
│ • Database row-level security (RLS) via Supabase               │
│ • HTTPS enforced in production                                  │
│ • Rate limiting on API endpoints                                │
│ • Input validation with Pydantic                                │
│ • TypeScript for type safety                                    │
│ • No credentials in git repository                              │
└─────────────────────────────────────────────────────────────────┘
```
