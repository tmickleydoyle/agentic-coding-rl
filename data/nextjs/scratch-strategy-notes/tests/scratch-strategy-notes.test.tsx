import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Strategy Notes", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Strategy Notes" })).toBeTruthy();
  });

  it("shows correct initial stats", () => {
    expect(screen.getByTestId("total-notes").textContent).toBe("4");
    expect(screen.getByTestId("active-notes").textContent).toBe("3");
    expect(screen.getByTestId("archived-notes").textContent).toBe("1");
  });

  it("hides archived notes by default", () => {
    expect(screen.queryByTestId("note-card-3")).toBeNull();
    expect(screen.getByTestId("note-card-1")).toBeTruthy();
  });

  it("shows archived notes after toggle", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-archived-btn"));
    expect(screen.getByTestId("note-card-3")).toBeTruthy();
  });

  it("toggle button text changes", async () => {
    expect(screen.getByTestId("toggle-archived-btn").textContent).toBe("Show Archived");
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-archived-btn"));
    expect(screen.getByTestId("toggle-archived-btn").textContent).toBe("Hide Archived");
  });

  it("shows correct seed note data", () => {
    expect(screen.getByTestId("note-title-1").textContent).toBe("Opening Gambit");
    expect(screen.getByTestId("note-content-1").textContent).toBe("Control center squares early");
    expect(screen.getByTestId("note-priority-1").textContent).toBe("high");
    expect(screen.getByTestId("note-archive-status-1").textContent).toBe("Active");
    expect(screen.getByTestId("note-tags-1").textContent).toBe("chess, opening");
  });

  it("search filters notes by title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "Gambit");
    expect(screen.getByTestId("note-card-1")).toBeTruthy();
    expect(screen.queryByTestId("note-card-2")).toBeNull();
  });

  it("search filters notes by content", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "wood");
    expect(screen.getByTestId("note-card-2")).toBeTruthy();
    expect(screen.queryByTestId("note-card-1")).toBeNull();
  });

  it("archives an active note", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("archive-toggle-1"));
    expect(screen.getByTestId("note-archive-status-1").textContent).toBe("Archived");
    expect(screen.getByTestId("archived-notes").textContent).toBe("2");
  });

  it("unarchives a note when showing archived", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-archived-btn"));
    await user.click(screen.getByTestId("archive-toggle-3"));
    expect(screen.getByTestId("note-archive-status-3").textContent).toBe("Active");
    expect(screen.getByTestId("archived-notes").textContent).toBe("0");
  });

  it("deletes a note and updates stats", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-note-4"));
    expect(screen.queryByTestId("note-card-4")).toBeNull();
    expect(screen.getByTestId("total-notes").textContent).toBe("3");
  });

  it("adds a new note", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("note-title-input"), "Flanking Strategy");
    await user.type(screen.getByTestId("note-content-input"), "Attack from the sides");
    await user.click(screen.getByTestId("add-note-btn"));
    expect(screen.getByTestId("total-notes").textContent).toBe("5");
  });

  it("does not add note with empty title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("note-content-input"), "Some content");
    await user.click(screen.getByTestId("add-note-btn"));
    expect(screen.getByTestId("total-notes").textContent).toBe("4");
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("note-title-input"), "New Note");
    await user.type(screen.getByTestId("note-content-input"), "Note content");
    await user.click(screen.getByTestId("add-note-btn"));
    expect((screen.getByTestId("note-title-input") as HTMLInputElement).value).toBe("");
  });

  it("stats unaffected by search", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "chess");
    expect(screen.getByTestId("total-notes").textContent).toBe("4");
  });
});
