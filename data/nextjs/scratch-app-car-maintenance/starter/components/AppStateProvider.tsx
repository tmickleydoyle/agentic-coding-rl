'use client';
import React, { createContext, useContext } from 'react';
import type { Vehicle, ServiceRecord, Reminder, Route } from '../lib/types';
interface AppContextValue { route: Route; navigate: (r: Route) => void; vehicles: Vehicle[]; setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>; serviceRecords: ServiceRecord[]; setServiceRecords: React.Dispatch<React.SetStateAction<ServiceRecord[]>>; reminders: Reminder[]; setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>; }
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, vehicles: [], setVehicles: () => {}, serviceRecords: [], setServiceRecords: () => {}, reminders: [], setReminders: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', navigate: () => {}, vehicles: [], setVehicles: () => {}, serviceRecords: [], setServiceRecords: () => {}, reminders: [], setReminders: () => {} }}>{children}</AppContext.Provider>;
}
