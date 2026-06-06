import type { Policy, Department, PolicyStatus } from "./types";

export function getPolicies(): Policy[] {
  return [];
}

export function getPolicy(_id: string): Policy | undefined {
  return undefined;
}

export function addPolicy(_data: {
  title: string; department: Department; version: string;
  status: PolicyStatus; owner: string; reviewDate: string; summary: string;
}): Policy {
  throw new Error("Not implemented");
}

export function __reset(): void {}
