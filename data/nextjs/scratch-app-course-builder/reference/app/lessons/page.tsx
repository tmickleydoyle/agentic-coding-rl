'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function LessonsPage() {
  const { modules, lessons, setLessons } = useApp();
  const [filter, setFilter] = useState('all');
  const [moduleId, setModuleId] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('video');
  const [duration, setDuration] = useState('');

  async function handleAdd() {
    if (!moduleId || !title.trim() || !duration) return;
    const res = await fetch('/api/courses?type=lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ moduleId: Number(moduleId), title, type, duration: Number(duration) }) });
    if (res.ok) { const lesson = await res.json(); setLessons([...lessons, lesson]); setTitle(''); setDuration(''); }
  }

  const filtered = filter === 'all' ? lessons : lessons.filter((l) => l.moduleId === Number(filter));

  return (
    <div data-testid="lessons-page">
      <h2>Lessons</h2>
      <select data-testid="lesson-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
      </select>
      <ul data-testid="lesson-list">
        {filtered.map((l) => (
          <li key={l.id} data-testid={`lesson-${l.id}`}>
            <span data-testid={`lesson-title-${l.id}`}>{l.title}</span>
            <span data-testid={`lesson-type-${l.id}`}>{l.type}</span>
            <span data-testid={`lesson-duration-${l.id}`}>{l.duration}</span>
          </li>
        ))}
      </ul>
      <div data-testid="add-lesson-form">
        <select data-testid="lesson-module-select" value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
          <option value="">Select module</option>
          {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
        <input data-testid="lesson-title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" />
        <select data-testid="lesson-type-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="video">Video</option>
          <option value="exercise">Exercise</option>
          <option value="reading">Reading</option>
        </select>
        <input data-testid="lesson-duration-input" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" />
        <button data-testid="add-lesson-btn" onClick={handleAdd}>Add Lesson</button>
      </div>
    </div>
  );
}
