import React from "react";
export function KeyResultsPage() {
  return (
    <div data-testid="keyresults-page">
      <h1>Key Results</h1>
      <select data-testid="select-objective"><option value="">Select objective</option></select>
      <div data-testid="kr-form">
        <input data-testid="input-kr-title" placeholder="Key result title" />
        <input data-testid="input-target" type="number" placeholder="Target" />
        <input data-testid="input-current" type="number" placeholder="Current" />
        <input data-testid="input-unit" placeholder="Unit" />
        <button data-testid="btn-add-kr">Add Key Result</button>
      </div>
      <ul data-testid="kr-list"></ul>
    </div>
  );
}
