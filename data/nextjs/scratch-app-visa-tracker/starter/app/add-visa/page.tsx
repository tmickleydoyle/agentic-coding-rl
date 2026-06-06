import React from "react";

export default function AddVisaPage() {
  return (
    <div data-testid="add-visa-page">
      <input data-testid="input-country" />
      <input data-testid="input-visa-type" />
      <input data-testid="input-applied-date" type="date" />
      <input data-testid="input-expiry-date" type="date" />
      <select data-testid="input-status"><option value="applied">applied</option></select>
      <input data-testid="input-passport" />
      <textarea data-testid="input-notes" />
      <button data-testid="submit-visa">Save Visa</button>
    </div>
  );
}
