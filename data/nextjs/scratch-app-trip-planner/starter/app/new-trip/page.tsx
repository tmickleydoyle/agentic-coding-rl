import React from "react";

export default function NewTripPage() {
  return (
    <div data-testid="new-trip-page">
      <input data-testid="input-name" />
      <input data-testid="input-destination" />
      <input data-testid="input-start-date" type="date" />
      <input data-testid="input-end-date" type="date" />
      <select data-testid="input-status"><option value="planned">planned</option></select>
      <textarea data-testid="input-notes" />
      <button data-testid="submit-trip">Save Trip</button>
    </div>
  );
}
