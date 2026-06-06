'use client';
import React, { createContext, useContext } from 'react';
import type { Pet, Visit, Medication, Route } from '../lib/types';
interface AppContextValue {
  route: Route; navigate: (r: Route) => void;
  pets: Pet[]; setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  visits: Visit[]; setVisits: React.Dispatch<React.SetStateAction<Visit[]>>;
  medications: Medication[]; setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
}
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, pets: [], setPets: () => {}, visits: [], setVisits: () => {}, medications: [], setMedications: () => {} });
export function useApp() { return useContext(AppContext); }
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <AppContext.Provider value={{ route: 'home', navigate: () => {}, pets: [], setPets: () => {}, visits: [], setVisits: () => {}, medications: [], setMedications: () => {} }}>{children}</AppContext.Provider>;
}
