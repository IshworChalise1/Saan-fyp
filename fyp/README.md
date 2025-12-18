# SAN - Venue Booking System

A comprehensive web application for booking event venues with role-based access for Users, Venue Owners, and Admins.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Fastest Setup (Windows)
```bash
# Run the quickstart script
quickstart.bat
```

### Manual Setup

**Terminal 1 - Start MongoDB (if local)**
```bash
mongod
```

**Terminal 2 - Backend Server**
```bash
cd backend
npm install
npm run seed    # Add test users
npm run dev     # Start server on http://localhost:5000
```

**Terminal 3 - Frontend Server**
```bash
cd Saan
npm install
npm run dev     # Start on http://localhost:5173
```

## 📋 Test Credentials

After running `npm run seed` in backend folder:

| Role | Email | Password |
|------|-------|----------|
| User | user@gmail.com | user@123 |
| Venue Owner | venue@gmail.com | venue@123 |
| Admin | admin@saan.com | admin@123 |

## 🏗️ Project Structure

```
fyp/
├── backend/                    # Express.js API
│   ├── config/
│   │   └── config.js          # Configuration
│   ├── controller/             # Business logic
│   │   ├── authController.js
│   │   ├── venueController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── auth.js            # JWT & Role-based auth
│   ├── models/
│   │   ├── User.js
│   │   ├── Venue.js
│   │   └── Booking.js
│   ├── route/                  # API endpoints
│   │   ├── authRoute.js
│   │   ├── venueRoute.js
│   │   └── bookingRoute.js
│   ├── scripts/
│   │   └── seedUsers.js       # Test data
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── README.md
│
└── Saan/                       # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── LoginForm.jsx
    │   │   ├── SignupForm.jsx
    │   │   └── Navigation.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── UserLogin.jsx
    │   │   │   └── Signup.jsx
    │   │   ├── admin/
    │   │   │   └── AdminDashboard.jsx
    │   │   ├── venue-owner/
    │   │   │   └── VenueDashboard.jsx
    │   │   └── user/
    │   │       └── UserHome.jsx
    │   ├── services/
    │   │   └── api.js          # API calls
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🎯 Features

### User Features
- ✅ Register and login
- ✅ Browse all approved venues
- ✅ Save favorite venues
- ✅ Create venue bookings
- ✅ View and manage bookings
- ✅ Cancel bookings
- ✅ Message venue owners

### Venue Owner Features
- ✅ Register as venue owner with venue details
- ✅ Create and manage venues
- ✅ View pending venue approvals
- ✅ View booking requests
- ✅ Accept/reject bookings
- ✅ View earnings and analytics
- ✅ Manage venue pricing

### Admin Features
- ✅ View all users
- ✅ Approve/reject venue registrations
- ✅ Monitor all bookings
- ✅ View platform analytics
- ✅ Manage users and venues
- ✅ Generate reports

## 🔐 Authentication & Authorization

- **JWT-based Authentication** - Secure token-based login
- **Role-Based Access Control** - Different permissions for each role
- **Password Hashing** - bcryptjs for secure password storage
- **Protected Routes** - Frontend and backend route protection

## 📱 Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP requests

### Backend
- **Express.js** - REST API framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login user
GET    /api/auth/me              Get current user
POST   /api/auth/logout          Logout user
GET    /api/auth/users           Get all users (Admin)
```

### Venues
```
POST   /api/venues               Create venue (Venue Owner)
GET    /api/venues/approved      Get all approved venues
GET    /api/venues/:id           Get single venue
GET    /api/venues/owner/my-venues  Get my venues (Venue Owner)
PUT    /api/venues/:id           Update venue
GET    /api/venues               Get all venues (Admin)
PUT    /api/venues/:id/approve   Approve venue (Admin)
DELETE /api/venues/:id           Delete venue (Admin)
```

### Bookings
```
POST   /api/bookings             Create booking (User)
GET    /api/bookings/my-bookings Get my bookings (User)
PUT    /api/bookings/:id/cancel  Cancel booking
GET    /api/bookings/venue/:id   Get venue bookings (Venue Owner)
PUT    /api/bookings/:id/status  Update status
GET    /api/bookings             Get all bookings (Admin)
```

## 🛠️ Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed test users to database
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## ⚙️ Environment Variables

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

## 🚨 Common Issues

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in `.env`
- For Atlas, whitelist your IP

### CORS Errors
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is enabled in Express

### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

## 📚 Documentation

- [Backend Setup Guide](./backend/README.md)
- [Complete Setup Instructions](./SETUP_GUIDE.md)
- API Documentation available in endpoint comments

## 🔄 User Workflows

### User Registration & Booking Flow
```
1. User registers with email and password
2. User browses approved venues
3. User selects venue and creates booking
4. Venue owner receives booking request
5. Venue owner accepts/rejects booking
6. User receives confirmation/rejection
```

### Venue Owner Registration Flow
```
1. Venue owner registers with venue details
2. Admin reviews and approves venue
3. Venue becomes visible to users
4. Venue owner starts receiving bookings
```

### Admin Management Flow
```
1. Admin logs in to dashboard
2. Admin reviews pending venues
3. Admin approves/rejects venues
4. Admin monitors all bookings and users
5. Admin generates reports
```

## 🎨 UI Components

- **LoginForm** - User authentication form with role selection
- **SignupForm** - Registration form with role-specific fields
- **Navigation** - Header navigation component
- **AdminDashboard** - Admin management interface
- **VenueDashboard** - Venue owner management interface
- **UserHome** - User booking interface

## 📝 Future Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] User reviews and ratings
- [ ] Advanced search filters
- [ ] Venue image gallery
- [ ] Real-time chat
- [ ] Mobile app
- [ ] Calendar integration
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created as a Final Year Project - SAN Venue Booking System

## 📞 Support

For issues and questions:
1. Check existing issues
2. Check documentation
3. Open a new issue with details

---

**Happy Booking! 🎉**
