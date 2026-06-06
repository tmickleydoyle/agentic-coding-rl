'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SkillsPage() {
  const { skills, progress, setProgress } = useApp();

  async function handleStart(skillId: number) {
    const res = await fetch('/api/skills?type=progress', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ skillId, status: 'in_progress' }) });
    if (res.ok) setProgress(progress.map((p) => p.skillId === skillId ? { ...p, status: 'in_progress' } : p));
  }

  async function handleComplete(skillId: number) {
    const res = await fetch('/api/skills?type=progress', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ skillId, status: 'completed' }) });
    if (res.ok) {
      const updated = await res.json();
      // re-fetch all progress to get auto-unlocked skills
      const dataRes = await fetch('/api/skills');
      if (dataRes.ok) { const data = await dataRes.json(); setProgress(data.progress); }
      else setProgress(progress.map((p) => p.skillId === skillId ? { ...p, status: 'completed' } : p));
    }
  }

  return (
    <div data-testid="skills-page">
      <h2>Skills</h2>
      <ul data-testid="skill-list">
        {skills.map((s) => {
          const p = progress.find((pr) => pr.skillId === s.id);
          const status = p ? p.status : 'locked';
          return (
            <li key={s.id} data-testid={`skill-${s.id}`}>
              <span data-testid={`skill-name-${s.id}`}>{s.name}</span>
              <span data-testid={`skill-level-${s.id}`}>Level {s.level}</span>
              <span data-testid={`skill-status-${s.id}`}>{status}</span>
              {status === 'available' && <button data-testid={`start-skill-${s.id}`} onClick={() => handleStart(s.id)}>Start</button>}
              {status === 'in_progress' && <button data-testid={`complete-skill-${s.id}`} onClick={() => handleComplete(s.id)}>Complete</button>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
