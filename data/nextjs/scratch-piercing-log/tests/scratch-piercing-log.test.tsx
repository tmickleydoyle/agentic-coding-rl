import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Piercing Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /piercing log/i })).toBeTruthy();
  });

  it("renders 4 seed piercing cards", () => {
    expect(screen.getAllByTestId("piercing-card").length).toBe(4);
  });

  it("shows initial summary: 2 healed / 4 total", () => {
    expect(screen.getByTestId("piercing-summary").textContent).toMatch(/2.*healed.*4.*total/i);
  });

  it("renders healed-badge on pre-healed entries", () => {
    const badges = screen.getAllByTestId("healed-badge");
    expect(badges.length).toBe(2);
  });

  it("adds a new piercing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("location-input"), "Tragus");
    await user.type(screen.getByTestId("date-input"), "2024-05-01");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("piercing-card").length).toBe(5);
    expect(screen.getByText("Tragus")).toBeTruthy();
  });

  it("clears fields after adding", async () => {
    const user = userEvent.setup();
    const loc = screen.getByTestId("location-input") as HTMLInputElement;
    const date = screen.getByTestId("date-input") as HTMLInputElement;
    await user.type(loc, "Helix");
    await user.type(date, "2024-06-01");
    await user.click(screen.getByTestId("add-button"));
    expect(loc.value).toBe("");
    expect(date.value).toBe("");
  });

  it("does not add when location is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-05-01");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("piercing-card").length).toBe(4);
  });

  it("does not add when date is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("location-input"), "Rook");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("piercing-card").length).toBe(4);
  });

  it("toggles healing status", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("piercing-card");
    // card[1] = Nostril, not healed
    expect(within(cards[1]).queryByTestId("healed-badge")).toBeNull();
    await user.click(within(cards[1]).getByTestId("toggle-healed-button"));
    expect(within(cards[1]).getByTestId("healed-badge")).toBeTruthy();
  });

  it("deletes a piercing card", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("piercing-card");
    await user.click(within(cards[0]).getByTestId("delete-button"));
    expect(screen.getAllByTestId("piercing-card").length).toBe(3);
  });

  it("Healing tab shows only unhealed entries", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Healing"));
    expect(screen.getAllByTestId("piercing-card").length).toBe(2);
  });

  it("active-tab testid moves to Healing tab when clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Healing"));
    expect(screen.getByTestId("active-tab").textContent).toMatch(/healing/i);
  });

  it("All tab shows all entries", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByText("Healing"));
    await user.click(screen.getByText("All"));
    expect(screen.getAllByTestId("piercing-card").length).toBe(4);
  });

  it("notes not shown when empty on added entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("location-input"), "Daith");
    await user.type(screen.getByTestId("date-input"), "2024-07-01");
    await user.click(screen.getByTestId("add-button"));
    const cards = screen.getAllByTestId("piercing-card");
    const lastCard = cards[cards.length - 1];
    expect(within(lastCard).queryByTestId("piercing-notes")).toBeNull();
  });
});
