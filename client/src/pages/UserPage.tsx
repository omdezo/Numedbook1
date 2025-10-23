import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Room, Booking } from '../types';
import { apiService } from '../services/ApiService';
import { RoomCard } from '../components/RoomCard';
import { BookingModal } from '../components/BookingModal';
import { BookingList } from '../components/BookingList';

export const UserPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings'>('rooms');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, bookingsData] = await Promise.all([
        apiService.getRooms(),
        apiService.getUserBookings()
      ]);
      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBookingCreated = () => {
    setSelectedRoom(null);
    loadData();
  };

  const activeBookingsCount = bookings.filter(b => b._status === 'approved' || b._status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl p-4 border-2 border-gray-100">
            <img src="/Logo/logoNu.png" alt="National University Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-3 h-3 bg-nu-purple-900 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-nu-gold-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-nu-purple-900 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-xl text-gray-600 mt-4 font-semibold">Loading...</p>
          <p className="text-sm text-nu-purple-900 mt-2">National University</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Student Header */}
      <header className="bg-nu-purple-900 shadow-lg relative overflow-hidden">
        {/* Hexagonal decorative patterns */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-nu-gold-700 opacity-10 animate-rotate-slow" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}></div>
        <div className="absolute -left-20 -bottom-20 w-56 h-56 bg-white opacity-5 animate-rotate-slow" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', animationDirection: 'reverse', animationDuration: '30s'}}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                <img src="/Logo/logoNu.png" alt="NU Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Study Room Booking</h1>
                <p className="text-xs text-yellow-100">National University of Science & Technology</p>
              </div>
            </div>

            {/* Stats - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-black text-white">{rooms.filter(r => r._status === 'available').length}</p>
                <p className="text-xs text-yellow-100">Available</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">{activeBookingsCount}</p>
                <p className="text-xs text-yellow-100">My Bookings</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">7-21</p>
                <p className="text-xs text-yellow-100">Hours</p>
              </div>
            </div>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="w-10 h-10 bg-nu-gold-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <span className="text-xs font-bold text-yellow-100">STUDENT</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg text-white text-sm font-semibold transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('rooms')}
                className={`px-4 py-3 font-bold transition-all duration-200 relative whitespace-nowrap ${
                  activeTab === 'rooms'
                    ? 'text-white bg-white/10 backdrop-blur-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2 text-sm">
                  <span>🏠</span>
                  <span className="hidden sm:inline">Available Rooms</span>
                  <span className="sm:hidden">Rooms</span>
                </span>
                {activeTab === 'rooms' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold-700 rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-3 font-bold transition-all duration-200 relative whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'text-white bg-white/10 backdrop-blur-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2 text-sm">
                  <span>📋</span>
                  <span className="hidden sm:inline">My Bookings</span>
                  <span className="sm:hidden">Bookings</span>
                  {activeBookingsCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-nu-gold-700 text-white text-xs font-bold rounded-full min-w-[18px] text-center">
                      {activeBookingsCount}
                    </span>
                  )}
                </span>
                {activeTab === 'bookings' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold-700 rounded-t-full" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-500 p-4 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                ⚠
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold gradient-text">Available Rooms</h2>
                <p className="text-sm text-gray-600 mt-1">Select a room to make a booking</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* First Row - 3 Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.slice(0, 3).map((room, index) => (
                  <div key={room.id} style={{ animationDelay: `${index * 100}ms` }}>
                    <RoomCard room={room} onSelect={setSelectedRoom} />
                  </div>
                ))}
              </div>

              {/* Second Row - 2 Rooms Centered */}
              {rooms.length > 3 && (
                <div className="flex justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                    {rooms.slice(3, 5).map((room, index) => (
                      <div key={room.id} style={{ animationDelay: `${(index + 3) * 100}ms` }}>
                        <RoomCard room={room} onSelect={setSelectedRoom} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold gradient-text">My Bookings</h2>
                <p className="text-sm text-gray-600 mt-1">View and manage your room reservations</p>
              </div>
            </div>

            <BookingList
              bookings={bookings}
              onCancel={async (id: string) => {
                try {
                  await apiService.cancelBooking(id);
                  await loadData();
                } catch (err: any) {
                  setError(err.message);
                }
              }}
            />
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onBookingCreated={handleBookingCreated}
        />
      )}

      {/* Footer */}
      <footer className="bg-nu-purple-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2">
                  <img src="/Logo/logoNu.png" alt="NU Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-bold">NU Study Rooms</span>
              </div>
              <p className="text-sm text-gray-300">
                National University of Science & Technology
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-yellow-300">Operating Hours</h3>
              <p className="text-sm text-gray-300">Monday - Sunday</p>
              <p className="text-sm text-gray-300">7:00 AM - 9:00 PM</p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-yellow-300">Booking Rules</h3>
              <p className="text-sm text-gray-300">• Book 1 day in advance</p>
              <p className="text-sm text-gray-300">• Maximum 2 hours per booking</p>
              <p className="text-sm text-gray-300">• One booking per day</p>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 National University. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
