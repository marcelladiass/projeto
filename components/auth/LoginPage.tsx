import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { IconPill, IconLoader } from '../common/Icons';

interface LoginPageProps {
  onSwitchMode: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      // On success, the AuthProvider will handle the redirect
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center items-center mb-6">
            <IconPill className="h-10 w-10 text-teal-600" />
            <h1 className="ml-3 text-4xl font-bold text-gray-800">Saúde Fácil</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-1">Bem-vindo de volta!</h2>
            <p className="text-center text-gray-500 mb-6">Faça login para continuar.</p>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-