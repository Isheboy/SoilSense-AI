# 🚀 SoilSense AI - Complete Deployment Guide

This guide will walk you through deploying your SoilSense AI application to make it accessible online.

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ GitHub account (you already have one)
- ✅ All code pushed to GitHub
- ✅ API keys ready:
  - Anthropic API Key
  - Google Earth Engine Project ID
  - Supabase URL and Key
  - Mapbox Token

---

## 🎯 PART 1: Deploy Backend (FastAPI) to Render

### Step 1: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your GitHub repositories
5. ✅ You're now logged into Render!

### Step 2: Create New Web Service

1. On Render Dashboard, click **"New +"** button (top right)
2. Select **"Web Service"** from the dropdown

### Step 3: Connect Your Repository

1. You'll see a list of your GitHub repositories
2. Find **"SoilSense-AI"** repository
3. Click **"Connect"** button next to it

### Step 4: Configure Web Service

Fill in the following settings:

**Basic Settings:**

- **Name**: `soilsense-ai-backend` (or any name you prefer)
- **Region**: Choose closest to your location (e.g., Oregon (US West))
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`

**Build & Deploy:**

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Instance Type:**

- Select **"Free"** (scroll down to find it)

### Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"** for each:

```
Key: PYTHON_VERSION
Value: 3.11

Key: ANTHROPIC_API_KEY
Value: sk-ant-api03-pSC1OBNAfM9... (your key)

Key: EARTHENGINE_PROJECT
Value: skillful-summer-385809 (your project ID)

Key: SUPABASE_URL
Value: https://vsslvgelusdjbdydrras.supabase.co (your URL)

Key: SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5... (your key)

Key: ALLOWED_ORIGINS
Value: * (or your frontend URL later)
```

### Step 6: Deploy!

1. Click **"Create Web Service"** button at the bottom
2. ⏳ Render will start building and deploying (takes 5-10 minutes)
3. Watch the deployment logs in real-time
4. ✅ When you see "Live" badge, your backend is deployed!

### Step 7: Get Your Backend URL

1. At the top of the page, you'll see your service URL
2. It will look like: `https://soilsense-ai-backend.onrender.com`
3. **📝 COPY THIS URL** - you'll need it for the frontend!

### Step 8: Test Your Backend

1. Open your browser and go to: `https://your-backend-url.onrender.com`
2. You should see: `{"status":"healthy","service":"SoilSense AI"...}`
3. ✅ Backend is working!

**⚠️ Important Note:** Free Render services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## 🎯 PART 2: Deploy Frontend (Next.js) to Vercel

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub
5. ✅ You're now logged into Vercel!

### Step 2: Import Project

1. On Vercel Dashboard, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories
3. Find **"SoilSense-AI"**
4. Click **"Import"** button

### Step 3: Configure Project

**Configure Project Settings:**

- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: Click **"Edit"** → Select `frontend` folder → Click **"Continue"**
- **Build Settings**: (leave as default)
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### Step 4: Add Environment Variables

Click on **"Environment Variables"** section and add these:

```
Name: NEXT_PUBLIC_MAPBOX_TOKEN
Value: pk.eyJ1IjoiaXNoZWJveSIsImEiOi... (your Mapbox token)

Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://vsslvgelusdjbdydrras.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5... (your Supabase anon key)

Name: NEXT_PUBLIC_API_URL
Value: https://soilsense-ai-backend.onrender.com (YOUR BACKEND URL from Part 1!)
```

**⚠️ CRITICAL:** Make sure to use YOUR actual backend URL from Render!

### Step 5: Deploy!

1. Click **"Deploy"** button
2. ⏳ Vercel will build and deploy (takes 2-5 minutes)
3. Watch the build logs
4. ✅ When complete, you'll see "Congratulations" message!

### Step 6: Get Your Live URL

1. You'll see your deployment at: `https://soilsense-ai-xxxxx.vercel.app`
2. Click **"Visit"** to open your live application!
3. 🎉 **Your app is now LIVE on the internet!**

### Step 7: Optional - Add Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain if you have one
3. Follow Vercel's instructions to update DNS

---

## 🔄 PART 3: Update Backend CORS (Important!)

Now that you have your frontend URL, update the backend:

### Step 1: Update Render Environment Variables

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click on your **"soilsense-ai-backend"** service
3. Go to **"Environment"** tab
4. Find **"ALLOWED_ORIGINS"** variable
5. Update value to: `https://your-vercel-app.vercel.app,http://localhost:3000`
6. Click **"Save Changes"**
7. Render will automatically redeploy

---

## ✅ PART 4: Test Your Deployed Application

### Test the Complete Flow:

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Type **"Chamazi"** in the search bar
3. Select it from the dropdown
4. Draw a polygon on the map
5. Wait for analysis results
6. ✅ Success! Your app is fully deployed!

---

## 🔧 Troubleshooting

### Backend Issues:

**Problem**: 500 error when analyzing

- **Solution**: Check Render logs for errors
- **Solution**: Verify all environment variables are set correctly
- **Solution**: Make sure Earth Engine authentication is working

**Problem**: CORS errors

- **Solution**: Update ALLOWED_ORIGINS to include your Vercel URL

### Frontend Issues:

**Problem**: Can't connect to backend

- **Solution**: Verify NEXT_PUBLIC_API_URL matches your Render URL exactly
- **Solution**: Make sure backend is not sleeping (first request wakes it up)

**Problem**: Map doesn't load

- **Solution**: Check NEXT_PUBLIC_MAPBOX_TOKEN is correct
- **Solution**: Check browser console for errors

---

## 📊 Monitoring & Logs

### View Backend Logs:

1. Go to Render Dashboard
2. Click your service
3. Click "Logs" tab
4. See real-time server logs

### View Frontend Logs:

1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click any deployment to see logs

---

## 🚀 Automatic Deployments

**Great news!** Both Render and Vercel are now set up for automatic deployments:

- ✅ Every `git push` to `main` branch automatically deploys backend to Render
- ✅ Every `git push` to `main` branch automatically deploys frontend to Vercel
- ✅ No manual deployment needed after initial setup!

---

## 💰 Cost Information

### Current Setup (FREE):

- ✅ **Render Free Tier**: 750 hours/month free
  - ⚠️ Service sleeps after 15 min inactivity
  - ⚠️ First request takes ~30 seconds to wake up
- ✅ **Vercel Free Tier**:
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic HTTPS & CDN

### Upgrade Options (Optional):

**Render ($7/month):**

- ✅ No sleeping
- ✅ Instant responses
- ✅ 400 hours always-on

**Vercel Pro ($20/month):**

- ✅ Custom domains
- ✅ More bandwidth
- ✅ Priority support

---

## 📝 Summary

✅ **Backend**: Deployed on Render at `https://your-backend.onrender.com`
✅ **Frontend**: Deployed on Vercel at `https://your-app.vercel.app`
✅ **Database**: Already on Supabase (cloud)
✅ **Auto-Deploy**: Enabled on both platforms

**Your SoilSense AI is now LIVE and accessible worldwide! 🌍🎉**

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs on Render/Vercel
3. Verify all environment variables are correct
4. Test each service independently

---

**Congratulations on deploying your AI-powered soil monitoring system! 🎊**
