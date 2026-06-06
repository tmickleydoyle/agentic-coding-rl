import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Dashboard", () => {
  it("shows active milestones count", () => {
    render(<App />);
    expect(screen.getByTestId("active-milestones").textContent).toBe("2");
  });

  it("shows pending applications count", () => {
    render(<App />);
    expect(screen.getByTestId("pending-applications").textContent).toBe("2");
  });

  it("shows milestone percentage", () => {
    render(<App />);
    expect(screen.getByTestId("milestone-pct").textContent).toBe("33%");
  });
});

describe("Milestones page", () => {
  it("lists all milestones", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-milestones"));
    const items = screen.getAllByTestId("milestone-item");
    expect(items.length).toBe(3);
  });

  it("filters by category", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-milestones"));
    fireEvent.change(screen.getByTestId("category-filter"), { target: { value: "education" } });
    const items = screen.getAllByTestId("milestone-item");
    expect(items.length).toBe(1);
  });

  it("toggles milestone completion", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-milestones"));
    const checkboxes = screen.getAllByTestId("milestone-complete");
    const unchecked = checkboxes.find((c) => !(c as HTMLInputElement).checked);
    if (unchecked) fireEvent.click(unchecked);
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    expect(screen.getByTestId("active-milestones").textContent).toBe("1");
  });
});

describe("Applications page", () => {
  it("filters by status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-applications"));
    fireEvent.change(screen.getByTestId("status-filter"), { target: { value: "rejected" } });
    const items = screen.getAllByTestId("application-item");
    expect(items.length).toBe(1);
  });

  it("adds an application", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-applications"));
    fireEvent.change(screen.getByTestId("app-company-input"), { target: { value: "NewCo" } });
    fireEvent.change(screen.getByTestId("app-role-input"), { target: { value: "Dev" } });
    fireEvent.click(screen.getByTestId("add-application-btn"));
    fireEvent.change(screen.getByTestId("status-filter"), { target: { value: "all" } });
    const items = screen.getAllByTestId("application-item");
    expect(items.length).toBe(4);
  });
});
