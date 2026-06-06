import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

function getCards() {
  return screen.getAllByTestId("rating-card");
}

function getCardField(card: HTMLElement, testId: string) {
  return within(card).getByTestId(testId).textContent ?? "";
}

describe("Player Ratings", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /player ratings/i })).toBeTruthy();
  });

  it("shows 5 player rating cards initially", () => {
    expect(getCards()).toHaveLength(5);
  });

  it("shows team average element", () => {
    expect(screen.getByTestId("team-average")).toBeTruthy();
  });

  it("shows initial team average of 3.73", () => {
    expect(screen.getByTestId("team-average").textContent).toBe("3.73");
  });

  it("renders sort select", () => {
    expect(screen.getByTestId("sort-select")).toBeTruthy();
  });

  it("Morgan Davis has highest initial average of 4.67", () => {
    const cards = getCards();
    const morganCard = cards.find((c) => getCardField(c, "card-player-name") === "Morgan Davis");
    expect(morganCard).toBeTruthy();
    expect(getCardField(morganCard!, "card-average")).toBe("4.67");
  });

  it("each card shows initial rating count of 3", () => {
    const cards = getCards();
    cards.forEach((c) => {
      expect(getCardField(c, "card-count")).toContain("3");
    });
  });

  it("submitting a rating updates the count", async () => {
    const user = userEvent.setup();
    const cards = getCards();
    const firstCard = cards[0];
    await user.click(within(firstCard).getByTestId("star-5"));
    await user.click(within(firstCard).getByTestId("btn-submit-rating"));
    expect(getCardField(getCards()[0], "card-count")).toContain("4");
  });

  it("submitting a rating updates the average", async () => {
    const user = userEvent.setup();
    const cards = getCards();
    const caseyCard = cards.find((c) => getCardField(c, "card-player-name") === "Casey Kim")!;
    await user.click(within(caseyCard).getByTestId("star-5"));
    await user.click(within(caseyCard).getByTestId("btn-submit-rating"));
    const updatedCaseyCard = getCards().find((c) => getCardField(c, "card-player-name") === "Casey Kim")!;
    const newAvg = parseFloat(getCardField(updatedCaseyCard, "card-average"));
    expect(newAvg).toBeGreaterThan(2.33);
  });

  it("team average updates after a rating submission", async () => {
    const user = userEvent.setup();
    const initialAvg = parseFloat(screen.getByTestId("team-average").textContent ?? "0");
    const cards = getCards();
    await user.click(within(cards[0]).getByTestId("star-5"));
    await user.click(within(cards[0]).getByTestId("btn-submit-rating"));
    const newAvg = parseFloat(screen.getByTestId("team-average").textContent ?? "0");
    expect(newAvg).not.toBe(initialAvg);
  });

  it("sort Highest Rated places Morgan Davis first", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("sort-select"), "Highest Rated");
    const firstCard = getCards()[0];
    expect(getCardField(firstCard, "card-player-name")).toBe("Morgan Davis");
  });

  it("sort Lowest Rated places Casey Kim first", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("sort-select"), "Lowest Rated");
    const firstCard = getCards()[0];
    expect(getCardField(firstCard, "card-player-name")).toBe("Casey Kim");
  });

  it("submit with no star selected does nothing", async () => {
    const user = userEvent.setup();
    const cards = getCards();
    await user.click(within(cards[0]).getByTestId("btn-submit-rating"));
    expect(getCardField(getCards()[0], "card-count")).toContain("3");
  });

  it("average is displayed to 2 decimal places", () => {
    const cards = getCards();
    cards.forEach((c) => {
      const avgText = getCardField(c, "card-average");
      expect(avgText).toMatch(/^\d+\.\d{2}$/);
    });
  });
});
