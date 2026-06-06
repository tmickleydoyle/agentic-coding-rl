"use client";
import React, { useState } from "react";

type Difficulty = "Easy" | "Medium" | "Hard";
type Category = "Behavioral" | "Technical" | "System Design";
type Result = "Correct" | "Incorrect" | null;

interface Question {
  id: number;
  category: Category;
  question: string;
  answer: string;
  difficulty: Difficulty;
}

interface PracticeState {
  shown: boolean;
  result: Result;
}

const SEED_QUESTIONS: Question[] = [
  { id: 1, category: "Behavioral", question: "Tell me about yourself", answer: "Focus on your journey, skills, and goals", difficulty: "Easy" },
  { id: 2, category: "Technical", question: "What is a closure in JavaScript?", answer: "A function that retains access to its outer scope", difficulty: "Medium" },
  { id: 3, category: "Behavioral", question: "Describe a challenge you overcame", answer: "Use STAR method: Situation, Task, Action, Result", difficulty: "Easy" },
  { id: 4, category: "Technical", question: "Explain the event loop", answer: "JS runtime uses a call stack and task queue", difficulty: "Hard" },
  { id: 5, category: "System Design", question: "Design a URL shortener", answer: "Hash URL, store mapping, handle collisions", difficulty: "Hard" },
];

const CATEGORIES: Category[] = ["Behavioral", "Technical", "System Design"];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(SEED_QUESTIONS);
  const [nextId, setNextId] = useState(6);
  const [practice, setPractice] = useState<Record<number, PracticeState>>({});
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formCategory, setFormCategory] = useState<Category>("Behavioral");
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>("Easy");

  const filtered = questions.filter((q) => {
    const mc = categoryFilter === "All" || q.category === categoryFilter;
    const md = difficultyFilter === "All" || q.difficulty === difficultyFilter;
    return mc && md;
  });

  const practiced = Object.values(practice).filter((p) => p.result !== null).length;
  const correct = Object.values(practice).filter((p) => p.result === "Correct").length;

  function toggleAnswer(id: number) {
    setPractice((prev) => ({
      ...prev,
      [id]: { shown: !prev[id]?.shown, result: prev[id]?.result ?? null },
    }));
  }

  function markResult(id: number, result: Result) {
    setPractice((prev) => ({
      ...prev,
      [id]: { shown: prev[id]?.shown ?? false, result },
    }));
  }

  function handleAdd() {
    if (!formQuestion.trim() || !formAnswer.trim()) return;
    setQuestions([...questions, { id: nextId, category: formCategory, question: formQuestion.trim(), answer: formAnswer.trim(), difficulty: formDifficulty }]);
    setNextId(nextId + 1);
    setFormQuestion(""); setFormAnswer("");
  }

  function handleReset() {
    setPractice({});
  }

  return (
    <div>
      <h1>Interview Prep</h1>
      <div>
        <span data-testid="stat-total">{questions.length}</span>
        <span data-testid="stat-practiced">{practiced}</span>
        <span data-testid="stat-correct">{correct}</span>
      </div>

      <div>
        <select data-testid="category-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select data-testid="difficulty-filter" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
          <option value="All">All</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <button data-testid="reset-btn" onClick={handleReset}>Reset All</button>

      {filtered.map((q) => {
        const state = practice[q.id] ?? { shown: false, result: null };
        return (
          <div key={q.id} data-testid={`question-card-${q.id}`}>
            <p>{q.category}</p>
            <p>{q.difficulty}</p>
            <p>{q.question}</p>
            <button data-testid={`show-answer-${q.id}`} onClick={() => toggleAnswer(q.id)}>
              {state.shown ? "Hide Answer" : "Show Answer"}
            </button>
            {state.shown && (
              <div>
                <p data-testid={`answer-${q.id}`}>{q.answer}</p>
                <button data-testid={`mark-correct-${q.id}`} onClick={() => markResult(q.id, "Correct")}>Mark Correct</button>
                <button data-testid={`mark-incorrect-${q.id}`} onClick={() => markResult(q.id, "Incorrect")}>Mark Incorrect</button>
              </div>
            )}
            {state.result !== null && (
              <span data-testid={`result-${q.id}`}>{state.result}</span>
            )}
          </div>
        );
      })}

      <div>
        <input data-testid="input-question" type="text" placeholder="Question" value={formQuestion} onChange={(e) => setFormQuestion(e.target.value)} />
        <input data-testid="input-answer" type="text" placeholder="Answer" value={formAnswer} onChange={(e) => setFormAnswer(e.target.value)} />
        <select data-testid="input-category" value={formCategory} onChange={(e) => setFormCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select data-testid="input-difficulty" value={formDifficulty} onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button data-testid="add-question-btn" onClick={handleAdd}>Add Question</button>
      </div>
    </div>
  );
}
