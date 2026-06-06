'use client'
import React, { useState, useMemo } from 'react';
import { useApp } from '../../components/AppStateProvider';
import { Word } from '../../lib/types';

export function QuizPage() {
  const { words, addQuizResult } = useApp();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const quizWords: Word[] = useMemo(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!started) {
    return (
      <main data-testid="quiz-page">
        <h2>Quiz</h2>
        {words.length === 0
          ? <p data-testid="no-words-msg">No words available</p>
          : <button data-testid="begin-quiz-btn" onClick={() => { setStarted(true); setIndex(0); setScore(0); setDone(false); setFeedback(null); }}>Begin Quiz</button>
        }
      </main>
    );
  }

  if (done) {
    return (
      <main data-testid="quiz-page">
        <h2>Quiz Complete!</h2>
        <p data-testid="quiz-score">{score} / {quizWords.length}</p>
        <button data-testid="retake-quiz-btn" onClick={() => { setStarted(false); setDone(false); }}>Retake</button>
      </main>
    );
  }

  const current = quizWords[index];

  const handleSubmit = () => {
    const correct = answer.trim().toLowerCase() === current.term.toLowerCase();
    const newScore = correct ? score + 1 : score;
    setFeedback(correct ? 'Correct!' : `Incorrect. Answer: ${current.term}`);
    if (index + 1 >= quizWords.length) {
      addQuizResult(newScore, quizWords.length);
      setScore(newScore);
      setTimeout(() => setDone(true), 0);
    } else {
      setScore(newScore);
      setTimeout(() => { setIndex(i => i + 1); setAnswer(''); setFeedback(null); }, 0);
    }
  };

  return (
    <main data-testid="quiz-page">
      <p data-testid="quiz-progress">{index + 1} / {quizWords.length}</p>
      <p data-testid="quiz-definition">{current.definition}</p>
      <input data-testid="quiz-answer-input" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Your answer" />
      <button data-testid="submit-answer-btn" onClick={handleSubmit}>Submit</button>
      {feedback && <p data-testid="quiz-feedback">{feedback}</p>}
    </main>
  );
}
