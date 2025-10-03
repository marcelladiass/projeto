import React, { useState } from 'react';
import { Reminder, ReminderType } from '../types';
import ShareModal from './ShareModal';
import { IconPill, IconStethoscope, IconMicroscope, IconShare, IconTrash, IconBell } from './Icons';

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const getIconForType = (type: ReminderType) => {
  switch (type) {
    case ReminderType.Medication:
      return <IconPill className="h-6 w-6 text-white" />;
    case ReminderType.Appointment:
      return <IconStethoscope className="h-6 w-6 text-white" />;
    case ReminderType.Exam:
      return <IconMicroscope className="h-6 w-6 text-white" />;
  }
};

const getBgColorForType = (type: ReminderType) => {
  switch (type) {
    case ReminderType.Medication:
      return 'bg-blue-500';
    case ReminderType.Appointment:
      return 'bg-purple-500';
    case ReminderType.Exam:
      return 'bg-green-500';
  }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onToggleComplete, onDelete }) => {
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    
    const isRefillNeeded = reminder.type === ReminderType.Medication && 
                            typeof reminder.remainingQuantity === 'number' &&
                            reminder.remainingQuantity <= 5;

  return (
    <>
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${reminder.isCompleted ? 'opacity-60' : ''}`}>
        <div className={`flex items-center p-4 ${getBgColorForType(reminder.type)}`}>
          <div className="flex-shrink-0">{getIconForType(reminder.type)}</div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-white leading-tight">{reminder.title}</h3>
            <p className="text-sm text-white opacity-90">{reminder.date ? formatDate(reminder.date) : 'Hoje'} às {reminder.time}</p>
          </div>
        </div>
        
        <div className="p-4 flex-grow">
          <p className="text-gray-600 text-sm">{reminder.details}</p>
          {isRefillNeeded && (
            <div className="mt-3 bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded-md flex items-center">
                <IconBell className="h-5 w-5 mr-2" />
              <p className="text-xs font-semibold">Reposição necessária! Restam {reminder.remainingQuantity} doses.</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200">
           <button 
             onClick={() => onToggleComplete(reminder.id)}
             className={`px-3 py-1.5 text-sm font-semibold rounded-full flex items-center transition-colors ${reminder.isCompleted ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-teal-100 text-teal-800 hover:bg-teal-200'}`}
           >
                <i className={`fa-solid ${reminder.isCompleted ? 'fa-xmark mr-2' : 'fa-check mr-2'}`}></i>
                {reminder.isCompleted ? 'Desmarcar' : 'Concluído'}
           </button>
           <div className="flex items-center space-x-2">
            <button onClick={() => setShareModalOpen(true)} className="text-gray-400 hover:text-blue-500 transition-colors">
                <IconShare className="h-5 w-5" />
            </button>
            <button onClick={() => onDelete(reminder.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <IconTrash className="h-5 w-5" />
            </button>
           </div>
        </div>
      </div>
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        reminderTitle={reminder.title}
      />
    </>
  );
};

export default ReminderCard;
