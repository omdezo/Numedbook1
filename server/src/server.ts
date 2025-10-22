import express from 'express';
import cors from 'cors';
import { BookingRepository } from './repositories/BookingRepository';
import { RoomRepository } from './repositories/RoomRepository';
import { UserRepository } from './repositories/UserRepository';
import { BookingService } from './services/BookingService';
import { RoomService } from './services/RoomService';
import { AuthService } from './services/AuthService';
import { BookingController } from './controllers/BookingController';
import { RoomController } from './controllers/RoomController';
import { createBookingRoutes } from './routes/bookingRoutes';
import { createRoomRoutes } from './routes/roomRoutes';
import { createAuthRoutes } from './routes/authRoutes';
import { createAdminRoutes } from './routes/adminRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection - Create instances
const bookingRepository = new BookingRepository();
const roomRepository = new RoomRepository();
const userRepository = new UserRepository();

const bookingService = new BookingService(bookingRepository, roomRepository);
const roomService = new RoomService(roomRepository);
const authService = new AuthService(userRepository);

const bookingController = new BookingController(bookingService);
const roomController = new RoomController(roomService, bookingService);

// Routes
app.use('/api/auth', createAuthRoutes(authService));
app.use('/api/rooms', createRoomRoutes(roomController));
app.use('/api/bookings', createBookingRoutes(bookingController));
app.use('/api/admin', createAdminRoutes(authService, bookingService, roomService));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Study Room Booking API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`\n🔐 Authentication:`);
  console.log(`   - POST   /api/auth/login`);
  console.log(`   - POST   /api/auth/register`);
  console.log(`   - GET    /api/auth/me`);
  console.log(`\n🏠 Rooms:`);
  console.log(`   - GET    /api/rooms`);
  console.log(`   - GET    /api/rooms/:id`);
  console.log(`   - GET    /api/rooms/:id/availability?date=YYYY-MM-DD`);
  console.log(`\n📅 Bookings:`);
  console.log(`   - POST   /api/bookings`);
  console.log(`   - GET    /api/bookings`);
  console.log(`   - GET    /api/bookings/user`);
  console.log(`   - DELETE /api/bookings/:id`);
  console.log(`\n👨‍💼 Admin:`);
  console.log(`   - GET    /api/admin/bookings`);
  console.log(`   - GET    /api/admin/stats`);
  console.log(`   - PATCH  /api/admin/rooms/:id/status`);
  console.log(`\n👤 Default Users:`);
  console.log(`   Admin: admin@nu.edu.om / admin123`);
  console.log(`   Student: student@nu.edu.om / student123`);
});

export default app;
