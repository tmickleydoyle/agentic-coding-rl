import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Employee, ChecklistItem } from "../../lib/types";

export default function EmployeesPage() {
  const { employees, templates, checklist, setEmployees, setChecklist } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim()) { setError("Name required"); return; }
    if (!email.includes("@")) { setError("Invalid email"); return; }
    if (!department.trim()) { setError("Department required"); return; }
    if (!startDate) { setError("Start date required"); return; }
    setError("");
    const newEmp: Employee = { id: String(Date.now()), name: name.trim(), email, department: department.trim(), startDate, managerId: "" };
    setEmployees([...employees, newEmp]);
    // auto-generate checklist items
    const newItems: ChecklistItem[] = templates.map((t, i) => ({
      id: `${newEmp.id}-${t.id}-${i}`,
      employeeId: newEmp.id,
      templateId: t.id,
      completed: false,
    }));
    setChecklist([...checklist, ...newItems]);
    setName(""); setEmail(""); setDepartment(""); setStartDate("");
  }

  return (
    <div data-testid="employees-page">
      <h1>Employees</h1>
      {error && <div data-testid="employee-error">{error}</div>}
      <div data-testid="add-employee-form">
        <input data-testid="emp-name-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input data-testid="emp-email-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input data-testid="emp-dept-input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" />
        <input data-testid="emp-start-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <button data-testid="add-employee-btn" onClick={handleAdd}>Add</button>
      </div>
      <ul data-testid="employee-list">
        {employees.map((e) => (
          <li key={e.id} data-testid={`employee-item-${e.id}`}>
            <span data-testid={`employee-name-${e.id}`}>{e.name}</span>
            <span data-testid={`employee-dept-${e.id}`}>{e.department}</span>
            <span data-testid={`employee-start-${e.id}`}>{e.startDate}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
