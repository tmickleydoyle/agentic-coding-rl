import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Tasting Notes Journal", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /tasting notes/i })).toBeTruthy();
  });

  it("renders all 3 seed notes", () => {
    expect(screen.getAllByTestId("note-card").length).toBe(3);
  });

  it("each card shows beverage, producer, vintage, score, and notes", () => {
    const cards = screen.getAllByTestId("note-card");
    const first = cards[0];
    expect(within(first).getByTestId("note-beverage").textContent).toBeTruthy();
    expect(within(first).getByTestId("note-producer").textContent).toBeTruthy();
    expect(within(first).getByTestId("note-vintage").textContent).toBeTruthy();
    expect(within(first).getByTestId("note-score").textContent).toContain("/100");
    expect(within(first).getByTestId("note-notes").textContent).toBeTruthy();
  });

  it("search filters notes by beverage", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "Barolo");
    const cards = screen.getAllByTestId("note-card");
    expect(cards.length).toBe(1);
    expect(within(cards[0]).getByTestId("note-beverage").textContent).toBe("Barolo");
  });

  it("search filters by producer (case-insensitive)", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "ardbeg");
    const cards = screen.getAllByTestId("note-card");
    expect(cards.length).toBe(1);
    expect(within(cards[0]).getByTestId("note-producer").textContent).toContain("Ardbeg");
  });

  it("search with no match shows empty list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "xyzzy999");
    expect(screen.queryAllByTestId("note-card").length).toBe(0);
  });

  it("adds a new note", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-beverage"), "Champagne");
    await user.type(screen.getByTestId("input-producer"), "Krug");
    await user.type(screen.getByTestId("input-vintage"), "2008");
    await user.type(screen.getByTestId("input-score"), "99");
    await user.type(screen.getByTestId("input-notes"), "Toasty brioche and lemon curd");
    await user.click(screen.getByTestId("submit-note"));
    expect(screen.getAllByTestId("note-card").length).toBe(4);
    const beverages = screen.getAllByTestId("note-beverage").map((el) => el.textContent);
    expect(beverages).toContain("Champagne");
  });

  it("does not add note when beverage is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-notes"), "Some notes");
    await user.click(screen.getByTestId("submit-note"));
    expect(screen.getAllByTestId("note-card").length).toBe(3);
  });

  it("does not add note when notes field is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-beverage"), "Some drink");
    await user.click(screen.getByTestId("submit-note"));
    expect(screen.getAllByTestId("note-card").length).toBe(3);
  });

  it("deletes a note", async () => {
    const user = userEvent.setup();
    const deleteButtons = screen.getAllByTestId("delete-note");
    await user.click(deleteButtons[0]);
    expect(screen.getAllByTestId("note-card").length).toBe(2);
  });

  it("edit shows inline form pre-populated with existing values", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("note-card");
    const editBtn = within(cards[0]).getByTestId("edit-note");
    const originalBeverage = within(cards[0]).getByTestId("note-beverage").textContent;
    await user.click(editBtn);
    const inputs = within(cards[0]).getAllByRole("textbox");
    const hasValue = inputs.some((inp) => (inp as HTMLInputElement).value === originalBeverage);
    expect(hasValue).toBe(true);
  });

  it("cancel edit restores original card view", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("note-card");
    await user.click(within(cards[0]).getByTestId("edit-note"));
    await user.click(screen.getByTestId("cancel-edit"));
    expect(screen.getByTestId("note-beverage")).toBeTruthy();
  });

  it("save edit updates note text", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("note-card");
    await user.click(within(cards[0]).getByTestId("edit-note"));
    const editedCard = screen.getAllByTestId("note-card")[0];
    const inputs = within(editedCard).getAllByRole("textbox");
    await user.clear(inputs[0]);
    await user.type(inputs[0], "Updated Beverage");
    await user.click(screen.getByTestId("save-edit"));
    const beverages = screen.getAllByTestId("note-beverage").map((el) => el.textContent);
    expect(beverages).toContain("Updated Beverage");
  });
});
