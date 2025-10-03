export enum ReminderType {
  Medication = 'MEDICATION',
  Appointment = 'APPOINTMENT',
  Exam = 'EXAM',
}

export interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  time: string; // e.g., "08:00"
  date?: string; // e.g., "2024-07-26"
  details: string; // e.g., Dosage, Doctor's name
  isCompleted: boolean;
  totalQuantity?: number;
  remainingQuantity?: number;
}

export interface ScannedMedication {
  medicationName: string;
  dosage: string;
  frequency: string;
}
