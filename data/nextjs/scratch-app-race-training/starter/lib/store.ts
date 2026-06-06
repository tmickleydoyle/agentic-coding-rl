import { Run } from "./types";

export function __reset(): void {}
export function getRuns(): Run[] { return []; }
export function addRun(_type: Run["type"], _distance: number, _date: string): Run | null { return null; }
export function deleteRun(_id: string): void {}
export function toggleRun(_id: string): void {}
