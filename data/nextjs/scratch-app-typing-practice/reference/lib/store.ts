import { Score } from './types';

export const TEXTS = [
  'The quick brown fox jumps over the lazy dog',
  'Pack my box with five dozen liquor jugs',
  'How vexingly quick daft zebras jump',
];

let scores: Score[] = [
  { id: 'sc1', name: 'Alice', wpm: 72, accuracy: 98, date: '2024-01-10' },
  { id: 'sc2', name: 'Bob', wpm: 55, accuracy: 94, date: '2024-01-11' },
];

let nextId = 3;

export function getScores(): Score[] {
  return [...scores].sort((a, b) => b.wpm - a.wpm);
}

export function addScore(name: string, wpm: number, accuracy: number, date: string): Score {
  const score: Score = { id: `sc${nextId++}`, name, wpm, accuracy, date };
  scores.push(score);
  return score;
}

export function __reset(): void {
  scores = [
    { id: 'sc1', name: 'Alice', wpm: 72, accuracy: 98, date: '2024-01-10' },
    { id: 'sc2', name: 'Bob', wpm: 55, accuracy: 94, date: '2024-01-11' },
  ];
  nextId = 3;
}
