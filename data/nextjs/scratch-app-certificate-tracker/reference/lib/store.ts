import type { Skill, Certificate } from './types';

export let skills: Skill[] = [
  { id: 1, name: 'JavaScript', category: 'Programming', requiredHours: 40 },
  { id: 2, name: 'Python', category: 'Programming', requiredHours: 40 },
  { id: 3, name: 'Public Speaking', category: 'Soft Skills', requiredHours: 20 },
  { id: 4, name: 'Data Analysis', category: 'Analytics', requiredHours: 60 },
];

export let certificates: Certificate[] = [
  { id: 1, skillId: 1, recipientName: 'Alice Johnson', issuedDate: '2024-01-10', hoursCompleted: 45 },
  { id: 2, skillId: 3, recipientName: 'Bob Martinez', issuedDate: '2024-01-12', hoursCompleted: 22 },
];

let nextSkillId = 5;
let nextCertId = 3;

export function addSkill(name: string, category: string, requiredHours: number): Skill {
  const skill: Skill = { id: nextSkillId++, name, category, requiredHours };
  skills.push(skill);
  return skill;
}

export function deleteSkill(id: number): 'ok' | 'not_found' | 'has_certificates' {
  const hasCerts = certificates.some((c) => c.skillId === id);
  if (hasCerts) return 'has_certificates';
  const idx = skills.findIndex((s) => s.id === id);
  if (idx === -1) return 'not_found';
  skills.splice(idx, 1);
  return 'ok';
}

export function issueCertificate(skillId: number, recipientName: string, issuedDate: string, hoursCompleted: number): Certificate | null {
  const skill = skills.find((s) => s.id === skillId);
  if (!skill || hoursCompleted < skill.requiredHours) return null;
  const cert: Certificate = { id: nextCertId++, skillId, recipientName, issuedDate, hoursCompleted };
  certificates.push(cert);
  return cert;
}

export function __reset(): void {
  skills = [
    { id: 1, name: 'JavaScript', category: 'Programming', requiredHours: 40 },
    { id: 2, name: 'Python', category: 'Programming', requiredHours: 40 },
    { id: 3, name: 'Public Speaking', category: 'Soft Skills', requiredHours: 20 },
    { id: 4, name: 'Data Analysis', category: 'Analytics', requiredHours: 60 },
  ];
  certificates = [
    { id: 1, skillId: 1, recipientName: 'Alice Johnson', issuedDate: '2024-01-10', hoursCompleted: 45 },
    { id: 2, skillId: 3, recipientName: 'Bob Martinez', issuedDate: '2024-01-12', hoursCompleted: 22 },
  ];
  nextSkillId = 5;
  nextCertId = 3;
}
