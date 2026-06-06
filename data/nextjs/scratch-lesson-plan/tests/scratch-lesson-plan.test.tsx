import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Lesson Plan App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByTestId("app-title")).toHaveTextContent("Lesson Plan");
  });

  it("renders seed activities on load", () => {
    expect(screen.getByTestId("activity-item-1")).toBeDefined();
    expect(screen.getByTestId("activity-item-2")).toBeDefined();
    expect(screen.getByTestId("activity-item-3")).toBeDefined();
    expect(screen.getByTestId("activity-item-4")).toBeDefined();
  });

  it("shows correct total activities", () => {
    expect(screen.getByTestId("total-activities")).toHaveTextContent("Total: 4 activities");
  });

  it("shows correct total minutes", () => {
    expect(screen.getByTestId("total-minutes")).toHaveTextContent("Total: 150 min");
  });

  it("shows correct completed count", () => {
    expect(screen.getByTestId("completed-count")).toHaveTextContent("1 completed");
  });

  it("displays activity details", () => {
    expect(screen.getByTestId("activity-title-1")).toHaveTextContent("Introduction to Fractions");
    expect(screen.getByTestId("activity-day-1")).toHaveTextContent("Monday");
    expect(screen.getByTestId("activity-subject-1")).toHaveTextContent("Math");
    expect(screen.getByTestId("activity-duration-1")).toHaveTextContent("30 min");
  });

  it("shows Done for completed activity", () => {
    expect(screen.getByTestId("btn-complete-2")).toHaveTextContent("Done");
  });

  it("shows Mark Done for incomplete activity", () => {
    expect(screen.getByTestId("btn-complete-1")).toHaveTextContent("Mark Done");
  });

  it("marks an activity done", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-complete-1"));
    expect(screen.getByTestId("btn-complete-1")).toHaveTextContent("Done");
    expect(screen.getByTestId("completed-count")).toHaveTextContent("2 completed");
  });

  it("deletes an activity", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-3"));
    expect(screen.queryByTestId("activity-item-3")).toBeNull();
    expect(screen.getByTestId("total-activities")).toHaveTextContent("Total: 3 activities");
  });

  it("filters by day", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-day"), "Monday");
    expect(screen.getByTestId("activity-item-1")).toBeDefined();
    expect(screen.getByTestId("activity-item-2")).toBeDefined();
    expect(screen.queryByTestId("activity-item-3")).toBeNull();
    expect(screen.getByTestId("total-activities")).toHaveTextContent("Total: 2 activities");
  });

  it("total-minutes updates after filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-day"), "Monday");
    expect(screen.getByTestId("total-minutes")).toHaveTextContent("Total: 75 min");
  });

  it("adds a new activity", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "New Activity");
    await user.selectOptions(screen.getByTestId("select-day"), "Tuesday");
    await user.selectOptions(screen.getByTestId("select-subject"), "Science");
    await user.clear(screen.getByTestId("input-duration"));
    await user.type(screen.getByTestId("input-duration"), "20");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("total-activities")).toHaveTextContent("Total: 5 activities");
    expect(screen.getByTestId("activity-title-5")).toHaveTextContent("New Activity");
  });

  it("does not add activity with empty title", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("total-activities")).toHaveTextContent("Total: 4 activities");
  });
});
