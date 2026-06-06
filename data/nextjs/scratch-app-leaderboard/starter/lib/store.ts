import { Score } from './types';

export function getScores(): Score[] { return []; }
export function getScore(_id: string): Score | undefined { return undefined; }
export function submitScore(_data: { player: string; game: string; score: number }): Score {
  return { id: '', player: '', game: 'Chess', score: 0, submittedAt: '' };
}
export function __reset() {}
