import { Injury, Treatment, RecoveryNote } from "./types";

const SEED: Injury[] = [
  {
    id: "i1",
    bodyPart: "Left Knee",
    type: "strain",
    severity: "moderate",
    date: "2024-03-10",
    treatments: [{ id: "t1", type: "ice", date: "2024-03-10", duration: 20 }],
    notes: [],
  },
  {
    id: "i2",
    bodyPart: "Right Shoulder",
    type: "sprain",
    severity: "mild",
    date: "2024-03-15",
    treatments: [],
    notes: [{ id: "n1", text: "Feeling better after rest", date: "2024-03-17" }],
  },
];

let injuries: Injury[] = SEED.map((i) => ({ ...i, treatments: i.treatments.map((t) => ({ ...t })), notes: i.notes.map((n) => ({ ...n })) }));
let iCounter = 3;
let tCounter = 2;
let nCounter = 2;

export function __reset() {
  injuries = SEED.map((i) => ({ ...i, treatments: i.treatments.map((t) => ({ ...t })), notes: i.notes.map((n) => ({ ...n })) }));
  iCounter = 3;
  tCounter = 2;
  nCounter = 2;
}

export function getInjuries(): Injury[] {
  return injuries;
}

export function addInjury(bodyPart: string, type: Injury["type"], severity: Injury["severity"], date: string): Injury | null {
  if (!bodyPart.trim()) return null;
  const i: Injury = { id: `i${iCounter++}`, bodyPart: bodyPart.trim(), type, severity, date, treatments: [], notes: [] };
  injuries.push(i);
  return i;
}

export function deleteInjury(id: string): void {
  injuries = injuries.filter((i) => i.id !== id);
}

export function addTreatment(injuryId: string, type: Treatment["type"], date: string, duration: number): Treatment | null {
  if (duration <= 0) return null;
  const inj = injuries.find((i) => i.id === injuryId);
  if (!inj) return null;
  const t: Treatment = { id: `t${tCounter++}`, type, date, duration };
  inj.treatments.push(t);
  return t;
}

export function addNote(injuryId: string, text: string, date: string): RecoveryNote | null {
  if (!text.trim()) return null;
  const inj = injuries.find((i) => i.id === injuryId);
  if (!inj) return null;
  const n: RecoveryNote = { id: `n${nCounter++}`, text: text.trim(), date };
  inj.notes.push(n);
  return n;
}
