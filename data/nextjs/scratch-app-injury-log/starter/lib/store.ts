import { Injury, Treatment, RecoveryNote } from "./types";

export function __reset(): void {}
export function getInjuries(): Injury[] { return []; }
export function addInjury(_bodyPart: string, _type: Injury["type"], _severity: Injury["severity"], _date: string): Injury | null { return null; }
export function deleteInjury(_id: string): void {}
export function addTreatment(_injuryId: string, _type: Treatment["type"], _date: string, _duration: number): Treatment | null { return null; }
export function addNote(_injuryId: string, _text: string, _date: string): RecoveryNote | null { return null; }
