import React, { useState, useEffect } from "react";
import { AppStateProvider, useApp } from "../components/AppStateProvider";
import { NavBar } from "../components/NavBar";
import type { AuditEvent } from "../lib/types";

function DashboardPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then(setEvents);
  }, []);

  const actors = new Set<string>();
  events.forEach((e) => actors.add(e.actor));

  const actionCounts: Record<string, number> = {};
  events.forEach((e) => {
    actionCounts[e.action] = (actionCounts[e.action] ?? 0) + 1;
  });

  return (
    <div data-testid="dashboard-page">
      <h1>Audit Trail</h1>
      <div data-testid="stat-total">Total Events: {events.length}</div>
      <div data-testid="stat-actors">Unique Actors: {actors.size}</div>
      <div data-testid="stat-create">CREATE: {actionCounts["CREATE"] ?? 0}</div>
      <div data-testid="stat-update">UPDATE: {actionCounts["UPDATE"] ?? 0}</div>
      <div data-testid="stat-view">VIEW: {actionCounts["VIEW"] ?? 0}</div>
      <div data-testid="stat-delete">DELETE: {actionCounts["DELETE"] ?? 0}</div>
    </div>
  );
}

function TrailPage() {
  const { navigate } = useApp();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [actorFilter, setActorFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then(setEvents);
  }, []);

  const actors = Array.from(new Set(events.map((e) => e.actor)));

  const filtered = events.filter(
    (e) =>
      (actorFilter === "All" || e.actor === actorFilter) &&
      (actionFilter === "All" || e.action === actionFilter)
  );

  return (
    <div data-testid="trail-page">
      <h2>Audit Trail</h2>
      <select data-testid="filter-actor" value={actorFilter} onChange={(ev) => setActorFilter(ev.target.value)}>
        <option value="All">All Actors</option>
        {actors.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <select data-testid="filter-action" value={actionFilter} onChange={(ev) => setActionFilter(ev.target.value)}>
        <option value="All">All Actions</option>
        <option value="CREATE">CREATE</option>
        <option value="UPDATE">UPDATE</option>
        <option value="VIEW">VIEW</option>
        <option value="DELETE">DELETE</option>
        <option value="OTHER">OTHER</option>
      </select>
      {filtered.length === 0 ? (
        <div data-testid="no-events">No events found</div>
      ) : (
        <ul data-testid="event-list">
          {filtered.map((e) => (
            <li key={e.id} data-testid={`event-item-${e.id}`}>
              <button data-testid={`event-link-${e.id}`} onClick={() => navigate({ name: "detail", id: e.id })}>
                {e.resource}
              </button>
              <span data-testid={`event-actor-${e.id}`}>{e.actor}</span>
              <span data-testid={`event-action-${e.id}`}>{e.action}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DetailPage({ id }: { id: string }) {
  const { navigate } = useApp();
  const [event, setEvent] = useState<AuditEvent | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data: AuditEvent[]) => setEvent(data.find((e) => e.id === id) ?? null));
  }, [id]);

  if (event === undefined) return <div data-testid="detail-loading">Loading...</div>;
  if (event === null) return <div data-testid="detail-not-found">Event not found</div>;

  return (
    <div data-testid="detail-page">
      <div data-testid="detail-actor">{event.actor}</div>
      <div data-testid="detail-action">{event.action}</div>
      <div data-testid="detail-resource">{event.resource}</div>
      <div data-testid="detail-timestamp">{event.timestamp}</div>
      <div data-testid="detail-details">{event.details}</div>
      <button data-testid="back-btn" onClick={() => navigate({ name: "trail" })}>Back</button>
    </div>
  );
}

function Shell() {
  const { route } = useApp();
  return (
    <div>
      <NavBar />
      {route.name === "dashboard" && <DashboardPage />}
      {route.name === "trail" && <TrailPage />}
      {route.name === "detail" && <DetailPage id={route.id} />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  );
}
