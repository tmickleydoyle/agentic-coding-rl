import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Assignments Page", () => {
  beforeEach(() => { __reset(); });

  function goToAssignments() {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assignments"));
  }

  it("shows seed assignments", () => {
    goToAssignments();
    expect(screen.getByTestId("assignment-row-a1")).toBeTruthy();
    expect(screen.getByTestId("assignment-row-a2")).toBeTruthy();
  });

  it("shows assignment title and status", () => {
    goToAssignments();
    expect(screen.getByTestId("assignment-title-a1").textContent).toBe("Tutor Session");
    expect(screen.getByTestId("assignment-status-a1").textContent).toBe("Completed");
  });

  it("adds a new assignment", () => {
    goToAssignments();
    fireEvent.change(screen.getByTestId("assignment-title"), { target: { value: "Park Cleanup" } });
    fireEvent.change(screen.getByTestId("assignment-volunteer"), { target: { value: "v1" } });
    fireEvent.change(screen.getByTestId("assignment-date"), { target: { value: "2024-07-01" } });
    fireEvent.click(screen.getByTestId("assignment-submit"));
    expect(screen.getByText("Park Cleanup")).toBeTruthy();
  });

  it("marks assignment complete", () => {
    goToAssignments();
    fireEvent.click(screen.getByTestId("complete-a2"));
    expect(screen.getByTestId("assignment-status-a2").textContent).toBe("Completed");
  });
});
