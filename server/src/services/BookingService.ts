import { Booking } from '../domain/entities/Booking';
import { BookingStatus } from '../domain/enums/BookingStatus';
import { BookingRepository } from '../repositories/BookingRepository';
import { RoomRepository } from '../repositories/RoomRepository';
import { v4 as uuidv4 } from 'uuid';

export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly roomRepository: RoomRepository
  ) {}

  async createBooking(
    userId: string,
    roomId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Booking> {
    // Check if room exists
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    if (!room.isAvailable()) {
      throw new Error('Room is not available');
    }

    // Check for conflicts
    const conflicts = await this.bookingRepository.findByRoomAndDateRange(
      roomId,
      startTime,
      endTime
    );

    if (conflicts.length > 0) {
      throw new Error('Time slot already booked');
    }

    // Check user doesn't have more than 2 active bookings
    const userBookings = await this.bookingRepository.findByUserId(userId);
    const activeBookings = userBookings.filter(b => b.isActive());
    if (activeBookings.length >= 2) {
      throw new Error('Maximum 2 active bookings per user');
    }

    // Create booking
    const booking = new Booking(
      uuidv4(),
      roomId,
      userId,
      startTime,
      endTime,
      BookingStatus.ACTIVE
    );

    const savedBooking = await this.bookingRepository.save(booking);

    // Update room status
    room.markAsOccupied();
    await this.roomRepository.save(room);

    return savedBooking;
  }

  async cancelBooking(bookingId: string, userId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new Error('Unauthorized');
    }

    booking.cancel();
    await this.bookingRepository.save(booking);

    // Update room availability
    await this.updateRoomAvailability(booking.roomId);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await this.bookingRepository.findByUserId(userId);
  }

  async getAllBookings(): Promise<Booking[]> {
    return await this.bookingRepository.findAll();
  }

  async getAvailableSlots(roomId: string, date: Date): Promise<any[]> {
    const slots = [];
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    const bookedSlots = await this.bookingRepository.findByRoomAndDateRange(
      roomId,
      dateStart,
      dateEnd
    );

    for (let hour = 7; hour < 21; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      const isBooked = bookedSlots.some(booking =>
        booking.startTime <= slotStart && booking.endTime > slotStart
      );

      slots.push({
        startHour: hour,
        endHour: hour + 1,
        isAvailable: !isBooked,
        displayLabel: this.formatTimeSlot(hour, hour + 1)
      });
    }

    return slots;
  }

  private formatTimeSlot(startHour: number, endHour: number): string {
    const startAMPM = startHour < 12 ? 'AM' : 'PM';
    const endAMPM = endHour < 12 || endHour === 24 ? 'AM' : 'PM';
    const startDisplay = startHour > 12 ? startHour - 12 : startHour;
    const endDisplay = endHour > 12 ? endHour - 12 : endHour;
    return `${startDisplay}:00 ${startAMPM} - ${endDisplay}:00 ${endAMPM}`;
  }

  private async updateRoomAvailability(roomId: string): Promise<void> {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeBookings = await this.bookingRepository.findByRoomAndDateRange(
      roomId,
      now,
      tomorrow
    );

    const room = await this.roomRepository.findById(roomId);
    if (room) {
      if (activeBookings.length === 0) {
        room.markAsAvailable();
      } else {
        room.markAsOccupied();
      }
      await this.roomRepository.save(room);
    }
  }
}
