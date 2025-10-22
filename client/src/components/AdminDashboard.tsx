import React, { useState, useEffect } from 'react';
import { apiService } from '../services/ApiService';
import { Booking, Room } from '../types';
import { format } from 'date-fns';

interface AdminStats {
  totalBookings: number;
  activeBookings: number;
  totalRooms: number;
  availableRooms: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'rooms'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, bookingsData, roomsData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAdminBookings(),
        apiService.getRooms(),
      ]);

      setStats(statsData);
      setBookings(bookingsData);
      setRooms(roomsData);
    } catch (error: any) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomStatusChange = async (roomId: string, newStatus: string) => {
    try {
      await apiService.updateRoomStatus(roomId, newStatus);
      await loadData();
    } catch (error: any) {
      console.error('Failed to update room status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-nu-purple-900 to-nu-gold-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">👨‍💼</span>
          </div>
          <p className="text-gray-600 font-semibold">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage study room bookings and resources</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-nu-purple-900 to-nu-gold-700 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                📚
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Rooms</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRooms}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                ✓
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Available</p>
                <p className="text-3xl font-bold text-gray-900">{stats.availableRooms}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                📅
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                🔄
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Active</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeBookings}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold transition-all duration-200 relative ${
              activeTab === 'overview' ? 'text-nu-purple-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nu-purple-900 to-nu-gold-700 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-bold transition-all duration-200 relative ${
              activeTab === 'bookings' ? 'text-nu-purple-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Bookings ({bookings.length})
            {activeTab === 'bookings' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nu-purple-900 to-nu-gold-700 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-6 py-3 font-bold transition-all duration-200 relative ${
              activeTab === 'rooms' ? 'text-nu-purple-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Room Management
            {activeTab === 'rooms' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-nu-purple-900 to-nu-gold-700 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h3>
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-gradient-to-r from-purple-50 to-yellow-50 rounded-xl border border-nu-purple-200 mb-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">Booking #{booking.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(booking.startTime), 'PPP p')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    booking._status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {booking._status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-nu-purple-900 to-nu-gold-700 rounded-lg flex items-center justify-center text-white text-xl">
                      📅
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Booking #{booking.id.slice(0, 12)}</p>
                      <p className="text-sm text-gray-600">Room ID: {booking.roomId.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Start Time</p>
                      <p className="text-sm font-bold">{format(new Date(booking.startTime), 'PPP p')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">End Time</p>
                      <p className="text-sm font-bold">{format(new Date(booking.endTime), 'PPP p')}</p>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  booking._status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {booking._status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div key={room.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Capacity: {room.capacity} people</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-purple-50 to-yellow-50 text-nu-purple-900 rounded-lg text-xs font-medium border border-nu-purple-200"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <select
                    value={room._status}
                    onChange={(e) => handleRoomStatusChange(room.id, e.target.value)}
                    className="input text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold text-center ${
                    room._status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : room._status === 'occupied'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {room._status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
