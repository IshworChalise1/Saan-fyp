# Login System Troubleshooting Guide

## ✅ Fixed Issues
1. **Backend login endpoint** - No longer requires `role` parameter
2. **Frontend API call** - Removed role from login request
3. **.env file** - Cleaned up test credentials

## 🔍 Debugging Steps

### Step 1: Verify Backend is Running
```bash
# Check if backend is running on port 5000
curl http://localhost:5000
```
Expected response: `{"message":"SAN - Venue Booking System API","version":"1.0.0","status":"running"}`

### Step 2: Verify MongoDB Connection
```bash
# In backend terminal, you should see:
✓ Connected to MongoDB
```

### Step 3: Verify Test Users Exist
```bash
# In backend folder
npm run seed

# Check console output:
✓ Test user created/exists: user@gmail.com
✓ Test venue owner created/exists: venue@gmail.com
✓ Test admin user created/exists: admin@saan.com
✓ Database seeding completed successfully
```

### Step 4: Test Login API Directly
```bash
# Using curl (PowerShell)
$body = @{
    email = "user@gmail.com"
    password = "user@123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

Expected response:
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

### Step 5: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try login and check for errors
4. Go to Network tab to see the actual request/response

### Step 6: Verify Environment Variables

**Backend .env (should have):**
```env
MONGO_URI=mongodb://localhost:27017/saan_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**Frontend .env (should have):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Common Issues & Solutions

### Issue: "Connection error. Please check if the backend is running"
**Solution:**
1. Verify backend is running: `npm run dev` in backend folder
2. Check if port 5000 is in use: `netstat -ano | findstr :5000`
3. Verify VITE_API_URL in frontend `.env` is correct
4. Check browser Network tab for actual request

### Issue: "Invalid email or password"
**Solution:**
1. Run `npm run seed` again to reset test users
2. Verify credentials are exactly:
   - Email: `user@gmail.com`
   - Password: `user@123`
3. Check if MongoDB has test users: `db.users.find()`

### Issue: Login button not responding
**Solution:**
1. Check browser console for JavaScript errors
2. Verify all dependencies are installed: `npm install`
3. Clear browser cache and localStorage
4. Restart frontend: `npm run dev`

### Issue: CORS Error
**Solution:**
1. Restart backend server
2. Verify CORS is enabled in backend (index.js)
3. Check that `VITE_API_URL` includes `/api` at the end
4. Ensure protocol matches (http/https)

### Issue: "Please provide email and password"
**Solution:**
1. Frontend is not sending required fields
2. Check LoginForm for input validation
3. Verify email and password inputs are not empty

## 🔧 Reset Everything

If login still doesn't work:

```bash
# Terminal 1: Stop all services
# (Ctrl+C in each terminal)

# Terminal 2: Clear MongoDB
# (Optional - only if you want fresh data)

# Terminal 3: Restart MongoDB
mongod

# Terminal 4: Reseed database
cd backend
npm run seed

# Terminal 5: Restart backend
npm run dev

# Terminal 6: Restart frontend
cd Saan
npm run dev
```

## 📝 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| User | user@gmail.com | user@123 |
| Venue Owner | venue@gmail.com | venue@123 |
| Admin | admin@saan.com | admin@123 |

## 🎯 Expected Login Flow

1. User enters email and password
2. Frontend calls `POST /api/auth/login`
3. Backend checks if user exists
4. Backend compares hashed password
5. Backend returns JWT token and user info
6. Frontend stores token in localStorage
7. Frontend redirects to correct dashboard based on role

## 📊 Files Modified

- ✅ `backend/controller/authController.js` - Removed role requirement from login
- ✅ `backend/.env` - Cleaned up configuration
- ✅ `Saan/src/services/api.js` - Removed role from login API call
- ✅ `Saan/src/pages/auth/UserLogin.jsx` - Updated to handle new API

## ✨ Next Steps

If everything is working:
1. Login with test credentials
2. Verify redirect to correct dashboard
3. Check localStorage for token
4. Verify user name displays in navigation

If issues persist:
1. Check error messages in browser console
2. Check backend terminal for error logs
3. Review Network tab in DevTools
4. Run through troubleshooting steps above
