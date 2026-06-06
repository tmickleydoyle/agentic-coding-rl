import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

const seedEvents = [
  { id: "1", actor: "alice@example.com", action: "CREATE", resource: "Document #101", timestamp: "2024-01-15T09:00:00Z", details: "Created new contract" },
  { id: "2", actor: "bob@example.com", action: "UPDATE", resource: "Document #101", timestamp: "2024-01-15T10:30:00Z", details: "Updated contract terms" },
  { id: "3", actor: "alice@example.com", action: "VIEW", resource: "Report #55", timestamp: "2024-01-16T14:00:00Z", details: "Viewed quarterly report" },
  { id: "4", actor: "carol@example.com", action: "DELETE", resource: "Draft #7", timestamp: "2024-01-17T11:00:00Z", details: "Deleted stale draft" },
];

beforeEach(() => {
  vi.stubGlobal("fetch", async () => ({ json: async () => seedEvents }));
});

describe("dashboard stats", () => {
  it("shows total events", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-total").textContent).toContain("4"));
  });

  it("shows unique actors count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-actors").textContent).toContain("3"));
  });

  it("shows CREATE count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-create").textContent).toContain("1"));
  });

  it("shows DELETE count", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("stat-delete").textContent).toContain("1"));
  });
});

describe("audit trail list", () => {
  it("shows all events", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trail"));
    await waitFor(() => screen.getByTestId("event-list"));
    expect(screen.getByTestId("event-item-1")).toBeTruthy();
    expect(screen.getByTestId("event-item-4")).toBeTruthy();
  });

  it("filters by action", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trail"));
    await waitFor(() => screen.getByTestId("event-list"));
    fireEvent.change(screen.getByTestId("filter-action"), { target: { value: "CREATE" } });
    expect(screen.getByTestId("event-item-1")).toBeTruthy();
    expect(screen.queryByTestId("event-item-2")).toBeNull();
  });

  it("shows no events message when filter has no match", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trail"));
    await waitFor(() => screen.getByTestId("event-list"));
    fireEvent.change(screen.getByTestId("filter-action"), { target: { value: "OTHER" } });
    expect(screen.getByTestId("no-events")).toBeTruthy();
  });

  it("navigates to event detail", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trail"));
    await waitFor(() => screen.getByTestId("event-list"));
    fireEvent.click(screen.getByTestId("event-link-1"));
    await waitFor(() => expect(screen.getByTestId("detail-page")).toBeTruthy());
  });
});
