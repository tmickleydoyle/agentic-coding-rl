'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function ProgressPage() {
  const { skills, progress } = useApp();
  const completed = progress.filter((p) => p.status === 'completed');
  const inProgress = progress.filter((p) => p.status === 'in_progress');
  const overall = Math.round((completed.length / progress.length) * 100);

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div data-testid="progress-page">
      <h2>Progress</h2>
      <p data-testid="overall-pct">Overall: {overall}%</p>
      <div data-testid="completed-list">
        <h3>Completed</h3>
        {completed.map((p) => {
          const skill = skills.find((s) => s.id === p.skillId);
          return <p key={p.skillId} data-testid={`completed-skill-${p.skillId}`}>{skill?.name}</p>;
        })}
      </div>
      <div data-testid="inprogress-list">
        <h3>In Progress</h3>
        {inProgress.map((p) => {
          const skill = skills.find((s) => s.id === p.skillId);
          return <p key={p.skillId} data-testid={`inprogress-skill-${p.skillId}`}>{skill?.name}</p>;
        })}
      </div>
      <div data-testid="category-breakdown">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat);
          const catCompleted = catSkills.filter((s) => {
            const p = progress.find((pr) => pr.skillId === s.id);
            return p && p.status === 'completed';
          }).length;
          return (
            <p key={cat} data-testid={`category-${cat.replace(/\s+/g, '-')}`}>
              {cat}: {catCompleted}/{catSkills.length}
            </p>
          );
        })}
      </div>
    </div>
  );
}
