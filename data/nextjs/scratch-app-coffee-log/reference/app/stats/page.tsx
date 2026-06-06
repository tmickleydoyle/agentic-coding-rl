'use client';
import React from 'react';
import { useApp } from '../../components/AppStateProvider';

export function StatsPage() {
  const { beans, brews } = useApp();

  // brews per method
  const methodMap: Record<string, number> = {};
  brews.forEach(br => {
    methodMap[br.method] = (methodMap[br.method] || 0) + 1;
  });
  const methods = Object.keys(methodMap);

  // avg rating per bean
  const beanRatingMap: Record<string, number[]> = {};
  brews.forEach(br => {
    if (!beanRatingMap[br.beanId]) beanRatingMap[br.beanId] = [];
    beanRatingMap[br.beanId].push(br.rating);
  });
  const beanIds = Object.keys(beanRatingMap);

  // brews this week
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekBrews = brews.filter(br => new Date(br.date) >= weekAgo).length;

  return (
    <div>
      <h2>Stats</h2>
      <div data-testid="stats-week-count">{weekBrews}</div>
      <ul data-testid="stats-methods-list">
        {methods.map(m => (
          <li key={m} data-testid="stats-method-item">
            <span>{m}</span>
            <span>{methodMap[m]}</span>
          </li>
        ))}
      </ul>
      <ul data-testid="stats-bean-ratings-list">
        {beanIds.map(beanId => {
          const bean = beans.find(b => b.id === beanId);
          const ratings = beanRatingMap[beanId];
          const avg = (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1);
          return (
            <li key={beanId} data-testid="stats-bean-rating-item">
              <span>{bean?.name ?? beanId}</span>
              <span>{avg}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
