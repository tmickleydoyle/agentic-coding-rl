'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { tasks, navigate } = useApp();
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inprogress = tasks.filter(t => t.status === 'inprogress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  return (
    <div style={{ padding: 24 }}>
      <h1>Task Board</h1>
      <p>Todo: <span data-testid="count-todo">{todo}</span></p>
      <p>In Progress: <span data-testid="count-inprogress">{inprogress}</span></p>
      <p>Done: <span data-testid="count-done">{done}</span></p>
      <button onClick={() => navigate('board')}>Go to Board</button>
    </div>
  );
}
