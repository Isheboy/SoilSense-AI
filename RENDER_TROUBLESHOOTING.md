# 🔧 Render Deployment - Common Issues & Solutions

## Issue 1: "Build failed: requirements not found"

**Symptom**: Build log shows "ERROR: Could not find requirements.txt"

**Solution**:
- Make sure "Root Directory" is set to `backend`
- Check that requirements.txt exists in backend folder
- Refresh and try again

---

## Issue 2: "ModuleNotFoundError: No module named 'ee'"

**Symptom**: Build succeeds but service crashes on startup

**Solution**:
- Check that `earthengine-api==1.6.11` is in requirements.txt
- Make sure PYTHON_VERSION=3.11 is set
- Redeploy service

---

## Issue 3: "Service keeps restarting"

**Symptom**: Service shows "Starting" then "Failed" repeatedly

**Common Causes**:
1. **Missing Environment Variables**
   - Check all 6 variables are added correctly
   - No extra spaces in keys or values
   
2. **Earth Engine Authentication Error**
   - Verify EARTHENGINE_PROJECT matches your GCP project
   - Check if EE credentials are valid

3. **Import Error**
   - Check build logs for Python import errors
   - Verify all dependencies in requirements.txt

**Solution**: Check logs in Render dashboard for specific error message

---

## Issue 4: "Your service is taking longer than expected to start"

**Symptom**: Deployment stuck at "Starting..."

**This is NORMAL for first deployment:**
- Earth Engine initialization takes time
- Installing packages takes 5-10 minutes
- Don't cancel! Just wait.

**If stuck for >15 minutes:**
- Check logs for errors
- Cancel and redeploy
- Verify all settings are correct

---

## Issue 5: "Free instance spun down due to inactivity"

**Symptom**: First request after 15 minutes takes 30+ seconds

**This is EXPECTED behavior on FREE tier:**
- Free Render services sleep after 15 min of no requests
- First request wakes up the service (takes 30-60 sec)
- Subsequent requests are fast

**Solutions:**
1. Accept this limitation (it's free!)
2. Upgrade to paid plan ($7/month for always-on)
3. Use a ping service to keep it awake (e.g., UptimeRobot)

---

## Issue 6: "Failed to initialize Earth Engine"

**Symptom**: Logs show "Earth Engine initialization failed"

**Causes**:
1. **Wrong Project ID**
   - EARTHENGINE_PROJECT must match your GCP project
   - Should be: `skillful-summer-385809`

2. **Project not registered with Earth Engine**
   - Go to https://code.earthengine.google.com
   - Register your project if needed

**Solution**:
- Verify project ID is correct
- Check Earth Engine authentication on GCP
- Make sure project has Earth Engine API enabled

---

## Issue 7: "CORS Error" after deployment

**Symptom**: Frontend can't connect to backend, browser shows CORS error

**Solution**:
1. Update ALLOWED_ORIGINS environment variable:
   ```
   https://your-vercel-app.vercel.app,http://localhost:3000
   ```
2. Save changes (auto-redeploys)
3. Test again

---

## Issue 8: "502 Bad Gateway"

**Symptom**: Service shows "Live" but returns 502 error

**Causes**:
1. Service crashed after starting
2. Health check failing
3. Port binding issue

**Solution**:
- Check logs for crash errors
- Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Make sure `$PORT` is used (Render provides this)
- Redeploy if needed

---

## Issue 9: "Out of Memory" errors

**Symptom**: Service crashes with "OOM" or memory errors

**Cause**: Free tier only has 512 MB RAM

**Solutions**:
1. Optimize code to use less memory
2. Reduce concurrent requests
3. Upgrade to paid plan (more RAM)

**For SoilSense AI**: This shouldn't happen with current setup

---

## Issue 10: Slow API responses

**Symptom**: Backend works but requests take >10 seconds

**Causes**:
1. Free tier CPU is limited (0.1 CPU)
2. Earth Engine API calls are slow
3. Cold start after sleeping

**Solutions**:
- This is expected on free tier
- Earth Engine processing takes time
- Upgrade for better performance
- Add loading indicators in frontend

---

## 📊 How to Check Logs:

1. Go to Render Dashboard
2. Click your service name
3. Click "Logs" tab
4. See real-time logs

**Look for**:
- ✓ "Earth Engine initialized successfully"
- ✓ "AI Recommendation Service initialized"
- ✓ "Database Service initialized"
- ✓ "Application startup complete"

---

## 🔍 Debug Checklist:

When something goes wrong:

☐ Check build logs for errors
☐ Verify all 6 environment variables exist
☐ Check variable names are EXACT (case-sensitive)
☐ Check no extra spaces in values
☐ Verify Root Directory = `backend`
☐ Verify Start Command uses `$PORT`
☐ Check Python version = 3.11
☐ Test backend URL directly in browser
☐ Check Render service status (should show "Live")
☐ Review application logs for errors

---

## ✅ Success Indicators:

Your deployment is successful when you see:

1. **Build Phase**: "Build succeeded"
2. **Deploy Phase**: Service status shows "Live"
3. **Logs Show**:
   ```
   ✓ Earth Engine initialized successfully
   ✓ AI Recommendation Service initialized
   ✓ Database Service initialized
   INFO: Application startup complete
   INFO: Uvicorn running on http://0.0.0.0:XXXXX
   ```
4. **URL Test**: Opening your service URL shows:
   ```json
   {"status":"healthy","service":"SoilSense AI"...}
   ```

---

## 🆘 Still Having Issues?

1. Check DEPLOYMENT_GUIDE.md for detailed setup
2. Review this troubleshooting guide
3. Check Render documentation: https://render.com/docs
4. Verify all prerequisites are met
5. Try redeploying from scratch

**Most issues are solved by:**
- ✅ Correct environment variables
- ✅ Correct Root Directory setting
- ✅ Waiting for build to complete
- ✅ Checking logs for specific errors
