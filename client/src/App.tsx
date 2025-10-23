import { useState, useEffect } from 'react';
import { Room, Booking } from './types';
import { apiService } from './services/ApiService';
import { useAuth } from './context/AuthContext';
import { RoomCard } from './components/RoomCard';
import { BookingModal } from './components/BookingModal';
import { BookingList } from './components/BookingList';
import { Login } from './components/Login';
import { Register } from './components/Register';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const { user, isAuthenticated, isAdmin, logout, loading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings' | 'admin'>('rooms');
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Redirect admin users to dashboard immediately after login
  useEffect(() => {
    if (user && user.role.toUpperCase() === 'ADMIN') {
      setActiveTab('admin');
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsData, bookingsData] = await Promise.all([
        apiService.getRooms(),
        apiService.getUserBookings(),
      ]);
      setRooms(roomsData);
      setBookings(bookingsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await apiService.cancelBooking(id);
      await loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBookingCreated = () => {
    loadData();
  };

  // Show auth loading
  if (authLoading) {
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

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onSwitchToRegister={() => setShowRegister(true)} />;
  }

  const activeBookingsCount = bookings.filter(b => b._status === 'approved' || b._status === 'pending').length;

  // Determine which tab to show - admins default to admin dashboard
  let currentTab = activeTab;
  if (user?.role && user.role.toUpperCase() === 'ADMIN' && activeTab === 'rooms') {
    currentTab = 'admin';
  }

  return (
    <div className="min-h-screen">
      {/* Compact Header */}
      <header className="relative bg-nu-purple-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                <img src="/Logo/logoNu.png" alt="National University Logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-white">National University</h1>
                <p className="text-xs text-yellow-100">Study Room Booking System</p>
              </div>
            </div>

            {/* Stats - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-300">{rooms.length}</p>
                <p className="text-xs text-yellow-100">Rooms</p>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-300">{activeBookingsCount}</p>
                <p className="text-xs text-yellow-100">Active</p>
              </div>
              <div className="w-px h-10 bg-white/30"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-300">7-9PM</p>
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
                  <span className={`text-xs font-bold ${
                    isAdmin ? 'text-yellow-300' : 'text-yellow-100'
                  }`}>
                    {isAdmin ? 'Admin' : 'Student'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-2 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white rounded-lg font-semibold transition-all duration-200 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-3 font-bold transition-all duration-200 relative whitespace-nowrap ${
                currentTab === 'rooms'
                  ? 'text-nu-purple-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                <span>🏠</span>
                <span className="hidden sm:inline">Available Rooms</span>
                <span className="sm:hidden">Rooms</span>
              </span>
              {currentTab === 'rooms' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold-700 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-3 font-bold transition-all duration-200 relative whitespace-nowrap ${
                currentTab === 'bookings'
                  ? 'text-nu-purple-900'
                  : 'text-gray-600 hover:text-gray-900'
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
              {currentTab === 'bookings' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold-700 rounded-t-full" />
              )}
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-3 font-bold transition-all duration-200 relative whitespace-nowrap ${
                  currentTab === 'admin'
                    ? 'text-nu-purple-900 bg-white/10 backdrop-blur-sm'
                    : 'text-gray-600 hover:text-nu-purple-900'
                }`}
              >
                <span className="flex items-center gap-2 text-sm">
                  <span>👨‍💼</span>
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                  <span className="px-1.5 py-0.5 bg-nu-gold-700 text-white rounded-full text-xs font-bold">
                    {bookings.filter(b => b._status === 'pending').length}
                  </span>
                </span>
                {currentTab === 'admin' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold-700 rounded-t-full" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

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

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'rooms' && (
          <div>
            <div className="mb-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Choose Your Study Space
              </h2>
              <p className="text-sm text-gray-600">
                All rooms are equipped with premium amenities
              </p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rooms.map((room, index) => (
                  <div key={room.id} style={{ animationDelay: `${index * 100}ms` }}>
                    <RoomCard
                      room={room}
                      onSelect={setSelectedRoom}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'bookings' && (
          <div>
            <div className="mb-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Your Bookings
              </h2>
              <p className="text-sm text-gray-600">
                Manage and track your study room reservations
              </p>
            </div>
            <BookingList
              bookings={bookings}
              onCancel={handleCancelBooking}
            />
          </div>
        )}

        {currentTab === 'admin' && isAdmin && (
          <AdminDashboard />
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
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5">
                  <img src="/Logo/logoNu.png" alt="National University Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-xl font-bold">National University</h3>
              </div>
              <p className="text-yellow-100 text-sm mb-2">
                للعلوم والتكنولوجيا
              </p>
              <p className="text-gray-300 text-sm">
                Premium study spaces for Science & Technology students
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Available Rooms</li>
                <li>My Bookings</li>
                <li>Booking Rules</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">Booking Hours</h4>
              <p className="text-gray-400 text-sm mb-2">Monday - Sunday</p>
              <p className="text-white font-bold">7:00 AM - 9:00 PM</p>
              <p className="text-gray-400 text-xs mt-4">
                Book at least 1 day in advance
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              Study Room Booking System - MVP Prototype
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Built with OOP principles | React + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
