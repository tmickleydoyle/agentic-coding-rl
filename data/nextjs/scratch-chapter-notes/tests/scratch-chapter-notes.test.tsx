import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

beforeEach(() => {
  render(<App />);
});

describe("Seed data", () => {
  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /chapter notes/i })).toBeTruthy();
  });

  it("shows Moby Dick seed note", () => {
    expect(screen.getByTestId("note-book-1").textContent).toBe("Moby Dick");
  });

  it("shows chapter label for seed note 1", () => {
    expect(screen.getByTestId("note-chapter-1").textContent).toBe("Chapter 1");
  });

  it("shows 1984 seed note", () => {
    expect(screen.getByTestId("note-book-2").textContent).toBe("1984");
  });
});

describe("Add note", () => {
  it("adds a valid note", async () => {
    const user = userEvent.setup();
    const bookSelect = screen.getByTestId("select-book");
    await user.selectOptions(bookSelect, "1984");
    await user.clear(screen.getByTestId("input-chapter"));
    await user.type(screen.getByTestId("input-chapter"), "3");
    await user.type(screen.getByTestId("input-note"), "Big Brother is watching.");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Big Brother is watching.")).toBeTruthy();
  });

  it("resets form after successful add", async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByTestId("input-chapter"));
    await user.type(screen.getByTestId("input-chapter"), "2");
    await user.type(screen.getByTestId("input-note"), "Some note.");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-chapter") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-note") as HTMLTextAreaElement).value).toBe("");
  });

  it("rejects note when text is blank", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-chapter"), "2");
    await user.click(screen.getByTestId("btn-add"));
    const list = screen.getByTestId("note-list");
    expect(within(list).getAllByRole("listitem").length).toBe(2);
  });

  it("rejects note when chapter is 0", async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByTestId("input-chapter"));
    await user.type(screen.getByTestId("input-chapter"), "0");
    await user.type(screen.getByTestId("input-note"), "Invalid chapter.");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Invalid chapter.")).toBeNull();
  });

  it("rejects note when chapter is negative", async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByTestId("input-chapter"));
    await user.type(screen.getByTestId("input-chapter"), "-1");
    await user.type(screen.getByTestId("input-note"), "Negative chapter.");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Negative chapter.")).toBeNull();
  });
});

describe("Delete note", () => {
  it("removes a note when Delete is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("note-card-1")).toBeNull();
  });

  it("does not remove other notes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.getByTestId("note-card-2")).toBeTruthy();
  });
});

describe("Filter by book", () => {
  it("filters notes by selected book", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-book"), "1984");
    expect(screen.queryByTestId("note-card-1")).toBeNull();
    expect(screen.getByTestId("note-card-2")).toBeTruthy();
  });

  it("All option shows all notes", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-book"), "1984");
    await user.selectOptions(screen.getByTestId("filter-book"), "All");
    expect(screen.getByTestId("note-card-1")).toBeTruthy();
    expect(screen.getByTestId("note-card-2")).toBeTruthy();
  });
});
