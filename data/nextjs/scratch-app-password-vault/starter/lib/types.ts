export interface Credential {
  id: string;
  site: string;
  username: string;
  password: string;
  url: string;
  category: string;
  notes: string;
  createdAt: string;
}

export interface VaultSettings {
  autoLockMinutes: number;
  requireSymbols: boolean;
}
