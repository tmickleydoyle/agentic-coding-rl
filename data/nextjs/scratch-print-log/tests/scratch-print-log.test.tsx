import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Print Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /Print Log/i })).toBeTruthy();
  });

  it("renders seed entries", () => {
    expect(screen.getByTestId("entry-model-1").textContent).toBe("Benchy Boat");
    expect(screen.getByTestId("entry-model-3").textContent).toBe("Dragon Figurine");
  });

  it("renders entry material", () => {
    expect(screen.getByTestId("entry-material-1").textContent).toBe("PLA");
    expect(screen.getByTestId("entry-material-2").textContent).toBe("PETG");
  });

  it("renders entry result", () => {
    expect(screen.getByTestId("entry-result-1").textContent).toBe("success");
    expect(screen.getByTestId("entry-result-3").textContent).toBe("failure");
  });

  it("renders entry rating", () => {
    expect(screen.getByTestId("entry-rating-1").textContent).toBe("5");
    expect(screen.getByTestId("entry-rating-3").textContent).toBe("2");
  });

  it("renders entry date", () => {
    expect(screen.getByTestId("entry-date-1").textContent).toBe("2024-01-10");
  });

  it("shows initial stats total", () => {
    expect(screen.getByTestId("stats-total").textContent).toBe("4");
  });

  it("shows initial success rate (75%)", () => {
    expect(screen.getByTestId("stats-success-rate").textContent).toBe("75%");
  });

  it("shows initial avg rating", () => {
    // (5+4+2+3)/4 = 3.5
    expect(screen.getByTestId("stats-avg-rating").textContent).toBe("3.5");
  });

  it("deletes an entry", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("entry-delete-1"));
    expect(screen.queryByTestId("entry-model-1")).toBeNull();
  });

  it("stats update after delete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("entry-delete-1"));
    expect(screen.getByTestId("stats-total").textContent).toBe("3");
  });

  it("filters by material", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-material"), "PLA");
    expect(screen.queryByTestId("entry-model-1")).toBeTruthy();
    expect(screen.queryByTestId("entry-model-2")).toBeNull();
  });

  it("stats reflect filtered view", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-material"), "PLA");
    // PLA: entries 1 (success,5) and 3 (failure,2) → 2 entries, 50% success, avg 3.5
    expect(screen.getByTestId("stats-total").textContent).toBe("2");
    expect(screen.getByTestId("stats-success-rate").textContent).toBe("50%");
  });

  it("adds a new entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Model name/i), "Gear Knob");
    await user.type(screen.getByLabelText(/Material/i), "ABS");
    await user.type(screen.getByLabelText(/Duration \(min\)/i), "60");
    await user.type(screen.getByLabelText(/Rating/i), "4");
    await user.type(screen.getByLabelText(/Date/i), "2024-02-01");
    await user.click(screen.getByRole("button", { name: /Add Entry/i }));
    expect(screen.getByText("Gear Knob")).toBeTruthy();
  });

  it("does not add entry with rating 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Model name/i), "Test");
    await user.type(screen.getByLabelText(/Material/i), "PLA");
    await user.type(screen.getByLabelText(/Duration \(min\)/i), "30");
    await user.type(screen.getByLabelText(/Rating/i), "0");
    await user.type(screen.getByLabelText(/Date/i), "2024-02-01");
    await user.click(screen.getByRole("button", { name: /Add Entry/i }));
    expect(screen.getByTestId("stats-total").textContent).toBe("4");
  });

  it("shows 0 stats when filtered list is empty", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-material"), "TPU");
    expect(screen.getByTestId("stats-total").textContent).toBe("0");
    expect(screen.getByTestId("stats-success-rate").textContent).toBe("0%");
    expect(screen.getByTestId("stats-avg-rating").textContent).toBe("0.0");
  });
});
