import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addExam, updateExamStatus } from "../../lib/store";
import type { Difficulty, ExamStatus } from "../../lib/types";

export default function ExamsPage() {
  const { exams, setExams } = useApp();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [totalQ, setTotalQ] = useState("20");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!title.trim() || !subject.trim() || !date) { setError("Title, subject, and date required"); return; }
    const total = parseInt(totalQ, 10);
    if (isNaN(total) || total < 1) { setError("Total questions must be at least 1"); return; }
    const e = addExam({ title: title.trim(), subject: subject.trim(), date, totalQuestions: total, difficulty, status: "upcoming" });
    setExams([...exams, e]);
    setTitle(""); setSubject(""); setDate(""); setError("");
  }

  function handleStatus(id: string, status: ExamStatus) {
    const updated = updateExamStatus(id, status);
    if (updated) setExams(exams.map(e => e.id === id ? updated : e));
  }

  return (
    <div data-testid="exams-page">
      <h2>Exams</h2>
      {error && <div data-testid="exam-error">{error}</div>}
      <ul data-testid="exam-list">
        {exams.map(e => (
          <li key={e.id} data-testid={`exam-item-${e.id}`}>
            <span data-testid={`exam-title-${e.id}`}>{e.title}</span>
            <span data-testid={`exam-subject-${e.id}`}>{e.subject}</span>
            <span data-testid={`exam-status-${e.id}`}>{e.status}</span>
            <span data-testid={`exam-difficulty-${e.id}`}>{e.difficulty}</span>
            <button data-testid={`btn-start-${e.id}`} onClick={() => handleStatus(e.id, "in-progress")}>Start</button>
            <button data-testid={`btn-complete-${e.id}`} onClick={() => handleStatus(e.id, "completed")}>Complete</button>
          </li>
        ))}
      </ul>
      <div data-testid="add-exam-form">
        <input data-testid="input-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Exam title" />
        <input data-testid="input-subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" />
        <input data-testid="input-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input data-testid="input-total-q" value={totalQ} onChange={e => setTotalQ(e.target.value)} placeholder="Total questions" />
        <select data-testid="select-difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button data-testid="btn-add-exam" onClick={handleAdd}>Add Exam</button>
      </div>
    </div>
  );
}
