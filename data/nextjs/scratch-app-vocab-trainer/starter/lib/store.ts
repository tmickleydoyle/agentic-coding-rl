import { Word, QuizResult } from './types';

export function getWords(): Word[] { return []; }
export function addWord(_term: string, _definition: string, _category: string): Word { throw new Error('Not implemented'); }
export function deleteWord(_id: string): void {}
export function getResults(): QuizResult[] { return []; }
export function addResult(_score: number, _total: number): QuizResult { throw new Error('Not implemented'); }
export function __reset(): void {}
