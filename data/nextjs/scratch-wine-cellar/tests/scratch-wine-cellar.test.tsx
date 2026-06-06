import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Wine Cellar", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /wine cellar/i })).toBeTruthy();
  });

  it("renders all 5 seed wines", () => {
    const cards = screen.getAllByTestId("wine-card");
    expect(cards.length).toBe(5);
  });

  it("displays wine name, winery, year, type, region, and quantity in each card", () => {
    const cards = screen.getAllByTestId("wine-card");
    const first = cards[0];
    expect(within(first).getByTestId("wine-name").textContent).toBeTruthy();
    expect(within(first).getByTestId("wine-winery").textContent).toBeTruthy();
    expect(within(first).getByTestId("wine-year").textContent).toBeTruthy();
    expect(within(first).getByTestId("wine-type").textContent).toBeTruthy();
    expect(within(first).getByTestId("wine-region").textContent).toBeTruthy();
    expect(within(first).getByTestId("wine-quantity").textContent).toContain("bottles");
  });

  it("filter Red shows only red wines", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-red"));
    const cards = screen.getAllByTestId("wine-card");
    cards.forEach((card) => {
      expect(within(card).getByTestId("wine-type").textContent).toBe("Red");
    });
  });

  it("filter White shows only white wines", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-white"));
    const cards = screen.getAllByTestId("wine-card");
    cards.forEach((card) => {
      expect(within(card).getByTestId("wine-type").textContent).toBe("White");
    });
  });

  it("filter Rosé shows only rosé wines", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-rose"));
    const cards = screen.getAllByTestId("wine-card");
    cards.forEach((card) => {
      expect(within(card).getByTestId("wine-type").textContent).toBe("Rosé");
    });
  });

  it("filter All restores all wines", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-red"));
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("wine-card").length).toBe(5);
  });

  it("sort by year ascending orders wines by year low to high", async () => {
    const user = userEvent.setup();
    const sortBtn = screen.getByTestId("sort-year");
    await user.click(sortBtn);
    const years = screen
      .getAllByTestId("wine-year")
      .map((el) => parseInt(el.textContent ?? "0"));
    const sorted = [...years].sort((a, b) => a - b);
    expect(years).toEqual(sorted);
  });

  it("sort by year descending on second click", async () => {
    const user = userEvent.setup();
    const sortBtn = screen.getByTestId("sort-year");
    await user.click(sortBtn);
    await user.click(sortBtn);
    const years = screen
      .getAllByTestId("wine-year")
      .map((el) => parseInt(el.textContent ?? "0"));
    const sorted = [...years].sort((a, b) => b - a);
    expect(years).toEqual(sorted);
  });

  it("adds a new wine when form is submitted", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Malbec");
    await user.type(screen.getByTestId("input-winery"), "Clos de los Siete");
    await user.type(screen.getByTestId("input-year"), "2017");
    await user.type(screen.getByTestId("input-region"), "Mendoza");
    await user.type(screen.getByTestId("input-quantity"), "3");
    await user.click(screen.getByTestId("submit-wine"));
    expect(screen.getAllByTestId("wine-card").length).toBe(6);
    const names = screen
      .getAllByTestId("wine-name")
      .map((el) => el.textContent);
    expect(names).toContain("Malbec");
  });

  it("does not add wine when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-winery"), "Test Winery");
    await user.click(screen.getByTestId("submit-wine"));
    expect(screen.getAllByTestId("wine-card").length).toBe(5);
  });

  it("does not add wine when winery is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Test Wine");
    await user.click(screen.getByTestId("submit-wine"));
    expect(screen.getAllByTestId("wine-card").length).toBe(5);
  });

  it("resets form fields after adding a wine", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Tempranillo");
    await user.type(screen.getByTestId("input-winery"), "Rioja House");
    await user.click(screen.getByTestId("submit-wine"));
    expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-winery") as HTMLInputElement).value).toBe("");
  });

  it("active filter button has aria-pressed true", async () => {
    const user = userEvent.setup();
    const redBtn = screen.getByTestId("filter-red");
    await user.click(redBtn);
    expect(redBtn.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("filter-all").getAttribute("aria-pressed")).toBe("false");
  });
});
