import React, { useState, useCallback, useEffect } from 'react';
import { Reminder, ReminderType, ScannedMedication } from '../../types';
import Header from '../common/Header';
import Dashboard from './Dashboard';
import AddReminderModal from './AddReminderModal';
import ScanPrescriptionModal from './ScanPrescriptionModal';
import { useAuth } from '../../hooks/useAuth';
import { defaultReminders } from '../../constants/defaultData';


const ReminderManager: React.FC = () => {
  const { user, logout } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isScanModalOpen, setScanModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Partial<Reminder> | null>(null);

  useEffect(() => {
    if (user) {
        const key = `reminders_${user.email}`;
        try {
            const storedReminders = localStorage.getItem(key);
            if (storedReminders) {
                setReminders(JSON.parse(storedReminders));
            } else {
                // New user, seed with default data
                const userDefaultReminders = defaultReminders.map(r => ({...r, id: crypto.randomUUID(), isCompleted: false }));
                setReminders(userDefaultReminders);
                localStorage.setItem(key, JSON.stringify(userDefaultReminders));
            }
        } catch (error) {
            console.error("Failed to parse reminders from localStorage", error);
            // Fallback to default if parsing fails
            const userDefaultReminders = defaultReminders.map(r => ({...r, id: crypto.randomUUID(), isCompleted: false }));
            setReminders(userDefaultReminders);
        }
    } else {
        setReminders([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && reminders.length > 0) {
        const key = `reminders_${user.email}`;
        localStorage.setItem(key, JSON.stringify(reminders));
    }
  }, [reminders, user]);


  const handleSaveReminder = (reminderData: Omit<Reminder, 'isCompleted'> & { id?: string }) => {
    if (reminderData.id) {
        const originalReminder = reminders.find(r => r.id === reminderData.id);
        if (!originalReminder) return;

        setReminders(prev => prev.map(r => {
            if (r.id === reminderData.id) {
                const updatedReminder = { ...r, ...reminderData };

                if (updatedReminder.type === ReminderType.Medication) {
                    const originalTotal = originalReminder.totalQuantity;
                    const newTotal = updatedReminder.totalQuantity;

                    if (typeof newTotal === 'number' && newTotal !== originalTotal) {
                        const dosesTaken = (typeof originalTotal === 'number' && typeof originalReminder.remainingQuantity === 'number')
                            ? originalTotal - originalReminder.remainingQuantity
                            : 0;
                        updatedReminder.remainingQuantity = Math.max(0, newTotal - dosesTaken);
                    }
                }
                return updatedReminder as Reminder;
            }
            return r;
        }));
    } else {
        const newReminder: Reminder = {
            id: crypto.randomUUID(),
            isCompleted: false,
            title: reminderData.title,
            type: reminderData.type,
            time: reminderData.time,
            details: reminderData.details,
            date: reminderData.date,
            totalQuantity: reminderData.totalQuantity,
            remainingQuantity: reminderData.totalQuantity,
        };
        setReminders(prev => [...prev, newReminder]);
    }
    
    setAddModalOpen(false);
    setModalInitialData(null);
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
    setModalInitialData(null);
    setAddModalOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setModalInitialData(reminder);
    setAddModalOpen(true);
  };

  const handleScanSuccess = (scannedMeds: ScannedMedication[]) => {
    setScanModalOpen(false);
    if (scannedMeds.length > 0) {
      const med = scannedMeds[0];
      setModalInitialData({
        type: ReminderType.Medication,
        title: med.medicationName,
        details: `${med.dosage}, ${med.frequency}`,
        time: '08:00',
      });
      setAddModalOpen(true);
    }
  };


  return (
    <div className="min-h-screen font-sans text-gray-800 bg-teal-50/50">
      <Header 
        onAddClick={openAddModal} 
        onScanClick={() => setScanModalOpen(true)}
        userName={user?.name || ''}
        onLogout={logout}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Dashboard 
          reminders={reminders} 
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteReminder}
          onEdit={handleEditReminder}
        />
      </main>
      {isAddModalOpen && (
        <AddReminderModal
          isOpen={isAddModalOpen}
          onClose={() => { setAddModalOpen(false); setModalInitialData(null); }}
          onSave={handleSaveReminder}
          initialData={modalInitialData}
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

export default ReminderManager;