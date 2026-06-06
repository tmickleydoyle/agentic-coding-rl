import { Word, QuizResult } from './types';

let words: Word[] = [
  { id: 'w1', term: 'Ephemeral', definition: 'Lasting for a very short time', category: 'adjective' },
  { id: 'w2', term: 'Ubiquitous', definition: 'Present everywhere', category: 'adjective' },
  { id: 'w3', term: 'Loquacious', definition: 'Tending to talk a great deal', category: 'adjective' },
  { id: 'w4', term: 'Pensive', definition: 'Engaged in deep thought', category: 'adjective' },
  { id: 'w5', term: 'Serene', definition: 'Calm and peaceful', category: 'adjective' },
];

let results: QuizResult[] = [];
let nextWordId = 6;
let nextResultId = 1;

export function getWords(): Word[] { return words; }

export function addWord(term: string, definition: string, category: string): Word {
  if (!term.trim() || !definition.trim()) throw new Error('Term and definition required');
  if (words.find(w => w.term.toLowerCase() === term.toLowerCase())) throw new Error('Duplicate term');
  const word: Word = { id: `w${nextWordId++}`, term: term.trim(), definition: definition.trim(), category };
  words.push(word);
  return word;
}

export function deleteWord(id: string): void {
  words = words.filter(w => w.id !== id);
}

export function getResults(): QuizResult[] { return results; }

export function addResult(score: number, total: number): QuizResult {
  const result: QuizResult = { id: `r${nextResultId++}`, date: new Date().toISOString().split('T')[0], score, total };
  results.push(result);
  return result;
}

export function __reset(): void {
  words = [
    { id: 'w1', term: 'Ephemeral', definition: 'Lasting for a very short time', category: 'adjective' },
    { id: 'w2', term: 'Ubiquitous', definition: 'Present everywhere', category: 'adjective' },
    { id: 'w3', term: 'Loquacious', definition: 'Tending to talk a great deal', category: 'adjective' },
    { id: 'w4', term: 'Pensive', definition: 'Engaged in deep thought', category: 'adjective' },
    { id: 'w5', term: 'Serene', definition: 'Calm and peaceful', category: 'adjective' },
  ];
  results = [];
  nextWordId = 6;
  nextResultId = 1;
}
