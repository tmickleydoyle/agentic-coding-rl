import React from "react";

export function AddSupplementPage() {
  return (
    <div>
      <h1>Add Supplement</h1>
      <form data-testid="add-supplement-form">
        <input data-testid="input-name" placeholder="Supplement name" />
        <input data-testid="input-dosage" placeholder="Dosage" />
        <select data-testid="select-frequency">
          <option value="daily">daily</option>
          <option value="twice-daily">twice-daily</option>
          <option value="weekly">weekly</option>
          <option value="as-needed">as-needed</option>
        </select>
        <input data-testid="input-notes" placeholder="Notes" />
        <button type="submit" data-testid="submit-btn">Add Supplement</button>
      </form>
    </div>
  );
}
