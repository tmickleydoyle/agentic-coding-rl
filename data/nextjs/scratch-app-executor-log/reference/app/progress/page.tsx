import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { TODAY } from "../../lib/store";

export function ProgressPage() {
  const { tasks } = useApp();
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const inProgress = tasks.filter((t) => t.status === "InProgress").length;
  const todo = tasks.filter((t) => t.status === "Todo").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const overdue = tasks.filter((t) => t.due < TODAY && t.status !== "Done");

  return (
    <div data-testid="progress-page">
      <h1>Progress</h1>
      <div data-testid="progress-pct">{pct}%</div>
      <div data-testid="progress-bar" style={{ width: `${pct}%`, height: 8, background: "green" }} />
      <div data-testid="count-todo">{todo} Todo</div>
      <div data-testid="count-inprogress">{inProgress} InProgress</div>
      <div data-testid="count-done">{done} Done</div>
      {overdue.length === 0 ? (
        <p data-testid="no-overdue">No overdue tasks.</p>
      ) : (
        <ul data-testid="overdue-list">
          {overdue.map((t) => (
            <li key={t.id} data-testid={`overdue-item-${t.id}`}>
              <span data-testid={`overdue-title-${t.id}`}>{t.title}</span>
              <span data-testid={`overdue-due-${t.id}`}>{t.due}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
