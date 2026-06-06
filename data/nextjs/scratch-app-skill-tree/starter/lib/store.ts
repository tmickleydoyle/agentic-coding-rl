import type { Skill, Path, LearnerProgress, SkillStatus } from './types';
export let skills: Skill[] = [];
export const paths: Path[] = [];
export let progress: LearnerProgress[] = [];
export function updateSkillStatus(_skillId: number, _status: SkillStatus): LearnerProgress | null { return null; }
export function __reset(): void { progress = []; }
