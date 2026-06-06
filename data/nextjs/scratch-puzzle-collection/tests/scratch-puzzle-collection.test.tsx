import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Puzzle Collection", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Puzzle Collection" })).toBeTruthy();
  });

  it("shows initial stats", () => {
    expect(screen.getByTestId("total-puzzles").textContent).toBe("4");
    expect(screen.getByTestId("solved-count").textContent).toBe("2");
    expect(screen.getByTestId("unsolved-count").textContent).toBe("2");
  });

  it("renders all seed puzzle cards", () => {
    expect(screen.getByTestId("puzzle-card-1")).toBeTruthy();
    expect(screen.getByTestId("puzzle-card-4")).toBeTruthy();
  });

  it("shows correct seed puzzle data", () => {
    expect(screen.getByTestId("puzzle-title-1").textContent).toBe("Towers of Hanoi");
    expect(screen.getByTestId("puzzle-category-1").textContent).toBe("Logic");
    expect(screen.getByTestId("puzzle-difficulty-2").textContent).toBe("5/5");
    expect(screen.getByTestId("puzzle-status-1").textContent).toBe("Solved");
    expect(screen.getByTestId("puzzle-status-2").textContent).toBe("Unsolved");
  });

  it("shows notes for puzzles", () => {
    expect(screen.getByTestId("puzzle-notes-1").textContent).toBe("Move all discs to target peg");
    expect(screen.getByTestId("puzzle-notes-4").textContent).toBe("");
  });

  it("toggle button text matches status", () => {
    expect(screen.getByTestId("toggle-solved-1").textContent).toBe("Mark Unsolved");
    expect(screen.getByTestId("toggle-solved-2").textContent).toBe("Mark Solved");
  });

  it("toggles puzzle solved status", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-solved-2"));
    expect(screen.getByTestId("puzzle-status-2").textContent).toBe("Solved");
    expect(screen.getByTestId("toggle-solved-2").textContent).toBe("Mark Unsolved");
  });

  it("removes a puzzle and updates stats", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove-puzzle-3"));
    expect(screen.queryByTestId("puzzle-card-3")).toBeNull();
    expect(screen.getByTestId("total-puzzles").textContent).toBe("3");
    expect(screen.getByTestId("solved-count").textContent).toBe("1");
  });

  it("adds a new puzzle", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("title-input"), "Maze Runner");
    await user.clear(screen.getByTestId("difficulty-input"));
    await user.type(screen.getByTestId("difficulty-input"), "2");
    await user.click(screen.getByTestId("add-puzzle-btn"));
    expect(screen.getByTestId("total-puzzles").textContent).toBe("5");
  });

  it("does not add puzzle with empty title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("difficulty-input"), "3");
    await user.click(screen.getByTestId("add-puzzle-btn"));
    expect(screen.getByTestId("total-puzzles").textContent).toBe("4");
  });

  it("filters puzzles by category", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("category-filter"), "Logic");
    expect(screen.getByTestId("puzzle-card-1")).toBeTruthy();
    expect(screen.queryByTestId("puzzle-card-2")).toBeNull();
  });

  it("filter all shows all puzzles", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("category-filter"), "Logic");
    await user.selectOptions(screen.getByTestId("category-filter"), "All");
    expect(screen.getByTestId("puzzle-card-1")).toBeTruthy();
    expect(screen.getByTestId("puzzle-card-2")).toBeTruthy();
  });

  it("stats are not affected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("category-filter"), "Spatial");
    expect(screen.getByTestId("total-puzzles").textContent).toBe("4");
  });

  it("clears form after adding puzzle", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("title-input"), "New Puzzle");
    await user.type(screen.getByTestId("difficulty-input"), "3");
    await user.click(screen.getByTestId("add-puzzle-btn"));
    expect((screen.getByTestId("title-input") as HTMLInputElement).value).toBe("");
  });
});
