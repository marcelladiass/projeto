import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ReminderManager from './components/ReminderManager';

const AppRouter: React.FC = () => {
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
      <AppRouter />
    </AuthProvider>
  );
};

export default App;