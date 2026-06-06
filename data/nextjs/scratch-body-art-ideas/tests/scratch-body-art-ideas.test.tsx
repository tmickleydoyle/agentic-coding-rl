import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Body Art Ideas", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /body art ideas/i })).toBeTruthy();
  });

  it("renders 4 seed idea cards", () => {
    expect(screen.getAllByTestId("idea-card").length).toBe(4);
  });

  it("shows idea count of 4", () => {
    expect(screen.getByTestId("idea-count").textContent).toMatch(/4 ideas/i);
  });

  it("renders 2 favorite badges on seed data", () => {
    expect(screen.getAllByTestId("favorite-badge").length).toBe(2);
  });

  it("renders tag chips", () => {
    const chips = screen.getAllByTestId("tag-chip");
    expect(chips.length).toBeGreaterThan(0);
  });

  it("adds a new idea", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("title-input"), "Lotus flower");
    await user.type(screen.getByTestId("description-input"), "Small lotus on ankle");
    await user.type(screen.getByTestId("tags-input"), "lotus, ankle");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("idea-card").length).toBe(5);
    expect(screen.getByText("Lotus flower")).toBeTruthy();
  });

  it("clears fields after adding", async () => {
    const user = userEvent.setup();
    const titleInput = screen.getByTestId("title-input") as HTMLInputElement;
    await user.type(titleInput, "Test");
    await user.click(screen.getByTestId("add-button"));
    expect(titleInput.value).toBe("");
  });

  it("does not add when title is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("description-input"), "Some description");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("idea-card").length).toBe(4);
  });

  it("searches by title (live filter)", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "mandala");
    expect(screen.getAllByTestId("idea-card").length).toBe(1);
    expect(screen.getByText("Mandala back piece")).toBeTruthy();
  });

  it("searches by description", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "forearm");
    expect(screen.getAllByTestId("idea-card").length).toBe(1);
  });

  it("search with no matches shows empty list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "zzznomatch");
    expect(screen.queryAllByTestId("idea-card").length).toBe(0);
    expect(screen.getByTestId("idea-count").textContent).toMatch(/0 ideas/i);
  });

  it("favorites filter shows only favorited ideas", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("favorites-filter"));
    expect(screen.getAllByTestId("idea-card").length).toBe(2);
  });

  it("toggles favorite on a card", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("idea-card");
    // card[0] = Mandala, not favorited
    expect(within(cards[0]).queryByTestId("favorite-badge")).toBeNull();
    await user.click(within(cards[0]).getByTestId("toggle-favorite-button"));
    expect(within(cards[0]).getByTestId("favorite-badge")).toBeTruthy();
  });

  it("deletes an idea", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("idea-card");
    await user.click(within(cards[0]).getByTestId("delete-button"));
    expect(screen.getAllByTestId("idea-card").length).toBe(3);
    expect(screen.getByTestId("idea-count").textContent).toMatch(/3 ideas/i);
  });
});
