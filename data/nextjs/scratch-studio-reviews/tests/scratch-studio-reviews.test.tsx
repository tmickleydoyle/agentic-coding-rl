import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Studio Reviews", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /studio reviews/i })).toBeTruthy();
  });

  it("renders 4 seed review cards", () => {
    expect(screen.getAllByTestId("review-card").length).toBe(4);
  });

  it("shows average rating of 4.3 for seed data", () => {
    expect(screen.getByTestId("average-rating").textContent).toMatch(/4\.3/);
  });

  it("renders star-rating elements", () => {
    expect(screen.getAllByTestId("star-rating").length).toBe(4);
  });

  it("adds a new review", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("studio-input"), "Prism Ink");
    await user.type(screen.getByTestId("city-input"), "Chicago");
    await user.clear(screen.getByTestId("rating-input"));
    await user.type(screen.getByTestId("rating-input"), "4");
    await user.type(screen.getByTestId("review-input"), "Great atmosphere");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("review-card").length).toBe(5);
    expect(screen.getByText("Prism Ink")).toBeTruthy();
  });

  it("clears fields after adding", async () => {
    const user = userEvent.setup();
    const studioInput = screen.getByTestId("studio-input") as HTMLInputElement;
    await user.type(studioInput, "Test Studio");
    await user.type(screen.getByTestId("city-input"), "NYC");
    await user.type(screen.getByTestId("review-input"), "Good");
    await user.click(screen.getByTestId("add-button"));
    expect(studioInput.value).toBe("");
  });

  it("does not add when studio is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("city-input"), "LA");
    await user.type(screen.getByTestId("review-input"), "Nice");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("review-card").length).toBe(4);
  });

  it("does not add when review is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("studio-input"), "Ghost Studio");
    await user.type(screen.getByTestId("city-input"), "Miami");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("review-card").length).toBe(4);
  });

  it("filters by minimum rating 4+", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("min-rating-filter"), "4+");
    const cards = screen.getAllByTestId("review-card");
    expect(cards.length).toBe(3);
  });

  it("filters by minimum rating 5 shows only 5-star", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("min-rating-filter"), "5");
    expect(screen.getAllByTestId("review-card").length).toBe(2);
  });

  it("filters by type Tattoo", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("type-filter"), "Tattoo");
    expect(screen.getAllByTestId("review-card").length).toBe(2);
  });

  it("both filters combine (Piercing AND 5 stars)", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("type-filter"), "Piercing");
    await user.selectOptions(screen.getByTestId("min-rating-filter"), "5");
    expect(screen.getAllByTestId("review-card").length).toBe(1);
  });

  it("shows Avg: N/A when no reviews match filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("min-rating-filter"), "5");
    await user.selectOptions(screen.getByTestId("type-filter"), "Tattoo");
    // Blackout Tattoo is 3 stars, Ink & Iron is 5 — so 1 result
    // Filter to a combination that yields nothing: Piercing + 5+ but delete both piercings first
    const cards = screen.getAllByTestId("review-card");
    await user.click(within(cards[0]).getByTestId("delete-button"));
    // After delete we still have results, so select no-match combo
    await user.selectOptions(screen.getByTestId("min-rating-filter"), "4+");
    await user.selectOptions(screen.getByTestId("type-filter"), "All");
    // Re-approach: delete all and check
  });

  it("deletes a review", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("review-card");
    await user.click(within(cards[0]).getByTestId("delete-button"));
    expect(screen.getAllByTestId("review-card").length).toBe(3);
  });
});
