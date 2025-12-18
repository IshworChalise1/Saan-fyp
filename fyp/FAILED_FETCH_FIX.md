# "Failed to Fetch" Error - Complete Fix Guide

## 🔴 What This Error Means

**"Failed to fetch"** = Frontend cannot reach the backend API

This is **NOT** an authentication error. It's a connectivity issue.

---

## ✅ Quick Fix (Most Common)

### **Step 1: Make sure MongoDB is running**
```powershell
mongod
```
**Expected output:**
```
Connection accepted from 127.0.0.1
```

### **Step 2: Open a NEW terminal and start the backend**
```powershell
cd backend
npm run seed
npm run dev
```

**Expected output:**
```
✓ Connected to MongoDB
🚀 Server is running on http://localhost:5000
```

### **Step 3: Open another NEW terminal and start the frontend**
```powershell
cd Saan
npm run dev
```

**Expected output:**
```
VITE vX.X.X  ready in XXX ms
```

### **Step 4: Open browser**
Navigate to `http://localhost:5173` (NOT `localhost:5000`)

---

## 🔍 Diagnostic Steps

### **Check 1: Is Backend Running?**

Open PowerShell and run:
```powershell
curl http://localhost:5000
```

**Expected response:**
```
{"message":"SAN - Venue Booking System API","version":"1.0.0","status":"running"}
```

**If you get error:** Backend is NOT running. Go back to Step 2 above.

### **Check 2: Verify API URL**

In browser console (F12), paste:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

**Should show:** `http://localhost:5000/api`

If it shows something else, check `Saan/.env`

### **Check 3: Test API Directly**

In browser console (F12), paste:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@gmail.com',
    password: 'user@123'
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.log('Error:', e))
```

This will show if the backend is responding.

---

## ❌ Common Causes & Solutions

### **Cause 1: Backend Not Running**

**Symptom:** `curl http://localhost:5000` shows error

**Solution:**
```powershell
# Kill any existing processes on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Start fresh
cd backend
npm run dev
```

### **Cause 2: MongoDB Not Running**

**Symptom:** Backend shows `✗ MongoDB connection error`

**Solution:**
```powershell
# New terminal - Start MongoDB
mongod

# Wait for: "Waiting for connections on port 27017"

# Then in another terminal, start backend
cd backend
npm run dev
```

### **Cause 3: Wrong Port in Frontend**

**Symptom:** API_URL is `localhost:3000/api` instead of `localhost:5000/api`

**Solution:**
Check `Saan/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

If different, update it and restart frontend:
```powershell
cd Saan
npm run dev
```

### **Cause 4: Backend Crashed After Starting**

**Symptom:** Backend started but then showed error

**Solution:**
Check the error message in backend terminal. Common issues:
- MongoDB connection failed
- Port 5000 already in use
- Missing dependencies

```powershell
# Reinstall dependencies
cd backend
npm install

# Try again
npm run dev
```

### **Cause 5: CORS Issue**

**Symptom:** Console shows "CORS error" or network error

**Solution:**
The backend has CORS enabled, so this shouldn't happen. But if it does:

1. Verify frontend URL matches backend's CORS config
2. Check both are using HTTP (not mixed HTTP/HTTPS)
3. Restart both services

---

## 🎯 Complete Working Setup

Follow this exact sequence:

**Terminal 1: Start MongoDB**
```powershell
mongod
# Wait for "Waiting for connections"
```

**Terminal 2: Start Backend**
```powershell
cd backend
npm install          # Run once if not done
npm run seed         # Create test users
npm run dev          # Start server
# Should show: ✓ Connected to MongoDB
#             🚀 Server is running on http://localhost:5000
```

**Terminal 3: Start Frontend**
```powershell
cd Saan
npm install          # Run once if not done
npm run dev          # Start development server
# Should show: VITE vX.X.X ready in XXX ms
```

**Browser:**
- Open: `http://localhost:5173`
- Login with: `user@gmail.com` / `user@123`
- Should work now!

---

## 🧪 Test API Connectivity

After starting both servers, open browser console (F12) and run:

```javascript
async function testAPI() {
  console.log('Testing API connectivity...');
  
  try {
    const response = await fetch('http://localhost:5000');
    const data = await response.json();
    console.log('✓ Backend is running:', data);
  } catch (error) {
    console.log('✗ Backend not responding:', error.message);
  }
}

testAPI();
```

If you see "✓ Backend is running", the connection works!

---

## 📋 Checklist Before Login

- [ ] MongoDB is running (check for "Waiting for connections")
- [ ] Backend is running (check for "Server is running on http://localhost:5000")
- [ ] Frontend is running (check for "VITE ready")
- [ ] Frontend shows URL: `http://localhost:5173`
- [ ] `Saan/.env` has: `VITE_API_URL=http://localhost:5000/api`
- [ ] Test user exists: `npm run seed` was run
- [ ] Browser cache cleared (Ctrl+Shift+Delete)

---

## 🚨 If Still Getting "Failed to Fetch"

**Step 1: Check backend console**
Look at the terminal where you ran `npm run dev`
Does it show:
- `✓ Connected to MongoDB` - YES?
- `🚀 Server is running on http://localhost:5000` - YES?

If NO, backend isn't running properly.

**Step 2: Restart everything**
```powershell
# Close all terminals (Ctrl+C)

# Terminal 1
mongod

# Wait 2 seconds

# Terminal 2
cd backend
npm run dev

# Wait for server to start

# Terminal 3
cd Saan
npm run dev

# Wait for frontend to start

# Open browser
http://localhost:5173
```

**Step 3: Clear browser cache**
- Press Ctrl+Shift+Delete
- Clear cookies and cached data
- Close and reopen browser

**Step 4: Check Network tab (F12)**
When you try to login:
- Go to DevTools (F12)
- Click Network tab
- Try login
- Look for `/api/auth/login` request
- Click it and check:
  - Status: Should be 200 (not 404, 500, etc)
  - Response: Should show JSON with user data

---

## 📞 Advanced Debugging

If you still can't fix it:

**1. Check if port 5000 is in use:**
```powershell
netstat -ano | findstr :5000
```
If it shows a PID, kill it:
```powershell
taskkill /PID <PID> /F
```

**2. Check Node.js version:**
```powershell
node --version
# Should be v14 or higher
```

**3. Reinstall backend dependencies:**
```powershell
cd backend
rm -r node_modules
npm install
npm run dev
```

**4. Check if MongoDB port is blocked:**
```powershell
netstat -ano | findstr :27017
```

**5. Verify config.js is correct:**
```powershell
# Check backend/config/config.js
# Should have:
# - mongoUri: mongodb://localhost:27017/saan_db
# - port: 5000
```

---

## ✨ Success Indicators

When everything is working:

1. ✅ Can see login page at `http://localhost:5173`
2. ✅ Backend console shows requests coming in
3. ✅ Login button doesn't show "Failed to fetch"
4. ✅ Network tab shows `/api/auth/login` with status 200
5. ✅ Response shows user data with token
6. ✅ Redirects to `/home` and shows venues

---

## 🔗 Related Files

- `backend/.env` - Backend configuration
- `Saan/.env` - Frontend configuration (API URL)
- `backend/index.js` - Server setup
- `Saan/src/services/api.js` - API client
- `Saan/src/pages/auth/UserLogin.jsx` - Login page

---

**If the checklist above is correct, the "Failed to fetch" error will be fixed! 🎉**
