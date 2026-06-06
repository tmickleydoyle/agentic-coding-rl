import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Profiles", () => {
  it("shows seed profiles", () => {
    render(<App />);
    expect(screen.getByTestId("profile-name-p1").textContent).toBe("Alice Chen");
    expect(screen.getByTestId("profile-email-p1").textContent).toBe("alice@example.com");
  });

  it("adds a profile", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("profile-name-input"), { target: { value: "Carol Davis" } });
    fireEvent.change(screen.getByTestId("profile-email-input"), { target: { value: "carol@example.com" } });
    fireEvent.click(screen.getByTestId("add-profile-btn"));
    expect(screen.getByText("Carol Davis")).toBeTruthy();
  });

  it("deletes a profile", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-profile-p2"));
    expect(screen.queryByTestId("profile-item-p2")).toBeNull();
  });

  it("ignores add when name is empty", () => {
    render(<App />);
    const before = screen.getByTestId("profile-list").children.length;
    fireEvent.click(screen.getByTestId("add-profile-btn"));
    expect(screen.getByTestId("profile-list").children.length).toBe(before);
  });
});

describe("Allocations", () => {
  it("shows seed allocations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-allocations"));
    expect(screen.getByTestId("alloc-asset-al1").textContent).toBe("Family Home");
    expect(screen.getByTestId("alloc-pct-al1").textContent).toBe("60%");
  });

  it("adds an allocation", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-allocations"));
    fireEvent.change(screen.getByTestId("alloc-beneficiary-input"), { target: { value: "Alice Chen" } });
    fireEvent.change(screen.getByTestId("alloc-asset-input"), { target: { value: "Jewelry" } });
    fireEvent.change(screen.getByTestId("alloc-pct-input"), { target: { value: "5" } });
    fireEvent.click(screen.getByTestId("add-alloc-btn"));
    expect(screen.getByText("Jewelry")).toBeTruthy();
  });

  it("no over-allocation warning with seed data", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-allocations"));
    expect(screen.queryByTestId("over-allocation-warning")).toBeNull();
  });

  it("shows over-allocation warning when total > 100", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-allocations"));
    fireEvent.change(screen.getByTestId("alloc-beneficiary-input"), { target: { value: "Alice Chen" } });
    fireEvent.change(screen.getByTestId("alloc-asset-input"), { target: { value: "Car" } });
    fireEvent.change(screen.getByTestId("alloc-pct-input"), { target: { value: "50" } });
    fireEvent.click(screen.getByTestId("add-alloc-btn"));
    expect(screen.getByTestId("over-allocation-warning")).toBeTruthy();
  });
});

describe("Report", () => {
  it("shows Alice Chen in report", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-report"));
    expect(screen.getByTestId("report-name-p1").textContent).toBe("Alice Chen");
  });

  it("shows Alice total 90%", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-report"));
    expect(screen.getByTestId("report-total-p1").textContent).toBe("90%");
  });

  it("shows Bob total 100%", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-report"));
    expect(screen.getByTestId("report-total-p2").textContent).toBe("100%");
  });
});
