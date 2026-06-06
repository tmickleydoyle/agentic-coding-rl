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

describe("navigation", () => {
  it("renders dashboard by default", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });

  it("shows navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("navigates to trail page", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trail"));
    await waitFor(() => expect(screen.getByTestId("trail-page")).toBeTruthy());
  });

  it("navigates back to dashboard", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trail"));
    await waitFor(() => screen.getByTestId("trail-page"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    await waitFor(() => expect(screen.getByTestId("dashboard-page")).toBeTruthy());
  });
});
