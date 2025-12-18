# 🚀 Quick Command Reference

## Starting the Application

### Option 1: Using Quick Start Script (Windows)
```bash
# From project root
quickstart.bat
```

### Option 2: Manual Start (All Platforms)

**Terminal 1 - MongoDB (if using local)**
```bash
mongod
```

**Terminal 2 - Backend**
```bash
cd backend
npm install          # First time only
npm run seed         # First time only - adds test users
npm run dev          # Starts on http://localhost:5000
```

**Terminal 3 - Frontend**
```bash
cd Saan
npm install          # First time only
npm run dev          # Starts on http://localhost:5173
```

## Available Commands

### Backend Commands
```bash
cd backend
npm run dev          # Development mode with auto-reload
npm start            # Production mode
npm run seed         # Add test users to database
npm run lint         # Run code linter
```

### Frontend Commands
```bash
cd Saan
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run code linter
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 👤 User | user@gmail.com | user@123 |
| 🏢 Venue Owner | venue@gmail.com | venue@123 |
| 👨‍💼 Admin | admin@saan.com | admin@123 |

## Default Ports

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## Common Tasks

### Reset Database
```bash
# Delete all data and reseed
cd backend
npm run seed
```

### Check if Backend is Running
```bash
# Should return JSON response
curl http://localhost:5000
```

### View Backend Logs
- Check the terminal where `npm run dev` is running
- Look for error messages and API requests

### Clear Frontend Cache
```bash
# Delete node_modules and reinstall
cd Saan
rm -rf node_modules
npm install
```

## Troubleshooting Commands

### Port Already in Use (Linux/Mac)
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>
```

### Port Already in Use (Windows)
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it
taskkill /PID <PID> /F
```

### Check MongoDB Connection
```bash
# From backend folder
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/saan_db').then(() => console.log('Connected!')).catch(e => console.log('Error:', e.message));"
```

### Rebuild Frontend
```bash
cd Saan
npm run build
npm run preview
```

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/saan_db
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## API Quick Reference

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@gmail.com",
  "password": "user@123",
  "role": "user"
}
```

### Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Get Approved Venues
```bash
GET http://localhost:5000/api/venues/approved
```

### Create Booking
```bash
POST http://localhost:5000/api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "venueId": "venue_id",
  "eventDate": "2025-06-15",
  "numberOfGuests": 200,
  "eventType": "Wedding"
}
```

## File Locations

- Frontend .env: `Saan/.env`
- Backend .env: `backend/.env`
- Frontend API service: `Saan/src/services/api.js`
- Backend config: `backend/config/config.js`
- Test user script: `backend/scripts/seedUsers.js`

## Useful Links

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB Local: mongodb://localhost:27017
- Backend Docs: `backend/README.md`
- Setup Guide: `SETUP_GUIDE.md`
- Integration Summary: `INTEGRATION_SUMMARY.md`

## First Time Setup Checklist

- [ ] Install Node.js
- [ ] Install MongoDB
- [ ] Clone/Extract project
- [ ] Run `npm install` in both backend and Saan
- [ ] Create .env files in both folders
- [ ] Run `npm run seed` in backend
- [ ] Start MongoDB with `mongod`
- [ ] Start backend with `npm run dev`
- [ ] Start frontend with `npm run dev`
- [ ] Test login with test credentials
- [ ] Explore dashboards for each role

## Need Help?

1. Check the SETUP_GUIDE.md for detailed instructions
2. Check the INTEGRATION_SUMMARY.md for overview
3. Check backend/README.md for API documentation
4. Check browser console (F12) for frontend errors
5. Check terminal output for backend errors

---

**Ready to build? Let's go! 🎉**
