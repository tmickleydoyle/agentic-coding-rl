import React, { useState } from "react";

function calcMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function buildAmortization(principal: number, annualRate: number, termYears: number): AmortRow[] {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  const monthly = calcMonthlyPayment(principal, annualRate, termYears);
  const rows: AmortRow[] = [];
  let balance = principal;
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const princ = monthly - interest;
    balance = balance - princ;
    rows.push({
      month: i,
      payment: monthly,
      principal: princ,
      interest,
      balance: Math.max(0, balance),
    });
  }
  return rows;
}

export default function App() {
  const [homePrice, setHomePrice] = useState("400000");
  const [downPayment, setDownPayment] = useState("80000");
  const [annualRate, setAnnualRate] = useState("6.5");
  const [termYears, setTermYears] = useState("30");
  const [showFull, setShowFull] = useState(false);

  const hp = parseFloat(homePrice) || 0;
  const dp = parseFloat(downPayment) || 0;
  const rate = parseFloat(annualRate) || 0;
  const term = parseInt(termYears, 10) || 30;

  let inputError = "";
  if (hp <= 0) inputError = "Down payment must be less than home price";
  else if (dp >= hp) inputError = "Down payment must be less than home price";
  else if (rate <= 0) inputError = "Down payment must be less than home price";

  const loanAmount = hp - dp;
  const monthly = inputError ? 0 : calcMonthlyPayment(loanAmount, rate, term);
  const totalPayment = monthly * term * 12;
  const totalInterest = totalPayment - loanAmount;

  const amortRows = inputError ? [] : buildAmortization(loanAmount, rate, term);
  const displayRows = showFull ? amortRows : amortRows.slice(0, 12);

  function fmt(n: number): string {
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtLoan(n: number): string {
    return "$" + n.toLocaleString("en-US");
  }

  return (
    <div>
      <h1>Mortgage Calculator</h1>

      <div>
        <label htmlFor="home-price">Home Price ($)</label>
        <input id="home-price" type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} />
      </div>
      <div>
        <label htmlFor="down-payment">Down Payment ($)</label>
        <input id="down-payment" type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
      </div>
      <div>
        <label htmlFor="annual-rate">Annual Interest Rate (%)</label>
        <input id="annual-rate" type="number" value={annualRate} step="0.1" onChange={(e) => setAnnualRate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="term">Loan Term (years)</label>
        <select id="term" value={termYears} onChange={(e) => setTermYears(e.target.value)}>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>

      {inputError && <div data-testid="input-error">{inputError}</div>}

      {!inputError && (
        <div>
          <p data-testid="loan-amount">{fmtLoan(loanAmount)}</p>
          <p data-testid="monthly-payment">{fmt(monthly)}</p>
          <p data-testid="total-payment">{fmt(totalPayment)}</p>
          <p data-testid="total-interest">{fmt(totalInterest)}</p>

          <button
            data-testid="toggle-schedule"
            onClick={() => setShowFull(!showFull)}
          >
            {showFull ? "Hide Full Schedule" : "Show Full Schedule"}
          </button>

          <table data-testid="amortization-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                <tr key={row.month} data-testid={`amort-row-${row.month}`}>
                  <td>{row.month}</td>
                  <td>{fmt(row.payment)}</td>
                  <td>{fmt(row.principal)}</td>
                  <td>{fmt(row.interest)}</td>
                  <td>{fmt(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
