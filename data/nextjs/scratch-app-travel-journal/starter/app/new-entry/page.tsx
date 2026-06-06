import React from "react";

export default function NewEntryPage() {
  return (
    <div data-testid="new-entry-page">
      <input data-testid="input-title" />
      <input data-testid="input-country" />
      <input data-testid="input-city" />
      <input data-testid="input-date" type="date" />
      <select data-testid="input-mood"><option value="happy">happy</option></select>
      <textarea data-testid="input-body" />
      <input data-testid="input-rating" type="number" />
      <button data-testid="submit-entry">Save Entry</button>
    </div>
  );
}
