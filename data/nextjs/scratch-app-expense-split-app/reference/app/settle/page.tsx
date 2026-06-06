'use client'
import React, { useState } from 'react';
import { useApp } from '../../components/AppStateProvider';

export function SettlePage() {
  const { groups, expenses } = useApp();
  const [groupId, setGroupId] = useState('');

  const selectedGroup = groups.find(g => g.id === groupId);
  const groupExpenses = expenses.filter(e => e.groupId === groupId);
  const total = groupExpenses.reduce((s, e) => s + e.amount, 0);
  const fairShare = selectedGroup ? total / selectedGroup.members.length : 0;

  const balances: Record<string, number> = {};
  if (selectedGroup) {
    selectedGroup.members.forEach(m => { balances[m] = 0; });
    groupExpenses.forEach(e => { balances[e.paidBy] = (balances[e.paidBy] ?? 0) + e.amount; });
    selectedGroup.members.forEach(m => { balances[m] = (balances[m] ?? 0) - fairShare; });
  }

  return (
    <main data-testid="settle-page">
      <h2>Settle Up</h2>
      <select data-testid="settle-group-select" value={groupId} onChange={e => setGroupId(e.target.value)}>
        <option value="">-- Select Group --</option>
        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
      {selectedGroup && (
        <ul data-testid="balances-list">
          {selectedGroup.members.map(m => (
            <li key={m} data-testid={`balance-${m}`}>
              <span data-testid={`balance-name-${m}`}>{m}</span>
              <span data-testid={`balance-amount-${m}`}>{(balances[m] ?? 0).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
