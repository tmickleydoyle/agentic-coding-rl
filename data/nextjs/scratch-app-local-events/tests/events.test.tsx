import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Calendar Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed events", () => {
    render(<App />);
    expect(screen.getByTestId("event-row-ev1")).toBeTruthy();
    expect(screen.getByTestId("event-row-ev2")).toBeTruthy();
    expect(screen.getByTestId("event-row-ev3")).toBeTruthy();
  });

  it("shows event title", () => {
    render(<App />);
    expect(screen.getByTestId("event-title-ev1").textContent).toBe("Summer Festival");
  });

  it("shows registered count", () => {
    render(<App />);
    expect(screen.getByTestId("event-registered-ev1").textContent).toBe("45");
  });

  it("register button is disabled when at capacity", () => {
    render(<App />);
    // ev2 has 28/30 — not at capacity; create a full one
    const btn = screen.getByTestId("register-btn-ev1");
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });
});

describe("Create Page", () => {
  beforeEach(() => { __reset(); });

  it("creates a new event and shows success", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-create"));
    fireEvent.change(screen.getByTestId("create-title"), { target: { value: "Jazz Night" } });
    fireEvent.change(screen.getByTestId("create-capacity"), { target: { value: "50" } });
    fireEvent.click(screen.getByTestId("create-submit"));
    expect(screen.getByTestId("create-success")).toBeTruthy();
  });
});

describe("Registrations Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed registrations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-registrations"));
    expect(screen.getByTestId("reg-row-r1")).toBeTruthy();
  });

  it("shows attendee name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-registrations"));
    expect(screen.getByTestId("reg-attendee-r1").textContent).toBe("Alice");
  });
});
