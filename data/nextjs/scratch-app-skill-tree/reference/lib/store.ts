import type { Skill, Path, LearnerProgress, SkillStatus } from './types';

export let skills: Skill[] = [
  { id: 1, name: 'HTML Basics', category: 'Frontend', level: 1, prerequisites: [] },
  { id: 2, name: 'CSS Styling', category: 'Frontend', level: 1, prerequisites: [] },
  { id: 3, name: 'JavaScript Fundamentals', category: 'Frontend', level: 2, prerequisites: [1] },
  { id: 4, name: 'React', category: 'Frontend', level: 3, prerequisites: [3] },
  { id: 5, name: 'Node.js', category: 'Backend', level: 2, prerequisites: [3] },
  { id: 6, name: 'Databases', category: 'Backend', level: 2, prerequisites: [] },
];

export const paths: Path[] = [
  { id: 1, name: 'Frontend Developer', skillIds: [1, 2, 3, 4] },
  { id: 2, name: 'Full Stack Developer', skillIds: [1, 2, 3, 4, 5, 6] },
];

export let progress: LearnerProgress[] = [
  { skillId: 1, status: 'completed' },
  { skillId: 2, status: 'completed' },
  { skillId: 3, status: 'in_progress' },
  { skillId: 4, status: 'locked' },
  { skillId: 5, status: 'locked' },
  { skillId: 6, status: 'available' },
];

export function updateSkillStatus(skillId: number, status: SkillStatus): LearnerProgress | null {
  const entry = progress.find((p) => p.skillId === skillId);
  if (!entry) return null;
  entry.status = status;

  if (status === 'completed') {
    // unlock dependent skills
    skills.forEach((s) => {
      if (s.prerequisites.includes(skillId)) {
        const allDone = s.prerequisites.every((pid) => {
          const dep = progress.find((p) => p.skillId === pid);
          return dep && dep.status === 'completed';
        });
        if (allDone) {
          const depEntry = progress.find((p) => p.skillId === s.id);
          if (depEntry && depEntry.status === 'locked') depEntry.status = 'available';
        }
      }
    });
  }
  return entry;
}

export function __reset(): void {
  progress = [
    { skillId: 1, status: 'completed' },
    { skillId: 2, status: 'completed' },
    { skillId: 3, status: 'in_progress' },
    { skillId: 4, status: 'locked' },
    { skillId: 5, status: 'locked' },
    { skillId: 6, status: 'available' },
  ];
}
