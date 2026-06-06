import React from "react";
import { useApp } from "../../components/AppStateProvider";

export default function DashboardPage() {
  const { employees, checklist } = useApp();
  const totalItems = checklist.length;
  const completedItems = checklist.filter((c) => c.completed).length;
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div data-testid="dashboard-page">
      <h1>Onboarding Dashboard</h1>
      <div data-testid="employee-count">New Hires: {employees.length}</div>
      <div data-testid="completion-rate">Completion Rate: {completionRate}%</div>
      <div data-testid="completed-items">Completed: {completedItems} / {totalItems}</div>
      <ul data-testid="employee-progress-list">
        {employees.map((e) => {
          const empItems = checklist.filter((c) => c.employeeId === e.id);
          const empCompleted = empItems.filter((c) => c.completed).length;
          const empRate = empItems.length > 0 ? Math.round((empCompleted / empItems.length) * 100) : 0;
          return (
            <li key={e.id} data-testid={`employee-progress-${e.id}`}>
              <span data-testid={`emp-name-${e.id}`}>{e.name}</span>
              <span data-testid={`emp-rate-${e.id}`}>{empRate}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
