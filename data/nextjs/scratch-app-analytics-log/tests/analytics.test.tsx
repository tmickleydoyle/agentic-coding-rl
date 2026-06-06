import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ events: [], funnels: [], segments: [], total: 0, uniqueSessions: 0, top3: [], stats: [], count: 0 }) }));
});

describe("Analytics Log UI", () => {
  it("overview shows total-events", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("total-events")).toBeTruthy());
  });
  it("overview shows unique-sessions", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("unique-sessions")).toBeTruthy());
  });
  it("events page shows no-events when empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    await waitFor(() => expect(screen.getByTestId("no-events")).toBeTruthy());
  });
  it("funnels page shows no-funnels when empty", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-funnels"));
    await waitFor(() => expect(screen.getByTestId("no-funnels")).toBeTruthy());
  });
  it("events page has add-event-form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("add-event-form")).toBeTruthy();
  });
  it("segments page has add-segment-form", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-segments"));
    expect(screen.getByTestId("add-segment-form")).toBeTruthy();
  });
});
