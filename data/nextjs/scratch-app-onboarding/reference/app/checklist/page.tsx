import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";

export default function ChecklistPage() {
  const { employees, templates, checklist, setChecklist } = useApp();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const filtered = selectedEmployeeId
    ? checklist.filter((c) => c.employeeId === selectedEmployeeId)
    : checklist;

  function toggleItem(id: string) {
    setChecklist(checklist.map((c) => c.id === id ? { ...c, completed: !c.completed } : c));
  }

  return (
    <div data-testid="checklist-page">
      <h1>Onboarding Checklist</h1>
      <select data-testid="checklist-employee-filter" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
        <option value="">All Employees</option>
        {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      <ul data-testid="checklist-list">
        {filtered.map((item) => {
          const template = templates.find((t) => t.id === item.templateId);
          const employee = employees.find((e) => e.id === item.employeeId);
          return (
            <li key={item.id} data-testid={`checklist-item-${item.id}`}>
              <input
                type="checkbox"
                data-testid={`checklist-check-${item.id}`}
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
              />
              <span data-testid={`checklist-title-${item.id}`}>{template ? template.title : "Unknown"}</span>
              <span data-testid={`checklist-employee-${item.id}`}>{employee ? employee.name : "Unknown"}</span>
              <span data-testid={`checklist-status-${item.id}`}>{item.completed ? "Done" : "Pending"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
