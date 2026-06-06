import { Asset, Liability, Snapshot } from "./types";
export function getAssets(): Asset[] { return []; }
export function getLiabilities(): Liability[] { return []; }
export function getSnapshots(): Snapshot[] { return []; }
export function addAsset(_a: Asset): void {}
export function deleteAsset(_id: string): void {}
export function addLiability(_l: Liability): void {}
export function deleteLiability(_id: string): void {}
export function addSnapshot(_s: Snapshot): void {}
export function __reset(): void {}
