import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Codebase Notes", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /codebase notes/i })).toBeTruthy();
  });

  it("shows seed notes on load (5 notes)", () => {
    expect(screen.getByTestId("note-card-1")).toBeTruthy();
    expect(screen.getByTestId("note-card-5")).toBeTruthy();
  });

  it("seed note 5 appears before note 1 (newest-first)", () => {
    const list = screen.getByRole("region", { name: /notes list/i });
    const cards = within(list).getAllByTestId(/^note-card-/);
    const ids = cards.map((c) => c.getAttribute("data-testid"));
    expect(ids.indexOf("note-card-5")).toBeLessThan(ids.indexOf("note-card-1"));
  });

  it("shows error when adding note with empty fields", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toBeTruthy();
    expect(screen.getByTestId("form-error").textContent).toMatch(/all fields are required/i);
  });

  it("adds a new note and prepends it to the list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-file"), "src/new/module.ts");
    await user.type(screen.getByTestId("input-module"), "newmod");
    await user.selectOptions(screen.getByTestId("input-tag"), "note");
    await user.type(screen.getByTestId("input-body"), "A brand new note.");
    await user.click(screen.getByTestId("btn-add"));

    const list = screen.getByRole("region", { name: /notes list/i });
    const cards = within(list).getAllByTestId(/^note-card-/);
    expect(cards[0].textContent).toContain("src/new/module.ts");
    expect(cards[0].textContent).toContain("A brand new note.");
  });

  it("clears the form after adding a note", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-file"), "src/x.ts");
    await user.type(screen.getByTestId("input-module"), "x");
    await user.selectOptions(screen.getByTestId("input-tag"), "todo");
    await user.type(screen.getByTestId("input-body"), "Some body text.");
    await user.click(screen.getByTestId("btn-add"));

    expect((screen.getByTestId("input-file") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-body") as HTMLTextAreaElement).value).toBe("");
  });

  it("deletes a note", async () => {
    const user = userEvent.setup();
    expect(screen.getByTestId("note-card-3")).toBeTruthy();
    await user.click(screen.getByTestId("btn-delete-3"));
    expect(screen.queryByTestId("note-card-3")).toBeNull();
  });

  it("filters notes by tag", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-todo"));
    expect(screen.getByTestId("note-card-2")).toBeTruthy();
    expect(screen.getByTestId("note-card-5")).toBeTruthy();
    expect(screen.queryByTestId("note-card-1")).toBeNull();
  });

  it("filter-all shows all notes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-security"));
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getByTestId("note-card-1")).toBeTruthy();
    expect(screen.getByTestId("note-card-2")).toBeTruthy();
  });

  it("active filter button has aria-pressed true", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-performance"));
    expect(screen.getByTestId("filter-performance").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("filter-all").getAttribute("aria-pressed")).toBe("false");
  });

  it("search filters by file path", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-search"), "cache");
    expect(screen.getByTestId("note-card-4")).toBeTruthy();
    expect(screen.queryByTestId("note-card-1")).toBeNull();
  });

  it("search filters by body text (case-insensitive)", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-search"), "UUID");
    expect(screen.getByTestId("note-card-3")).toBeTruthy();
    expect(screen.queryByTestId("note-card-2")).toBeNull();
  });

  it("search and tag filter apply simultaneously", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-todo"));
    await user.type(screen.getByTestId("input-search"), "email");
    expect(screen.getByTestId("note-card-5")).toBeTruthy();
    expect(screen.queryByTestId("note-card-2")).toBeNull();
  });

  it("shows empty message when no notes match", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-search"), "xyzzy_no_match");
    expect(screen.getByTestId("empty-message")).toBeTruthy();
  });

  it("does not reset filter after deleting a note", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-todo"));
    await user.click(screen.getByTestId("btn-delete-5"));
    expect(screen.getByTestId("filter-todo").getAttribute("aria-pressed")).toBe("true");
    expect(screen.queryByTestId("note-card-5")).toBeNull();
  });
});
