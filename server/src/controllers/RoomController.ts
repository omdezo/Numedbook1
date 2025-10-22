import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { RoomService } from '../services/RoomService';
import { BookingService } from '../services/BookingService';

export class RoomController extends BaseController {
  constructor(
    private readonly roomService: RoomService,
    private readonly bookingService: BookingService
  ) {
    super();
  }

  async getAllRooms(req: Request, res: Response): Promise<Response> {
    try {
      const rooms = await this.roomService.getAllRooms();
      return this.sendSuccess(res, rooms);
    } catch (error: any) {
      return this.sendError(res, error.message, 500);
    }
  }

  async getRoomById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const room = await this.roomService.getRoomById(id);

      if (!room) {
        return this.sendError(res, 'Room not found', 404);
      }

      return this.sendSuccess(res, room);
    } catch (error: any) {
      return this.sendError(res, error.message, 500);
    }
  }

  async getAvailableSlots(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { date } = req.query;

      if (!date) {
        return this.sendError(res, 'Date parameter is required', 400);
      }

      const slots = await this.bookingService.getAvailableSlots(id, new Date(date as string));
      return this.sendSuccess(res, slots);
    } catch (error: any) {
      return this.sendError(res, error.message, 500);
    }
  }
}
