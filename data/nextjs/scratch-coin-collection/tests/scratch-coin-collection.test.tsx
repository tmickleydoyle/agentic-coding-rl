import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Coin Collection Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByTestId("heading")).toHaveTextContent("Coin Collection");
  });

  it("renders seed coins", () => {
    expect(screen.getByTestId("coin-1")).toBeTruthy();
    expect(screen.getByTestId("coin-name-1")).toHaveTextContent("Morgan Dollar");
    expect(screen.getByTestId("coin-graded-1")).toHaveTextContent("GRADED");
  });

  it("shows total value in summary", () => {
    expect(screen.getByTestId("total-value")).toBeTruthy();
  });

  it("adds a new coin", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Flowing Hair Dollar");
    await user.type(screen.getByTestId("input-country"), "United States");
    await user.selectOptions(screen.getByTestId("select-era"), "Modern");
    await user.type(screen.getByTestId("input-year"), "1794");
    await user.type(screen.getByTestId("input-estimated-value"), "1500000");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("coin-6")).toBeTruthy();
    expect(screen.getByTestId("coin-name-6")).toHaveTextContent("Flowing Hair Dollar");
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Test Coin");
    await user.type(screen.getByTestId("input-country"), "France");
    await user.type(screen.getByTestId("input-estimated-value"), "100");
    await user.click(screen.getByTestId("btn-add"));
    expect(nameInput.value).toBe("");
  });

  it("shows error for empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-country"), "France");
    await user.type(screen.getByTestId("input-estimated-value"), "100");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Name is required");
  });

  it("shows error for empty country", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Coin");
    await user.type(screen.getByTestId("input-estimated-value"), "100");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Country is required");
  });

  it("shows error for negative estimated value", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Coin");
    await user.type(screen.getByTestId("input-country"), "Rome");
    await user.type(screen.getByTestId("input-estimated-value"), "-5");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Estimated value must be 0 or greater");
  });

  it("toggles graded status", async () => {
    const user = userEvent.setup();
    // coin-2 is not graded
    expect(screen.queryByTestId("coin-graded-2")).toBeNull();
    await user.click(screen.getByTestId("btn-grade-2"));
    expect(screen.getByTestId("coin-graded-2")).toHaveTextContent("GRADED");
    await user.click(screen.getByTestId("btn-grade-2"));
    expect(screen.queryByTestId("coin-graded-2")).toBeNull();
  });

  it("removes a coin", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-remove-1"));
    expect(screen.queryByTestId("coin-1")).toBeNull();
  });

  it("filters by era", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-era"), "Ancient");
    expect(screen.getByTestId("coin-2")).toBeTruthy();
    expect(screen.queryByTestId("coin-1")).toBeNull();
  });

  it("filters graded only", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-graded"));
    expect(screen.getByTestId("coin-1")).toBeTruthy();
    expect(screen.getByTestId("coin-3")).toBeTruthy();
    expect(screen.queryByTestId("coin-2")).toBeNull();
  });

  it("combines era and graded filters", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-era"), "Colonial");
    await user.click(screen.getByTestId("filter-graded"));
    expect(screen.getByTestId("coin-3")).toBeTruthy();
    expect(screen.queryByTestId("coin-4")).toBeNull();
  });

  it("summary total value reflects all coins", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-era"), "Modern");
    const totalValue = screen.getByTestId("total-value");
    // should contain total of all coins, not just Modern
    expect(totalValue.textContent).toContain("2100.00");
  });
});
