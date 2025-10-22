import { Router, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { BookingService } from '../services/BookingService';
import { RoomService } from '../services/RoomService';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/authMiddleware';

export const createAdminRoutes = (
  authService: AuthService,
  bookingService: BookingService,
  roomService: RoomService
): Router => {
  const router = Router();

  // Apply auth and admin middleware to all routes
  router.use(authMiddleware(authService));
  router.use(adminMiddleware);

  // Get all bookings (admin view)
  router.get('/bookings', async (req: AuthRequest, res: Response) => {
    try {
      const bookings = await bookingService.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get statistics
  router.get('/stats', async (req: AuthRequest, res: Response) => {
    try {
      const bookings = await bookingService.getAllBookings();
      const rooms = await roomService.getAllRooms();

      const activeBookings = bookings.filter(b => b.status === BookingStatus.APPROVED).length;
      const totalBookings = bookings.length;
      const totalRooms = rooms.length;
      const availableRooms = rooms.filter(r => r.status === 'available').length;

      res.json({
        totalBookings,
        activeBookings,
        totalRooms,
        availableRooms,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update room status
  router.patch('/rooms/:id/status', async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const room = await roomService.getRoomById(id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      switch (status) {
        case 'available':
          room.markAsAvailable();
          break;
        case 'occupied':
          room.markAsOccupied();
          break;
        case 'maintenance':
          room.setMaintenance();
          break;
        default:
          return res.status(400).json({ error: 'Invalid status provided' });
      }

      // Note: In a real application, you would persist this change.
      // For this example, we'll just return the updated room view.
      res.json(room);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Approve booking
  router.post('/bookings/:id/approve', async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const booking = await bookingService.approveBooking(id);
      res.json({ data: booking });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reject booking
  router.post('/bookings/:id/reject', async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const booking = await bookingService.rejectBooking(id);
      res.json({ data: booking });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Delete booking (admin can delete any booking)
  router.delete('/bookings/:id', async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      await bookingService.deleteBooking(id);
      res.json({ message: 'Booking deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Re-approve cancelled booking
  router.post('/bookings/:id/reapprove', async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const booking = await bookingService.reApproveBooking(id);
      res.json({ data: booking });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
