# 🚀 Quick Reference - SoilSense AI

## 📌 Essential Commands

### Backend (Terminal 1)

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

### Frontend (Terminal 2)

```powershell
cd frontend
npm run dev
```

### One-Click Setup

```powershell
.\setup.ps1
```

### One-Click Start

```powershell
.\start.ps1
```

---

## 🔑 Required API Keys

| Service             | Where to Get                    | Environment Variable           |
| ------------------- | ------------------------------- | ------------------------------ |
| Anthropic Claude    | https://console.anthropic.com/  | `ANTHROPIC_API_KEY`            |
| Google Earth Engine | https://earthengine.google.com/ | `EARTHENGINE_PROJECT`          |
| Supabase            | https://supabase.com/           | `SUPABASE_URL`, `SUPABASE_KEY` |
| Mapbox              | https://www.mapbox.com/         | `NEXT_PUBLIC_MAPBOX_TOKEN`     |

---

## 📁 Key Files

### Backend

- `backend/main.py` - Main API application
- `backend/.env` - Backend environment variables
- `backend/requirements.txt` - Python dependencies

### Frontend

- `frontend/pages/index.tsx` - Main page
- `frontend/.env.local` - Frontend environment variables
- `frontend/package.json` - Node dependencies

### Documentation

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup
- `IMPLEMENTATION.md` - What's implemented

---

## 🌐 URLs

| Service            | URL                        | Description          |
| ------------------ | -------------------------- | -------------------- |
| Frontend           | http://localhost:3000      | Main application     |
| Backend API        | http://localhost:8000      | API endpoints        |
| API Docs           | http://localhost:8000/docs | Interactive API docs |
| Supabase Dashboard | Your project URL           | Database management  |

---

## 🛠️ Common Tasks

### Install Backend Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### Authenticate Earth Engine

```powershell
earthengine authenticate
```

### Run Database Schema

```sql
-- Run in Supabase SQL Editor
-- Copy from docs/database-schema.sql
```

### Reset Frontend

```powershell
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

### Reset Backend

```powershell
cd backend
rm -rf venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 🎯 API Endpoints Quick Reference

### GET Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/locations` - List locations
- `GET /api/location/{id}/history` - Location history

### POST Endpoints

- `POST /api/analyze` - Analyze area
- `POST /api/recommendations` - Get recommendations
- `POST /api/predict` - Predict degradation
- `POST /api/time-series` - Get time series

---

## 📊 Data Models

### Analysis Request

```typescript
{
  polygon: number[][],
  location_name?: string,
  start_date?: string,
  end_date?: string
}
```

### Analysis Result

```typescript
{
  degradation_score: number,
  severity: string,
  confidence: number,
  primary_factors: string[],
  indicators: {
    vegetation_health: number,
    moisture_level: number,
    soil_exposure: number,
    erosion_risk: number
  }
}
```

---

## 🐛 Quick Troubleshooting

| Problem               | Solution                              |
| --------------------- | ------------------------------------- |
| Port 8000 in use      | Use `--port 8001`                     |
| Module not found      | Run `pip install -r requirements.txt` |
| Map not loading       | Check Mapbox token                    |
| API connection failed | Ensure backend is running             |
| TypeScript errors     | Run `npm install`                     |
| Earth Engine error    | Run `earthengine authenticate`        |

---

## 📦 Dependencies Overview

### Backend (Python)

- FastAPI - Web framework
- Uvicorn - ASGI server
- Earth Engine - Satellite data
- Anthropic - AI recommendations
- Supabase - Database
- Scikit-learn/XGBoost - ML

### Frontend (Node.js)

- Next.js - React framework
- TypeScript - Type safety
- Mapbox GL - Interactive maps
- Recharts - Data visualization
- TailwindCSS - Styling
- Supabase JS - Database client

---

## 🎨 Color Codes

### Severity Levels

- 🟢 **Healthy** - Score < 25
- 🟡 **At Risk** - Score 25-50
- 🟠 **Degraded** - Score 50-75
- 🔴 **Severely Degraded** - Score 75+

### Status Indicators

- 🟢 **Connected** - API healthy
- 🟡 **Checking** - Status unknown
- 🔴 **Disconnected** - API unavailable

---

## 📝 Testing Checklist

- [ ] Backend runs without errors
- [ ] Frontend loads successfully
- [ ] Map displays satellite imagery
- [ ] Drawing tools work
- [ ] Analysis completes successfully
- [ ] Dashboard shows results
- [ ] Recommendations generate
- [ ] All metrics display correctly
- [ ] Database saves data
- [ ] API status shows connected

---

## 🔄 Development Workflow

1. **Start both servers** (backend & frontend)
2. **Draw area** on the map
3. **Wait for analysis** (10-30 seconds)
4. **Review results** in dashboard
5. **Check recommendations** from AI
6. **Repeat** for different areas

---

## 📞 Support Resources

- GitHub Issues: Report bugs
- Documentation: See SETUP_GUIDE.md
- API Docs: http://localhost:8000/docs
- Code Comments: Inline explanations

---

## 🎓 Quick Start for New Developers

1. Clone repository
2. Run `.\setup.ps1`
3. Add API keys to `.env` files
4. Run `earthengine authenticate`
5. Run `.\start.ps1`
6. Open http://localhost:3000
7. Start developing!

---

**Happy Coding! 🚀**
