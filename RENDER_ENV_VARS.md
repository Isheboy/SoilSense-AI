# 🔑 Environment Variables for Render Deployment

Copy and paste these into Render's Environment Variables section:

## Add These Environment Variables:

Click "+ Add Environment Variable" for EACH of these **5 variables**:

### ⚠️ IMPORTANT: Python Version

**DO NOT add PYTHON_VERSION as environment variable!**

- Python version is handled by `runtime.txt` file
- Adding it as env var causes conflicts
- Render will use `backend/runtime.txt` automatically

---

### 1. Anthropic API Key

```
NAME_OF_VARIABLE: ANTHROPIC_API_KEY
value: sk-ant-api03-pSC1OBNAfM9lB7IZdnvIkHYm90CQs1jtmRYgTfnf8cUJlrpFQi4zXuFEhhUCfq0cF-eM2u6UbE9nS6a_AQAA
```

### 2. Earth Engine Project

```
NAME_OF_VARIABLE: EARTHENGINE_PROJECT
value: skillful-summer-385809
```

### 3. Supabase URL

```
NAME_OF_VARIABLE: SUPABASE_URL
value: https://vsslvgelusdjbdydrras.supabase.co
```

### 4. Supabase Key

```
NAME_OF_VARIABLE: SUPABASE_KEY
value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzc2x2Z2VsdXNkamJkeWRycmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTk4ODIsImV4cCI6MjA2MDAzNTg4Mn0.N-IeZC_Rqhdt6YsNRVYovQcOuwB1IBbK3OZTdMJ6oeU
```

### 5. Allowed Origins (CORS)

```
NAME_OF_VARIABLE: ALLOWED_ORIGINS
value: *
```

(You'll update this later with your Vercel URL)

---

## 📝 How to Add in Render:

1. In the "Environment Variables" section you see in your screenshot
2. Click **"+ Add Environment Variable"**
3. Type the **NAME_OF_VARIABLE** in the left field
4. Paste the **value** in the right field
5. Repeat for all 5 variables above
6. Then scroll down and click **"Deploy Web Service"**

---

## ⚠️ IMPORTANT NOTES:

- Make sure there are NO extra spaces before or after the values
- The keys must be EXACTLY as shown (case-sensitive)
- Don't include quotes around the values
- After adding all 6, you should see them listed

---

## 🎯 Next Steps After Adding Variables:

1. ✅ Add all 5 environment variables (NO PYTHON_VERSION!)
2. ✅ Click "Deploy Web Service" at the bottom
3. ⏳ Wait 5-10 minutes for deployment
4. 📝 COPY your backend URL when it shows "Live"
5. 🎉 Move to Part 2 (Vercel frontend deployment)
