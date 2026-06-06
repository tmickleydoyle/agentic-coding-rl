'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ReportPage() {
  const { projects, entries } = useApp();

  const rows = projects.map(p => ({
    project: p,
    total: entries.filter(e => e.projectId === p.id).reduce((s, e) => s + e.hours, 0),
  })).sort((a, b) => b.total - a.total);

  return (
    <div style={{ padding: 24 }}>
      <h1>Report</h1>
      {rows.map(({ project, total }) => (
        <div key={project.id} data-testid={`report-row-${project.id}`} style={{ marginBottom: 8 }}>
          <strong>{project.name}</strong>: {total.toFixed(1)}h
        </div>
      ))}
    </div>
  );
}
