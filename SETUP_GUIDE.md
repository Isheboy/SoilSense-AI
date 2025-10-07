# 🚀 SoilSense AI - Complete Setup Guide

This guide will walk you through setting up the complete SoilSense AI application step by step.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

You'll also need accounts for:

- **Google Earth Engine** - [Sign up](https://earthengine.google.com/signup/)
- **Anthropic API** - [Get API key](https://console.anthropic.com/)
- **Supabase** - [Create account](https://supabase.com/)
- **Mapbox** - [Get token](https://www.mapbox.com/)

---

## 🔧 Backend Setup

### Step 1: Set Up Python Environment

```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 2: Install Dependencies

```powershell
# Install all required Python packages
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

Edit the `backend\.env` file and add your API keys:

```bash
# Backend API Keys
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
EARTHENGINE_PROJECT=your-earth-engine-project-id
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Server Configuration
PORT=8000
HOST=0.0.0.0
DEBUG=True
```

### Step 4: Authenticate Google Earth Engine

```powershell
# Run Earth Engine authentication
earthengine authenticate

# Follow the browser prompts to sign in
# Copy the authorization code back to the terminal
```

### Step 5: Set Up Database

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Navigate to SQL Editor in your Supabase dashboard
3. Run the SQL schema from `docs/database-schema.sql`:

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    geom GEOGRAPHY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_analysis_location ON analysis_results(location_id);
CREATE INDEX idx_analysis_created ON analysis_results(created_at DESC);
```

4. Copy your Supabase URL and anon key to the `.env` file

### Step 6: Run the Backend Server

```powershell
# Make sure you're in the backend folder with venv activated
uvicorn main:app --reload --port 8000

# You should see:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# ✓ Earth Engine initialized successfully
# ✓ AI Recommendation Service initialized
# ✓ Database Service initialized
```

Test the API by visiting: http://localhost:8000

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend

Open a **new terminal** (keep backend running):

```powershell
cd frontend
```

### Step 2: Configure Environment Variables

Edit `frontend\.env.local` and add your keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1xxxxxxxxxxxxx
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 3: Install Dependencies

```powershell
# Install all Node.js packages
npm install

# This will install:
# - Next.js framework
# - React and React DOM
# - TypeScript
# - Mapbox GL and drawing tools
# - Recharts for data visualization
# - Supabase client
# - TailwindCSS for styling
```

### Step 4: Run the Development Server

```powershell
npm run dev

# You should see:
# - ready started server on 0.0.0.0:3000, url: http://localhost:3000
# - event compiled client and server successfully
```

Visit: http://localhost:3000

---

## 🧪 Testing the Application

### 1. Check Backend Health

Visit http://localhost:8000 - you should see:

```json
{
  "message": "Welcome to SoilSense AI API",
  "status": "healthy",
  "version": "1.0.0",
  "endpoints": [...]
}
```

### 2. Test Frontend Connection

1. Open http://localhost:3000
2. Check the API status indicator in the header (should show "connected")
3. The map should load with satellite imagery

### 3. Run a Soil Analysis

1. Use the polygon drawing tool on the map
2. Draw a polygon around an area of interest
3. Wait for the analysis to complete
4. View the degradation metrics and recommendations

---

## 📁 Project Structure

```
SoilSense-AI/
├── backend/
│   ├── main.py                      # FastAPI application
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment variables
│   └── services/
│       ├── earth_engine_service.py  # Satellite data processing
│       ├── degradation_service.py   # Degradation analysis
│       ├── ai_service.py            # Claude AI recommendations
│       ├── prediction_service.py    # ML predictions
│       └── database_service.py      # Supabase integration
├── frontend/
│   ├── pages/
│   │   ├── index.tsx                # Main dashboard page
│   │   ├── _app.tsx                 # Next.js app wrapper
│   │   └── _document.tsx            # HTML document structure
│   ├── components/
│   │   ├── MapComponent.tsx         # Interactive map
│   │   └── Dashboard.tsx            # Analytics dashboard
│   ├── lib/
│   │   ├── api.ts                   # API client
│   │   └── supabase.ts              # Supabase client
│   ├── styles/
│   │   └── globals.css              # Global styles
│   ├── package.json                 # Node dependencies
│   ├── .env.local                   # Environment variables
│   ├── next.config.js               # Next.js configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── tailwind.config.js           # TailwindCSS configuration
│   └── postcss.config.js            # PostCSS configuration
└── docs/
    ├── database-schema.sql          # Database schema
    └── SETUP.md                     # This file
```

---

## 🔑 API Endpoints

### GET `/`

Welcome message and API information

### GET `/api/health`

Health check endpoint

### POST `/api/analyze`

Analyze soil degradation for a given area

**Request Body:**

```json
{
  "polygon": [[[lon1, lat1], [lon2, lat2], ...]],
  "location_name": "Farm Field 1",
  "end_date": "2025-10-07"
}
```

### POST `/api/recommendations`

Get AI-powered restoration recommendations

### POST `/api/predict`

Predict 6-month degradation risk

### POST `/api/time-series`

Get NDVI time series data

### GET `/api/locations`

Get all monitored locations

### GET `/api/location/{id}/history`

Get analysis history for a location

---

## 🐛 Troubleshooting

### Backend Issues

**Earth Engine Authentication Failed:**

```powershell
earthengine authenticate
# Follow the browser prompts
```

**Module Import Errors:**

```powershell
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Port Already in Use:**

```powershell
# Use a different port
uvicorn main:app --reload --port 8001
```

### Frontend Issues

**Module Not Found Errors:**

```powershell
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Mapbox Map Not Loading:**

- Check that NEXT_PUBLIC_MAPBOX_TOKEN is set correctly
- Verify the token is valid at https://account.mapbox.com/

**API Connection Failed:**

- Ensure backend is running on http://localhost:8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors

---

## 🚀 Deployment

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables
4. Deploy

### Frontend (Vercel)

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
```

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Earth Engine Guides](https://developers.google.com/earth-engine/guides)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [Supabase Documentation](https://supabase.com/docs)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Support

For issues and questions:

- Create an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

---

**Built with ❤️ for the Land ReGen Hackathon 2025**
