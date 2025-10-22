import { useState, useEffect } from 'react';
import { Room, Booking } from '../types';
import { apiService } from '../services/ApiService';
import { RoomCard } from '../components/RoomCard';
import { BookingModal } from '../components/BookingModal';
import { BookingList } from '../components/BookingList';

export function UserPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings'>('rooms');
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

  const activeBookingsCount = bookings.filter(b => b._status === 'approved' || b._status === 'pending').length;

  return (
    <>
      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`px-4 py-3 font-bold transition-all duration-200 relative whitespace-nowrap ${
                activeTab === 'rooms'
                  ? 'text-nu-purple-900'
                  : 'text-gray-600 hover:text-gray-900'
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
              {activeTab === 'bookings' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-nu-gold-700 rounded-t-full" />
              )}
            </button>
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
        {activeTab === 'rooms' && (
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

        {activeTab === 'bookings' && (
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
      </main>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onBookingCreated={handleBookingCreated}
        />
      )}
    </>
  );
}
