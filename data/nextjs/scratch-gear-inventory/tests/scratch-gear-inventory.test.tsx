import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Gear Inventory", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /gear inventory/i })).toBeTruthy();
  });

  it("shows 8 items initially", () => {
    expect(screen.getByTestId("item-count").textContent).toContain("8");
  });

  it("renders gear names from seed data", () => {
    expect(screen.getByTestId("gear-name-1").textContent).toBe("Tent");
    expect(screen.getByTestId("gear-name-4").textContent).toBe("Headlamp");
  });

  it("condition badge has correct data-condition attribute", () => {
    const badge = screen.getByTestId("condition-badge-1");
    expect(badge.getAttribute("data-condition")).toBe("Good");
  });

  it("excellent condition badge has data-condition Excellent", () => {
    const badge = screen.getByTestId("condition-badge-2");
    expect(badge.getAttribute("data-condition")).toBe("Excellent");
  });

  it("filtering by Shelter shows only shelter items", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("category-filter"), "Shelter");
    expect(screen.getByTestId("item-count").textContent).toContain("2");
    expect(screen.queryByTestId("gear-3")).toBeNull();
  });

  it("switching filter back to All restores all items", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("category-filter"), "Lighting");
    await user.selectOptions(screen.getByTestId("category-filter"), "All");
    expect(screen.getByTestId("item-count").textContent).toContain("8");
  });

  it("increment increases quantity", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("increment-1"));
    expect(screen.getByTestId("gear-qty-1").textContent).toBe("2");
  });

  it("decrement decreases quantity", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("increment-1"));
    await user.click(screen.getByTestId("decrement-1"));
    expect(screen.getByTestId("gear-qty-1").textContent).toBe("1");
  });

  it("decrement cannot go below 1", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("decrement-1"));
    expect(screen.getByTestId("gear-qty-1").textContent).toBe("1");
  });

  it("removing an item decreases count", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove-1"));
    expect(screen.getByTestId("item-count").textContent).toContain("7");
    expect(screen.queryByTestId("gear-1")).toBeNull();
  });

  it("adding an item with empty name does nothing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-gear-btn"));
    expect(screen.getByTestId("item-count").textContent).toContain("8");
  });

  it("adding a valid item increases count", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("form-name"), "Compass");
    await user.click(screen.getByTestId("add-gear-btn"));
    expect(screen.getByTestId("item-count").textContent).toContain("9");
    expect(screen.getByText("Compass")).toBeTruthy();
  });

  it("form clears after successful add", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("form-name") as HTMLInputElement;
    await user.type(input, "Rope");
    await user.click(screen.getByTestId("add-gear-btn"));
    expect(input.value).toBe("");
  });
});
