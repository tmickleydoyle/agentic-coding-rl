import type { Allergy, ReactionLog, Severity, AllergyType } from "./types";

export function getAllergies(): Allergy[] { return []; }
export function getReactions(): ReactionLog[] { return []; }
export function addAllergy(_data: { name: string; type: AllergyType; severity: Severity; symptoms: string[]; notes: string }): Allergy { throw new Error("Not implemented"); }
export function deleteAllergy(_id: string): boolean { return false; }
export function logReaction(_data: { allergyId: string; date: string; symptoms: string[]; severity: Severity; treatment: string }): ReactionLog | null { return null; }
export function getTriggerCounts(): Record<string, number> { return {}; }
export function __reset(): void {}
