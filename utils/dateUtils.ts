import { Reminder } from '../types';

export const getReminderDate = (reminder: Reminder): Date => {
  if (reminder.date) {
      const [year, month, day] = reminder.date.split('-').map(Number);
      return new Date(year, month - 1, day);
  }
  return new Date(); // Treat reminders without a date as today's reminders
};

export const formatDate = (dateString?: string): string | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};
