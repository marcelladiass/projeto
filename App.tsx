import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReminderManager from './components/ReminderManager';

const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    if (!user) {
        return authMode === 'login' ? (
            <LoginPage onSwitchMode={() => setAuthMode('register')} />
        ) : (
            <RegisterPage onSwitchMode={() => setAuthMode('login')} />
        );
    }

    return <ReminderManager />;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
