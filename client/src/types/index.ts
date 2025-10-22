export interface Room {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  _status: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string;
  _status: 'pending' | 'approved' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface TimeSlot {
  startHour: number;
  endHour: number;
  isAvailable: boolean;
  displayLabel: string;
}

export interface CreateBookingRequest {
  roomId: string;
  startTime: string;
  endTime: string;
}
