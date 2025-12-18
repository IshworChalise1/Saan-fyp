# Setup Instructions - SAN Venue Booking System

Complete guide to set up and run both frontend and backend.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb://localhost:27017/saan_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/saan_db
```

### 3. Start MongoDB

If using local MongoDB:

```bash
# Terminal 1: Start MongoDB
mongod
```

### 4. Seed Test Users

```bash
# Terminal 2: Add test users to database
npm run seed
```

**Test Credentials Created:**
```
User Account:
  Email: user@gmail.com
  Password: user@123

Venue Owner Account:
  Email: venue@gmail.com
  Password: venue@123

Admin Account:
  Email:  
  Password: admin@123
```

### 5. Start Backend Server

```bash
npm run dev
```

Backend should run on: **http://localhost:5000**

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd Saan
npm install
```

### 2. Verify Environment Configuration

Check that `.env` file exists with:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend should run on: **http://localhost:5173** (or another available port)

## Testing the Application

### Login Flow

1. Open frontend at `http://localhost:5173`
2. You'll see the login page
3. Select role from dropdown (User, Admin, or Venue Owner)
4. Enter credentials for chosen role
5. Click Login

**Example Login:**
- Role: User
- Email: user@gmail.com
- Password: user@123

### Expected Results

After successful login:
- **User** → Redirected to User Home page
- **Venue Owner** → Redirected to Venue Owner Dashboard
- **Admin** → Redirected to Admin Dashboard

### Signup Flow

1. Click "Signup" button on login page
2. Select account type (User or Venue Owner)
3. Fill in required details
4. For Venue Owner, also fill:
   - Venue Name
   - Venue Type
   - City
5. Click "Create Account"
6. Return to login and test new credentials

## API Endpoints

All protected endpoints require JWT token in header:

```
Authorization: Bearer {token}
```

### Authentication

- `POST /api/auth/register` - Register user/venue owner
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Venues

- `GET /api/venues/approved` - Get all approved venues
- `POST /api/venues` - Create venue (Venue Owner only)
- `GET /api/venues/owner/my-venues` - My venues (Venue Owner only)

### Bookings

- `POST /api/bookings` - Create booking (User only)
- `GET /api/bookings/my-bookings` - My bookings (User only)

See backend README.md for complete API documentation.

## Troubleshooting

### "Cannot connect to backend" error

1. Check if MongoDB is running
2. Check if backend server is running on port 5000
3. Verify `VITE_API_URL` in frontend `.env`
4. Check browser console for CORS errors

### MongoDB Connection Error

1. Ensure MongoDB is installed and running
2. Check connection string in `.env`
3. For Atlas, check network access whitelist

### Port Already in Use

Backend (5000):
```bash
lsof -i :5000  # Check what's using port
kill -9 <PID>  # Kill the process
```

Frontend (5173):
```bash
Vite will automatically use next available port
```

## Project Structure

```
fyp/
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── route/
│   ├── scripts/
│   │   └── seedUsers.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── Saan/
    ├── src/
    │   ├── components/
    │   │   ├── LoginForm.jsx
    │   │   ├── SignupForm.jsx
    │   │   └── Navigation.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   ├── admin/
    │   │   ├── venue-owner/
    │   │   └── user/
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

## Next Steps

After successful setup:

1. Explore the Admin Dashboard
2. Test Venue Owner functionality
3. Create and manage bookings as User
4. Implement additional features as needed

## Support

For any issues, check:
- Browser Console (F12)
- Backend Terminal for errors
- MongoDB logs
