import type { Experiment, Equipment, LabResult, ExperimentStatus, EquipmentStatus } from "./types";

export function getExperiments(): Experiment[] { return []; }
export function getEquipment(): Equipment[] { return []; }
export function getResults(): LabResult[] { return []; }
export function getExperimentResults(_experimentId: string): LabResult[] { return []; }
export function addExperiment(_data: Omit<Experiment, "id">): Experiment { throw new Error("Not implemented"); }
export function updateExperimentStatus(_id: string, _status: ExperimentStatus): Experiment | null { return null; }
export function addEquipment(_data: Omit<Equipment, "id">): Equipment { throw new Error("Not implemented"); }
export function updateEquipmentStatus(_id: string, _status: EquipmentStatus): Equipment | null { return null; }
export function addResult(_data: Omit<LabResult, "id">): LabResult { throw new Error("Not implemented"); }
export function deleteResult(_id: string): boolean { return false; }
export function __reset(): void {}
