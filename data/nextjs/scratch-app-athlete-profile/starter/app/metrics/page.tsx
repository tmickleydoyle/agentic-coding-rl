import React from "react";

export default function MetricsPage() {
  return (
    <div data-testid="metrics-page">
      <h1>Metrics</h1>
      <form data-testid="add-metric-form">
        <input data-testid="input-metric-date" type="date" />
        <input data-testid="input-metric-weight" type="number" placeholder="Weight (kg)" />
        <input data-testid="input-metric-height" type="number" placeholder="Height (cm)" />
        <input data-testid="input-metric-vo2max" type="number" placeholder="VO2max" />
        <button type="submit" data-testid="btn-add-metric">Add</button>
      </form>
      <ul data-testid="metrics-list"></ul>
    </div>
  );
}
