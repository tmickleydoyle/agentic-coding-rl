import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("PR Review Notes", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /pr review notes/i })).toBeTruthy();
  });

  it("renders all 6 seed note cards", () => {
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`note-card-${i}`)).toBeTruthy();
    }
  });

  it("shows pr number for seed notes", () => {
    expect(screen.getByTestId("pr-number-1").textContent).toBe("42");
    expect(screen.getByTestId("pr-number-5").textContent).toBe("67");
  });

  it("shows note text", () => {
    expect(screen.getByTestId("note-text-1").textContent).toContain("Missing error handling");
  });

  it("shows category badges", () => {
    expect(screen.getByTestId("category-badge-1").textContent).toBe("bug");
    expect(screen.getByTestId("category-badge-2").textContent).toBe("suggestion");
    expect(screen.getByTestId("category-badge-3").textContent).toBe("nit");
  });

  it("shows resolved indicator for resolved notes", () => {
    expect(screen.getByTestId("resolved-indicator-3")).toBeTruthy();
    expect(screen.getByTestId("resolved-indicator-6")).toBeTruthy();
  });

  it("does not show resolved indicator for unresolved notes", () => {
    expect(screen.queryByTestId("resolved-indicator-1")).toBeNull();
    expect(screen.queryByTestId("resolved-indicator-2")).toBeNull();
  });

  it("shows correct stats", () => {
    expect(screen.getByTestId("stat-total").textContent).toContain("6");
    expect(screen.getByTestId("stat-resolved").textContent).toContain("2");
    expect(screen.getByTestId("stat-unresolved").textContent).toContain("4");
  });

  it("resolve button toggles to unresolve", async () => {
    const btn = screen.getByTestId("btn-resolve-1");
    expect(btn.textContent).toBe("Resolve");
    await userEvent.click(btn);
    expect(screen.getByTestId("btn-resolve-1").textContent).toBe("Unresolve");
    expect(screen.getByTestId("resolved-indicator-1")).toBeTruthy();
  });

  it("unresolve button toggles back", async () => {
    await userEvent.click(screen.getByTestId("btn-resolve-3"));
    expect(screen.getByTestId("btn-resolve-3").textContent).toBe("Resolve");
    expect(screen.queryByTestId("resolved-indicator-3")).toBeNull();
  });

  it("filters by bug category", async () => {
    await userEvent.click(screen.getByTestId("filter-bug"));
    expect(screen.getByTestId("note-card-1")).toBeTruthy();
    expect(screen.getByTestId("note-card-5")).toBeTruthy();
    expect(screen.queryByTestId("note-card-2")).toBeNull();
  });

  it("filter all shows all notes", async () => {
    await userEvent.click(screen.getByTestId("filter-nit"));
    await userEvent.click(screen.getByTestId("filter-all"));
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`note-card-${i}`)).toBeTruthy();
    }
  });

  it("adds new note", async () => {
    await userEvent.type(screen.getByTestId("input-author"), "frank");
    await userEvent.type(screen.getByTestId("input-note"), "Add more tests");
    await userEvent.click(screen.getByTestId("btn-add-note"));
    expect(screen.getByTestId("note-card-7")).toBeTruthy();
  });

  it("does not add note with empty author", async () => {
    await userEvent.type(screen.getByTestId("input-note"), "Something");
    await userEvent.click(screen.getByTestId("btn-add-note"));
    expect(screen.queryByTestId("note-card-7")).toBeNull();
  });

  it("does not add note with empty note text", async () => {
    await userEvent.type(screen.getByTestId("input-author"), "grace");
    await userEvent.click(screen.getByTestId("btn-add-note"));
    expect(screen.queryByTestId("note-card-7")).toBeNull();
  });

  it("deletes a note", async () => {
    await userEvent.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("note-card-1")).toBeNull();
    expect(screen.getByTestId("stat-total").textContent).toContain("5");
  });

  it("stats are global not filtered", async () => {
    await userEvent.click(screen.getByTestId("filter-bug"));
    expect(screen.getByTestId("stat-total").textContent).toContain("6");
  });
});
