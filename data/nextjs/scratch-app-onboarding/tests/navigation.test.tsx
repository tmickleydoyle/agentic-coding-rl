import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows dashboard by default", () => {
    render(<App />);
    expect(screen.getByTestId("dashboard-page")).toBeTruthy();
  });

  it("navigates to employees", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-employees"));
    expect(screen.getByTestId("employees-page")).toBeTruthy();
  });

  it("navigates to tasks", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-tasks"));
    expect(screen.getByTestId("tasks-page")).toBeTruthy();
  });

  it("navigates to checklist", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-checklist"));
    expect(screen.getByTestId("checklist-page")).toBeTruthy();
  });
});
