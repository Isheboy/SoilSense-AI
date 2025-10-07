# ✅ Testing Guide - SoilSense AI

This guide helps you verify that all components of SoilSense AI are working correctly.

---

## 🎯 Pre-Testing Checklist

Before running tests, ensure:

- [ ] Python virtual environment is activated
- [ ] All backend dependencies are installed
- [ ] All frontend dependencies are installed
- [ ] Environment variables are configured
- [ ] Google Earth Engine is authenticated
- [ ] Both servers are running

---

## 🧪 Backend Testing

### 1. Health Check Test

**URL**: http://localhost:8000/api/health

**Expected Response**:

```json
{
  "status": "healthy",
  "service": "SoilSense AI",
  "timestamp": "2025-10-07T..."
}
```

**Test Command**:

```powershell
curl http://localhost:8000/api/health
```

✅ **Pass Criteria**: Status code 200 and "healthy" status

---

### 2. API Root Test

**URL**: http://localhost:8000/

**Expected Response**:

```json
{
  "message": "Welcome to SoilSense AI API",
  "status": "healthy",
  "version": "1.0.0",
  "endpoints": [...]
}
```

✅ **Pass Criteria**: All endpoints listed

---

### 3. Analysis Endpoint Test

**URL**: http://localhost:8000/api/analyze

**Test Request**:

```json
{
  "polygon": [
    [
      [36.8219, -1.2921],
      [36.8319, -1.2921],
      [36.8319, -1.2821],
      [36.8219, -1.2821],
      [36.8219, -1.2921]
    ]
  ],
  "location_name": "Test Area",
  "end_date": "2025-10-07"
}
```

**Expected Response**:

```json
{
  "degradation_score": 45.67,
  "severity": "At Risk",
  "confidence": 0.85,
  "primary_factors": [...],
  "indicators": {
    "vegetation_health": 65.3,
    "moisture_level": 58.2,
    "soil_exposure": 32.1,
    "erosion_risk": 28.4
  },
  "date": "2025-10-07",
  "location_name": "Test Area"
}
```

**Test Command**:

```powershell
curl -X POST http://localhost:8000/api/analyze `
  -H "Content-Type: application/json" `
  -d '{\"polygon\":[[36.8219,-1.2921],[36.8319,-1.2921],[36.8319,-1.2821],[36.8219,-1.2821],[36.8219,-1.2921]],\"location_name\":\"Test Area\"}'
```

✅ **Pass Criteria**:

- Status code 200
- Contains degradation_score
- Severity is classified
- All indicators present

---

### 4. Recommendations Test

**Prerequisite**: Run analysis first

**Test Request**:

```json
{
  "degradation_score": 45.67,
  "severity": "At Risk",
  "primary_factors": ["Low vegetation cover"],
  "indicators": {
    "vegetation_health": 65.3,
    "moisture_level": 58.2,
    "soil_exposure": 32.1,
    "erosion_risk": 28.4
  }
}
```

✅ **Pass Criteria**:

- Returns recommendations text
- Includes severity
- Lists primary focus areas
- Has confidence score

---

### 5. Prediction Test

**Test Request**:

```json
{
  "polygon": [
    [
      [36.8219, -1.2921],
      [36.8319, -1.2921],
      [36.8319, -1.2821],
      [36.8219, -1.2821],
      [36.8219, -1.2921]
    ]
  ],
  "start_date": "2025-04-07",
  "end_date": "2025-10-07"
}
```

✅ **Pass Criteria**:

- Returns risk_level
- Contains 6-month forecast
- Lists key_drivers
- Includes confidence scores

---

## 🎨 Frontend Testing

### 1. Page Load Test

**URL**: http://localhost:3000

✅ **Pass Criteria**:

- [ ] Page loads without errors
- [ ] Header displays "SoilSense AI"
- [ ] API status indicator shows "connected"
- [ ] Map container is visible
- [ ] Dashboard section is visible
- [ ] Instructions panel is shown

---

### 2. Map Component Test

✅ **Pass Criteria**:

- [ ] Mapbox loads satellite imagery
- [ ] Navigation controls appear
- [ ] Drawing tools are visible
- [ ] Map is interactive (pan, zoom)
- [ ] No console errors

**Manual Test**:

1. Navigate to http://localhost:3000
2. Wait for map to load
3. Try zooming in/out
4. Try panning the map
5. Verify satellite imagery is visible

---

### 3. Drawing Tool Test

✅ **Pass Criteria**:

- [ ] Polygon tool is clickable
- [ ] Can draw multiple points
- [ ] Polygon closes automatically
- [ ] Drawn polygon is visible
- [ ] Can delete polygon

**Manual Test**:

1. Click the polygon tool
2. Click 4-5 points on the map
3. Complete the polygon
4. Verify it's visible
5. Click trash icon to delete

---

### 4. Analysis Flow Test

✅ **Pass Criteria**:

- [ ] Loading spinner appears during analysis
- [ ] Analysis completes successfully
- [ ] Results display in dashboard
- [ ] Degradation score is shown
- [ ] Severity badge appears
- [ ] All 4 metric cards display
- [ ] Radar chart renders
- [ ] Primary concerns listed

**Manual Test**:

1. Draw a polygon on the map
2. Wait for analysis (5-15 seconds)
3. Verify loading spinner appears
4. Check dashboard populates with data
5. Verify all metrics are displayed

---

### 5. Dashboard Component Test

✅ **Pass Criteria**:

- [ ] Overall score displays prominently
- [ ] Severity badge has correct color
- [ ] Vegetation health metric shown
- [ ] Moisture level metric shown
- [ ] Soil exposure metric shown
- [ ] Erosion risk metric shown
- [ ] Radar chart renders correctly
- [ ] Primary concerns section appears

---

### 6. Recommendations Test

