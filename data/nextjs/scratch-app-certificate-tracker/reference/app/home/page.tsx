'use client'
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { skills, certificates, navigate } = useApp();
  return (
    <div data-testid="home-page">
      <h1 data-testid="app-title">Certificate Tracker</h1>
      <p data-testid="total-certificates">Certificates: {certificates.length}</p>
      <p data-testid="total-skills">Skills: {skills.length}</p>
      <button data-testid="btn-certificates" onClick={() => navigate('certificates')}>View Certificates</button>
      <button data-testid="btn-skills" onClick={() => navigate('skills')}>Manage Skills</button>
    </div>
  );
}
