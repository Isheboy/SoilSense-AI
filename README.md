# 🌍 SoilSense AI - Intelligent Soil Degradation Monitoring

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Hackathon](https://img.shields.io/badge/hackathon-Land_ReGen-green.svg)
![Status](https://img.shields.io/badge/status-Live-success.svg)

> AI-powered platform for real-time soil health monitoring and restoration recommendations using satellite imagery and machine learning.

**🏆 Built for the Land ReGen Hackathon 2025**

## 🌐 Live Application

**🚀 Try it now:** [https://soil-sense-ai.vercel.app/](https://soil-sense-ai.vercel.app/)

**📡 API Backend:** [https://soilsense-ai-backend.onrender.com](https://soilsense-ai-backend.onrender.com)

## 🌟 Features

### 🗺️ Interactive Mapping

- **Location Search**: Search for any location worldwide using Mapbox geocoding
- **Polygon Drawing**: Draw custom analysis areas on satellite imagery
- **Real-time Visualization**: See your analysis area on high-resolution satellite maps

### 📊 Soil Health Analysis

- **Multi-Factor Assessment**: Analyzes 4 key indicators:
  - 🌱 **Vegetation Health (NDVI)**: Measures plant vitality and coverage
  - 💧 **Moisture Level (NDMI)**: Tracks soil water content
  - 🏜️ **Soil Exposure**: Detects bare soil and erosion risk
  - 🌊 **Erosion Risk**: Evaluates degradation potential

### 🤖 AI-Powered Insights

- **Degradation Score**: 0-100 scale with severity ratings (Healthy → Critical)
- **Risk Assessment**: Identifies primary degradation factors
- **Smart Recommendations**: Claude AI generates personalized restoration strategies
- **Confidence Ratings**: Shows prediction reliability (0-100%)

### 📈 Time-Series Analysis

- **Historical Trends**: Tracks soil health changes over time
- **NDVI Time Series**: Visualizes vegetation patterns
- **Predictive Forecasting**: 6-month degradation risk predictions using ML

### 🎯 User-Friendly Interface

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clear Visualizations**: Color-coded indicators and intuitive charts
- **Instant Results**: Analysis completes in seconds
- **Educational Content**: Learn about soil health and conservation

## � How to Use SoilSense AI

### For End Users (Web App)

1. **Visit the App**: Go to [https://soil-sense-ai.vercel.app/](https://soil-sense-ai.vercel.app/)

2. **Select Your Area**:

   - **Option 1 - Search**: Type a location name (e.g., "Chamazi, Tanzania") in the search box
   - **Option 2 - Draw**: Click the "Click Here to Draw Area" button and draw a polygon on the map

3. **Analyze**:

   - The analysis starts automatically after searching or drawing
   - Wait 5-10 seconds for processing

4. **View Results**:

   - **Degradation Score**: See overall soil health (0-100)
   - **Severity Level**: Check if area is Healthy, At Risk, Degraded, or Critical
   - **Indicators**: View detailed metrics:
     - Vegetation Health percentage
     - Moisture Level percentage
     - Soil Exposure percentage
     - Erosion Risk percentage
   - **Radar Chart**: Visualize all indicators at once

5. **Get Recommendations**:

   - Scroll down to see AI-generated restoration strategies
   - View time-series trends of vegetation health
   - Check confidence rating for prediction reliability

6. **Try Different Areas**:
   - Search new locations or draw new polygons
   - Compare different regions
   - Track changes over time

### Tips for Best Results

✅ **DO:**

- Draw polygons on agricultural or degraded land
- Use areas between 1-100 hectares for accurate analysis
- Search specific place names for better geocoding
- Try different time periods for trend analysis

❌ **AVOID:**

- Drawing polygons over water bodies or urban areas
- Very small areas (< 0.1 hectares)
- Very large areas (> 1000 hectares) - may take longer

---

## 🚀 Quick Start for Developers

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))

### Required API Keys

You'll need accounts and API keys for:

- 🗺️ **Mapbox** - For maps ([Get key](https://account.mapbox.com/))
- 🛰️ **Google Earth Engine** - For satellite data ([Register](https://earthengine.google.com/))
- 🤖 **Anthropic Claude** - For AI recommendations ([Get key](https://console.anthropic.com/))
- 💾 **Supabase** - For database ([Create project](https://supabase.com/))

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/Isheboy/SoilSense-AI.git
cd SoilSense-AI
```

#### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Windows CMD:
.venv\Scripts\activate.bat
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Authenticate Earth Engine
earthengine authenticate
```

#### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install
```

#### 4. Environment Configuration

**Backend** - Create `backend/.env`:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
EARTHENGINE_PROJECT=your_earth_engine_project_id
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
ALLOWED_ORIGINS=http://localhost:3000,https://soil-sense-ai.vercel.app
```

**Frontend** - Create `frontend/.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 5. Database Setup

```bash
# Run SQL schema in Supabase SQL Editor
# Copy contents from docs/database-schema.sql
# Execute in Supabase dashboard
```

### Running the Application Locally

#### Start Backend Server

```bash
# From project root
cd backend

# Activate virtual environment (if not already active)
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
# source .venv/bin/activate    # Mac/Linux

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

#### Start Frontend Server

```bash
# From project root (new terminal)
cd frontend

# Start Next.js development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

#### Quick Start Scripts

For Windows users, convenient scripts are provided:

```bash
# Setup everything (first time only)
.\setup.ps1

# Start both servers
.\start.ps1
```

### Testing the Application

1. Open browser to `http://localhost:3000`
2. Search for "Chamazi, Tanzania" or any location
3. Or click "Draw Area" and draw a polygon
4. Wait for analysis results
5. View degradation score and recommendations

### Troubleshooting

**Backend won't start?**

- Check Python version: `python --version` (should be 3.11+)
- Verify virtual environment is activated
- Check Earth Engine authentication: `earthengine authenticate`

**Frontend errors?**

- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 18+)
- Verify .env.local has all required variables

**No analysis results?**

- Check backend is running on port 8000
- Verify API keys in environment variables
- Check browser console for errors (F12)

## 📊 Project Structure

```
SoilSense-AI/
├── frontend/                    # Next.js frontend application
│   ├── app/                    # App router pages
│   │   ├── page.tsx           # Main application page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── MapComponent.tsx   # Interactive map with drawing
│   │   └── Dashboard.tsx      # Results dashboard
│   ├── lib/                   # Utilities and API client
│   │   └── api.ts            # Backend API integration
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
│
├── backend/                    # FastAPI backend application
│   ├── main.py               # API routes and startup
│   ├── services/             # Business logic services
│   │   ├── earth_engine_service.py    # Satellite data processing
│   │   ├── degradation_service.py     # Degradation analysis
│   │   └── ai_service.py              # AI recommendations
│   ├── requirements.txt      # Python dependencies
│   └── runtime.txt          # Python version for deployment
│
├── docs/                      # Documentation
│   ├── database-schema.sql   # Database setup script
│   └── SETUP.md             # Detailed setup guide
│
├── _documentation/           # Archive (gitignored)
│   ├── deployment guides     # Render & Vercel guides
│   ├── technical docs       # Architecture & fixes
│   └── credentials          # Service account keys
│
├── .gitignore               # Git ignore rules
├── LICENSE                  # MIT License
├── README.md               # This file
├── setup.ps1              # Windows setup script
└── start.ps1             # Windows start script
```

### Key Files Explained

- **`frontend/components/MapComponent.tsx`**: Interactive Mapbox map with polygon drawing and location search
- **`frontend/components/Dashboard.tsx`**: Displays analysis results with charts and indicators
- **`backend/services/earth_engine_service.py`**: Fetches and processes Sentinel-2 satellite imagery
- **`backend/services/degradation_service.py`**: Calculates degradation scores and risk factors
- **`backend/services/ai_service.py`**: Generates AI-powered recommendations using Claude

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5 with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Maps**: Mapbox GL JS 3 + MapboxDraw
- **Charts**: Recharts 2
- **HTTP Client**: Axios
- **Deployment**: Vercel

### Backend

- **Framework**: FastAPI 0.104
- **Language**: Python 3.11
- **Satellite Data**: Google Earth Engine
- **AI**: Anthropic Claude 3.5 Sonnet
- **ML Models**: XGBoost, Scikit-learn
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Deployment**: Render.com

### Data Sources

- **Sentinel-2**: 10m resolution satellite imagery (ESA Copernicus)
- **Earth Engine**: Geospatial processing and analysis
- **Historical Data**: 2015-present satellite archive

### Key Libraries

- `earthengine-api` - Satellite data access
- `anthropic` - AI recommendations
- `xgboost` - Predictive modeling
- `mapbox-gl` - Interactive mapping
- `recharts` - Data visualization

## � Deployment

### Current Deployment

- **Frontend**: Deployed on Vercel  
  Live at: [https://soil-sense-ai.vercel.app/](https://soil-sense-ai.vercel.app/)
- **Backend**: Deployed on Render  
  API at: [https://soilsense-ai-backend.onrender.com](https://soilsense-ai-backend.onrender.com)

### Deploy Your Own

#### Frontend (Vercel)

1. Fork this repository
2. Connect to Vercel: [vercel.com/new](https://vercel.com/new)
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically from main branch

#### Backend (Render)

1. Create new Web Service on [Render](https://render.com/)
2. Connect GitHub repository
3. Set root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `EARTHENGINE_PROJECT`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `ALLOWED_ORIGINS`
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON` (entire service account JSON)
7. Deploy

**Note**: Create Google Earth Engine service account for production deployment.

---

## 🤝 Contributing

This is a hackathon project but contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

### Areas for Improvement

- [ ] Add more satellite data sources (Landsat, MODIS)
- [ ] Implement user authentication
- [ ] Add historical data comparison
- [ ] Create mobile app version
- [ ] Add multi-language support
- [ ] Improve ML model accuracy
- [ ] Add soil type classification

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Developer**: [@Isheboy](https://github.com/Isheboy)  
**Built for**: Land ReGen Hackathon 2025  
**Duration**: 5 days (January 2025)

---

## 🙏 Acknowledgments

- **Google Earth Engine** - For providing free access to Sentinel-2 satellite imagery
- **ESA Copernicus Program** - For Sentinel-2 mission and open data policy
- **Anthropic** - For Claude AI API powering intelligent recommendations
- **Mapbox** - For beautiful interactive mapping capabilities
- **Supabase** - For managed PostgreSQL database with PostGIS
- **Vercel & Render** - For free hosting and seamless deployment
- **Land ReGen Hackathon** - For the opportunity and challenge

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Isheboy/SoilSense-AI/issues)
- **Live App**: [soil-sense-ai.vercel.app](https://soil-sense-ai.vercel.app/)
- **API Docs**: [soilsense-ai-backend.onrender.com/docs](https://soilsense-ai-backend.onrender.com/docs)

---

## 🌱 Impact

SoilSense AI aims to democratize soil health monitoring by making satellite-based analysis accessible to:

- 👨‍🌾 **Farmers** - Monitor field health and optimize interventions
- 🌍 **NGOs** - Track restoration projects and measure impact
- 🏛️ **Governments** - Inform policy and prioritize degraded areas
- 🔬 **Researchers** - Study degradation patterns and test solutions

**Made with ❤️ for a healthier planet** 🌍
