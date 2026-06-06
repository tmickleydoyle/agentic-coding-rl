"use client";
import React, { useState } from "react";

interface Preset {
  label: string;
  incomeGoal: number;
  weeks: number;
  hoursPerWeek: number;
  nonBillablePct: number;
  expenses: number;
  taxRate: number;
}

const PRESETS: Preset[] = [
  { label: "Part-time", incomeGoal: 40000, weeks: 48, hoursPerWeek: 20, nonBillablePct: 20, expenses: 2000, taxRate: 20 },
  { label: "Full-time", incomeGoal: 80000, weeks: 48, hoursPerWeek: 40, nonBillablePct: 30, expenses: 5000, taxRate: 25 },
  { label: "Consulting", incomeGoal: 150000, weeks: 46, hoursPerWeek: 50, nonBillablePct: 40, expenses: 15000, taxRate: 30 },
];

function compute(
  incomeGoal: number,
  weeks: number,
  hoursPerWeek: number,
  nonBillablePct: number,
  expenses: number,
  taxRate: number
): { grossNeeded: number; billableHours: number; minRate: string; recommendedRate: string } {
  const safeIncome = Math.max(0, incomeGoal);
  const safeWeeks = Math.max(0, weeks);
  const safeHrs = Math.max(0, hoursPerWeek);
  const safePct = Math.max(0, nonBillablePct);
  const safeExp = Math.max(0, expenses);
  const safeTax = Math.max(0, taxRate);

  const taxAmount = safeIncome * (safeTax / 100);
  const grossNeeded = safeIncome + safeExp + taxAmount;
  const totalHours = safeWeeks * safeHrs;
  const billableHours = totalHours * (1 - safePct / 100);

  if (billableHours <= 0) {
    return { grossNeeded, billableHours: 0, minRate: "N/A", recommendedRate: "N/A" };
  }

  const minRate = grossNeeded / billableHours;
  const recommendedRate = minRate * 1.2;

  return {
    grossNeeded,
    billableHours,
    minRate: `$${minRate.toFixed(2)}`,
    recommendedRate: `$${recommendedRate.toFixed(2)}`,
  };
}

export default function App() {
  const [incomeGoal, setIncomeGoal] = useState(80000);
  const [weeks, setWeeks] = useState(48);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [nonBillablePct, setNonBillablePct] = useState(30);
  const [expenses, setExpenses] = useState(5000);
  const [taxRate, setTaxRate] = useState(25);

  const results = compute(incomeGoal, weeks, hoursPerWeek, nonBillablePct, expenses, taxRate);

  function applyPreset(preset: Preset) {
    setIncomeGoal(preset.incomeGoal);
    setWeeks(preset.weeks);
    setHoursPerWeek(preset.hoursPerWeek);
    setNonBillablePct(preset.nonBillablePct);
    setExpenses(preset.expenses);
    setTaxRate(preset.taxRate);
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 600 }}>
      <h1 data-testid="page-heading">Rate Calculator</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {PRESETS.map((p) => (
          <button key={p.label} data-testid={`preset-${p.label.toLowerCase()}`} onClick={() => applyPreset(p)}>
            {p.label}
          </button>
        ))}
      </div>

      <div data-testid="input-form" style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        <div>
          <label htmlFor="income-goal">Annual income goal ($)</label>
          <input
            id="income-goal"
            data-testid="input-income-goal"
            type="number"
            value={incomeGoal}
            onChange={(e) => setIncomeGoal(parseFloat(e.target.value) || 0)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <label htmlFor="weeks">Weeks per year</label>
          <input
            id="weeks"
            data-testid="input-weeks"
            type="number"
            value={weeks}
            onChange={(e) => setWeeks(parseFloat(e.target.value) || 0)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <label htmlFor="hours-per-week">Hours per week</label>
          <input
            id="hours-per-week"
            data-testid="input-hours-per-week"
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <label htmlFor="non-billable">Non-billable hours (%)</label>
          <input
            id="non-billable"
            data-testid="input-non-billable"
            type="number"
            value={nonBillablePct}
            onChange={(e) => setNonBillablePct(parseFloat(e.target.value) || 0)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <label htmlFor="expenses">Business expenses/yr ($)</label>
          <input
            id="expenses"
            data-testid="input-expenses"
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
            style={{ marginLeft: 8 }}
          />
        </div>
        <div>
          <label htmlFor="tax-rate">Tax rate (%)</label>
          <input
            id="tax-rate"
            data-testid="input-tax-rate"
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
            style={{ marginLeft: 8 }}
          />
        </div>
      </div>

      <section data-testid="results-panel" style={{ border: "1px solid #ccc", padding: 16 }}>
        <h2>Results</h2>
        <div>
          <span>Gross income needed: </span>
          <span data-testid="result-gross">${results.grossNeeded.toFixed(2)}</span>
        </div>
        <div>
          <span>Billable hours/year: </span>
          <span data-testid="result-billable-hours">{results.billableHours}</span>
        </div>
        <div>
          <span>Minimum hourly rate: </span>
          <span data-testid="result-min-rate">{results.minRate}</span>
        </div>
        <div>
          <span>Recommended rate: </span>
          <span data-testid="result-recommended-rate">{results.recommendedRate}</span>
        </div>
      </section>
    </main>
  );
}
