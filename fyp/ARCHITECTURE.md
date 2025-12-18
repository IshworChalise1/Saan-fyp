# 📊 System Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Side (Browser)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Frontend (Vite)                   │   │
│  │  • Login Page                                        │   │
│  │  • Signup Page                                       │   │
│  │  • User Dashboard                                    │   │
│  │  • Venue Owner Dashboard                             │   │
│  │  • Admin Dashboard                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          API Service (services/api.js)               │   │
│  │  • authAPI (register, login, logout)                │   │
│  │  • venueAPI (CRUD venues)                           │   │
│  │  • bookingAPI (create, manage bookings)             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTP/REST with JWT
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
┌─────────▼──────────────────────────────────────────────────┐
│                  Server Side (Node.js)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Express REST API (Port 5000)               │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Authentication Routes (/api/auth)              │ │  │
│  │  │  • POST /register                              │ │  │
│  │  │  • POST /login                                 │ │  │
│  │  │  • GET /me                                     │ │  │
│  │  │  • POST /logout                                │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Venue Routes (/api/venues)                     │ │  │
│  │  │  • POST / (Create)                             │ │  │
│  │  │  • GET /approved (List)                        │ │  │
│  │  │  • GET /owner/my-venues                        │ │  │
│  │  │  • PUT /:id (Update)                           │ │  │
│  │  │  • DELETE /:id (Admin)                         │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Booking Routes (/api/bookings)                 │ │  │
│  │  │  • POST / (Create)                             │ │  │
│  │  │  • GET /my-bookings                            │ │  │
│  │  │  • PUT /:id/status (Update)                    │ │  │
│  │  │  • PUT /:id/cancel (Cancel)                    │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Controllers (Business Logic)                 │  │
│  │  • authController.js                              │  │
│  │  • venueController.js                             │  │
│  │  • bookingController.js                           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        Middleware (Security & Auth)                  │  │
│  │  • JWT Authentication                             │  │
│  │  • Role-Based Authorization                       │  │
│  │  • CORS Handling                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────┘
                             │
                        MongoDB Queries
                             │
┌────────────────────────────▼──────────────────────────────┐
│                    Database (MongoDB)                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Collections:                                         │ │
│  │  • users (name, email, password_hash, role)         │ │
│  │  • venues (name, owner, type, city, approval_status)│ │
│  │  • bookings (user, venue, date, status)             │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User fills login form
         │
         ▼
Frontend validates input
         │
         ▼
API call: POST /api/auth/login
{email, password, role}
         │
         ▼
Backend validates credentials
         │
    ┌────┴─────┐
    │           │
   NO          YES
    │           │
    │     Hash password & compare
    │           │
    │        Match?
    │        ├─ NO → Return error
    │        │
    │        └─ YES
    │            │
    │            ▼
    │     Generate JWT token
    │            │
    │            ▼
    │     Return {token, user}
    │           │
    ▼           ▼
Error      Frontend stores:
message    • token in localStorage
           • user info in localStorage
displayed       │
           ▼
       Redirect to dashboard
       based on user.role
           │
      ┌────┼────┬────┐
      │    │    │    │
     User  │  Admin  │
    Home   │    │    │
      Venue Owner │
           Dashboard │
          Admin Dashboard
```

## Data Models

### User Schema
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'venue-owner' | 'admin',
  createdAt: Date
}
```

### Venue Schema
```
{
  _id: ObjectId,
  name: String,
  owner: Reference → User,
  type: 'banquet' | 'wedding' | 'conference' | ...,
  city: String,
  address: String,
  capacity: Number,
  pricePerDay: Number,
  description: String,
  amenities: [String],
  isApproved: Boolean,
  rating: Number,
  createdAt: Date
}
```

### Booking Schema
```
{
  _id: ObjectId,
  user: Reference → User,
  venue: Reference → Venue,
  eventDate: Date,
  numberOfGuests: Number,
  eventType: String,
  specialRequests: String,
  totalPrice: Number,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  createdAt: Date,
  updatedAt: Date
}
```

## API Request/Response Examples

### Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@gmail.com",
  "password": "user@123",
  "role": "user"
}
```

### Login Response (Success)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@gmail.com",
    "role": "user"
  }
}
```

### Login Response (Error)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Role-Based Access Matrix

| Feature | User | Venue Owner | Admin |
|---------|------|-------------|-------|
| Browse Venues | ✅ | ✅ | ✅ |
| Register Venue | ❌ | ✅ | ❌ |
| Create Booking | ✅ | ❌ | ❌ |
| View My Bookings | ✅ | ❌ | ❌ |
| View Venue Bookings | ❌ | ✅ | ✅ |
| Approve Booking | ❌ | ✅ | ✅ |
| Approve Venue | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ✅ | ✅ |

## State Management (Frontend)

```
App.jsx
├── Token (localStorage)
│   └── Checked on app load
├── User Info (localStorage)
│   ├── id
│   ├── name
│   ├── email
│   └── role
└── Component State
    ├── isLoading (during API calls)
    ├── error (API error messages)
    └── data (fetched from API)
```

## Security Measures

1. **Password Security**
   - Hashed with bcryptjs (10 salt rounds)
   - Never stored in plain text
   - Never returned in API responses

2. **Authentication**
   - JWT tokens with 7-day expiry
   - Tokens stored in localStorage
   - Tokens included in Authorization header

3. **Authorization**
   - Middleware checks JWT validity
   - Role-based access control
   - Protected routes blocked without token

4. **API Security**
   - CORS enabled for frontend
   - Input validation
   - Error handling without exposing sensitive data

## Database Relationships

```
User
├── 1 ---> Many ──> Venue (as owner)
└── 1 ---> Many ──> Booking (as user)

Venue
├── Many <--- 1 ──< User (owner)
└── 1 ---> Many ──> Booking

Booking
├── Many <--- 1 ──< User
└── Many <--- 1 ──< Venue
```

## Error Handling Flow

```
API Call
    │
    ▼
Try Block
    │
    ├─ Network Error ──▶ "Connection error"
    ├─ Validation Error ──▶ API error message
    └─ Success ──▶ Update state
           │
           ▼
       Display to user
```

## Component Hierarchy

```
App
├── Router
│   ├── Route → UserLogin
│   │   ├── Navigation
│   │   ├── LoginForm
│   │   └── SignupForm
│   ├── Route → AdminDashboard
│   ├── Route → VenueDashboard
│   └── Route → UserHome
```

---

**This architecture ensures:**
- ✅ Secure authentication and authorization
- ✅ Clear separation of concerns
- ✅ Scalable code structure
- ✅ Proper error handling
- ✅ Role-based access control
