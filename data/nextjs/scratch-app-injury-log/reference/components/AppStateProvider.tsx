import React, { createContext, useContext, useState } from "react";
import { Injury, InjuryType, Severity, Treatment, TreatmentType, RecoveryNote, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  injuries: Injury[];
  activeInjuryId: string | null;
  setActiveInjuryId: (id: string | null) => void;
  addInjury: (bodyPart: string, type: InjuryType, severity: Severity, date: string) => void;
  deleteInjury: (id: string) => void;
  addTreatment: (injuryId: string, type: TreatmentType, date: string, duration: number) => void;
  addNote: (injuryId: string, text: string, date: string) => void;
}

const Ctx = createContext<AppCtx>({
  route: "injuries",
  setRoute: () => {},
  injuries: [],
  activeInjuryId: null,
  setActiveInjuryId: () => {},
  addInjury: () => {},
  deleteInjury: () => {},
  addTreatment: () => {},
  addNote: () => {},
});

export function useApp() {
  return useContext(Ctx);
}

const SEED: Injury[] = [
  { id: "i1", bodyPart: "Left Knee", type: "strain", severity: "moderate", date: "2024-03-10", treatments: [{ id: "t1", type: "ice", date: "2024-03-10", duration: 20 }], notes: [] },
  { id: "i2", bodyPart: "Right Shoulder", type: "sprain", severity: "mild", date: "2024-03-15", treatments: [], notes: [{ id: "n1", text: "Feeling better after rest", date: "2024-03-17" }] },
];

let uid_i = 3;
let uid_t = 2;
let uid_n = 2;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("injuries");
  const [injuries, setInjuries] = useState<Injury[]>(SEED.map((i) => ({ ...i, treatments: i.treatments.map((t) => ({ ...t })), notes: i.notes.map((n) => ({ ...n })) })));
  const [activeInjuryId, setActiveInjuryId] = useState<string | null>(null);

  function addInjury(bodyPart: string, type: InjuryType, severity: Severity, date: string) {
    if (!bodyPart.trim()) return;
    const i: Injury = { id: `i${uid_i++}`, bodyPart: bodyPart.trim(), type, severity, date, treatments: [], notes: [] };
    setInjuries((prev) => [...prev, i]);
  }

  function deleteInjury(id: string) {
    setInjuries((prev) => prev.filter((i) => i.id !== id));
    setActiveInjuryId((prev) => (prev === id ? null : prev));
  }

  function addTreatment(injuryId: string, type: TreatmentType, date: string, duration: number) {
    if (duration <= 0) return;
    const t: Treatment = { id: `t${uid_t++}`, type, date, duration };
    setInjuries((prev) => prev.map((i) => i.id === injuryId ? { ...i, treatments: [...i.treatments, t] } : i));
  }

  function addNote(injuryId: string, text: string, date: string) {
    if (!text.trim()) return;
    const n: RecoveryNote = { id: `n${uid_n++}`, text: text.trim(), date };
    setInjuries((prev) => prev.map((i) => i.id === injuryId ? { ...i, notes: [...i.notes, n] } : i));
  }

  return (
    <Ctx.Provider value={{ route, setRoute, injuries, activeInjuryId, setActiveInjuryId, addInjury, deleteInjury, addTreatment, addNote }}>
      {children}
    </Ctx.Provider>
  );
}
