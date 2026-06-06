'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Vehicle, ServiceRecord, Reminder, Route } from '../lib/types';

interface AppContextValue {
  route: Route; navigate: (r: Route) => void;
  vehicles: Vehicle[]; setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  serviceRecords: ServiceRecord[]; setServiceRecords: React.Dispatch<React.SetStateAction<ServiceRecord[]>>;
  reminders: Reminder[]; setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', navigate: () => {},
  vehicles: [], setVehicles: () => {},
  serviceRecords: [], setServiceRecords: () => {},
  reminders: [], setReminders: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'v1', make: 'Toyota', model: 'Camry', year: 2018, mileage: 45000 },
    { id: 'v2', make: 'Honda', model: 'Civic', year: 2020, mileage: 28000 },
  ]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([
    { id: 's1', vehicleId: 'v1', serviceType: 'Oil Change', date: '2025-09-15', mileageAtService: 44500, cost: 45, notes: 'Synthetic 5W-30' },
    { id: 's2', vehicleId: 'v2', serviceType: 'Tire Rotation', date: '2025-09-20', mileageAtService: 27800, cost: 25, notes: '' },
  ]);
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 'r1', vehicleId: 'v1', title: 'Next Oil Change', dueDate: '2026-03-15', dueMileage: 49500, completed: false },
    { id: 'r2', vehicleId: 'v2', title: 'Brake Inspection', dueDate: '2025-06-01', dueMileage: 30000, completed: false },
  ]);
  const navigate = useCallback((r: Route) => setRoute(r), []);
  return (
    <AppContext.Provider value={{ route, navigate, vehicles, setVehicles, serviceRecords, setServiceRecords, reminders, setReminders }}>
      {children}
    </AppContext.Provider>
  );
}
