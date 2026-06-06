import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Refactor Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /refactor tracker/i })).toBeTruthy();
  });

  it("renders all 6 seed task cards", () => {
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`task-card-${i}`)).toBeTruthy();
    }
  });

  it("shows module for seed tasks", () => {
    expect(screen.getByTestId("module-1").textContent).toBe("auth");
    expect(screen.getByTestId("module-2").textContent).toBe("ui");
  });

  it("shows priority badges", () => {
    expect(screen.getByTestId("priority-badge-1").textContent).toBe("high");
    expect(screen.getByTestId("priority-badge-2").textContent).toBe("medium");
    expect(screen.getByTestId("priority-badge-3").textContent).toBe("low");
  });

  it("shows progress values", () => {
    expect(screen.getByTestId("progress-1").textContent).toBe("80");
    expect(screen.getByTestId("progress-3").textContent).toBe("100");
  });

  it("shows assignees", () => {
    expect(screen.getByTestId("assignee-1").textContent).toBe("alice");
    expect(screen.getByTestId("assignee-6").textContent).toBe("bob");
  });

  it("shows done badge for done tasks", () => {
    expect(screen.getByTestId("done-badge-3")).toBeTruthy();
    expect(screen.getByTestId("done-badge-5")).toBeTruthy();
  });

  it("no done badge for open tasks", () => {
    expect(screen.queryByTestId("done-badge-1")).toBeNull();
    expect(screen.queryByTestId("done-badge-2")).toBeNull();
  });

  it("shows correct stats", () => {
    expect(screen.getByTestId("stat-total").textContent).toContain("6");
    expect(screen.getByTestId("stat-done").textContent).toContain("2");
    // (80+40+100+60+100+20)/6 = 66.7
    expect(screen.getByTestId("stat-avg-progress").textContent).toContain("66.7");
  });

  it("mark done sets progress to 100 and shows done badge", async () => {
    await userEvent.click(screen.getByTestId("btn-done-1"));
    expect(screen.getByTestId("progress-1").textContent).toBe("100");
    expect(screen.getByTestId("done-badge-1")).toBeTruthy();
    expect(screen.getByTestId("btn-done-1").textContent).toBe("Mark Open");
  });

  it("mark open reverts progress and removes done badge", async () => {
    await userEvent.click(screen.getByTestId("btn-done-1"));
    await userEvent.click(screen.getByTestId("btn-done-1"));
    expect(screen.getByTestId("progress-1").textContent).toBe("80");
    expect(screen.queryByTestId("done-badge-1")).toBeNull();
  });

  it("filters by ui module", async () => {
    await userEvent.click(screen.getByTestId("filter-ui"));
    expect(screen.getByTestId("task-card-2")).toBeTruthy();
    expect(screen.getByTestId("task-card-4")).toBeTruthy();
    expect(screen.queryByTestId("task-card-1")).toBeNull();
  });

  it("filter-all restores all tasks", async () => {
    await userEvent.click(screen.getByTestId("filter-types"));
    await userEvent.click(screen.getByTestId("filter-all"));
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`task-card-${i}`)).toBeTruthy();
    }
  });

  it("filters by high priority", async () => {
    await userEvent.click(screen.getByTestId("filter-high"));
    expect(screen.getByTestId("task-card-1")).toBeTruthy();
    expect(screen.getByTestId("task-card-4")).toBeTruthy();
    expect(screen.getByTestId("task-card-6")).toBeTruthy();
    expect(screen.queryByTestId("task-card-2")).toBeNull();
  });

  it("module and priority filters combine", async () => {
    await userEvent.click(screen.getByTestId("filter-ui"));
    await userEvent.click(screen.getByTestId("filter-high"));
    expect(screen.getByTestId("task-card-4")).toBeTruthy();
    expect(screen.queryByTestId("task-card-2")).toBeNull(); // ui but medium
    expect(screen.queryByTestId("task-card-1")).toBeNull(); // high but auth
  });

  it("adds a new task", async () => {
    await userEvent.type(screen.getByTestId("input-name"), "Consolidate helpers");
    await userEvent.click(screen.getByTestId("btn-add-task"));
    expect(screen.getByTestId("task-card-7")).toBeTruthy();
  });

  it("does not add task with empty name", async () => {
    await userEvent.click(screen.getByTestId("btn-add-task"));
    expect(screen.queryByTestId("task-card-7")).toBeNull();
  });

  it("deletes a task", async () => {
    await userEvent.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("task-card-1")).toBeNull();
    expect(screen.getByTestId("stat-total").textContent).toContain("5");
  });
});
