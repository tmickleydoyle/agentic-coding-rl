import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Podcast Notes", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /podcast notes/i })).toBeTruthy();
  });

  it("shows seed notes on load", () => {
    const cards = screen.getAllByTestId("note-card");
    expect(cards.length).toBe(3);
  });

  it("shows correct initial note count", () => {
    expect(screen.getByTestId("note-count").textContent).toContain("3");
  });

  it("displays seed note podcast names", () => {
    const podcasts = screen.getAllByTestId("note-podcast");
    expect(podcasts[0].textContent).toBe("Lex Fridman Podcast");
  });

  it("displays seed note timestamps", () => {
    const timestamps = screen.getAllByTestId("note-timestamp");
    expect(timestamps[1].textContent).toBe("45:10");
  });

  it("adds a new note when all fields are filled", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/podcast/i), "My Show");
    await user.type(screen.getByLabelText(/episode/i), "Ep 1");
    await user.type(screen.getByLabelText(/note/i), "Great insights");
    await user.type(screen.getByLabelText(/timestamp/i), "05:00");
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(screen.getAllByTestId("note-card").length).toBe(4);
  });

  it("clears form after adding a note", async () => {
    const user = userEvent.setup();
    const podcastInput = screen.getByLabelText(/podcast/i);
    await user.type(podcastInput, "My Show");
    await user.type(screen.getByLabelText(/episode/i), "Ep 1");
    await user.type(screen.getByLabelText(/note/i), "Great insights");
    await user.type(screen.getByLabelText(/timestamp/i), "05:00");
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect((podcastInput as HTMLInputElement).value).toBe("");
  });

  it("shows error when fields are empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(screen.getByTestId("error-message").textContent).toContain("All fields are required");
  });

  it("does not add note when validation fails", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/podcast/i), "Only Podcast");
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(screen.getAllByTestId("note-card").length).toBe(3);
  });

  it("deletes a note when Delete is clicked", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("note-card");
    const deleteBtn = within(cards[0]).getByRole("button", { name: /delete/i });
    await user.click(deleteBtn);
    expect(screen.getAllByTestId("note-card").length).toBe(2);
  });

  it("updates note count after deletion", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("note-card");
    await user.click(within(cards[0]).getByRole("button", { name: /delete/i }));
    expect(screen.getByTestId("note-count").textContent).toContain("2");
  });

  it("error clears after successful add", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(screen.getByTestId("error-message")).toBeTruthy();
    await user.type(screen.getByLabelText(/podcast/i), "Show");
    await user.type(screen.getByLabelText(/episode/i), "E1");
    await user.type(screen.getByLabelText(/note/i), "Note");
    await user.type(screen.getByLabelText(/timestamp/i), "01:00");
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(screen.queryByTestId("error-message")).toBeNull();
  });

  it("rejects whitespace-only fields", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/podcast/i), "   ");
    await user.type(screen.getByLabelText(/episode/i), "   ");
    await user.type(screen.getByLabelText(/note/i), "   ");
    await user.type(screen.getByLabelText(/timestamp/i), "   ");
    await user.click(screen.getByRole("button", { name: /add note/i }));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });
});
