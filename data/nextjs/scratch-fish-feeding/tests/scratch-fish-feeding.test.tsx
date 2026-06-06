import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Fish Feeding Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Fish Feeding Tracker" })).toBeTruthy();
  });

  it("shows 3 seed feedings on load", () => {
    expect(screen.getByTestId("total-feedings").textContent).toContain("3");
  });

  it("renders all 4 tanks in the summary list", () => {
    const list = screen.getByTestId("tanks-list");
    expect(within(list).getAllByRole("listitem").length).toBe(4);
  });

  it("shows correct feeding count per tank initially", () => {
    expect(screen.getByTestId("tank-feeding-count-1").textContent).toBe("2");
    expect(screen.getByTestId("tank-feeding-count-2").textContent).toBe("1");
    expect(screen.getByTestId("tank-feeding-count-3").textContent).toBe("0");
    expect(screen.getByTestId("tank-feeding-count-4").textContent).toBe("0");
  });

  it("shows correct fish counts", () => {
    expect(screen.getByTestId("tank-fish-count-1").textContent).toBe("8");
    expect(screen.getByTestId("tank-fish-count-2").textContent).toBe("12");
  });

  it("renders seed feeding details", () => {
    expect(screen.getByTestId("feeding-food-1").textContent).toBe("Flake");
    expect(screen.getByTestId("feeding-amount-1").textContent).toBe("1 pinch");
    expect(screen.getByTestId("feeding-time-1").textContent).toBe("08:00");
  });

  it("renders tank name in feedings list", () => {
    expect(screen.getByTestId("feeding-tank-1").textContent).toBe("Reef Tank");
    expect(screen.getByTestId("feeding-tank-2").textContent).toBe("Freshwater");
  });

  it("adds a new feeding", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("tank-select"), "2");
    await user.type(screen.getByTestId("food-input"), "Pellet");
    await user.type(screen.getByTestId("amount-input"), "1 pinch");
    await user.click(screen.getByTestId("log-button"));
    expect(screen.getByTestId("total-feedings").textContent).toContain("4");
  });

  it("clears food and amount after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("food-input"), "Flake");
    await user.type(screen.getByTestId("amount-input"), "1 pinch");
    await user.click(screen.getByTestId("log-button"));
    expect((screen.getByTestId("food-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("amount-input") as HTMLInputElement).value).toBe("");
  });

  it("does not add feeding with empty food", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("amount-input"), "1 pinch");
    await user.click(screen.getByTestId("log-button"));
    expect(screen.getByTestId("total-feedings").textContent).toContain("3");
  });

  it("does not add feeding with empty amount", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("food-input"), "Flake");
    await user.click(screen.getByTestId("log-button"));
    expect(screen.getByTestId("total-feedings").textContent).toContain("3");
  });

  it("deletes a feeding", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-feeding-1"));
    expect(screen.queryByTestId("feeding-1")).toBeNull();
    expect(screen.getByTestId("total-feedings").textContent).toContain("2");
  });

  it("updates tank feeding count after delete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-feeding-1"));
    expect(screen.getByTestId("tank-feeding-count-1").textContent).toBe("1");
  });

  it("updates tank feeding count after add", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("tank-select"), "3");
    await user.type(screen.getByTestId("food-input"), "Brine Shrimp");
    await user.type(screen.getByTestId("amount-input"), "half pinch");
    await user.click(screen.getByTestId("log-button"));
    expect(screen.getByTestId("tank-feeding-count-3").textContent).toBe("1");
  });
});
