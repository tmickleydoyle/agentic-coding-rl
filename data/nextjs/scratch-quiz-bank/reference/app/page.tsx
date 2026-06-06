import React, { useState } from "react";

type Topic = "Math" | "Science" | "English" | "History";
type Difficulty = "Easy" | "Medium" | "Hard";

interface Question {
  id: number;
  question: string;
  topic: Topic;
  difficulty: Difficulty;
  answer: string;
  used: boolean;
  showAnswer: boolean;
}

const SEED_QUESTIONS: Question[] = [
  { id: 1, question: "What is the Pythagorean theorem?", topic: "Math", difficulty: "Easy", answer: "a² + b² = c²", used: false, showAnswer: false },
  { id: 2, question: "What is photosynthesis?", topic: "Science", difficulty: "Easy", answer: "Process by which plants convert sunlight to food.", used: true, showAnswer: false },
  { id: 3, question: "Who wrote Hamlet?", topic: "English", difficulty: "Medium", answer: "William Shakespeare", used: false, showAnswer: false },
  { id: 4, question: "What year did World War I begin?", topic: "History", difficulty: "Medium", answer: "1914", used: false, showAnswer: false },
];

const TOPICS: Topic[] = ["Math", "Science", "English", "History"];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(SEED_QUESTIONS);
  const [filterTopic, setFilterTopic] = useState<string>("All");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");
  const [qText, setQText] = useState("");
  const [topic, setTopic] = useState<Topic>("Math");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [answer, setAnswer] = useState("");

  const visible = questions.filter((q) => {
    if (filterTopic !== "All" && q.topic !== filterTopic) return false;
    if (filterDifficulty !== "All" && q.difficulty !== filterDifficulty) return false;
    return true;
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!qText.trim() || !answer.trim()) return;
    const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, question: qText, topic, difficulty, answer, used: false, showAnswer: false }]);
    setQText("");
    setTopic("Math");
    setDifficulty("Easy");
    setAnswer("");
  }

  function handleToggleAnswer(id: number) {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, showAnswer: !q.showAnswer } : q)));
  }

  function handleMarkUsed(id: number) {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, used: true } : q)));
  }

  function handleDelete(id: number) {
    setQuestions(questions.filter((q) => q.id !== id));
  }

  const usedCount = visible.filter((q) => q.used).length;

  return (
    <div>
      <h1 data-testid="app-title">Quiz Bank</h1>

      <form data-testid="add-form" onSubmit={handleAdd}>
        <textarea
          data-testid="input-question"
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          placeholder="Question text"
        />
        <select
          data-testid="select-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as Topic)}
        >
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          data-testid="select-difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <input
          data-testid="input-answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
        />
        <button data-testid="btn-add" type="submit">Add Question</button>
      </form>

      <select
        data-testid="filter-topic"
        value={filterTopic}
        onChange={(e) => setFilterTopic(e.target.value)}
      >
        <option value="All">All</option>
        {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select
        data-testid="filter-difficulty"
        value={filterDifficulty}
        onChange={(e) => setFilterDifficulty(e.target.value)}
      >
        <option value="All">All</option>
        {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      <div data-testid="question-count">{visible.length} questions</div>
      <div data-testid="used-count">{usedCount} used</div>

      <div data-testid="question-list">
        {visible.map((q) => (
          <div key={q.id} data-testid={`question-item-${q.id}`}>
            <span data-testid={`question-text-${q.id}`}>{q.question}</span>
            <span data-testid={`question-topic-${q.id}`}>{q.topic}</span>
            <span data-testid={`question-difficulty-${q.id}`}>{q.difficulty}</span>
            {q.showAnswer && (
              <span data-testid={`question-answer-${q.id}`}>{q.answer}</span>
            )}
            <button
              data-testid={`btn-toggle-answer-${q.id}`}
              onClick={() => handleToggleAnswer(q.id)}
            >
              {q.showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
            <button
              data-testid={`btn-mark-used-${q.id}`}
              onClick={() => handleMarkUsed(q.id)}
            >
              {q.used ? "Used" : "Mark Used"}
            </button>
            <button
              data-testid={`btn-delete-${q.id}`}
              onClick={() => handleDelete(q.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
