import React, { useState } from 'react';
import { Booking } from '../types';
import { format, differenceInHours } from 'date-fns';

interface BookingListProps {
  bookings: Booking[];
  onCancel: (id: string) => void;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, onCancel }) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const activeBookings = bookings.filter(b => b._status === 'active');

  if (activeBookings.length === 0) {
    return (
      <div className="card text-center py-12 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">📅</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Bookings</h3>
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              {/* Left: Booking Icon and ID */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                  <span className="text-2xl">✓</span>
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
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-yellow-50 rounded-xl border border-nu-purple-300">
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
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-nu-gold-600">
                    <p className="text-xs text-nu-gold-700 uppercase tracking-wide font-semibold mb-2">
                      ⏱️ Duration & Status
                    </p>
                    <p className="font-bold text-gray-900">{duration} Hour{duration > 1 ? 's' : ''}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Active
                    </span>
                  </div>
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
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
};
