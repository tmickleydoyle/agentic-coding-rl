import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Exams", () => {
  function goToExams() {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-exams"));
  }

  it("shows seed exams", () => {
    goToExams();
    expect(screen.getByTestId("exam-item-e1")).toBeTruthy();
    expect(screen.getByTestId("exam-item-e3")).toBeTruthy();
  });

  it("adds a new exam", () => {
    goToExams();
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "Physics Test" } });
    fireEvent.change(screen.getByTestId("input-subject"), { target: { value: "Physics" } });
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-05-01" } });
    fireEvent.click(screen.getByTestId("btn-add-exam"));
    expect(screen.getByTestId("exam-list").textContent).toContain("Physics Test");
  });

  it("shows error on empty submit", () => {
    goToExams();
    fireEvent.click(screen.getByTestId("btn-add-exam"));
    expect(screen.getByTestId("exam-error")).toBeTruthy();
  });

  it("updates exam status to in-progress", () => {
    goToExams();
    fireEvent.click(screen.getByTestId("btn-start-e1"));
    expect(screen.getByTestId("exam-status-e1").textContent).toBe("in-progress");
  });

  it("completes an exam", () => {
    goToExams();
    fireEvent.click(screen.getByTestId("btn-complete-e2"));
    expect(screen.getByTestId("exam-status-e2").textContent).toBe("completed");
  });
});
