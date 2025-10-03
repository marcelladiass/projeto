import React, { useState } from 'react';
import { IconShare, IconCheckCircle } from './Icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderTitle: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, reminderTitle }) => {
  const [email, setEmail] = useState('');
  const [isShared, setIsShared] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    // Simulate API call
    console.log(`Sharing reminder "${reminderTitle}" with ${email}`);
    setIsShared(true);
    setTimeout(() => {
        onClose();
        setIsShared(false);
        setEmail('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
        {isShared ? (
            <div className="text-center py-8">
                <IconCheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-gray-800 mt-4">Compartilhado!</h3>
                <p className="text-gray-600 mt-1">O lembrete foi compartilhado com sucesso.</p>
            </div>
        ) : (
            <>
                <div className="flex items-center mb-4">
                    <IconShare className="h-6 w-6 text-teal-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-800">Compartilhar Lembrete</h2>
                </div>
                <p className="mb-4 text-gray-600 text-sm">
                    Compartilhe <span className="font-semibold text-teal-700">"{reminderTitle}"</span> com um familiar ou cuidador.
                </p>
                <div className="mb-4">
                    <label htmlFor="share-email" className="block text-sm font-medium text-gray-700">Email do Contato</label>
                    <input
                        type="email"
                        id="share-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        placeholder="exemplo@email.com"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Fechar
                    </button>
                    <button onClick={handleShare} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                        Compartilhar
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
