import type { Skill, Certificate } from './types';
export let skills: Skill[] = [];
export let certificates: Certificate[] = [];
export function addSkill(_n: string, _c: string, _h: number): Skill { return { id: 0, name: '', category: '', requiredHours: 0 }; }
export function deleteSkill(_id: number): 'ok' | 'not_found' | 'has_certificates' { return 'not_found'; }
export function issueCertificate(_sId: number, _rN: string, _iD: string, _hC: number): Certificate | null { return null; }
export function __reset(): void { skills = []; certificates = []; }
