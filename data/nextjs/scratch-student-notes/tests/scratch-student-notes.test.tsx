import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Student Notes App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByTestId("app-title")).toHaveTextContent("Student Notes");
  });

  it("renders all seed notes on load", () => {
    expect(screen.getByTestId("note-item-1")).toBeDefined();
    expect(screen.getByTestId("note-item-2")).toBeDefined();
    expect(screen.getByTestId("note-item-3")).toBeDefined();
    expect(screen.getByTestId("note-item-4")).toBeDefined();
  });

  it("shows correct initial note count", () => {
    expect(screen.getByTestId("note-count")).toHaveTextContent("4 notes");
  });

  it("displays note details correctly", () => {
    expect(screen.getByTestId("note-title-1")).toHaveTextContent("Algebra Basics");
    expect(screen.getByTestId("note-subject-1")).toHaveTextContent("Math");
    expect(screen.getByTestId("note-content-1")).toHaveTextContent("Variables, expressions, and equations overview.");
  });

  it("pinned note (id=2) shows Unpin button", () => {
    expect(screen.getByTestId("btn-pin-2")).toHaveTextContent("Unpin");
  });

  it("unpinned note shows Pin button", () => {
    expect(screen.getByTestId("btn-pin-1")).toHaveTextContent("Pin");
  });

  it("toggles pin state", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-pin-1"));
    expect(screen.getByTestId("btn-pin-1")).toHaveTextContent("Unpin");
    await user.click(screen.getByTestId("btn-pin-1"));
    expect(screen.getByTestId("btn-pin-1")).toHaveTextContent("Pin");
  });

  it("deletes a note", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-3"));
    expect(screen.queryByTestId("note-item-3")).toBeNull();
    expect(screen.getByTestId("note-count")).toHaveTextContent("3 notes");
  });

  it("filters notes by subject", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-subject"), "Math");
    expect(screen.getByTestId("note-item-1")).toBeDefined();
    expect(screen.queryByTestId("note-item-3")).toBeNull();
    expect(screen.getByTestId("note-count")).toHaveTextContent("1 notes");
  });

  it("searches notes by title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "Algebra");
    expect(screen.getByTestId("note-item-1")).toBeDefined();
    expect(screen.queryByTestId("note-item-2")).toBeNull();
    expect(screen.getByTestId("note-count")).toHaveTextContent("1 notes");
  });

  it("searches notes by content case-insensitively", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "organelle");
    expect(screen.getByTestId("note-item-2")).toBeDefined();
    expect(screen.queryByTestId("note-item-1")).toBeNull();
  });

  it("clears search", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "Algebra");
    await user.click(screen.getByTestId("btn-clear-search"));
    expect(screen.getByTestId("note-count")).toHaveTextContent("4 notes");
  });

  it("adds a new note", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "New Note");
    await user.selectOptions(screen.getByTestId("select-subject"), "History");
    await user.type(screen.getByTestId("input-content"), "Some content here");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("note-count")).toHaveTextContent("5 notes");
    expect(screen.getByTestId("note-title-5")).toHaveTextContent("New Note");
  });

  it("does not add note with empty title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-content"), "content only");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("note-count")).toHaveTextContent("4 notes");
  });
});
