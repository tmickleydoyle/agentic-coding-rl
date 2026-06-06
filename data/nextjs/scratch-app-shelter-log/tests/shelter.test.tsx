import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Residents Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed residents", () => {
    render(<App />);
    expect(screen.getByTestId("resident-row-r1")).toBeTruthy();
    expect(screen.getByTestId("resident-row-r2")).toBeTruthy();
  });

  it("shows resident name and status", () => {
    render(<App />);
    expect(screen.getByTestId("resident-name-r1").textContent).toBe("James Doe");
    expect(screen.getByTestId("resident-status-r1").textContent).toBe("Staying");
  });

  it("adds a new resident", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("resident-name"), { target: { value: "Sarah Lee" } });
    fireEvent.click(screen.getByTestId("resident-submit"));
    expect(screen.getByText("Sarah Lee")).toBeTruthy();
  });

  it("marks resident as departed", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("depart-r1"));
    expect(screen.getByTestId("resident-status-r1").textContent).toBe("Departed");
  });
});

describe("Beds Page", () => {
  beforeEach(() => { __reset(); });

  it("shows all beds", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-beds"));
    expect(screen.getByTestId("bed-row-b1")).toBeTruthy();
    expect(screen.getByTestId("bed-row-b3")).toBeTruthy();
  });

  it("occupied bed shows resident name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-beds"));
    expect(screen.getByTestId("bed-occupant-b1").textContent).toBe("James Doe");
  });

  it("unoccupied bed shows Empty", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-beds"));
    expect(screen.getByTestId("bed-occupant-b3").textContent).toBe("Empty");
  });
});

describe("Services Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed services", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-services"));
    expect(screen.getByTestId("service-row-s1")).toBeTruthy();
  });

  it("shows service type", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-services"));
    expect(screen.getByTestId("service-type-s1").textContent).toBe("Meal");
  });
});
