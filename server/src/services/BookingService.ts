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
    userName: string,
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

    // Check if user already has a booking on the same day
    const bookingDate = new Date(startTime);
    bookingDate.setHours(0, 0, 0, 0);
    const dayEnd = new Date(bookingDate);
    dayEnd.setHours(23, 59, 59, 999);

    const userBookings = await this.bookingRepository.findByUserId(userId);
    const bookingsOnSameDay = userBookings.filter(booking => {
      const bookingDay = new Date(booking.startTime);
      bookingDay.setHours(0, 0, 0, 0);
      return (
        bookingDay.getTime() === bookingDate.getTime() &&
        (booking.isActive() || booking.isPending())
      );
    });

    if (bookingsOnSameDay.length > 0) {
      throw new Error('You can only book one room per day');
    }

    // Check for conflicts with approved bookings only
    const conflicts = await this.bookingRepository.findByRoomAndDateRange(
      roomId,
      startTime,
      endTime
    );

    const approvedConflicts = conflicts.filter(b => b.isActive());
    if (approvedConflicts.length > 0) {
      throw new Error('Time slot already booked');
    }

    // Create booking with PENDING status
    const booking = new Booking(
      uuidv4(),
      roomId,
      userId,
      userName,
      startTime,
      endTime
    );

    const savedBooking = await this.bookingRepository.save(booking);

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

  async approveBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.approve();
    await this.bookingRepository.save(booking);

    // Update room status
    const room = await this.roomRepository.findById(booking.roomId);
    if (room) {
      room.markAsOccupied();
      await this.roomRepository.save(room);
    }

    return booking;
  }

  async rejectBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.reject();
    await this.bookingRepository.save(booking);

    return booking;
  }

  async deleteBooking(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    await this.bookingRepository.delete(bookingId);

    // Update room availability
    await this.updateRoomAvailability(booking.roomId);
  }

  async reApproveBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== BookingStatus.CANCELLED) {
      throw new Error('Only cancelled bookings can be re-approved');
    }

    // Change status back to pending for admin to approve
    booking['_status'] = BookingStatus.PENDING;
    await this.bookingRepository.save(booking);

    return booking;
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
