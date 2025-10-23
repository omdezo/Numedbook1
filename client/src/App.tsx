import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { UserPage } from './pages/UserPage';
import { AdminPage } from './pages/AdminPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement; requireAdmin?: boolean }> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/userpage" replace />;
  }

  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage />} />

        {/* Student Page */}
        <Route
          path="/userpage"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Page */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
