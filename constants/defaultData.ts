import { Reminder, ReminderType } from '../types';

export const defaultReminders: Omit<Reminder, 'id'>[] = [
    { type: ReminderType.Medication, title: 'Amoxicilina', time: '08:00', details: '1 comprimido de 500mg', isCompleted: true, totalQuantity: 21, remainingQuantity: 15 },
    { type: ReminderType.Appointment, title: 'Consulta com Dr. Carlos', date: '2024-08-15', time: '10:30', details: 'Cardiologista - Clínica Coração Forte', isCompleted: false },
    { type: ReminderType.Medication, title: 'Dipirona', time: '14:00', details: '30 gotas se houver dor', isCompleted: false },
    { type: ReminderType.Exam, title: 'Exame de Sangue', date: '2024-08-05', time: '07:00', details: 'Jejum de 8 horas - Laboratório Central', isCompleted: false },
    { type: ReminderType.Medication, title: 'Amoxicilina', time: '16:00', details: '1 comprimido de 500mg', isCompleted: false, totalQuantity: 21, remainingQuantity: 15 },
    { type: ReminderType.Medication, title: 'Amoxicilina', time: '00:00', details: '1 comprimido de 500mg', isCompleted: false, totalQuantity: 21, remainingQuantity: 15 },
];
