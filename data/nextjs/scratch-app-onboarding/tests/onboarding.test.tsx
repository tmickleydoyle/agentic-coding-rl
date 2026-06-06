import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Onboarding", () => {
  it("shows employee count on dashboard", () => {
    render(<App />);
    expect(screen.getByTestId("employee-count").textContent).toContain("2");
  });

  it("shows 0% completion rate initially", () => {
    render(<App />);
    expect(screen.getByTestId("completion-rate").textContent).toContain("0%");
  });

  it("shows seed employees", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-employees"));
    expect(screen.getByTestId("employee-item-1")).toBeTruthy();
    expect(screen.getByTestId("employee-item-2")).toBeTruthy();
  });

  it("adds an employee", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-employees"));
    fireEvent.change(screen.getByTestId("emp-name-input"), { target: { value: "George" } });
    fireEvent.change(screen.getByTestId("emp-email-input"), { target: { value: "george@co.com" } });
    fireEvent.change(screen.getByTestId("emp-dept-input"), { target: { value: "Sales" } });
    fireEvent.change(screen.getByTestId("emp-start-input"), { target: { value: "2024-03-01" } });
    fireEvent.click(screen.getByTestId("add-employee-btn"));
    expect(screen.getByText("George")).toBeTruthy();
  });

  it("shows error for invalid email", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-employees"));
    fireEvent.change(screen.getByTestId("emp-name-input"), { target: { value: "George" } });
    fireEvent.change(screen.getByTestId("emp-email-input"), { target: { value: "notvalid" } });
    fireEvent.change(screen.getByTestId("emp-dept-input"), { target: { value: "Sales" } });
    fireEvent.click(screen.getByTestId("add-employee-btn"));
    expect(screen.getByTestId("employee-error")).toBeTruthy();
  });

  it("toggles checklist item completion", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-checklist"));
    const firstItem = screen.getByTestId("checklist-item-1");
    expect(firstItem).toBeTruthy();
    const checkbox = screen.getByTestId("checklist-check-1");
    fireEvent.click(checkbox);
    expect(screen.getByTestId("checklist-status-1").textContent).toBe("Done");
  });

  it("shows seed task templates", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tasks"));
    expect(screen.getByTestId("task-item-1")).toBeTruthy();
    expect(screen.getByTestId("task-item-4")).toBeTruthy();
  });
});
