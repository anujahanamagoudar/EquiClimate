# EquiClimate Frontend - Backend Setup Guide

## Issue: Registration Returns 404

If you're seeing "Request failed with status code 404" during registration, it means the frontend cannot find the backend API endpoints.

## Solution Checklist

### 1. **Verify Backend is Running**
```bash
# Check if backend is running on port 8081
curl http://localhost:8081/api/register
```

If this fails:
- ❌ Backend is NOT running - Start it first
- ❌ Backend is on different port - Update `.env` file
- ✅ Backend responds - Continue to step 2

### 2. **Check Backend URL** (.env file)

The `.env` file controls where the frontend looks for the backend:

```env
REACT_APP_API_URL=http://localhost:8081
```

If your backend is on:
- Different machine: `REACT_APP_API_URL=http://192.168.x.x:8081`
- Different port: `REACT_APP_API_URL=http://localhost:3001`
- Different server: `REACT_APP_API_URL=https://api.example.com`

**After editing `.env`, restart the React dev server (Ctrl+C, then `npm start`)**

### 3. **Check Backend Routes**

The frontend tries these endpoint patterns:
1. `{API_URL}/api/register` ← Most common
2. `{API_URL}/api/v1/register`
3. `{API_URL}/register`
4. `{API_URL}/auth/register`
5. `{API_URL}/users/register`

Ask your backend developer which pattern they use.

### 4. **Debug with Browser Console**

1. Open **DevTools** (F12)
2. Go to **Console** tab
3. Try registering
4. Look for `[API]` logs showing which paths are being tried
5. **Share the output** so we can see what succeeded/failed

### 5. **Common Issues**

| Error | Solution |
|-------|----------|
| All paths return 404 | Backend not running or at wrong URL |
| Connection refused | Backend port is wrong or not running |
| CORS error | Backend needs `Access-Control-Allow-Origin` header |
| Successful but data wrong | Backend route exists but returns unexpected format |

## Next Steps

1. **Verify backend is running** on `http://localhost:8081`
2. **Test manually** with curl: `curl -X POST http://localhost:8081/api/register -H "Content-Type: application/json" -d '{"name":"test","email":"test@test.com","password":"123","role":"Citizen"}'`
3. **Share the console logs** from DevTools when you try registering
4. We'll identify the correct backend route and configure it

---

**Questions for backend developer:**
- What port is the backend running on?
- What are the exact endpoint paths? (e.g. `/api/register`, `/auth/register`)
- Does the backend have CORS configured for `http://localhost:3000`?
