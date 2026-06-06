'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Pet, Visit, Medication, Route } from '../lib/types';

interface AppContextValue {
  route: Route; navigate: (r: Route) => void;
  pets: Pet[]; setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  visits: Visit[]; setVisits: React.Dispatch<React.SetStateAction<Visit[]>>;
  medications: Medication[]; setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
}

const AppContext = createContext<AppContextValue>({
  route: 'home', navigate: () => {},
  pets: [], setPets: () => {},
  visits: [], setVisits: () => {},
  medications: [], setMedications: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [pets, setPets] = useState<Pet[]>([
    { id: 'pt1', name: 'Buddy', species: 'dog', birthDate: '2019-05-01', weight: 12 },
    { id: 'pt2', name: 'Whiskers', species: 'cat', birthDate: '2021-03-15', weight: 4 },
  ]);
  const [visits, setVisits] = useState<Visit[]>([
    { id: 'v1', petId: 'pt1', vetName: 'Dr. Smith', date: '2025-11-10', reason: 'Checkup', notes: 'Healthy' },
  ]);
  const [medications, setMedications] = useState<Medication[]>([
    { id: 'm1', petId: 'pt1', name: 'Heartgard', dosage: '1 tablet', frequency: 'monthly', active: true },
    { id: 'm2', petId: 'pt2', name: 'Flea Treatment', dosage: '0.5ml', frequency: 'monthly', active: false },
  ]);
  const navigate = useCallback((r: Route) => setRoute(r), []);
  return (
    <AppContext.Provider value={{ route, navigate, pets, setPets, visits, setVisits, medications, setMedications }}>
      {children}
    </AppContext.Provider>
  );
}
