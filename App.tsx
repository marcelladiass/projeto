import React, { useState, useCallback } from 'react';
import { Reminder, ReminderType, ScannedMedication } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddReminderModal from './components/AddReminderModal';
import ScanPrescriptionModal from './components/ScanPrescriptionModal';

const App: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', type: ReminderType.Medication, title: 'Amoxicilina', time: '08:00', details: '1 comprimido de 500mg', isCompleted: true, totalQuantity: 21, remainingQuantity: 15 },
    { id: '2', type: ReminderType.Appointment, title: 'Consulta com Dr. Carlos', date: '2024-08-15', time: '10:30', details: 'Cardiologista - Clínica Coração Forte', isCompleted: false },
    { id: '3', type: ReminderType.Medication, title: 'Dipirona', time: '14:00', details: '30 gotas se houver dor', isCompleted: false },
    { id: '4', type: ReminderType.Exam, title: 'Exame de Sangue', date: '2024-08-05', time: '07:00', details: 'Jejum de 8 horas - Laboratório Central', isCompleted: false },
    { id: '5', type: ReminderType.Medication, title: 'Amoxicilina', time: '16:00', details: '1 comprimido de 500mg', isCompleted: false, totalQuantity: 21, remainingQuantity: 15 },
    { id: '6', type: ReminderType.Medication, title: 'Amoxicilina', time: '00:00', details: '1 comprimido de 500mg', isCompleted: false, totalQuantity: 21, remainingQuantity: 15 },
  ]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isScanModalOpen, setScanModalOpen] = useState(false);
  const [prefilledData, setPrefilledData] = useState<Partial<Reminder> | null>(null);

  const handleAddReminder = (reminder: Omit<Reminder, 'id' | 'isCompleted'>) => {
    setReminders(prev => [...prev, { ...reminder, id: new Date().toISOString(), isCompleted: false }]);
    setAddModalOpen(false);
    setPrefilledData(null);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };
  
  const handleToggleComplete = useCallback((id: string) => {
    setReminders(prevReminders =>
      prevReminders.map(r => {
        if (r.id === id) {
          const wasCompleted = r.isCompleted;
          const newCompletedState = !wasCompleted;
          let newRemaining = r.remainingQuantity;

          if (r.type === ReminderType.Medication && typeof r.remainingQuantity === 'number') {
            newRemaining = newCompletedState ? newRemaining - 1 : newRemaining + 1;
          }
          return { ...r, isCompleted: newCompletedState, remainingQuantity: newRemaining };
        }
        return r;
      })
    );
  }, []);

  const openAddModal = () => {
    setPrefilledData(null);
    setAddModalOpen(true);
  };

  const handleScanSuccess = (scannedMeds: ScannedMedication[]) => {
    setScanModalOpen(false);
    // For simplicity, we'll pre-fill the form with the first medication found.
    // A real app might show a list for the user to add multiple reminders.
    if (scannedMeds.length > 0) {
      const med = scannedMeds[0];
      setPrefilledData({
        type: ReminderType.Medication,
        title: med.medicationName,
        details: `${med.dosage}, ${med.frequency}`,
        time: '08:00', // Default time
      });
      setAddModalOpen(true);
    }
  };


  return (
    <div className="min-h-screen font-sans text-gray-800 bg-teal-50/50">
      <Header onAddClick={openAddModal} onScanClick={() => setScanModalOpen(true)} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Dashboard 
          reminders={reminders} 
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteReminder}
        />
      </main>
      {isAddModalOpen && (
        <AddReminderModal
          isOpen={isAddModalOpen}
          onClose={() => { setAddModalOpen(false); setPrefilledData(null); }}
          onAdd={handleAddReminder}
          initialData={prefilledData}
        />
      )}
      {isScanModalOpen && (
        <ScanPrescriptionModal
          isOpen={isScanModalOpen}
          onClose={() => setScanModalOpen(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </div>
  );
};

export default App;
