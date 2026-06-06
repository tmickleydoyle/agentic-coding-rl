import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Real Estate Search", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /real estate search/i })).toBeTruthy();
  });

  it("shows all 6 listings by default", () => {
    const cards = screen.getAllByTestId("listing-card");
    expect(cards.length).toBe(6);
  });

  it("shows listing count as '6 listings' by default", () => {
    expect(screen.getByTestId("listing-count").textContent).toContain("6");
  });

  it("filters by city Austin", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("city-filter"), "Austin");
    const cards = screen.getAllByTestId("listing-card");
    expect(cards.length).toBe(2);
    expect(screen.getByTestId("listing-count").textContent).toContain("2");
  });

  it("filters by city Denver", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("city-filter"), "Denver");
    const cards = screen.getAllByTestId("listing-card");
    expect(cards.length).toBe(2);
  });

  it("filters by min bedrooms 4", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("min-bedrooms"), "4");
    const cards = screen.getAllByTestId("listing-card");
    expect(cards.length).toBe(2);
  });

  it("filters by max price 350000", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("max-price"), "350000");
    const cards = screen.getAllByTestId("listing-card");
    expect(cards.length).toBe(2);
  });

  it("shows no results when filters match nothing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("min-bedrooms"), "6");
    expect(screen.getByTestId("no-results")).toBeTruthy();
  });

  it("no-results message text is correct", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("min-bedrooms"), "6");
    expect(screen.getByTestId("no-results").textContent).toContain("No listings found");
  });

  it("combines city and max price filters", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("city-filter"), "Austin");
    await user.type(screen.getByTestId("max-price"), "500000");
    const cards = screen.getAllByTestId("listing-card");
    expect(cards.length).toBe(1);
  });

  it("displays prices in formatted currency", () => {
    expect(screen.getByTestId("price-1").textContent).toContain("$450,000");
  });

  it("resetting city to All Cities shows all listings", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("city-filter"), "Seattle");
    await user.selectOptions(screen.getByTestId("city-filter"), "All Cities");
    const cards = screen.getAllByTestId("listing-card");
    expect(cards.length).toBe(6);
  });
});
