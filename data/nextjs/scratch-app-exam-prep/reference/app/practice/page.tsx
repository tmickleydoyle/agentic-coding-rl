import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { getExamQuestions, addResult } from "../../lib/store";

export default function PracticePage() {
  const { exams, results, setResults } = useApp();
  const [selectedExamId, setSelectedExamId] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = selectedExamId ? getExamQuestions(selectedExamId) : [];

  function handleAnswer(qId: string, idx: number) {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: idx }));
  }

  function handleSubmit() {
    if (!selectedExamId || questions.length === 0) return;
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correctIndex) correct++; });
    const exam = exams.find(e => e.id === selectedExamId);
    const r = addResult({ examId: selectedExamId, examTitle: exam?.title || "", score: correct, total: questions.length, date: new Date().toISOString().slice(0, 10), timeMinutes: 0 });
    setResults([...results, r]);
    setScore(correct);
    setSubmitted(true);
  }

  function handleReset() {
    setSelectedExamId(""); setAnswers({}); setSubmitted(false); setScore(0);
  }

  return (
    <div data-testid="practice-page">
      <h2>Practice</h2>
      {!submitted ? (
        <>
          <select data-testid="select-exam" value={selectedExamId} onChange={e => { setSelectedExamId(e.target.value); setAnswers({}); }}>
            <option value="">Select exam</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
          <ul data-testid="question-list">
            {questions.map((q, qi) => (
              <li key={q.id} data-testid={`question-item-${q.id}`}>
                <div data-testid={`question-text-${q.id}`}>{qi + 1}. {q.text}</div>
                {q.options.map((opt, idx) => (
                  <label key={idx} data-testid={`option-${q.id}-${idx}`}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === idx}
                      onChange={() => handleAnswer(q.id, idx)}
                    />
                    {opt}
                  </label>
                ))}
              </li>
            ))}
          </ul>
          {questions.length > 0 && <button data-testid="btn-submit-practice" onClick={handleSubmit}>Submit</button>}
        </>
      ) : (
        <div data-testid="practice-result">
          <div data-testid="result-score">{score} / {questions.length}</div>
          <div data-testid="result-pct">{Math.round((score / questions.length) * 100)}%</div>
          <button data-testid="btn-reset-practice" onClick={handleReset}>Practice Again</button>
        </div>
      )}
    </div>
  );
}
