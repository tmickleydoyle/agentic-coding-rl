import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Tutoring Sessions App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByTestId("app-title")).toHaveTextContent("Tutoring Sessions");
  });

  it("renders seed sessions on initial load", () => {
    expect(screen.getByTestId("session-item-1")).toBeDefined();
    expect(screen.getByTestId("session-item-2")).toBeDefined();
    expect(screen.getByTestId("session-item-3")).toBeDefined();
    expect(screen.getByTestId("session-item-4")).toBeDefined();
  });

  it("shows correct session count for all sessions", () => {
    expect(screen.getByTestId("session-count")).toHaveTextContent("4 sessions");
  });

  it("displays session student, subject, date, and duration", () => {
    expect(screen.getByTestId("session-student-1")).toHaveTextContent("Alice Johnson");
    expect(screen.getByTestId("session-subject-1")).toHaveTextContent("Math");
    expect(screen.getByTestId("session-date-1")).toHaveTextContent("2024-01-15");
    expect(screen.getByTestId("session-duration-1")).toHaveTextContent("60 min");
  });

  it("shows Completed for already completed sessions", () => {
    expect(screen.getByTestId("btn-complete-1")).toHaveTextContent("Completed");
  });

  it("shows Mark Complete for incomplete sessions", () => {
    expect(screen.getByTestId("btn-complete-2")).toHaveTextContent("Mark Complete");
  });

  it("marks a session complete on button click", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-complete-2"));
    expect(screen.getByTestId("btn-complete-2")).toHaveTextContent("Completed");
  });

  it("deletes a session", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-2"));
    expect(screen.queryByTestId("session-item-2")).toBeNull();
    expect(screen.getByTestId("session-count")).toHaveTextContent("3 sessions");
  });

  it("filters sessions by subject", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-subject"), "Math");
    expect(screen.getByTestId("session-item-1")).toBeDefined();
    expect(screen.getByTestId("session-item-3")).toBeDefined();
    expect(screen.queryByTestId("session-item-2")).toBeNull();
    expect(screen.getByTestId("session-count")).toHaveTextContent("2 sessions");
  });

  it("adds a new session", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-student"), "Eve Davis");
    await user.selectOptions(screen.getByTestId("select-subject"), "History");
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-02-01" } });
    await user.clear(screen.getByTestId("input-duration"));
    await user.type(screen.getByTestId("input-duration"), "50");
    await user.type(screen.getByTestId("input-notes"), "Some notes");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("session-count")).toHaveTextContent("5 sessions");
    expect(screen.getByTestId("session-student-5")).toHaveTextContent("Eve Davis");
  });

  it("does not add session when student name is empty", async () => {
    const user = userEvent.setup();
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-02-01" } });
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("session-count")).toHaveTextContent("4 sessions");
  });

  it("does not add session when date is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-student"), "Frank Test");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("session-count")).toHaveTextContent("4 sessions");
  });

  it("shows All sessions when filter reset to All", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-subject"), "English");
    await user.selectOptions(screen.getByTestId("filter-subject"), "All");
    expect(screen.getByTestId("session-count")).toHaveTextContent("4 sessions");
  });
});
