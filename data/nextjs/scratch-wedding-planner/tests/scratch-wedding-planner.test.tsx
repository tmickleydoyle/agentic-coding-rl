import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Wedding Planner", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /wedding planner/i })).toBeTruthy();
  });

  it("renders summary with correct initial counts", () => {
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/2 of 8 tasks complete/i);
  });

  it("renders all seed tasks by default", () => {
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByTestId(`task-${i}`)).toBeTruthy();
    }
  });

  it("shows completed tasks with strikethrough", () => {
    // task 3 (Buy wedding dress) is completed
    const task3 = screen.getByTestId("task-3");
    const span = task3.querySelector("span");
    expect(span?.style.textDecoration).toBe("line-through");
  });

  it("toggles a task and updates summary", async () => {
    const user = userEvent.setup();
    const checkbox1 = screen.getByTestId("checkbox-1");
    await user.click(checkbox1);
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/3 of 8 tasks complete/i);
  });

  it("filter pending hides completed tasks", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-pending"));
    expect(screen.queryByTestId("task-3")).toBeNull();
    expect(screen.queryByTestId("task-7")).toBeNull();
    expect(screen.getByTestId("task-1")).toBeTruthy();
  });

  it("filter completed shows only completed tasks", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-completed"));
    expect(screen.getByTestId("task-3")).toBeTruthy();
    expect(screen.getByTestId("task-7")).toBeTruthy();
    expect(screen.queryByTestId("task-1")).toBeNull();
  });

  it("filter all restores all tasks", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-pending"));
    await user.click(screen.getByTestId("filter-all"));
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByTestId(`task-${i}`)).toBeTruthy();
    }
  });

  it("shows add form when Add Task button is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-task-btn"));
    expect(screen.getByTestId("add-form")).toBeTruthy();
  });

  it("cancel hides the form without adding task", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-task-btn"));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByTestId("add-form")).toBeNull();
    expect(screen.getByTestId("summary").textContent).toMatch(/2 of 8 tasks complete/i);
  });

  it("adds a new task", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-task-btn"));
    await user.type(screen.getByLabelText(/title/i), "Send invitations");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByTestId("summary").textContent).toMatch(/2 of 9 tasks complete/i);
    expect(screen.getByText("Send invitations")).toBeTruthy();
  });

  it("does not add task when title is empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-task-btn"));
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByTestId("summary").textContent).toMatch(/2 of 8 tasks complete/i);
  });

  it("hides category heading when all tasks in that category are filtered out", async () => {
    const user = userEvent.setup();
    // Filter to completed — Attire has only task-3 completed, Music has none
    await user.click(screen.getByTestId("filter-completed"));
    expect(screen.queryByText("Music")).toBeNull();
  });

  it("shows new category input when New Category is selected", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-task-btn"));
    await user.selectOptions(screen.getByLabelText(/category/i), "__new__");
    expect(screen.getByLabelText(/new category name/i)).toBeTruthy();
  });
});
