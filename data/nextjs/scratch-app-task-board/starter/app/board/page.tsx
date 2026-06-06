'use client';
import React from 'react';
export function BoardPage() {
  return <div><h1>Board</h1>
    <input data-testid="task-title" /><input data-testid="task-description" />
    <select data-testid="task-label"></select><select data-testid="task-priority"></select>
    <button data-testid="add-task-btn">Add Task</button>
  </div>;
}
