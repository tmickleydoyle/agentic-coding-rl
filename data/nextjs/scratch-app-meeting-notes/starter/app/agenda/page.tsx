import React from "react";
export function AgendaPage() {
  return (
    <div data-testid="agenda-page">
      <h1>Meeting Agenda</h1>
      <select data-testid="select-meeting"><option value="">Select a meeting</option></select>
    </div>
  );
}
