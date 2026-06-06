import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Talk Notes", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /talk notes/i })).toBeTruthy();
  });

  it("shows 4 seed notes initially", () => {
    expect(screen.getByTestId("note-count").textContent).toContain("4");
  });

  it("displays seed note session and speaker", () => {
    expect(screen.getByTestId("note-session-1").textContent).toBe("Keynote: Future of AI");
    expect(screen.getByTestId("note-speaker-1").textContent).toBe("Dr. Ada Lovelace");
  });

  it("displays seed note tag and text", () => {
    expect(screen.getByTestId("note-tag-2").textContent).toBe("frontend");
    expect(screen.getByTestId("note-text-3").textContent).toContain("circuit breaker");
  });

  it("adds a new note and shows it at top", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-session"), "New Session");
    await user.type(screen.getByTestId("input-speaker"), "New Speaker");
    await user.type(screen.getByTestId("input-tag"), "newtag");
    await user.type(screen.getByTestId("input-note"), "Some note text");
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("note-count").textContent).toContain("5");
    expect(screen.getByTestId("note-session-5").textContent).toBe("New Session");
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-session"), "S");
    await user.type(screen.getByTestId("input-speaker"), "Sp");
    await user.type(screen.getByTestId("input-tag"), "t");
    await user.type(screen.getByTestId("input-note"), "n");
    await user.click(screen.getByTestId("add-btn"));
    expect((screen.getByTestId("input-session") as HTMLInputElement).value).toBe("");
  });

  it("does not add note when fields are empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-btn"));
    expect(screen.getByTestId("note-count").textContent).toContain("4");
  });

  it("deletes a note", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-btn-4"));
    expect(screen.queryByTestId("note-4")).toBeNull();
    expect(screen.getByTestId("note-count").textContent).toContain("3");
  });

  it("enters edit mode when Edit is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-1"));
    expect(screen.getByTestId("edit-form-1")).toBeTruthy();
  });

  it("saves edited note", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-2"));
    const sessionInput = screen.getByTestId("edit-session-2") as HTMLInputElement;
    await user.clear(sessionInput);
    await user.type(sessionInput, "Updated Session");
    await user.click(screen.getByTestId("save-btn-2"));
    expect(screen.getByTestId("note-session-2").textContent).toBe("Updated Session");
  });

  it("cancel discards edit", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-3"));
    await user.click(screen.getByTestId("cancel-btn-3"));
    expect(screen.queryByTestId("edit-form-3")).toBeNull();
    expect(screen.getByTestId("note-session-3").textContent).toBe("Scaling Microservices");
  });

  it("tag filter hides non-matching notes", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("tag-filter"), "ai");
    expect(screen.getByTestId("note-1")).toBeTruthy();
    expect(screen.queryByTestId("note-2")).toBeNull();
  });

  it("tag filter count updates", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("tag-filter"), "backend");
    expect(screen.getByTestId("note-count").textContent).toContain("1");
  });

  it("tag filter is case-insensitive", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("tag-filter"), "FRONTEND");
    expect(screen.getByTestId("note-2")).toBeTruthy();
  });
});
