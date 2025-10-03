import React from 'react';
import { Reminder } from '../types';
import ReminderCard from './ReminderCard';
import { IconCalendar } from './Icons';

interface DashboardProps {
  reminders: Reminder[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reminders, onToggleComplete, onDelete }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getReminderDate = (reminder: Reminder) => {
    if (reminder.date) {
        const [year, month, day] = reminder.date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date(); // Treat reminders without a date as today's reminders
  }

  const todayReminders = reminders
    .filter(r => {
        const reminderDate = getReminderDate(r);
        reminderDate.setHours(0,0,0,0);
        return reminderDate.getTime() === today.getTime();
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const upcomingReminders = reminders
    .filter(r => {
        const reminderDate = getReminderDate(r);
        reminderDate.setHours(0,0,0,0);
        return reminderDate.getTime() > today.getTime();
    })
    .sort((a, b) => {
        const dateA = getReminderDate(a);
        const dateB = getReminderDate(b);
        if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
        }
        return a.time.localeCompare(b.time);
    });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Lembretes de Hoje</h2>
      {todayReminders.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {todayReminders.map(reminder => (
            <ReminderCard key={reminder.id} reminder={reminder} onToggleComplete={onToggleComplete} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Nenhum lembrete para hoje.</p>
      )}

      {upcomingReminders.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">Próximos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcomingReminders.map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} onToggleComplete={onToggleComplete} onDelete={onDelete} />
            ))}
            </div>
          </>
      )}

      {reminders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <IconCalendar className="mx-auto h-16 w-16 text-gray-300"/>
            <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum Lembrete</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo lembrete.</p>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
