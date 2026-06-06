import React from "react";
import { getVolunteers, getAssignments } from "../../lib/store";

export function ReportsPage() {
  const volunteers = getVolunteers();
  const assignments = getAssignments();
  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter((v) => v.status === "Active").length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === "Completed").length;

  return (
    <div data-testid="reports-page">
      <h2>Reports</h2>
      <div data-testid="stat-total-volunteers">{totalVolunteers}</div>
      <div data-testid="stat-active-volunteers">{activeVolunteers}</div>
      <div data-testid="stat-total-assignments">{totalAssignments}</div>
      <div data-testid="stat-completed-assignments">{completedAssignments}</div>
    </div>
  );
}
