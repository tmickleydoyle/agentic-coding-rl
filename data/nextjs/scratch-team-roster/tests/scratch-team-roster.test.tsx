import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

function getCards() {
  return screen.getAllByTestId("player-card");
}

function getCardField(card: HTMLElement, testId: string) {
  return within(card).getByTestId(testId).textContent ?? "";
}

describe("Team Roster", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /team roster/i })).toBeTruthy();
  });

  it("shows 7 seed players initially", () => {
    expect(getCards()).toHaveLength(7);
  });

  it("shows correct initial player count", () => {
    expect(screen.getByTestId("player-count").textContent).toContain("7");
  });

  it("renders search input", () => {
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  it("renders position filter", () => {
    expect(screen.getByTestId("position-filter")).toBeTruthy();
  });

  it("search filters by name case-insensitively", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "sofia");
    const cards = getCards();
    expect(cards).toHaveLength(1);
    expect(getCardField(cards[0], "card-name")).toBe("Sofia Martinez");
  });

  it("position filter shows only matching players", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("position-filter"), "Defender");
    const cards = getCards();
    expect(cards).toHaveLength(2);
    cards.forEach((c) => {
      expect(getCardField(c, "card-position")).toBe("Defender");
    });
  });

  it("player count updates when filtering", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("position-filter"), "Goalkeeper");
    expect(screen.getByTestId("player-count").textContent).toContain("1");
  });

  it("add player appends to the list at the top", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-jersey"), "99");
    await user.type(screen.getByTestId("input-name"), "New Player");
    await user.click(screen.getByTestId("btn-add-player"));
    const cards = getCards();
    expect(cards).toHaveLength(8);
    expect(getCardField(cards[0], "card-name")).toBe("New Player");
  });

  it("player count updates after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-jersey"), "99");
    await user.type(screen.getByTestId("input-name"), "New Player");
    await user.click(screen.getByTestId("btn-add-player"));
    expect(screen.getByTestId("player-count").textContent).toContain("8");
  });

  it("does not add player when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-jersey"), "99");
    await user.click(screen.getByTestId("btn-add-player"));
    expect(getCards()).toHaveLength(7);
  });

  it("remove button deletes a player", async () => {
    const user = userEvent.setup();
    const initialCards = getCards();
    const removeBtn = within(initialCards[0]).getByTestId("btn-remove");
    await user.click(removeBtn);
    expect(getCards()).toHaveLength(6);
  });

  it("search and position filter combine", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("position-filter"), "Forward");
    await user.type(screen.getByTestId("search-input"), "carlos");
    const cards = getCards();
    expect(cards).toHaveLength(1);
    expect(getCardField(cards[0], "card-name")).toBe("Carlos Mendes");
  });

  it("seed player cards show jersey numbers", () => {
    const cards = getCards();
    const jerseys = cards.map((c) => getCardField(c, "card-jersey"));
    expect(jerseys.some((j) => j.includes("10"))).toBe(true);
  });
});
