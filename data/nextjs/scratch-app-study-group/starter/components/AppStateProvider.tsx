import React, { createContext, useContext, useState } from "react";
import type { Route, StudyGroup, Member, GroupSession } from "../lib/types";

interface AppContextValue {
  route: Route;
  setRoute: (r: Route) => void;
  groups: StudyGroup[];
  setGroups: (g: StudyGroup[]) => void;
  members: Member[];
  setMembers: (m: Member[]) => void;
  sessions: GroupSession[];
  setSessions: (s: GroupSession[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "home",
  setRoute: () => {},
  groups: [],
  setGroups: () => {},
  members: [],
  setMembers: () => {},
  sessions: [],
  setSessions: () => {},
});

export function useApp(): AppContextValue { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("home");
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [sessions, setSessions] = useState<GroupSession[]>([]);
  return (
    <AppContext.Provider value={{ route, setRoute, groups, setGroups, members, setMembers, sessions, setSessions }}>
      {children}
    </AppContext.Provider>
  );
}
