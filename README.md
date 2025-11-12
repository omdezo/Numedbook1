# Study Room Booking System - MVP Prototype

A high-performance study room booking system built with **Object-Oriented Programming** principles, managing 4 study rooms with real-time availability.

## 🏗️ Architecture

**Backend (OOP-Based)**:
- TypeScript + Express
- Domain-Driven Design with Entities, Repositories, Services, Controllers
- In-memory storage for MVP
- SOLID principles implementation

**Frontend**:
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- OOP-based service layer
- Responsive design

## ✨ Features

- **4 Study Rooms** with different capacities and amenities
- **Hourly Booking Slots** from 7 AM to 9 PM
- **1 or 2 hour bookings** only
- **Must book at least 1 day in advance**
- **Maximum 2 active bookings** per user
- **Real-time availability** checking
- **Cancel bookings** functionality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm installed

### Installation & Running

#### 1. Install Backend Dependencies

```bash
cd server
npm install
```

#### 2. Install Frontend Dependencies

```bash
cd ../client
npm install
```

#### 3. Run Backend Server

```bash
cd server
npm run dev
```

Server will run on http://localhost:3000

#### 4. Run Frontend (in a new terminal)

```bash
cd client
npm run dev
```

Frontend will run on http://localhost:5173

#### 5. Open in Browser

Navigate to **http://localhost:5173**

## 📚 API Endpoints

### Rooms
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/:id/availability?date=YYYY-MM-DD` - Get available time slots

### Bookings
- `POST /api/bookings` - Create booking
  ```json
  {
    "roomId": "room-id",
    "startTime": "2025-01-20T10:00:00Z",
    "endTime": "2025-01-20T11:00:00Z"
  }
  ```
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings` - Get all bookings
- `DELETE /api/bookings/:id` - Cancel booking

## 🏛️ OOP Architecture

### Backend Structure
```
server/src/
├── domain/              # Domain entities (Room, Booking, User)
│   ├── entities/
│   ├── enums/
│   └── value-objects/
├── repositories/        # Data access layer
├── services/            # Business logic layer
├── controllers/         # HTTP request handlers
└── routes/              # API routes
```

### Design Patterns Used
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic separation
- **Dependency Injection**: Loose coupling
- **Entity Pattern**: Self-validating domain objects

## 🎨 Frontend Features

### Modern UI/UX Design
- **Stunning Gradients**: Beautiful gradient backgrounds and effects throughout
- **Smooth Animations**: Fade-in, slide-up, scale animations on all interactions
- **Glass Morphism**: Frosted glass effects with backdrop blur
- **Interactive Cards**: Hover effects with shadows, scaling, and gradient overlays
- **Custom Color System**: Carefully crafted color palette with custom gradients
- **Premium Typography**: Inter font family for modern, clean text

### Components
- **Hero Header**: Eye-catching gradient header with animated background
- **Room Cards**: Interactive cards with hover effects, status badges, and amenities
- **Booking Modal**: Beautiful modal with step-by-step booking flow
- **Time Slots**: Visual grid with color-coded availability
- **My Bookings**: Elegant booking cards with detailed information
- **Loading States**: Animated skeleton loaders and spinners
- **Error Handling**: Toast notifications with animations
- **Responsive Design**: Perfectly adapted for mobile, tablet, and desktop

### Design Elements
- ✨ Gradient backgrounds everywhere
- 🎯 Interactive hover states with scale effects
- 🌊 SVG wave decorations
- 💫 Smooth transitions (200-300ms)
- 🎨 Color-coded status badges (available/occupied/maintenance)
- 📱 Mobile-first responsive design
- 🔔 Toast notifications for errors
- ⚡ Loading states with animations

## 🧪 Testing the MVP

### Test Scenarios:

1. **View Available Rooms**
   - Open the app
   - See 4 rooms (A, B, C, D) with different capacities

2. **Book a Room**
   - Click on any room card
   - Select a date (tomorrow or later)
   - Choose 1 or 2 hour duration
   - Select an available time slot (7 AM - 8 PM)
   - Click "Confirm Booking"

3. **View Your Bookings**
   - Click "My Bookings" tab
   - See your active bookings

4. **Cancel a Booking**
   - In "My Bookings" tab
   - Click "Cancel" on any booking
   - Confirm cancellation

5. **Test Validations**
   - Try booking same-day (should fail)
   - Try booking 3+ hours (should fail)
   - Try booking same slot twice (should fail)
   - Try making 3 bookings (should fail after 2)

## 📋 Booking Rules

- **Operating Hours**: 7:00 AM to 9:00 PM (14 hourly slots)
- **Slot Duration**: 1 hour each (7-8 AM, 8-9 AM, etc.)
- **Booking Duration**: 1 or 2 consecutive hours only
- **Advance Booking**: Must book at least 1 day before
- **Max Active Bookings**: 2 per user
- **Auto-validation**: All rules enforced by domain entities

## 🛠️ Tech Stack

**Backend**:
- TypeScript
- Express.js
- UUID for ID generation
- CORS enabled

**Frontend**:
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS
- date-fns (date utilities)

## 📝 Project Status

This is a **Minimum Viable Product (MVP)** prototype demonstrating:
- ✅ OOP architecture with SOLID principles
- ✅ Clean separation of concerns
- ✅ Type-safe TypeScript throughout
- ✅ Working booking system
- ✅ In-memory storage (no database needed for demo)
- ✅ Responsive UI
- ✅ Business rule validation

## 🔄 Next Steps (Beyond MVP)

- Add PostgreSQL database with Prisma ORM
- Implement WebSocket for real-time updates
- Add user authentication (JWT)
- Email notifications
- Extend booking duration feature
- Admin dashboard
- Room check-in system
- Analytics and reporting

## 🚢 Deployment

### Deploy to Render

This application is ready for deployment on Render. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed deployment instructions.

**Quick Deploy**:
1. Push your code to GitHub
2. Connect to Render
3. Use the included `render.yaml` configuration
4. Set environment variables
5. Deploy!

For step-by-step instructions, troubleshooting, and best practices, refer to the [Deployment Guide](./DEPLOYMENT.md).

## 📖 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete system architecture, OOP patterns, and implementation details
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide for Render
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick setup guide

## 🤝 Contributing

This is a prototype project. Feel free to explore the code and learn from the OOP patterns implemented.

## 📄 License

MIT
