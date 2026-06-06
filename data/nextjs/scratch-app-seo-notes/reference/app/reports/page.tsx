"use client";
import React, { useEffect, useState } from "react";
import { Report } from "../../lib/types";

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const load = () => { fetch("/api/keywords/reports").then((r) => r.json()).then((d) => setReports(d.reports ?? [])); };
  useEffect(() => { load(); }, []);

  const generate = async () => {
    await fetch("/api/keywords/reports", { method: "POST" });
    load();
  };

  return (
    <div data-testid="reports-page">
      <h1>Reports</h1>
      <button data-testid="generate-report-btn" onClick={generate}>Generate Report</button>
      {reports.length === 0 ? (
        <div data-testid="no-reports">No reports generated</div>
      ) : (
        <ul data-testid="reports-list">
          {reports.map((r) => (
            <li key={r.id} data-testid={`report-${r.id}`}>
              <span data-testid={`report-date-${r.id}`}>{r.generatedAt}</span>
              <span data-testid={`report-keywords-${r.id}`}>{r.totalKeywords}</span>
              <span data-testid={`report-avg-pos-${r.id}`}>{r.avgPosition}</span>
              <span data-testid={`report-avg-score-${r.id}`}>{r.avgScore}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
