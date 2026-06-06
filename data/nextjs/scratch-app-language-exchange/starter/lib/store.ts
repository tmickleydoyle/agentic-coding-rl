import type { Partner, VocabWord, Session, Language } from "./types";

export function getPartners(): Partner[] { return []; }
export function getVocabWords(): VocabWord[] { return []; }
export function getSessions(): Session[] { return []; }
export function addPartner(_data: Omit<Partner, "id">): Partner { throw new Error("Not implemented"); }
export function addVocabWord(_data: Omit<VocabWord, "id">): VocabWord { throw new Error("Not implemented"); }
export function toggleMastered(_id: string): VocabWord | null { return null; }
export function addSession(_data: Omit<Session, "id">): Session { throw new Error("Not implemented"); }
export function deleteSession(_id: string): boolean { return false; }
export function filterPartnersByLanguage(_lang: Language): Partner[] { return []; }
export function __reset(): void {}
