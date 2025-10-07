# 🌍 SoilSense AI - Intelligent Soil Degradation Monitoring

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Hackathon](https://img.shields.io/badge/hackathon-Land_ReGen-green.svg)

> AI-powered platform for real-time soil health monitoring and restoration recommendations using satellite imagery and machine learning.

**🏆 Built for the Land ReGen Hackathon 2025**

## 🌟 Features

- **Real-time Monitoring**: Analyze soil health using Sentinel-2 satellite data (10m resolution)
- **Degradation Detection**: Multi-factor analysis (NDVI, moisture, erosion, soil exposure)
- **Predictive Analytics**: ML-powered 6-month degradation risk forecasting
- **AI Recommendations**: Claude-generated personalized restoration strategies
- **Interactive Maps**: Draw analysis areas and visualize degradation heatmaps
- **Progress Tracking**: Monitor intervention effectiveness over time

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account
- Google Earth Engine account
- Anthropic API key

### Installation

```bash
# Clone repository
git clone https://github.com/Isheboy/SoilSense-AI.git
cd SoilSense-AI

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install

# Environment variables
cp .env.example .env
# Add your API keys to .env
```

### Running Locally

```bash
# Terminal 1: Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## 📊 Project Structure

```
SoilSense-AI/
├── frontend/           # React + TypeScript frontend
├── backend/            # FastAPI Python backend
├── docs/               # Documentation
├── .vscode/            # VS Code configuration
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Mapbox GL, TailwindCSS
- **Backend**: FastAPI, Python, Google Earth Engine
- **Database**: Supabase (PostgreSQL + PostGIS)
- **AI/ML**: Claude 3.5 Sonnet, XGBoost, Scikit-learn
- **Deployment**: Vercel, Supabase Cloud

## 📅 Development Timeline

- **Day 1**: Foundation & Data Pipeline
- **Day 2**: Core AI Models
- **Day 3**: Frontend Development
- **Day 4**: Integration & Features
- **Day 5**: Testing & Presentation

## 🤝 Contributing

This is a hackathon project. Contributions and feedback welcome!

## 📄 License

MIT License

## 👥 Team

Built with ❤️ for the Land ReGen Hackathon by @Isheboy

## 🙏 Acknowledgments

- Sentinel-2 data courtesy of ESA Copernicus program
- Google Earth Engine for geospatial processing
- Anthropic Claude for AI recommendations