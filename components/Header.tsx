import React from 'react';
import { IconPill, IconCamera, IconPlus } from './Icons';

interface HeaderProps {
  onAddClick: () => void;
  onScanClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddClick, onScanClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <IconPill className="h-8 w-8 text-teal-600" />
            <h1 className="ml-3 text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              Saúde Fácil
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
             <button
              onClick={onScanClick}
              className="flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-sm transition-transform transform hover:scale-105"
            >
              <IconCamera className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Escanear Receita</span>
            </button>
            <button
              onClick={onAddClick}
              className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3 sm:px-4 rounded-lg shadow-sm transition-transform transform hover:scale-105"
            >
              <IconPlus className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
