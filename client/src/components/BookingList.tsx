import React, { useState } from 'react';
import { Booking } from '../types';
import { format, differenceInHours } from 'date-fns';

interface BookingListProps {
  bookings: Booking[];
  onCancel: (id: string) => void;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, onCancel }) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const activeBookings = bookings.filter(b => b._status === 'approved' || b._status === 'pending');

  if (activeBookings.length === 0) {
    return (
      <div className="card text-center py-12 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="relative mx-auto mb-6" style={{ width: '100px', height: '100px' }}>
            <div
              className="w-24 h-24 bg-purple-100 flex items-center justify-center mx-auto transition-all duration-500 hover:scale-110 hover:rotate-12"
              style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}
            >
              <span className="text-5xl transform hover:-rotate-12 transition-transform duration-500">📅</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings</h3>
          <p className="text-gray-600">Start by booking a study room from the available rooms!</p>
        </div>
      </div>
    );
  }

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    await onCancel(id);
    setCancellingId(null);
  };

  return (
    <div className="space-y-4">
      {activeBookings.map((booking, index) => {
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const duration = differenceInHours(endTime, startTime);
        const isCancelling = cancellingId === booking.id;

        return (
          <div
            key={booking.id}
            className="card-interactive animate-slide-up group relative overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Hexagonal background pattern */}
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500 opacity-5 transition-all duration-700 group-hover:rotate-180 group-hover:scale-125 pointer-events-none" style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}></div>

            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              {/* Left: Booking Icon and ID */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-16 h-16 bg-emerald-600 flex items-center justify-center text-white shadow-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                    style={{clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}
                  >
                    <span className="text-2xl relative z-10 transform group-hover:-rotate-12 transition-transform duration-300">✓</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Booking ID</p>
                  <p className="text-sm font-mono text-gray-700">#{booking.id.slice(0, 12)}</p>
                </div>
              </div>

              {/* Middle: Booking Details */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date & Time */}
                  <div className="p-4 bg-purple-50 rounded-xl border border-nu-purple-300">
                    <p className="text-xs text-nu-purple-900 uppercase tracking-wide font-semibold mb-2">
                      📅 Date & Time
                    </p>
                    <p className="font-bold text-gray-900">
                      {format(startTime, 'EEEE, MMM d')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                    </p>
                  </div>

                  {/* Duration & Status */}
                  <div className="p-4 bg-yellow-50 rounded-xl border border-nu-gold-600">
                    <p className="text-xs text-nu-gold-700 uppercase tracking-wide font-semibold mb-2">
                      ⏱️ Duration & Status
                    </p>
                    <p className="font-bold text-gray-900">{duration} Hour{duration > 1 ? 's' : ''}</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                      booking._status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : booking._status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        booking._status === 'pending'
                          ? 'bg-yellow-500 animate-pulse'
                          : booking._status === 'approved'
                          ? 'bg-green-500 animate-pulse'
                          : 'bg-gray-500'
                      }`}></span>
                      {booking._status === 'pending' ? 'Pending Approval' : booking._status === 'approved' ? 'Approved' : booking._status}
                    </span>
                  </div>
                </div>

                {/* User Name */}
                <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-xs text-purple-700 uppercase tracking-wide font-semibold mb-1">
                    👤 Booked By
                  </p>
                  <p className="font-bold text-gray-900">{booking.userName}</p>
                </div>

                {/* Created At */}
                <p className="text-xs text-gray-500">
                  Booked on {format(new Date(booking.createdAt), 'PPP p')}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={isCancelling}
                  className="btn-danger min-w-[120px]"
                >
                  {isCancelling ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Cancelling...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>✕</span>
                      <span>Cancel</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Corner decoration */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
};
