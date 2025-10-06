import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database in localStorage
const getUsersFromStorage = () => {
    const users = localStorage.getItem('saude_facil_users');
    return users ? JSON.parse(users) : {};
};

const setUsersInStorage = (users: any) => {
    localStorage.setItem('saude_facil_users', JSON.stringify(users));
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUserEmail = localStorage.getItem('saude_facil_currentUser');
    if (loggedInUserEmail) {
        const users = getUsersFromStorage();
        const currentUser = users[loggedInUserEmail];
        if (currentUser) {
            setUser({ name: currentUser.name, email: loggedInUserEmail });
        }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    const users = getUsersFromStorage();
    if (users[email] && users[email].password === pass) {
      const loggedUser = { name: users[email].name, email };
      setUser(loggedUser);
      localStorage.setItem('saude_facil_currentUser', email);
    } else {
      throw new Error('Email ou senha inválidos.');
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<void> => {
    const users = getUsersFromStorage();
    if (users[email]) {
      throw new Error('Este email já está cadastrado.');
    }
    users[email] = { name, password: pass };
    setUsersInStorage(users);
    await login(email, pass); // Auto-login after registration
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('saude_facil_currentUser');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
