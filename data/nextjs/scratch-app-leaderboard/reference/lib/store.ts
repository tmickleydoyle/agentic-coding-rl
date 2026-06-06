import { Score } from './types';

let scores: Score[] = [
  { id: 's1', player: 'alice', game: 'Chess', score: 1200, submittedAt: '2024-01-01T09:00:00Z' },
  { id: 's2', player: 'bob', game: 'Trivia', score: 850, submittedAt: '2024-01-01T10:00:00Z' },
  { id: 's3', player: 'alice', game: 'Chess', score: 1350, submittedAt: '2024-01-02T09:00:00Z' },
  { id: 's4', player: 'carol', game: 'Puzzle', score: 970, submittedAt: '2024-01-02T10:00:00Z' },
  { id: 's5', player: 'bob', game: 'Chess', score: 900, submittedAt: '2024-01-03T09:00:00Z' },
];

let nextNum = 6;

export function getScores(): Score[] {
  return [...scores].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function getScore(id: string): Score | undefined {
  return scores.find((s) => s.id === id);
}

export function submitScore(data: { player: string; game: string; score: number }): Score {
  const s: Score = {
    id: `s${nextNum++}`, player: data.player, game: data.game as Score['game'],
    score: data.score, submittedAt: new Date().toISOString(),
  };
  scores.push(s);
  return s;
}

export function __reset() {
  scores = [
    { id: 's1', player: 'alice', game: 'Chess', score: 1200, submittedAt: '2024-01-01T09:00:00Z' },
    { id: 's2', player: 'bob', game: 'Trivia', score: 850, submittedAt: '2024-01-01T10:00:00Z' },
    { id: 's3', player: 'alice', game: 'Chess', score: 1350, submittedAt: '2024-01-02T09:00:00Z' },
    { id: 's4', player: 'carol', game: 'Puzzle', score: 970, submittedAt: '2024-01-02T10:00:00Z' },
    { id: 's5', player: 'bob', game: 'Chess', score: 900, submittedAt: '2024-01-03T09:00:00Z' },
  ];
  nextNum = 6;
}
