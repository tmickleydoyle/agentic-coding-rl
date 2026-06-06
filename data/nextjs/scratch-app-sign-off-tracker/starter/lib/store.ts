import type { SignOffItem } from "./types";

export function getItems(): SignOffItem[] {
  return [];
}

export function getItem(_id: string): SignOffItem | undefined {
  return undefined;
}

export function addItem(_data: { title: string; signers: string[]; dueDate: string }): SignOffItem {
  throw new Error("Not implemented");
}

export function signItem(_id: string, _signer: string): SignOffItem | undefined {
  return undefined;
}

export function __reset(): void {}
