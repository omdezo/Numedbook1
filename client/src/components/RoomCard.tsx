import React, { useState } from 'react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    available: {
      badge: 'badge-available',
      glow: 'shadow-glow-green',
      icon: '✓',
      text: 'Available'
    },
    occupied: {
      badge: 'badge-occupied',
      glow: '',
      icon: '⊗',
      text: 'Occupied'
    },
    maintenance: {
      badge: 'badge-maintenance',
      glow: '',
      icon: '⚠',
      text: 'Maintenance'
    },
  };

  const config = statusConfig[room._status as keyof typeof statusConfig] || statusConfig.available;
  const isAvailable = room._status === 'available';

  return (
    <div
      className={`card-interactive animate-slide-up group relative overflow-hidden ${
        isAvailable && isHovered ? config.glow : ''
      }`}
      onClick={() => isAvailable && onSelect(room)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-nu-purple-500/5 to-nu-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <div className="relative flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {room.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-nu-purple-900 rounded-full animate-pulse"></span>
            Room ID: {room.id.slice(0, 8)}
          </p>
        </div>
        <span className={`${config.badge} flex items-center gap-1.5 animate-scale-in`}>
          <span>{config.icon}</span>
          {config.text}
        </span>
      </div>

      {/* Capacity with icon */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-yellow-50 rounded-xl border border-nu-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-nu-purple-900 to-nu-gold-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {room.capacity}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Capacity</p>
            <p className="text-sm font-semibold text-gray-700">{room.capacity} People Max</p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
          Amenities
        </p>
        <div className="flex flex-wrap gap-2">
          {room.amenities.map((amenity, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-gradient-to-r from-white to-purple-50 text-nu-purple-900 rounded-lg text-xs font-medium border border-purple-200 hover:border-nu-gold-700 transition-colors duration-200 shadow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Action button */}
      {isAvailable ? (
        <button className="btn-primary w-full group-hover:shadow-glow transition-all duration-300">
          <span className="flex items-center justify-center gap-2">
            <span>Book This Room</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>
        </button>
      ) : (
        <button className="btn w-full bg-gray-100 text-gray-400 cursor-not-allowed" disabled>
          Currently Unavailable
        </button>
      )}

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-nu-gold-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
