import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Navigate based on role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/userpage');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setLoading(true);
    setError('');

    try {
      await login(userEmail, userPassword);
      // Navigate based on role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/userpage');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card animate-scale-in">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-lg mx-auto mb-4">
              <img src="/Logo/logoNu.png" alt="National University Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to book your study room</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
                  ⚠
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="student@nu.edu.om"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">Quick Access</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => quickLogin('admin@nu.edu.om', 'admin123')}
              disabled={loading}
              className="w-full p-4 bg-purple-50 hover:bg-purple-100 border-2 border-nu-purple-300 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-nu-purple-900 rounded-lg flex items-center justify-center text-white">
                  👨‍💼
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Admin Demo</p>
                  <p className="text-xs text-gray-600">admin@nu.edu.om</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => quickLogin('student@nu.edu.om', 'student123')}
              disabled={loading}
              className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-nu-gold-600 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-nu-gold-700 rounded-lg flex items-center justify-center text-white">
                  👨‍🎓
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Student Demo</p>
                  <p className="text-xs text-gray-600">student@nu.edu.om</p>
                </div>
              </div>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-nu-purple-900 font-bold hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
