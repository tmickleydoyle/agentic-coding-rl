import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Schedule", () => {
  it("shows 4 seed supplements", () => {
    render(<App />);
    expect(screen.getByTestId("total-supplements").textContent).toContain("4");
  });

  it("shows 2 taken today from seed logs", () => {
    render(<App />);
    expect(screen.getByTestId("taken-count").textContent).toContain("2");
  });

  it("lists all supplement items", () => {
    render(<App />);
    expect(screen.getAllByTestId("supplement-item").length).toBe(4);
  });

  it("delete removes supplement", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-supplement-s1"));
    expect(screen.getByTestId("total-supplements").textContent).toContain("3");
  });
});

describe("Add Supplement", () => {
  it("shows error on empty name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-supplement"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("adds supplement and returns to schedule", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-supplement"));
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Zinc" } });
    fireEvent.change(screen.getByTestId("input-dosage"), { target: { value: "30mg" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("total-supplements").textContent).toContain("5");
  });
});

describe("Log Dose", () => {
  it("shows today log items", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log-dose"));
    expect(screen.getAllByTestId("today-log-item").length).toBe(2);
  });

  it("logging a dose increments today logs and returns to schedule", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-log-dose"));
    fireEvent.click(screen.getByTestId("log-btn"));
    expect(screen.getByTestId("taken-count")).toBeTruthy();
  });
});
