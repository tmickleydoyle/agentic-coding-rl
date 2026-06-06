import { Credential, VaultSettings } from "./types";

export function __reset(): void {}
export function getCredentials(): Credential[] { return []; }
export function addCredential(_data: Omit<Credential, "id">): Credential { return {} as Credential; }
export function removeCredential(_id: string): boolean { return false; }
export function getWeakCredentials(): Credential[] { return []; }
export function getSettings(): VaultSettings { return { autoLockMinutes: 5, requireSymbols: true }; }
export function updateSettings(_data: Partial<VaultSettings>): VaultSettings { return { autoLockMinutes: 5, requireSymbols: true }; }
export function generatePassword(_length: number, _useSymbols: boolean): string { return ""; }
