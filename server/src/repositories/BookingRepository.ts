import { IRepository } from './IRepository';
import { Booking } from '../domain/entities/Booking';
import { BookingStatus } from '../domain/enums/BookingStatus';

export class BookingRepository implements IRepository<Booking> {
  private bookings: Map<string, Booking> = new Map();

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.get(id) || null;
  }

  async findAll(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.userId === userId);
  }

  async findByRoomAndDateRange(roomId: string, start: Date, end: Date): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking =>
      booking.roomId === roomId &&
      booking.status === BookingStatus.APPROVED &&
      booking.startTime < end &&
      booking.endTime > start
    );
  }

  async save(booking: Booking): Promise<Booking> {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async delete(id: string): Promise<void> {
    this.bookings.delete(id);
  }
}
