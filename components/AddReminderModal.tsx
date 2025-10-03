import React, { useState, useEffect } from 'react';
import { Reminder, ReminderType } from '../types';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (reminder: Omit<Reminder, 'id' | 'isCompleted'>) => void;
  initialData?: Partial<Reminder> | null;
}

const AddReminderModal: React.FC<AddReminderModalProps> = ({ isOpen, onClose, onAdd, initialData }) => {
  const [type, setType] = useState<ReminderType>(ReminderType.Medication);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [totalQuantity, setTotalQuantity] = useState<number | undefined>();

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || ReminderType.Medication);
      setTitle(initialData.title || '');
      setTime(initialData.time || '08:00');
      setDate(initialData.date || '');
      setDetails(initialData.details || '');
      setTotalQuantity(initialData.totalQuantity);
    } else {
        // Reset form when opening without initial data
        setType(ReminderType.Medication);
        setTitle('');
        setTime('08:00');
        setDate(new Date().toISOString().split('T')[0]);
        setDetails('');
        setTotalQuantity(undefined);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: Omit<Reminder, 'id' | 'isCompleted'> = {
        type,
        title,
        time,
        details,
    };
    if (type !== ReminderType.Medication) {
        newReminder.date = date;
    }
    if (type === ReminderType.Medication && totalQuantity) {
        newReminder.totalQuantity = totalQuantity;
        newReminder.remainingQuantity = totalQuantity;
    }
    onAdd(newReminder);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{initialData ? 'Editar Lembrete' : 'Novo Lembrete'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value as ReminderType)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
              <option value={ReminderType.Medication}>Medicamento</option>
              <option value={ReminderType.Appointment}>Consulta</option>
              <option value={ReminderType.Exam}>Exame</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Horário</label>
                <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
            </div>
            {type !== ReminderType.Medication && (
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
            )}
            {type === ReminderType.Medication && (
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade Total</label>
                    <input type="number" id="quantity" value={totalQuantity || ''} onChange={(e) => setTotalQuantity(parseInt(e.target.value, 10))} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Ex: 30"/>
                </div>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Detalhes</label>
            <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" rows={3} placeholder={type === ReminderType.Medication ? "Ex: 1 comprimido, após o café" : "Ex: Dr. Roberto, Clínica Central"}></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors shadow-sm">{initialData ? 'Salvar Alterações' : 'Adicionar Lembrete'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReminderModal;
