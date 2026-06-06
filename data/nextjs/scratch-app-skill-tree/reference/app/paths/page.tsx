'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function PathsPage() {
  const { paths, skills, progress } = useApp();
  const [expanded, setExpanded] = useState<number | null>(null);

  function skillName(id: number) {
    return skills.find((s) => s.id === id)?.name ?? 'Unknown';
  }

  function pathCompletion(skillIds: number[]) {
    const completed = skillIds.filter((id) => {
      const p = progress.find((pr) => pr.skillId === id);
      return p && p.status === 'completed';
    }).length;
    return Math.round((completed / skillIds.length) * 100);
  }

  return (
    <div data-testid="paths-page">
      <h2>Learning Paths</h2>
      <ul data-testid="path-list">
        {paths.map((p) => (
          <li key={p.id} data-testid={`path-${p.id}`}>
            <span data-testid={`path-name-${p.id}`}>{p.name}</span>
            <span data-testid={`path-count-${p.id}`}>{p.skillIds.length} skills</span>
            <span data-testid={`path-completion-${p.id}`}>{pathCompletion(p.skillIds)}%</span>
            <button data-testid={`toggle-path-${p.id}`} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
              {expanded === p.id ? 'Hide' : 'Show'}
            </button>
            {expanded === p.id && (
              <ul data-testid={`path-skills-${p.id}`}>
                {p.skillIds.map((id) => (
                  <li key={id} data-testid={`path-skill-${p.id}-${id}`}>{skillName(id)}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
