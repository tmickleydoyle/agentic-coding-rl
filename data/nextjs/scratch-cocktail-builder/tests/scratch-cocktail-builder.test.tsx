import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Cocktail Builder", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /cocktail builder/i })).toBeTruthy();
  });

  it("renders all 3 seed cocktails", () => {
    expect(screen.getAllByTestId("cocktail-card").length).toBe(3);
  });

  it("each card shows name, category, ingredients, and instructions", () => {
    const cards = screen.getAllByTestId("cocktail-card");
    const first = cards[0];
    expect(within(first).getByTestId("cocktail-name").textContent).toBeTruthy();
    expect(within(first).getByTestId("cocktail-category").textContent).toBeTruthy();
    expect(within(first).getByTestId("cocktail-ingredients")).toBeTruthy();
    expect(within(first).getByTestId("cocktail-instructions").textContent).toBeTruthy();
  });

  it("filter Classic shows only classic cocktails", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-classic"));
    const cards = screen.getAllByTestId("cocktail-card");
    cards.forEach((card) => {
      expect(within(card).getByTestId("cocktail-category").textContent).toBe("Classic");
    });
  });

  it("filter Modern shows only modern cocktails", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-modern"));
    const cards = screen.getAllByTestId("cocktail-card");
    cards.forEach((card) => {
      expect(within(card).getByTestId("cocktail-category").textContent).toBe("Modern");
    });
  });

  it("filter All restores all cocktails", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-classic"));
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("cocktail-card").length).toBe(3);
  });

  it("adding an ingredient appends it to the pending list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-ingredient"), "Vodka (2 oz)");
    await user.click(screen.getByTestId("add-ingredient"));
    const items = screen.getAllByTestId("ingredient-item");
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain("Vodka (2 oz)");
  });

  it("clicking add-ingredient with empty input does nothing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-ingredient"));
    expect(screen.queryAllByTestId("ingredient-item").length).toBe(0);
  });

  it("remove ingredient button removes ingredient from pending list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-ingredient"), "Gin (1.5 oz)");
    await user.click(screen.getByTestId("add-ingredient"));
    expect(screen.getAllByTestId("ingredient-item").length).toBe(1);
    await user.click(screen.getByTestId("remove-ingredient"));
    expect(screen.queryAllByTestId("ingredient-item").length).toBe(0);
  });

  it("saves a new cocktail when name and at least one ingredient are provided", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Moscow Mule");
    await user.type(screen.getByTestId("input-ingredient"), "Vodka (2 oz)");
    await user.click(screen.getByTestId("add-ingredient"));
    await user.type(screen.getByTestId("input-instructions"), "Mix and serve over ice.");
    await user.click(screen.getByTestId("submit-cocktail"));
    expect(screen.getAllByTestId("cocktail-card").length).toBe(4);
    const names = screen.getAllByTestId("cocktail-name").map((el) => el.textContent);
    expect(names).toContain("Moscow Mule");
  });

  it("does not save cocktail with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-ingredient"), "Rum (2 oz)");
    await user.click(screen.getByTestId("add-ingredient"));
    await user.click(screen.getByTestId("submit-cocktail"));
    expect(screen.getAllByTestId("cocktail-card").length).toBe(3);
  });

  it("does not save cocktail with no ingredients", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Empty Drink");
    await user.click(screen.getByTestId("submit-cocktail"));
    expect(screen.getAllByTestId("cocktail-card").length).toBe(3);
  });

  it("form resets after saving", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Test Cocktail");
    await user.type(screen.getByTestId("input-ingredient"), "Rum (2 oz)");
    await user.click(screen.getByTestId("add-ingredient"));
    await user.click(screen.getByTestId("submit-cocktail"));
    expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe("");
    expect(screen.queryAllByTestId("ingredient-item").length).toBe(0);
  });

  it("saved cocktail shows its ingredients in the card", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Negroni");
    await user.type(screen.getByTestId("input-ingredient"), "Campari (1 oz)");
    await user.click(screen.getByTestId("add-ingredient"));
    await user.type(screen.getByTestId("input-ingredient"), "Gin (1 oz)");
    await user.click(screen.getByTestId("add-ingredient"));
    await user.click(screen.getByTestId("submit-cocktail"));
    const cards = screen.getAllByTestId("cocktail-card");
    const negroni = cards.find((c) =>
      within(c).getByTestId("cocktail-name").textContent === "Negroni"
    );
    expect(negroni).toBeTruthy();
    expect(within(negroni!).getByTestId("cocktail-ingredients").textContent).toContain("Campari (1 oz)");
  });
});
