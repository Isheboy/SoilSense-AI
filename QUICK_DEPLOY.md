# 🚀 Quick Deployment Checklist

## ✅ Part 1: Deploy Backend to Render (15 minutes)

### Your API Keys (Have These Ready):

```
PYTHON_VERSION: 3.11.9
ANTHROPIC_API_KEY: sk-ant-api03-pSC1OBNAfM9...
EARTHENGINE_PROJECT: skillful-summer-385809
SUPABASE_URL: https://vsslvgelusdjbdydrras.supabase.co
SUPABASE_KEY: eyJhbGciOiJIUzI1NiIsInR5...
```

**⚠️ Note**: Python version must be `3.11.9` (not `3.11`) - Render requires full version

### Steps:

1. ☐ Go to https://render.com → Sign up with GitHub
2. ☐ Click "New +" → "Web Service"
3. ☐ Connect "SoilSense-AI" repository
4. ☐ Configure:
   - Name: soilsense-ai-backend
   - Root Directory: backend
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. ☐ Add all environment variables above
6. ☐ Click "Create Web Service"
7. ☐ **COPY YOUR URL**: https://soilsense-ai-backend-xxxx.onrender.com

---

## ✅ Part 2: Deploy Frontend to Vercel (10 minutes)

### Your API Keys (Have These Ready):

```
NEXT_PUBLIC_MAPBOX_TOKEN: pk.eyJ1IjoiaXNoZWJveSIsImEiOi...
NEXT_PUBLIC_SUPABASE_URL: https://vsslvgelusdjbdydrras.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5...
NEXT_PUBLIC_API_URL: [YOUR RENDER URL FROM PART 1]
```

### Steps:

1. ☐ Go to https://vercel.com → Sign up with GitHub
2. ☐ Click "Add New..." → "Project"
3. ☐ Import "SoilSense-AI"
4. ☐ Configure:
   - Root Directory: frontend (click Edit to select)
   - Framework: Next.js (auto-detected)
5. ☐ Add all environment variables above
6. ☐ **IMPORTANT**: Use YOUR backend URL from Part 1!
7. ☐ Click "Deploy"
8. ☐ **YOUR APP IS LIVE!**: https://soilsense-ai-xxxx.vercel.app

---

## ✅ Part 3: Final Touch (2 minutes)

1. ☐ Go back to Render → Your service → Environment
2. ☐ Update ALLOWED_ORIGINS to your Vercel URL
3. ☐ Save → Auto-redeploys

---

## 🎉 Test Your Live App!

1. ☐ Open your Vercel URL
2. ☐ Search "Chamazi"
3. ☐ Draw polygon
4. ☐ Get analysis results
5. ☐ **SUCCESS!** 🌍✨

---

## ⚠️ Common Issues:

**Backend sleeping?**

- First request takes 30 seconds (free tier limitation)

**CORS error?**

- Update ALLOWED_ORIGINS with your Vercel URL

**Can't connect?**

- Double-check NEXT_PUBLIC_API_URL matches your Render URL

---

**Total Time: ~30 minutes** ⏱️

**See DEPLOYMENT_GUIDE.md for detailed instructions**
