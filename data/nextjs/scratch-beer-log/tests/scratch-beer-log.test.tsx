import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Beer Tasting Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /beer tasting log/i })).toBeTruthy();
  });

  it("renders all 5 seed beers", () => {
    expect(screen.getAllByTestId("beer-card").length).toBe(5);
  });

  it("each card shows name, brewery, style, abv, rating, notes", () => {
    const cards = screen.getAllByTestId("beer-card");
    const first = cards[0];
    expect(within(first).getByTestId("beer-name").textContent).toBeTruthy();
    expect(within(first).getByTestId("beer-brewery").textContent).toBeTruthy();
    expect(within(first).getByTestId("beer-style").textContent).toBeTruthy();
    expect(within(first).getByTestId("beer-abv").textContent).toContain("%");
    expect(within(first).getByTestId("beer-rating").textContent).toBeTruthy();
    expect(within(first).getByTestId("beer-notes").textContent).toBeTruthy();
  });

  it("rating 5 displays five filled stars", () => {
    const cards = screen.getAllByTestId("beer-card");
    const headyCard = cards.find((c) =>
      within(c).getByTestId("beer-name").textContent?.includes("Heady Topper")
    );
    expect(headyCard).toBeTruthy();
    expect(within(headyCard!).getByTestId("beer-rating").textContent).toBe("★★★★★");
  });

  it("rating 3 displays three filled and two empty stars", () => {
    const cards = screen.getAllByTestId("beer-card");
    const dogfishCard = cards.find((c) =>
      within(c).getByTestId("beer-name").textContent?.includes("Dogfish")
    );
    expect(dogfishCard).toBeTruthy();
    expect(within(dogfishCard!).getByTestId("beer-rating").textContent).toBe("★★★☆☆");
  });

  it("filter by IPA shows only IPA beers", async () => {
    const user = userEvent.setup();
    const styleFilters = screen.getAllByTestId("style-filter");
    const ipaBtn = styleFilters.find((b) => b.textContent === "IPA");
    expect(ipaBtn).toBeTruthy();
    await user.click(ipaBtn!);
    const cards = screen.getAllByTestId("beer-card");
    cards.forEach((card) => {
      expect(within(card).getByTestId("beer-style").textContent).toBe("IPA");
    });
  });

  it("All Styles button restores all beers", async () => {
    const user = userEvent.setup();
    const styleFilters = screen.getAllByTestId("style-filter");
    await user.click(styleFilters[0]);
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("beer-card").length).toBe(5);
  });

  it("adds a new beer when form is submitted", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Guinness");
    await user.type(screen.getByTestId("input-brewery"), "Guinness Ltd");
    await user.type(screen.getByTestId("input-style"), "Stout");
    await user.type(screen.getByTestId("input-abv"), "4.2");
    await user.click(screen.getByTestId("submit-beer"));
    expect(screen.getAllByTestId("beer-card").length).toBe(6);
    const names = screen.getAllByTestId("beer-name").map((el) => el.textContent);
    expect(names).toContain("Guinness");
  });

  it("does not add beer when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-brewery"), "Some Brewery");
    await user.click(screen.getByTestId("submit-beer"));
    expect(screen.getAllByTestId("beer-card").length).toBe(5);
  });

  it("does not add beer when brewery is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Some Beer");
    await user.click(screen.getByTestId("submit-beer"));
    expect(screen.getAllByTestId("beer-card").length).toBe(5);
  });

  it("resets form after adding a beer", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Test Beer");
    await user.type(screen.getByTestId("input-brewery"), "Test Brewery");
    await user.click(screen.getByTestId("submit-beer"));
    expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-brewery") as HTMLInputElement).value).toBe("");
  });

  it("adding a beer with a new style creates a new style filter button", async () => {
    const user = userEvent.setup();
    const before = screen.getAllByTestId("style-filter").length;
    await user.type(screen.getByTestId("input-name"), "Pilsner Urquell");
    await user.type(screen.getByTestId("input-brewery"), "Pilsner Urquell Brewery");
    await user.type(screen.getByTestId("input-style"), "Lager");
    await user.click(screen.getByTestId("submit-beer"));
    expect(screen.getAllByTestId("style-filter").length).toBeGreaterThan(before);
  });

  it("ABV displays with percent sign", () => {
    const abvEls = screen.getAllByTestId("beer-abv");
    abvEls.forEach((el) => {
      expect(el.textContent).toMatch(/%/);
    });
  });
});
