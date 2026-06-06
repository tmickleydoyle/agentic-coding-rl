import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Tank Maintenance Scheduler", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Tank Maintenance" })).toBeTruthy();
  });

  it("renders 5 seed tasks on load", () => {
    const list = screen.getByTestId("tasks-list");
    expect(within(list).getAllByRole("listitem").length).toBe(5);
  });

  it("shows correct initial pending count", () => {
    expect(screen.getByTestId("pending-count").textContent).toContain("3");
  });

  it("shows correct initial completed count", () => {
    expect(screen.getByTestId("completed-count").textContent).toContain("2");
  });

  it("shows task description", () => {
    expect(screen.getByTestId("task-desc-1").textContent).toBe("10% water change");
    expect(screen.getByTestId("task-desc-2").textContent).toBe("Clean filter");
  });

  it("shows task tank", () => {
    expect(screen.getByTestId("task-tank-1").textContent).toBe("Reef Tank");
  });

  it("shows pending status for task 1", () => {
    expect(screen.getByTestId("task-status-1").textContent).toBe("Pending");
  });

  it("shows completed status for task 2", () => {
    expect(screen.getByTestId("task-status-2").textContent).toBe("Completed");
  });

  it("toggle button text reflects status", () => {
    expect(screen.getByTestId("toggle-1").textContent).toBe("Mark Complete");
    expect(screen.getByTestId("toggle-2").textContent).toBe("Mark Pending");
  });

  it("toggling pending task marks it complete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-1"));
    expect(screen.getByTestId("task-status-1").textContent).toBe("Completed");
    expect(screen.getByTestId("toggle-1").textContent).toBe("Mark Pending");
  });

  it("toggling updates counts", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-1"));
    expect(screen.getByTestId("pending-count").textContent).toContain("2");
    expect(screen.getByTestId("completed-count").textContent).toContain("3");
  });

  it("adds a new task", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("task-input"), "Check skimmer");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("pending-count").textContent).toContain("4");
  });

  it("clears task input after add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("task-input"), "Check skimmer");
    await user.click(screen.getByTestId("add-button"));
    expect((screen.getByTestId("task-input") as HTMLInputElement).value).toBe("");
  });

  it("does not add task with empty description", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-button"));
    const list = screen.getByTestId("tasks-list");
    expect(within(list).getAllByRole("listitem").length).toBe(5);
  });

  it("deletes a task", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("task-1")).toBeNull();
    expect(screen.getByTestId("pending-count").textContent).toContain("2");
  });

  it("filter Pending shows only pending tasks", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("status-filter"), "Pending");
    const list = screen.getByTestId("tasks-list");
    expect(within(list).getAllByRole("listitem").length).toBe(3);
  });

  it("filter Completed shows only completed tasks", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("status-filter"), "Completed");
    const list = screen.getByTestId("tasks-list");
    expect(within(list).getAllByRole("listitem").length).toBe(2);
  });

  it("pending/completed counts reflect all tasks, not filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("status-filter"), "Pending");
    expect(screen.getByTestId("pending-count").textContent).toContain("3");
    expect(screen.getByTestId("completed-count").textContent).toContain("2");
  });
});
