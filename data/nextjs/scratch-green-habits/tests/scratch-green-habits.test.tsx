import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Green Habits Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(
      screen.getByRole("heading", { name: /green habits tracker/i })
    ).toBeTruthy();
  });

  it("loads 4 seed habits", () => {
    expect(screen.getByTestId("total-habits").textContent).toBe("4");
  });

  it("shows correct on-track count for seed data", () => {
    // Meatless Monday: completed 1 >= target 1 = on track
    expect(screen.getByTestId("on-track-count").textContent).toBe("1");
  });

  it("shows correct completion percentage for seed data", () => {
    // completed: 2+3+1+4=10, targets: 3+5+1+7=16, 10/16=62.5% -> 63%
    expect(screen.getByTestId("completion-pct").textContent).toBe("63%");
  });

  it("adds a new habit with valid data", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Compost food waste");
    await user.selectOptions(screen.getByTestId("category-select"), "Home");
    await user.clear(screen.getByTestId("target-input"));
    await user.type(screen.getByTestId("target-input"), "3");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-habits").textContent).toBe("5");
  });

  it("new habit starts with Behind status", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Test habit");
    await user.clear(screen.getByTestId("target-input"));
    await user.type(screen.getByTestId("target-input"), "5");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("habit-status-5").textContent).toBe("Behind");
  });

  it("shows error when name is missing", async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByTestId("target-input"));
    await user.type(screen.getByTestId("target-input"), "3");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "Name and target are required"
    );
  });

  it("shows error when target is out of range", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Test");
    await user.clear(screen.getByTestId("target-input"));
    await user.type(screen.getByTestId("target-input"), "8");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "Target must be between 1 and 7"
    );
  });

  it("increments completions", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("increment-1"));
    expect(screen.getByTestId("habit-completed-1").textContent).toBe("3");
  });

  it("increments to on-track and shows On Track", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("increment-1"));
    expect(screen.getByTestId("habit-status-1").textContent).toBe("On Track");
  });

  it("increment does not exceed target", async () => {
    const user = userEvent.setup();
    // habit 3: completed=1, target=1, already at cap
    await user.click(screen.getByTestId("increment-3"));
    expect(screen.getByTestId("habit-completed-3").textContent).toBe("1");
  });

  it("deletes a habit", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("habit-1")).toBeNull();
    expect(screen.getByTestId("total-habits").textContent).toBe("3");
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("cat-filter"), "Food");
    const list = screen.getByTestId("habit-list");
    expect(list.textContent).toContain("Meatless Monday");
    expect(list.textContent).not.toContain("Bring reusable bag");
  });

  it("stats unaffected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("cat-filter"), "Food");
    expect(screen.getByTestId("total-habits").textContent).toBe("4");
  });
});
