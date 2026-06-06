import type { Experiment, Equipment, LabResult, ExperimentStatus, EquipmentStatus } from "./types";

let experiments: Experiment[] = [
  { id: "ex1", title: "Photosynthesis Rate", hypothesis: "More light increases O2 production", subject: "Biology", status: "running", startDate: "2024-03-01", endDate: "2024-03-15", observations: "Plants near window grew faster", conclusion: "" },
  { id: "ex2", title: "Acid-Base Reactions", hypothesis: "Vinegar and baking soda produce CO2", subject: "Chemistry", status: "completed", startDate: "2024-02-15", endDate: "2024-02-20", observations: "Vigorous bubbling observed", conclusion: "Hypothesis confirmed" },
  { id: "ex3", title: "Pendulum Period", hypothesis: "Longer pendulum has longer period", subject: "Physics", status: "planned", startDate: "2024-04-01", endDate: "2024-04-10", observations: "", conclusion: "" },
];

let equipment: Equipment[] = [
  { id: "eq1", name: "Microscope", category: "Optics", quantity: 5, status: "available", location: "Lab A" },
  { id: "eq2", name: "Bunsen Burner", category: "Heating", quantity: 8, status: "in-use", location: "Lab B" },
  { id: "eq3", name: "pH Meter", category: "Measurement", quantity: 3, status: "available", location: "Lab A" },
  { id: "eq4", name: "Centrifuge", category: "Separation", quantity: 2, status: "maintenance", location: "Storage" },
];

let results: LabResult[] = [
  { id: "res1", experimentId: "ex1", experimentTitle: "Photosynthesis Rate", measurement: "O2 production", value: 2.4, unit: "mL/min", recordedAt: "2024-03-05" },
  { id: "res2", experimentId: "ex2", experimentTitle: "Acid-Base Reactions", measurement: "CO2 volume", value: 150, unit: "mL", recordedAt: "2024-02-17" },
];

let nextId = 100;

export function getExperiments(): Experiment[] { return [...experiments]; }
export function getEquipment(): Equipment[] { return [...equipment]; }
export function getResults(): LabResult[] { return [...results]; }
export function getExperimentResults(experimentId: string): LabResult[] { return results.filter(r => r.experimentId === experimentId); }

export function addExperiment(data: Omit<Experiment, "id">): Experiment {
  const e: Experiment = { ...data, id: `ex${nextId++}` };
  experiments.push(e);
  return e;
}

export function updateExperimentStatus(id: string, status: ExperimentStatus): Experiment | null {
  const e = experiments.find(x => x.id === id);
  if (!e) return null;
  e.status = status;
  return { ...e };
}

export function addEquipment(data: Omit<Equipment, "id">): Equipment {
  const eq: Equipment = { ...data, id: `eq${nextId++}` };
  equipment.push(eq);
  return eq;
}

export function updateEquipmentStatus(id: string, status: EquipmentStatus): Equipment | null {
  const eq = equipment.find(x => x.id === id);
  if (!eq) return null;
  eq.status = status;
  return { ...eq };
}

export function addResult(data: Omit<LabResult, "id">): LabResult {
  const r: LabResult = { ...data, id: `res${nextId++}` };
  results.push(r);
  return r;
}

export function deleteResult(id: string): boolean {
  const before = results.length;
  results = results.filter(r => r.id !== id);
  return results.length < before;
}

export function __reset(): void {
  experiments = [
    { id: "ex1", title: "Photosynthesis Rate", hypothesis: "More light increases O2 production", subject: "Biology", status: "running", startDate: "2024-03-01", endDate: "2024-03-15", observations: "Plants near window grew faster", conclusion: "" },
    { id: "ex2", title: "Acid-Base Reactions", hypothesis: "Vinegar and baking soda produce CO2", subject: "Chemistry", status: "completed", startDate: "2024-02-15", endDate: "2024-02-20", observations: "Vigorous bubbling observed", conclusion: "Hypothesis confirmed" },
    { id: "ex3", title: "Pendulum Period", hypothesis: "Longer pendulum has longer period", subject: "Physics", status: "planned", startDate: "2024-04-01", endDate: "2024-04-10", observations: "", conclusion: "" },
  ];
  equipment = [
    { id: "eq1", name: "Microscope", category: "Optics", quantity: 5, status: "available", location: "Lab A" },
    { id: "eq2", name: "Bunsen Burner", category: "Heating", quantity: 8, status: "in-use", location: "Lab B" },
    { id: "eq3", name: "pH Meter", category: "Measurement", quantity: 3, status: "available", location: "Lab A" },
    { id: "eq4", name: "Centrifuge", category: "Separation", quantity: 2, status: "maintenance", location: "Storage" },
  ];
  results = [
    { id: "res1", experimentId: "ex1", experimentTitle: "Photosynthesis Rate", measurement: "O2 production", value: 2.4, unit: "mL/min", recordedAt: "2024-03-05" },
    { id: "res2", experimentId: "ex2", experimentTitle: "Acid-Base Reactions", measurement: "CO2 volume", value: 150, unit: "mL", recordedAt: "2024-02-17" },
  ];
  nextId = 100;
}
