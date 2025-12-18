# Login Redirect Not Working - Debugging Guide

## 🔍 Quick Diagnosis

When you click login and nothing happens, follow these steps:

### Step 1: Check Browser Console (F12)
1. Open your browser
2. Press **F12** to open DevTools
3. Click **Console** tab
4. Try logging in with `user@gmail.com` / `user@123`
5. Look for these console logs:
```
Attempting login with: user@gmail.com
Login response: {...}
User data stored. Role: user
Redirecting to: user
```

### Step 2: Check Network Tab
1. Open DevTools (F12)
2. Click **Network** tab
3. Try login again
4. Look for `/api/auth/login` request
5. Click it and check:
   - **Status**: Should be `200`
   - **Response**: Should show `{"success":true,"user":{"role":"user"},...}`

### Step 3: Check localStorage
1. Open DevTools (F12)
2. Click **Application** tab
3. Click **Local Storage** 
4. Click your site URL
5. Look for these keys:
   - `token` - Should have a long string
   - `userRole` - Should be `user`
   - `userName` - Should be `Test User`
   - `userEmail` - Should be `user@gmail.com`

---

## ❌ Common Issues & Solutions

### Issue 1: "Connection error. Please check if the backend is running"

**This means the frontend can't reach the backend API**

**Solution:**
```bash
# Terminal 1: Check if MongoDB is running
mongod

# Terminal 2: Verify backend is running
cd backend
npm run dev

# Check output - you should see:
# ✓ Connected to MongoDB
# 🚀 Server is running on http://localhost:5000
```

Then verify:
1. Check Saan/.env has: `VITE_API_URL=http://localhost:5000/api`
2. Frontend should be running on: `http://localhost:5173`
3. No CORS errors in console

### Issue 2: "Invalid email or password"

**This means the backend received the request but credentials are wrong**

**Solution:**
1. Verify test users exist:
```bash
cd backend
npm run seed
```

2. Check credentials exactly:
   - Email: `user@gmail.com` (NOT `user@gmail.com ` with spaces)
   - Password: `user@123` (NOT `user@1234` or others)

3. If still fails, check MongoDB:
```bash
mongo
> use saan_db
> db.users.find()
```

### Issue 3: Login succeeds but page doesn't redirect

**This is the most likely issue you're facing**

**Step 1: Check console messages**
Open DevTools (F12) → Console and look for:
- Should see: `Attempting login with: user@gmail.com`
- Should see: `Login response: {...}`
- Should see: `User data stored. Role: user`
- Should see: `Redirecting to: user`

If you don't see these messages, the login function isn't being called properly.

**Step 2: Check if token is stored**
```javascript
// Paste in browser console:
localStorage.getItem('token')
localStorage.getItem('userRole')
```

If both return values, data was stored. If empty/null, login failed.

**Step 3: Check /home route exists**
Open `App.jsx` and verify:
```jsx
<Route path="/home" element={<UserHome />} />
```

**Step 4: Check UserHome access control**
The UserHome component checks if user is logged in:
```jsx
// This happens in UserHome.jsx useEffect
if (!token || userRole !== "user") {
  navigate("/");  // This redirects back to login!
}
```

If you see this redirect, it means:
- Either token is empty
- Or userRole is not exactly "user"

**Solution:**
Add a small delay before redirecting:
```jsx
// In UserHome.jsx, add this line in useEffect
setTimeout(() => {
  // navigation code
}, 100);
```

### Issue 4: Infinite redirect loop

**This happens if the access check keeps redirecting back**

**Solution:**
Check the backend login response. Log it:
```bash
# In browser console, test the API directly:
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@gmail.com',
    password: 'user@123'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

The response should show `"role":"user"` (not "Role" or something else).

---

## 🛠️ Step-by-Step Fix

**If login still isn't redirecting:**

1. **Restart everything:**
```bash
# Close all terminals with Ctrl+C

# Terminal 1: Start MongoDB
mongod

# Terminal 2: Seed and start backend
cd backend
npm run seed
npm run dev

# Terminal 3: Start frontend
cd Saan
npm run dev
```

2. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear "Cookies and other site data"
   - Clear "Cached images and files"

3. **Test login:**
   - Go to http://localhost:5173
   - Open DevTools (F12)
   - Login with `user@gmail.com` / `user@123`
   - Check console for our debug messages

4. **Verify redirect:**
   - After login, URL should change to `http://localhost:5173/home`
   - Page should show venue listings with navigation bar
   - User name should display in top-right of navigation

---

## 🔧 Files to Check

**Frontend:**
- `Saan/src/pages/auth/UserLogin.jsx` - Has console.logs for debugging
- `Saan/src/pages/user/UserHome.jsx` - Has access control check
- `Saan/src/App.jsx` - Has `/home` route
- `Saan/.env` - Should have `VITE_API_URL=http://localhost:5000/api`

**Backend:**
- `backend/.env` - Should have `PORT=5000` and MongoDB URI
- `backend/controller/authController.js` - Login logic
- `backend/route/authRoute.js` - `/api/auth/login` endpoint

---

## 📊 Expected Request/Response

**Request to backend:**
```json
POST http://localhost:5000/api/auth/login

{
  "email": "user@gmail.com",
  "password": "user@123"
}
```

**Expected response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "user@gmail.com",
    "role": "user"
  }
}
```

---

## ✅ Success Indicators

When login works correctly, you should see:

1. ✅ Console shows "Attempting login with: user@gmail.com"
2. ✅ Console shows login response with success: true
3. ✅ Console shows "Redirecting to: user"
4. ✅ URL changes from `http://localhost:5173/` to `http://localhost:5173/home`
5. ✅ Page shows venues with search bar and footer
6. ✅ User name displays in top-right navigation
7. ✅ localStorage has token, userRole, userName, etc.

---

## 📞 If Still Not Working

1. **Take a screenshot** of the browser console showing the error
2. **Check backend console** for any error messages
3. **Verify all 3 services are running:**
   - MongoDB: `mongod` running
   - Backend: Shows "Server is running on http://localhost:5000"
   - Frontend: Shows "VITE v..." and "ready in ... ms"
4. **Run the test script:**
   ```bash
   # In bash/PowerShell
   npm run seed  # to reset test users
   ```

---

## 🎯 Quick Test

Paste this in browser console to test the complete flow:

```javascript
async function testLogin() {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@gmail.com',
      password: 'user@123'
    })
  });
  
  const data = await response.json();
  console.log('API Response:', data);
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.user.role);
    localStorage.setItem('userName', data.user.name);
    console.log('Data stored. Navigate to /home');
  }
}

testLogin();
```

Then manually navigate to `http://localhost:5173/home` to test if the page loads.
