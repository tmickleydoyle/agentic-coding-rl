'use client'
import React, { useState, useMemo } from 'react';
import { useApp } from '../../components/AppStateProvider';

const TEXTS = [
  'The quick brown fox jumps over the lazy dog',
  'Pack my box with five dozen liquor jugs',
  'How vexingly quick daft zebras jump',
];

function calcWpm(typed: string, prompt: string, seconds: number): number {
  if (seconds <= 0) return 0;
  const promptWords = prompt.trim().split(' ');
  const typedWords = typed.trim().split(' ');
  let correct = 0;
  promptWords.forEach((w, i) => { if (typedWords[i] === w) correct++; });
  return Math.round(correct / (seconds / 60));
}

function calcAccuracy(typed: string, prompt: string): number {
  if (prompt.length === 0) return 0;
  let matches = 0;
  for (let i = 0; i < Math.min(typed.length, prompt.length); i++) {
    if (typed[i] === prompt[i]) matches++;
  }
  return Math.round((matches / prompt.length) * 1000) / 10;
}

export function PracticePage() {
  const { settings, addScore } = useApp();
  const prompt = useMemo(() => TEXTS[Math.floor(Math.random() * TEXTS.length)], []);
  const [typed, setTyped] = useState('');
  const [startTime] = useState(() => Date.now());
  const [result, setResult] = useState<{ wpm: number; accuracy: number } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!typed.trim()) { setError('Type something first'); return; }
    const elapsed = (Date.now() - startTime) / 1000;
    const wpm = calcWpm(typed, prompt, elapsed);
    const accuracy = calcAccuracy(typed, prompt);
    setResult({ wpm, accuracy });
    addScore(settings.name, wpm, accuracy, new Date().toISOString().split('T')[0]);
    setError('');
  };

  return (
    <main data-testid="practice-page">
      <h2>Practice</h2>
      <p data-testid="prompt-text">{prompt}</p>
      <textarea data-testid="typing-input" value={typed} onChange={e => setTyped(e.target.value)} rows={4} />
      <button data-testid="submit-typing-btn" onClick={handleSubmit}>Submit</button>
      {error && <span data-testid="practice-error">{error}</span>}
      {result && (
        <div data-testid="practice-result">
          <p data-testid="result-wpm">{result.wpm} WPM</p>
          <p data-testid="result-accuracy">{result.accuracy}% accuracy</p>
        </div>
      )}
    </main>
  );
}
