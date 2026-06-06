import type { Allergy, ReactionLog, Severity, AllergyType } from "./types";

let allergies: Allergy[] = [
  { id: "1", name: "Peanuts", type: "food", severity: "severe", symptoms: ["hives", "anaphylaxis"], notes: "Carry EpiPen", createdAt: 1704067200000 },
  { id: "2", name: "Penicillin", type: "medication", severity: "moderate", symptoms: ["rash", "swelling"], notes: "Use alternatives", createdAt: 1704153600000 },
  { id: "3", name: "Pollen", type: "environmental", severity: "mild", symptoms: ["sneezing", "itchy eyes"], notes: "Seasonal", createdAt: 1704240000000 },
];
let reactions: ReactionLog[] = [
  { id: "1", allergyId: "1", allergyName: "Peanuts", date: "2024-01-10", symptoms: ["hives"], severity: "moderate", treatment: "Antihistamine", createdAt: 1704844800000 },
];
let nextAllergyId = 4;
let nextReactionId = 2;

export function getAllergies(): Allergy[] { return [...allergies]; }
export function getReactions(): ReactionLog[] { return [...reactions]; }

export function addAllergy(data: { name: string; type: AllergyType; severity: Severity; symptoms: string[]; notes: string }): Allergy {
  const allergy: Allergy = { id: String(nextAllergyId++), ...data, createdAt: Date.now() };
  allergies.push(allergy);
  return allergy;
}

export function deleteAllergy(id: string): boolean {
  const idx = allergies.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  allergies.splice(idx, 1);
  return true;
}

export function logReaction(data: { allergyId: string; date: string; symptoms: string[]; severity: Severity; treatment: string }): ReactionLog | null {
  const allergy = allergies.find((a) => a.id === data.allergyId);
  if (!allergy) return null;
  const reaction: ReactionLog = { id: String(nextReactionId++), allergyName: allergy.name, ...data, createdAt: Date.now() };
  reactions.push(reaction);
  return reaction;
}

export function getTriggerCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  reactions.forEach((r) => {
    counts[r.allergyName] = (counts[r.allergyName] || 0) + 1;
  });
  return counts;
}

export function __reset(): void {
  allergies = [
    { id: "1", name: "Peanuts", type: "food", severity: "severe", symptoms: ["hives", "anaphylaxis"], notes: "Carry EpiPen", createdAt: 1704067200000 },
    { id: "2", name: "Penicillin", type: "medication", severity: "moderate", symptoms: ["rash", "swelling"], notes: "Use alternatives", createdAt: 1704153600000 },
    { id: "3", name: "Pollen", type: "environmental", severity: "mild", symptoms: ["sneezing", "itchy eyes"], notes: "Seasonal", createdAt: 1704240000000 },
  ];
  reactions = [
    { id: "1", allergyId: "1", allergyName: "Peanuts", date: "2024-01-10", symptoms: ["hives"], severity: "moderate", treatment: "Antihistamine", createdAt: 1704844800000 },
  ];
  nextAllergyId = 4;
  nextReactionId = 2;
}
