import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { Supplement } from "../../lib/types";

export function LogDosePage() {
  const { supplements, todayLogs, handleLogDose } = useApp();
  const [selectedId, setSelectedId] = useState(supplements[0]?.id ?? "");
  const [time, setTime] = useState("08:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId) handleLogDose(selectedId, "2024-06-01", time);
  };

  return (
    <div>
      <h1>Log Dose</h1>
      <form data-testid="log-dose-form" onSubmit={handleSubmit}>
        <select data-testid="select-supplement" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
          {supplements.map((s: Supplement) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <input data-testid="input-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <button type="submit" data-testid="log-btn">Log Dose</button>
      </form>
      <h2>Today's Doses</h2>
      {todayLogs.map((log) => (
        <div key={log.id} data-testid="today-log-item">
          {log.supplementId} at {log.time}
        </div>
      ))}
    </div>
  );
}
