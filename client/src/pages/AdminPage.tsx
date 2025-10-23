import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/AdminDashboard';

export const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-nu-purple-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
                <img src="/Logo/logoNu.png" alt="NU Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-yellow-100">Study Room Management System</p>
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
                  <span className="text-xs font-bold text-yellow-100">ADMIN</span>
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </main>

      {/* Footer */}
      <footer className="bg-nu-purple-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2">
                  <img src="/Logo/logoNu.png" alt="NU Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-bold">NU Admin Panel</span>
              </div>
              <p className="text-sm text-gray-300">
                National University of Science & Technology
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-yellow-300">Quick Stats</h3>
              <p className="text-sm text-gray-300">Manage all bookings</p>
              <p className="text-sm text-gray-300">Monitor room availability</p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-yellow-300">Admin Actions</h3>
              <p className="text-sm text-gray-300">• Approve bookings</p>
              <p className="text-sm text-gray-300">• Reject requests</p>
              <p className="text-sm text-gray-300">• Manage system</p>
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
