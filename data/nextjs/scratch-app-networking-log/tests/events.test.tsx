import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Dashboard stats", () => {
  it("shows correct event count", () => {
    render(<App />);
    expect(screen.getByTestId("event-count").textContent).toBe("2");
  });

  it("shows correct connection count", () => {
    render(<App />);
    expect(screen.getByTestId("connection-count").textContent).toBe("3");
  });

  it("shows correct pending followups", () => {
    render(<App />);
    expect(screen.getByTestId("pending-followups").textContent).toBe("1");
  });
});

describe("Events page", () => {
  it("lists seed events", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    const items = screen.getAllByTestId("event-item");
    expect(items.length).toBe(2);
  });

  it("adds a new event", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    fireEvent.change(screen.getByTestId("event-name-input"), { target: { value: "New Event" } });
    fireEvent.change(screen.getByTestId("event-date-input"), { target: { value: "2024-09-01" } });
    fireEvent.change(screen.getByTestId("event-location-input"), { target: { value: "NYC" } });
    fireEvent.click(screen.getByTestId("add-event-btn"));
    const items = screen.getAllByTestId("event-item");
    expect(items.length).toBe(3);
  });

  it("deletes an event", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    const deleteButtons = screen.getAllByTestId("delete-event");
    fireEvent.click(deleteButtons[0]);
    const items = screen.getAllByTestId("event-item");
    expect(items.length).toBe(1);
  });
});

describe("FollowUps page", () => {
  it("shows pending filter", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-followups"));
    fireEvent.click(screen.getByTestId("filter-pending"));
    const items = screen.getAllByTestId("followup-item");
    expect(items.length).toBe(1);
  });

  it("toggles done state", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-followups"));
    const checkboxes = screen.getAllByTestId("followup-done");
    const unchecked = checkboxes.find((c) => !(c as HTMLInputElement).checked);
    if (unchecked) fireEvent.click(unchecked);
    fireEvent.click(screen.getByTestId("filter-pending"));
    expect(screen.queryAllByTestId("followup-item").length).toBe(0);
  });
});
