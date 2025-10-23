import React, { useState } from 'react';
import { Login } from '../components/Login';
import { Register } from '../components/Register';

export const LoginPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {showRegister ? (
        <Register onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <Login onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </div>
  );
};
