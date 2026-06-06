import React from "react";

export default function LogPage() {
  return (
    <div data-testid="log-page">
      <h1>Training Log</h1>
      <p data-testid="total-km-logged">Total km logged: 0</p>
      <ul data-testid="log-list"></ul>
    </div>
  );
}
