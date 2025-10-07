# SoilSense AI Setup Guide

## Prerequisites

- Python 3.9+
- Node.js 18+
- Git

## Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp ../.env.example .env
# Edit .env with your API keys
```

5. Authenticate Google Earth Engine:
```bash
earthengine authenticate
```

6. Run the server:
```bash
uvicorn main:app --reload
```

## Frontend Setup

Coming soon...

## Database Setup

1. Create Supabase project at https://supabase.com
2. Run the SQL schema from docs/database-schema.sql
3. Copy URL and keys to .env file
