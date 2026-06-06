import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Candidate Notes", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /candidate notes/i })).toBeTruthy();
  });

  it("renders 5 note cards from seed data", () => {
    expect(screen.getAllByTestId("note-card").length).toBe(5);
  });

  it("shows note candidate, tag, and text", () => {
    const cards = screen.getAllByTestId("note-card");
    const aliceCard = cards.find((c) =>
      within(c).getByTestId("note-candidate").textContent === "Alice Mercer" &&
      within(c).getByTestId("note-tag").textContent === "Policy"
    );
    expect(aliceCard).toBeTruthy();
    expect(within(aliceCard!).getByTestId("note-text").textContent).toContain("renewable energy");
  });

  it("search filters notes by text content", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "affordable housing");
    expect(screen.getAllByTestId("note-card").length).toBe(1);
    expect(screen.getByTestId("note-candidate").textContent).toBe("Carol Nguyen");
  });

  it("search filters notes by candidate name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "Carol");
    expect(screen.getAllByTestId("note-card").length).toBe(1);
  });

  it("tag filter narrows results", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("tag-filter"), "Background");
    expect(screen.getAllByTestId("note-card").length).toBe(1);
    expect(screen.getByTestId("note-candidate").textContent).toBe("Bob Harrington");
  });

  it("search and tag filter combine with AND logic", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "Bob");
    await user.selectOptions(screen.getByTestId("tag-filter"), "Policy");
    // Bob has two notes total; only one matches Policy
    expect(screen.getAllByTestId("note-card").length).toBe(1);
  });

  it("adds a new note and clears form", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("add-candidate-input"), "Dave Kim");
    await user.type(screen.getByTestId("add-tag-input"), "Event");
    await user.type(screen.getByTestId("add-note-textarea"), "Town hall scheduled for July");
    await user.click(screen.getByTestId("add-note-btn"));

    expect(screen.getAllByTestId("note-card").length).toBe(6);
    expect((screen.getByTestId("add-candidate-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("add-tag-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("add-note-textarea") as HTMLTextAreaElement).value).toBe("");
  });

  it("does not add note if any field is blank", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("add-candidate-input"), "Dave Kim");
    await user.click(screen.getByTestId("add-note-btn"));
    expect(screen.getAllByTestId("note-card").length).toBe(5);
  });

  it("deletes a note", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("note-card");
    const carolCard = cards.find((c) =>
      within(c).getByTestId("note-candidate").textContent === "Carol Nguyen"
    );
    await user.click(within(carolCard!).getByTestId("delete-btn"));
    expect(screen.getAllByTestId("note-card").length).toBe(4);
  });

  it("edits a note inline and saves", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("note-card");
    const aliceCard = cards.find((c) =>
      within(c).queryByTestId("note-tag") &&
      within(c).getByTestId("note-tag").textContent === "Policy" &&
      within(c).getByTestId("note-candidate").textContent === "Alice Mercer"
    );
    await user.click(within(aliceCard!).getByTestId("edit-btn"));

    const noteInput = screen.getByTestId("edit-note-input") as HTMLTextAreaElement;
    await user.clear(noteInput);
    await user.type(noteInput, "Updated policy note");
    await user.click(screen.getByTestId("save-btn"));

    const updatedCards = screen.getAllByTestId("note-card");
    const updatedAlice = updatedCards.find((c) =>
      within(c).queryByTestId("note-candidate") &&
      within(c).getByTestId("note-candidate").textContent === "Alice Mercer" &&
      within(c).queryByTestId("note-tag") &&
      within(c).getByTestId("note-tag").textContent === "Policy"
    );
    expect(within(updatedAlice!).getByTestId("note-text").textContent).toBe("Updated policy note");
  });

  it("cancel edit reverts to read mode without saving", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("note-card");
    const carolCard = cards.find((c) =>
      within(c).getByTestId("note-candidate").textContent === "Carol Nguyen"
    );
    await user.click(within(carolCard!).getByTestId("edit-btn"));
    const noteInput = screen.getByTestId("edit-note-input") as HTMLTextAreaElement;
    await user.clear(noteInput);
    await user.type(noteInput, "Changed text");
    await user.click(screen.getByTestId("cancel-btn"));

    const refreshed = screen.getAllByTestId("note-card");
    const refreshedCarol = refreshed.find((c) =>
      within(c).queryByTestId("note-candidate") &&
      within(c).getByTestId("note-candidate").textContent === "Carol Nguyen"
    );
    expect(within(refreshedCarol!).getByTestId("note-text").textContent).toContain("affordable housing");
  });

  it("tag dropdown updates after adding a note with a new tag", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("add-candidate-input"), "Eve Lang");
    await user.type(screen.getByTestId("add-tag-input"), "Finance");
    await user.type(screen.getByTestId("add-note-textarea"), "Campaign finance details");
    await user.click(screen.getByTestId("add-note-btn"));

    const tagFilter = screen.getByTestId("tag-filter") as HTMLSelectElement;
    const options = Array.from(tagFilter.options).map((o) => o.value);
    expect(options).toContain("Finance");
  });
});
