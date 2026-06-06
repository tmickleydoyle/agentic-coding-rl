import React, { createContext, useContext, useState } from "react";
import type { Route, Partner, VocabWord, Session } from "../lib/types";
import { getPartners, getVocabWords, getSessions } from "../lib/store";

interface AppContextValue {
  route: Route;
  setRoute: (r: Route) => void;
  partners: Partner[];
  setPartners: (p: Partner[]) => void;
  vocabWords: VocabWord[];
  setVocabWords: (v: VocabWord[]) => void;
  sessions: Session[];
  setSessions: (s: Session[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  setRoute: () => {},
  partners: [],
  setPartners: () => {},
  vocabWords: [],
  setVocabWords: () => {},
  sessions: [],
  setSessions: () => {},
});

export function useApp(): AppContextValue {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [partners, setPartners] = useState<Partner[]>(getPartners());
  const [vocabWords, setVocabWords] = useState<VocabWord[]>(getVocabWords());
  const [sessions, setSessions] = useState<Session[]>(getSessions());

  return (
    <AppContext.Provider value={{ route, setRoute, partners, setPartners, vocabWords, setVocabWords, sessions, setSessions }}>
      {children}
    </AppContext.Provider>
  );
}
