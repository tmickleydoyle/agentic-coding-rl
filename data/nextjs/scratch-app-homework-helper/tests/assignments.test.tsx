import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Assignments", () => {
  function goToAssignments() {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assignments"));
  }

  it("shows seed assignments", () => {
    goToAssignments();
    expect(screen.getByTestId("assignment-item-a1")).toBeTruthy();
    expect(screen.getByTestId("assignment-item-a3")).toBeTruthy();
  });

  it("adds a new assignment", () => {
    goToAssignments();
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "New Homework" } });
    fireEvent.change(screen.getByTestId("input-subject"), { target: { value: "Art" } });
    fireEvent.change(screen.getByTestId("input-due-date"), { target: { value: "2024-04-01" } });
    fireEvent.click(screen.getByTestId("btn-add-assignment"));
    expect(screen.getByTestId("assignment-list").textContent).toContain("New Homework");
  });

  it("shows error on empty form", () => {
    goToAssignments();
    fireEvent.click(screen.getByTestId("btn-add-assignment"));
    expect(screen.getByTestId("assignment-error")).toBeTruthy();
  });

  it("marks assignment as done", () => {
    goToAssignments();
    fireEvent.click(screen.getByTestId("btn-done-a1"));
    expect(screen.getByTestId("assignment-status-a1").textContent).toBe("done");
  });

  it("deletes an assignment", () => {
    goToAssignments();
    fireEvent.click(screen.getByTestId("btn-delete-a4"));
    expect(screen.queryByTestId("assignment-item-a4")).toBeNull();
  });
});
