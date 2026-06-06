import { Score } from './types';

export const TEXTS: string[] = [];
export function getScores(): Score[] { return []; }
export function addScore(_name: string, _wpm: number, _accuracy: number, _date: string): Score { throw new Error('Not implemented'); }
export function __reset(): void {}
