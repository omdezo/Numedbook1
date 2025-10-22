import React, { useState, useEffect } from 'react';
import { Room, TimeSlot } from '../types';
import { apiService } from '../services/ApiService';
import { format, addDays } from 'date-fns';

interface BookingModalProps {
  room: Room | null;
  onClose: () => void;
  onBookingCreated: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  onClose,
  onBookingCreated,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedStartSlot, setSelectedStartSlot] = useState<number | null>(null);
  const [duration, setDuration] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (room) {
      loadSlots();
    }
  }, [room, selectedDate]);

  const loadSlots = async () => {
    if (!room) return;

    setLoadingSlots(true);
    try {
      const availableSlots = await apiService.getAvailableSlots(room.id, selectedDate);
      setSlots(availableSlots);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async () => {
    if (!room || selectedStartSlot === null) return;

    setLoading(true);
    setError('');

    try {
      const startTime = new Date(selectedDate);
      startTime.setHours(selectedStartSlot, 0, 0, 0);

      const endTime = new Date(selectedDate);
      endTime.setHours(selectedStartSlot + duration, 0, 0, 0);

      await apiService.createBooking({
        roomId: room.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      setSuccess(true);
      setTimeout(() => {
        onBookingCreated();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  const canBookSlots = selectedStartSlot !== null && slots[selectedStartSlot - 7]?.isAvailable;
  const nextSlotAvailable = duration === 2 && selectedStartSlot !== null
    ? slots[selectedStartSlot - 7 + 1]?.isAvailable
    : true;

  const availableSlotsCount = slots.filter(s => s.isAvailable).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-nu-purple-900 to-nu-gold-700 text-white px-8 py-6 rounded-t-3xl z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-1">Book {room.name}</h2>
              <p className="text-yellow-100 text-sm">Select your preferred time slot</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:rotate-90"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl animate-scale-in">
                  ✓
                </div>
                <div>
                  <p className="font-bold text-green-900">Booking Confirmed!</p>
                  <p className="text-sm text-green-700">Redirecting you back...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-500 rounded-2xl animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl">
                  ⚠
                </div>
                <div className="flex-1">
                  <p className="font-bold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Date Selection */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-yellow-50 rounded-2xl border-2 border-nu-purple-300">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                📅 Select Date
              </label>
              <p className="text-xs text-gray-600 mb-3">Bookings must be made at least 1 day in advance</p>
              <input
                type="date"
                className="input text-lg font-semibold"
                value={format(selectedDate, 'yyyy-MM-dd')}
                min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                onChange={(e) => {
                  setSelectedDate(new Date(e.target.value));
                  setSelectedStartSlot(null);
                }}
              />
            </div>

            {/* Duration Selection */}
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-nu-gold-600">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                ⏱️ Booking Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDuration(1)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    duration === 1
                      ? 'border-nu-gold-700 bg-gradient-to-br from-nu-purple-900 to-nu-gold-700 text-white shadow-lg scale-105'
                      : 'border-nu-gold-300 bg-white hover:border-nu-gold-700'
                  }`}
                >
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm">Hour</p>
                </button>
                <button
                  onClick={() => setDuration(2)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    duration === 2
                      ? 'border-nu-gold-700 bg-gradient-to-br from-nu-purple-900 to-nu-gold-700 text-white shadow-lg scale-105'
                      : 'border-nu-gold-300 bg-white hover:border-nu-gold-700'
                  }`}
                >
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm">Hours</p>
                </button>
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  🕐 Available Time Slots
                </label>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  {availableSlotsCount} slots available
                </span>
              </div>

              {loadingSlots ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer"
                      style={{ backgroundSize: '1000px 100%' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {slots.map((slot, index) => {
                    const isSelected = selectedStartSlot === slot.startHour;
                    const isDisabled = !slot.isAvailable ||
                      (duration === 2 && !slots.find(s => s.startHour === slot.startHour + 1)?.isAvailable);

                    return (
                      <button
                        key={slot.startHour}
                        disabled={isDisabled}
                        onClick={() => setSelectedStartSlot(slot.startHour)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 transform ${
                          isSelected
                            ? 'border-nu-purple-900 bg-gradient-to-br from-nu-purple-900 to-nu-gold-700 text-white shadow-xl scale-105'
                            : isDisabled
                            ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                            : 'border-gray-300 bg-white hover:border-nu-purple-500 hover:shadow-lg hover:scale-105'
                        }`}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <div className={`text-base font-bold ${isSelected ? 'text-white' : isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                          {slot.displayLabel.split(' - ')[0]}
                        </div>
                        <div className={`text-xs mt-1 ${isSelected ? 'text-yellow-100' : isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Summary */}
            {selectedStartSlot !== null && canBookSlots && nextSlotAvailable && (
              <div className="p-6 bg-gradient-to-r from-nu-purple-900 to-nu-gold-700 text-white rounded-2xl shadow-xl animate-slide-up">
                <p className="text-sm font-semibold mb-2 opacity-90">📋 Booking Summary</p>
                <div className="space-y-1">
                  <p className="text-lg font-bold">{room.name}</p>
                  <p className="text-yellow-100">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                  <p className="text-yellow-100">
                    {selectedStartSlot}:00 - {selectedStartSlot + duration}:00 ({duration} hour{duration > 1 ? 's' : ''})
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                disabled={!canBookSlots || !nextSlotAvailable || loading || success}
                className="btn-primary flex-1 relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    Confirmed!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>🎯</span>
                    Confirm Booking
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
