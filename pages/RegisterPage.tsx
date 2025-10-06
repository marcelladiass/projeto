import React, { useState, FormEvent } from 'react';
// FIX: Corrected the import path for the useAuth hook. It should be imported from '../hooks/useAuth'.
import { useAuth } from '../hooks/useAuth';
import { IconPill, IconLoader } from '../components/Icons';

interface RegisterPageProps {
  onSwitchMode: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        setIsLoading(false);
        return;
    }
    try {
      await register(name, email, password);
      // On success, the AuthProvider will handle the redirect
    } catch (err: any) {
      setError(err.message || 'Falha ao criar conta. Tente novamente.');
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
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-1">Crie sua conta</h2>
            <p className="text-center text-gray-500 mb-6">É rápido e fácil!</p>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-700 transition-colors shadow-sm disabled:bg-teal-400 flex justify-center items-center">
                    {isLoading ? <IconLoader className="h-5 w-5"/> : 'Criar Conta'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                Já tem uma conta?{' '}
                <button onClick={onSwitchMode} className="font-semibold text-teal-600 hover:text-teal-700">
                    Faça login
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;