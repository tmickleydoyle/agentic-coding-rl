'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function HomePage() {
  const { applications } = useApp();
  const sorted = [...applications].sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));
  const recentCompany = sorted[0]?.company ?? '';
  return (
    <div>
      <h1>Dashboard</h1>
      <div data-testid="dashboard-total">{applications.length}</div>
      <div data-testid="dashboard-applied-count">{applications.filter(a => a.status === 'applied').length}</div>
      <div data-testid="dashboard-interview-count">{applications.filter(a => a.status === 'interview').length}</div>
      <div data-testid="dashboard-offer-count">{applications.filter(a => a.status === 'offer').length}</div>
      <div data-testid="dashboard-rejected-count">{applications.filter(a => a.status === 'rejected').length}</div>
      <div data-testid="dashboard-recent-company">{recentCompany}</div>
    </div>
  );
}
