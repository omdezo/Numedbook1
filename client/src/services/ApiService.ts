import { Room, Booking, TimeSlot, CreateBookingRequest } from '../types';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STUDENT';
  };
}

interface AdminStats {
  totalBookings: number;
  activeBookings: number;
  totalRooms: number;
  availableRooms: number;
}

class ApiService {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    } else {
      headers['x-user-id'] = 'demo-user';
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      headers: {
        ...headers,
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data || data;
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.fetchJSON<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return this.fetchJSON<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getMe(): Promise<{ user: any }> {
    return this.fetchJSON('/auth/me');
  }

  // Room endpoints
  async getRooms(): Promise<Room[]> {
    return this.fetchJSON<Room[]>('/rooms');
  }

  async getRoom(id: string): Promise<Room> {
    return this.fetchJSON<Room>(`/rooms/${id}`);
  }

  async getAvailableSlots(roomId: string, date: Date): Promise<TimeSlot[]> {
    const dateStr = date.toISOString().split('T')[0];
    return this.fetchJSON<TimeSlot[]>(`/rooms/${roomId}/availability?date=${dateStr}`);
  }

  // Booking endpoints
  async createBooking(booking: CreateBookingRequest): Promise<Booking> {
    return this.fetchJSON<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async getUserBookings(): Promise<Booking[]> {
    return this.fetchJSON<Booking[]>('/bookings/user');
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.fetchJSON<Booking[]>('/bookings');
  }

  async cancelBooking(id: string): Promise<void> {
    await this.fetchJSON(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getAdminBookings(): Promise<Booking[]> {
    return this.fetchJSON<Booking[]>('/admin/bookings');
  }

  async getAdminStats(): Promise<AdminStats> {
    return this.fetchJSON<AdminStats>('/admin/stats');
  }

  async updateRoomStatus(roomId: string, status: string): Promise<Room> {
    return this.fetchJSON<Room>(`/admin/rooms/${roomId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiService = new ApiService();
