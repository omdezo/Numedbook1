import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { BookingService } from '../services/BookingService';

export class BookingController extends BaseController {
  constructor(private readonly bookingService: BookingService) {
    super();
  }

  async createBooking(req: Request, res: Response): Promise<Response> {
    try {
      const { roomId, startTime, endTime } = req.body;
      const userId = req.headers['x-user-id'] as string || 'demo-user'; // Mock user for MVP

      if (!roomId || !startTime || !endTime) {
        return this.sendError(res, 'Missing required fields', 400);
      }

      const booking = await this.bookingService.createBooking(
        userId,
        roomId,
        new Date(startTime),
        new Date(endTime)
      );

      return this.sendSuccess(res, booking, 201);
    } catch (error: any) {
      return this.sendError(res, error.message, 400);
    }
  }

  async getUserBookings(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.headers['x-user-id'] as string || 'demo-user';
      const bookings = await this.bookingService.getUserBookings(userId);
      return this.sendSuccess(res, bookings);
    } catch (error: any) {
      return this.sendError(res, error.message, 500);
    }
  }

  async getAllBookings(req: Request, res: Response): Promise<Response> {
    try {
      const bookings = await this.bookingService.getAllBookings();
      return this.sendSuccess(res, bookings);
    } catch (error: any) {
      return this.sendError(res, error.message, 500);
    }
  }

  async cancelBooking(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.headers['x-user-id'] as string || 'demo-user';

      await this.bookingService.cancelBooking(id, userId);

      return this.sendSuccess(res, { message: 'Booking cancelled successfully' });
    } catch (error: any) {
      return this.sendError(res, error.message, 400);
    }
  }
}
