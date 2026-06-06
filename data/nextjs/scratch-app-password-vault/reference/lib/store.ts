import { Credential, VaultSettings } from "./types";

let credentials: Credential[] = [
  { id: "c1", site: "GitHub", username: "alice", password: "gh_secure_pass_2024!", url: "https://github.com", category: "dev", notes: "", createdAt: "2024-01-01" },
  { id: "c2", site: "Netflix", username: "alice@email.com", password: "short", url: "https://netflix.com", category: "entertainment", notes: "", createdAt: "2024-02-01" },
];

let settings: VaultSettings = { autoLockMinutes: 5, requireSymbols: true };

let nextCredId = 3;

export function __reset() {
  credentials = [
    { id: "c1", site: "GitHub", username: "alice", password: "gh_secure_pass_2024!", url: "https://github.com", category: "dev", notes: "", createdAt: "2024-01-01" },
    { id: "c2", site: "Netflix", username: "alice@email.com", password: "short", url: "https://netflix.com", category: "entertainment", notes: "", createdAt: "2024-02-01" },
  ];
  settings = { autoLockMinutes: 5, requireSymbols: true };
  nextCredId = 3;
}

export function getCredentials(): Credential[] { return credentials; }
export function addCredential(data: Omit<Credential, "id">): Credential {
  const c: Credential = { id: `c${nextCredId++}`, ...data };
  credentials.push(c);
  return c;
}
export function removeCredential(id: string): boolean {
  const idx = credentials.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  credentials.splice(idx, 1);
  return true;
}
export function getWeakCredentials(): Credential[] {
  return credentials.filter((c) => c.password.length < 12);
}
export function getSettings(): VaultSettings { return settings; }
export function updateSettings(data: Partial<VaultSettings>): VaultSettings {
  settings = { ...settings, ...data };
  return settings;
}
export function generatePassword(length: number, useSymbols: boolean): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const symbols = "!@#$%^&*()_+-=";
  const pool = useSymbols ? chars + symbols : chars;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += pool[Math.floor(Math.random() * pool.length)];
  }
  return result;
}
