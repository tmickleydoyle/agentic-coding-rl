'use client';
import React from 'react';
export function HomePage() {
  return <div><h1>Task Board</h1>
    <p>Todo: <span data-testid="count-todo">0</span></p>
    <p>In Progress: <span data-testid="count-inprogress">0</span></p>
    <p>Done: <span data-testid="count-done">0</span></p>
  </div>;
}
