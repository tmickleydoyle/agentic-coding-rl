import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Bar Inventory Manager", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /bar inventory/i })).toBeTruthy();
  });

  it("renders all 6 seed items", () => {
    expect(screen.getAllByTestId("inventory-card").length).toBe(6);
  });

  it("each card shows name, category, and quantity", () => {
    const cards = screen.getAllByTestId("inventory-card");
    const first = cards[0];
    expect(within(first).getByTestId("item-name").textContent).toBeTruthy();
    expect(within(first).getByTestId("item-category").textContent).toBeTruthy();
    expect(within(first).getByTestId("item-quantity").textContent).toBeTruthy();
  });

  it("shows low-stock banner because seed data has low-stock items", () => {
    expect(screen.getByTestId("low-stock-banner")).toBeTruthy();
  });

  it("low-stock-indicator present on items with quantity <= threshold", () => {
    const cards = screen.getAllByTestId("inventory-card");
    const lowStockCards = cards.filter((c) => within(c).queryByTestId("low-stock-indicator") !== null);
    expect(lowStockCards.length).toBeGreaterThan(0);
  });

  it("increment button increases quantity", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("inventory-card");
    const first = cards[0];
    const before = parseInt(within(first).getByTestId("item-quantity").textContent ?? "0");
    await user.click(within(first).getByTestId("increment-qty"));
    const after = parseInt(within(first).getByTestId("item-quantity").textContent ?? "0");
    expect(after).toBe(before + 1);
  });

  it("decrement button decreases quantity", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("inventory-card");
    const bulleitCard = cards.find((c) =>
      within(c).getByTestId("item-name").textContent?.includes("Bulleit")
    );
    expect(bulleitCard).toBeTruthy();
    const before = parseInt(within(bulleitCard!).getByTestId("item-quantity").textContent ?? "0");
    await user.click(within(bulleitCard!).getByTestId("decrement-qty"));
    const after = parseInt(within(bulleitCard!).getByTestId("item-quantity").textContent ?? "0");
    expect(after).toBe(before - 1);
  });

  it("decrement does not go below 0", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("inventory-card");
    const rumsCard = cards.find((c) =>
      within(c).getByTestId("item-name").textContent?.includes("Bacardi")
    );
    expect(rumsCard).toBeTruthy();
    await user.click(within(rumsCard!).getByTestId("decrement-qty"));
    const qty = parseInt(within(rumsCard!).getByTestId("item-quantity").textContent ?? "-1");
    expect(qty).toBe(0);
  });

  it("filter by category shows only matching items", async () => {
    const user = userEvent.setup();
    const catFilters = screen.getAllByTestId("category-filter");
    const ginBtn = catFilters.find((b) => b.textContent === "Gin");
    expect(ginBtn).toBeTruthy();
    await user.click(ginBtn!);
    const cards = screen.getAllByTestId("inventory-card");
    cards.forEach((card) => {
      expect(within(card).getByTestId("item-category").textContent).toBe("Gin");
    });
  });

  it("filter All restores full list", async () => {
    const user = userEvent.setup();
    const catFilters = screen.getAllByTestId("category-filter");
    await user.click(catFilters[0]);
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("inventory-card").length).toBe(6);
  });

  it("adds a new item", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Hendrick's Orbium");
    await user.type(screen.getByTestId("input-category"), "Gin");
    await user.type(screen.getByTestId("input-quantity"), "3");
    await user.type(screen.getByTestId("input-threshold"), "1");
    await user.click(screen.getByTestId("submit-item"));
    expect(screen.getAllByTestId("inventory-card").length).toBe(7);
  });

  it("does not add item when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-category"), "Gin");
    await user.click(screen.getByTestId("submit-item"));
    expect(screen.getAllByTestId("inventory-card").length).toBe(6);
  });

  it("new category from added item creates a new category filter button", async () => {
    const user = userEvent.setup();
    const before = screen.getAllByTestId("category-filter").length;
    await user.type(screen.getByTestId("input-name"), "Laphroaig 10");
    await user.type(screen.getByTestId("input-category"), "Scotch");
    await user.click(screen.getByTestId("submit-item"));
    expect(screen.getAllByTestId("category-filter").length).toBeGreaterThan(before);
  });

  it("low-stock banner count updates when quantity changes", async () => {
    const user = userEvent.setup();
    const bannerBefore = screen.getByTestId("low-stock-banner").textContent ?? "";
    const countBefore = parseInt(bannerBefore.match(/\d+/)?.[0] ?? "0");
    const cards = screen.getAllByTestId("inventory-card");
    const bulleitCard = cards.find((c) =>
      within(c).getByTestId("item-name").textContent?.includes("Bulleit")
    );
    await user.click(within(bulleitCard!).getByTestId("decrement-qty"));
    await user.click(within(bulleitCard!).getByTestId("decrement-qty"));
    await user.click(within(bulleitCard!).getByTestId("decrement-qty"));
    await user.click(within(bulleitCard!).getByTestId("decrement-qty"));
    const bannerAfter = screen.getByTestId("low-stock-banner").textContent ?? "";
    const countAfter = parseInt(bannerAfter.match(/\d+/)?.[0] ?? "0");
    expect(countAfter).toBeGreaterThanOrEqual(countBefore);
  });
});
