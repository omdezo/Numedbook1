import { Entity } from './Entity';
import { BookingStatus } from '../enums/BookingStatus';

export class Booking extends Entity {
  constructor(
    id: string,
    public readonly roomId: string,
    public readonly userId: string,
    public readonly userName: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    private _status: BookingStatus = BookingStatus.PENDING,
    public readonly createdAt: Date = new Date()
  ) {
    super(id);
    this.validate();
  }

  private validate(): void {
    if (this.endTime <= this.startTime) {
      throw new Error('End time must be after start time');
    }

    const durationHours = this.getDurationHours();
    if (durationHours !== 1 && durationHours !== 2) {
      throw new Error('Booking must be 1 or 2 hours');
    }

    const startHour = this.startTime.getHours();
    if (startHour < 7 || startHour >= 21) {
      throw new Error('Bookings only available between 7 AM and 9 PM');
    }

    // Check if booking is at least 1 day in advance
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const bookingDate = new Date(this.startTime);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < tomorrow) {
      throw new Error('Must book at least 1 day in advance');
    }
  }

  get status(): BookingStatus {
    return this._status;
  }

  getDurationHours(): number {
    return (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60 * 60);
  }

  isActive(): boolean {
    return this._status === BookingStatus.APPROVED;
  }

  isPending(): boolean {
    return this._status === BookingStatus.PENDING;
  }

  approve(): void {
    if (this._status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be approved');
    }
    this._status = BookingStatus.APPROVED;
  }

  reject(): void {
    if (this._status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be rejected');
    }
    this._status = BookingStatus.CANCELLED;
  }

  cancel(): void {
    if (this._status !== BookingStatus.APPROVED && this._status !== BookingStatus.PENDING) {
      throw new Error('Only approved or pending bookings can be cancelled');
    }
    this._status = BookingStatus.CANCELLED;
  }

  complete(): void {
    if (this._status !== BookingStatus.APPROVED) {
      throw new Error('Only approved bookings can be completed');
    }
    this._status = BookingStatus.COMPLETED;
  }

  canExtend(): boolean {
    return this.getDurationHours() === 1 && this.isActive();
  }

  conflictsWith(other: Booking): boolean {
    return (
      this.roomId === other.roomId &&
      this.startTime < other.endTime &&
      this.endTime > other.startTime
    );
  }
}