✅ **Pass Criteria**:

- [ ] AI recommendations section loads
- [ ] Loading spinner shown while fetching
- [ ] Recommendations text appears
- [ ] Formatted properly
- [ ] Relevant to degradation level

**Manual Test**:

1. Complete an analysis
2. Scroll to recommendations section
3. Wait for AI response
4. Verify recommendations are relevant

---

### 7. Reset Functionality Test

✅ **Pass Criteria**:

- [ ] Reset button appears after analysis
- [ ] Clicking reset clears results
- [ ] Map polygon is removed
- [ ] Dashboard returns to empty state
- [ ] Can perform new analysis

**Manual Test**:

1. Complete an analysis
2. Click "Reset" button
3. Verify all cleared
4. Perform new analysis

---

## 🔗 Integration Testing

### Full Workflow Test

Complete end-to-end test of the entire application.

**Steps**:

1. **Start Application**

   ```powershell
   # Terminal 1
   cd backend
   .\venv\Scripts\Activate.ps1
   uvicorn main:app --reload

   # Terminal 2
   cd frontend
   npm run dev
   ```

2. **Verify Backend**

   - Visit http://localhost:8000
   - Check health endpoint
   - Review console for initialization messages

3. **Verify Frontend**

   - Visit http://localhost:3000
   - Check for "connected" status
   - Verify no console errors

4. **Perform Analysis**

   - Draw polygon in Kenya (around Nairobi)
   - Wait for analysis to complete
   - Verify results appear

5. **Check All Features**
   - Degradation score displayed
   - Severity classification shown
   - All 4 indicators present
   - Radar chart rendered
   - AI recommendations loaded
   - No errors in console

✅ **Complete Integration Pass**: All steps successful

---

## 🐛 Error Testing

### Test Error Handling

1. **Invalid Polygon Test**

   - Draw a very small polygon
   - Expect: Error message or fallback

2. **Network Error Test**

   - Stop backend server
   - Try to analyze
   - Expect: "Failed to analyze area" error

3. **Invalid Date Test**

   - Send request with future date
   - Expect: Graceful error handling

4. **Large Polygon Test**
   - Draw a very large area
   - Expect: Processing or size warning

---

## 📊 Performance Testing

### Response Time Tests

| Operation       | Target | Acceptable |
| --------------- | ------ | ---------- |
| Page Load       | <2s    | <5s        |
| Map Load        | <3s    | <5s        |
| API Health      | <100ms | <500ms     |
| Analysis        | 5-15s  | <30s       |
| Recommendations | 2-5s   | <10s       |
| Predictions     | 3-8s   | <15s       |

**Test Command** (Windows PowerShell):

```powershell
Measure-Command { curl http://localhost:8000/api/health }
```

---

## 🔍 Console Check

### Backend Console

✅ **Should see**:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process
✓ Earth Engine initialized successfully
✓ AI Recommendation Service initialized
✓ Database Service initialized
INFO:     Application startup complete.
```

❌ **Should NOT see**:

- Import errors
- API key errors
- Connection failures
- Uncaught exceptions

### Frontend Console

✅ **Should see**:

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully
```

❌ **Should NOT see**:

- Module not found errors
- API connection errors
- CORS errors
- Type errors

---

## 🎓 Test Scenarios

### Scenario 1: Healthy Soil

**Location**: Well-vegetated farmland
**Expected**:

- Score: 0-25
- Severity: Healthy
- High vegetation health (>70%)

### Scenario 2: At-Risk Soil

**Location**: Sparse vegetation area
**Expected**:

- Score: 25-50
- Severity: At Risk
- Moderate indicators

### Scenario 3: Degraded Soil

**Location**: Bare or eroded area
**Expected**:

- Score: 50-75
- Severity: Degraded
- Low vegetation (<40%)
- High soil exposure

---

## 📝 Test Results Template

```
Test Date: _____________
Tester: _____________

Backend Tests:
[ ] Health Check - Pass/Fail
[ ] API Root - Pass/Fail
[ ] Analysis Endpoint - Pass/Fail
[ ] Recommendations - Pass/Fail
[ ] Predictions - Pass/Fail

Frontend Tests:
[ ] Page Load - Pass/Fail
[ ] Map Component - Pass/Fail
[ ] Drawing Tools - Pass/Fail
[ ] Analysis Flow - Pass/Fail
[ ] Dashboard Display - Pass/Fail
[ ] Recommendations - Pass/Fail
[ ] Reset Function - Pass/Fail

Integration Tests:
[ ] Full Workflow - Pass/Fail
[ ] Error Handling - Pass/Fail
[ ] Performance - Pass/Fail

Issues Found:
_________________________________
_________________________________
_________________________________

Overall Status: Pass / Fail / Partial
```

---

## 🚨 Common Issues & Solutions

### Issue: "Module not found"

**Solution**:

```powershell
pip install -r requirements.txt --force-reinstall
```

### Issue: "Earth Engine not initialized"

**Solution**:

```powershell
earthengine authenticate
```

### Issue: "Map not loading"

**Solution**: Check NEXT_PUBLIC_MAPBOX_TOKEN in .env.local

### Issue: "API connection failed"

**Solution**: Ensure backend is running on port 8000

### Issue: "Database error"

**Solution**: Check Supabase credentials in .env

---

## ✅ Final Checklist

Before considering the project complete:

- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] Integration test successful
- [ ] Error handling works
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] No console errors
- [ ] Clean code (no warnings)
- [ ] Environment files configured
- [ ] Git repository clean

---

## 🎉 Success Criteria

**Application is ready for use when**:

✅ All tests pass
✅ No critical errors
✅ Response times acceptable
✅ User experience smooth
✅ Documentation complete
✅ Code is deployable

---

**Happy Testing! 🧪**
