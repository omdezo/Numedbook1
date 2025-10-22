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
  const [loading, setLoading] = useState(true);
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    action: string;
    bookingId: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, bookingsData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAdminBookings(),
      ]);

      setStats(statsData);
      setBookings(bookingsData);
    } catch (error: any) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string) => {
    try {
      setProcessingBookingId(bookingId);
      await apiService.approveBooking(bookingId);
      await loadData();
      setConfirmModal(null);
    } catch (error: any) {
      console.error('Failed to approve booking:', error);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      setProcessingBookingId(bookingId);
      await apiService.rejectBooking(bookingId);
      await loadData();
      setConfirmModal(null);
    } catch (error: any) {
      console.error('Failed to reject booking:', error);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleDelete = async (bookingId: string) => {
    try {
      setProcessingBookingId(bookingId);
      await apiService.deleteBooking(bookingId);
      await loadData();
      setConfirmModal(null);
    } catch (error: any) {
      console.error('Failed to delete booking:', error);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const handleReApprove = async (bookingId: string) => {
    try {
      setProcessingBookingId(bookingId);
      await apiService.reApproveBooking(bookingId);
      await loadData();
      setConfirmModal(null);
    } catch (error: any) {
      console.error('Failed to re-approve booking:', error);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const showConfirmation = (action: string, bookingId: string, message: string) => {
    setConfirmModal({ show: true, action, bookingId, message });
  };

  const handleConfirm = () => {
    if (!confirmModal) return;

    switch (confirmModal.action) {
      case 'approve':
        handleApprove(confirmModal.bookingId);
        break;
      case 'reject':
        handleReject(confirmModal.bookingId);
        break;
      case 'delete':
        handleDelete(confirmModal.bookingId);
        break;
      case 'reapprove':
        handleReApprove(confirmModal.bookingId);
        break;
    }
  };

  const filteredBookings = bookings
    .filter(b => filterStatus === 'all' || b._status === filterStatus)
    .filter(b =>
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const pendingCount = bookings.filter(b => b._status === 'pending').length;
  const approvedCount = bookings.filter(b => b._status === 'approved').length;
  const cancelledCount = bookings.filter(b => b._status === 'cancelled').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-nu-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">👨‍💼</span>
          </div>
          <p className="text-gray-600 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage bookings and monitor system activity</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-nu-purple-900 text-white rounded-lg font-semibold hover:bg-nu-purple-800 hover:shadow-lg transition-all duration-200"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Pending</p>
                <p className="text-4xl font-black text-yellow-900 mt-2">{pendingCount}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
              </div>
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                ⏳
              </div>
            </div>
          </div>

          <div className="card bg-green-50 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-green-700 uppercase tracking-wide">Approved</p>
                <p className="text-4xl font-black text-green-900 mt-2">{approvedCount}</p>
                <p className="text-xs text-green-600 mt-1">Active bookings</p>
              </div>
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                ✓
              </div>
            </div>
          </div>

          <div className="card bg-purple-50 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-nu-purple-900 uppercase tracking-wide">Total Rooms</p>
                <p className="text-4xl font-black text-nu-purple-900 mt-2">{stats.totalRooms}</p>
                <p className="text-xs text-purple-600 mt-1">{stats.availableRooms} available</p>
              </div>
              <div className="w-16 h-16 bg-nu-purple-900 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                🏠
              </div>
            </div>
          </div>

          <div className="card bg-red-50 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-red-700 uppercase tracking-wide">Cancelled</p>
                <p className="text-4xl font-black text-red-900 mt-2">{cancelledCount}</p>
                <p className="text-xs text-red-600 mt-1">Rejected bookings</p>
              </div>
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg">
                ✕
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search by user name, booking ID, or room ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nu-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filterStatus === 'all'
                  ? 'bg-nu-purple-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filterStatus === 'approved'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filterStatus === 'cancelled'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className={`card-interactive border-2 ${
                booking._status === 'pending'
                  ? 'border-yellow-300 bg-yellow-50'
                  : booking._status === 'approved'
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Booking Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg ${
                        booking._status === 'pending'
                          ? 'bg-orange-500'
                          : booking._status === 'approved'
                          ? 'bg-emerald-600'
                          : 'bg-red-500'
                      }`}>
                        {booking._status === 'pending' ? '⏳' : booking._status === 'approved' ? '✓' : '✕'}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">Booking ID</p>
                        <p className="font-mono font-bold text-gray-900">#{booking.id.slice(0, 12)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-nu-purple-900">👤 {booking.userName}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">Room #{booking.roomId.slice(0, 8)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-600 font-semibold uppercase">📅 Date</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">{format(new Date(booking.startTime), 'MMM d, yyyy')}</p>
                      </div>
                      <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-600 font-semibold uppercase">🕐 Time</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                        </p>
                      </div>
                      <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-600 font-semibold uppercase">⏱️ Duration</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          {Math.round((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60))} hour(s)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                    booking._status === 'pending'
                      ? 'bg-orange-500 text-white'
                      : booking._status === 'approved'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {booking._status.toUpperCase()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t-2 border-white/50">
                  {booking._status === 'pending' && (
                    <>
                      <button
                        onClick={() => showConfirmation('approve', booking.id, `Approve booking for ${booking.userName}?`)}
                        disabled={processingBookingId === booking.id}
                        className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => showConfirmation('reject', booking.id, `Reject booking for ${booking.userName}?`)}
                        disabled={processingBookingId === booking.id}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}

                  {booking._status === 'approved' && (
                    <button
                      onClick={() => showConfirmation('delete', booking.id, `Delete this approved booking? This action cannot be undone.`)}
                      disabled={processingBookingId === booking.id}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      🗑️ Delete Booking
                    </button>
                  )}

                  {booking._status === 'cancelled' && (
                    <button
                      onClick={() => showConfirmation('reapprove', booking.id, `Re-approve this booking for ${booking.userName}?`)}
                      disabled={processingBookingId === booking.id}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      ↻ Re-approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                confirmModal.action === 'approve'
                  ? 'bg-emerald-600'
                  : confirmModal.action === 'delete'
                  ? 'bg-red-500'
                  : confirmModal.action === 'reapprove'
                  ? 'bg-blue-600'
                  : 'bg-orange-500'
              }`}>
                <span className="text-4xl text-white">
                  {confirmModal.action === 'approve' ? '✓' : confirmModal.action === 'delete' ? '🗑️' : confirmModal.action === 'reapprove' ? '↻' : '✕'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Action</h3>
              <p className="text-gray-600 mb-6">{confirmModal.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={processingBookingId !== null}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 ${
                    confirmModal.action === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'
                      : confirmModal.action === 'delete'
                      ? 'bg-red-500 hover:bg-red-600 hover:shadow-lg'
                      : confirmModal.action === 'reapprove'
                      ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                      : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg'
                  }`}
                >
                  {processingBookingId ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
