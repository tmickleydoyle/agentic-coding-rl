"use client";
import React from "react";
export function ResultsPage() {
  return (
    <div data-testid="results-page">
      <h2>Results</h2>
      <select data-testid="result-match-select"><option value="">Select match</option></select>
      <select data-testid="result-winner-select"><option value="">Select winner</option></select>
      <button data-testid="record-result-btn">Record Result</button>
      <ul data-testid="results-list"></ul>
    </div>
  );
}
