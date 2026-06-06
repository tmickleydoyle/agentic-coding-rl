import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Energy Usage Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(
      screen.getByRole("heading", { name: /energy usage tracker/i })
    ).toBeTruthy();
  });

  it("loads 5 seed entries", () => {
    expect(screen.getByTestId("entry-count").textContent).toBe("5");
  });

  it("shows correct total kWh for seed data", () => {
    // 320 + 150 + 295 + 130 + 310 = 1205
    expect(screen.getByTestId("total-kwh").textContent).toBe("1205.0");
  });

  it("shows correct total cost for seed data", () => {
    // 48 + 22.5 + 44.25 + 19.5 + 46.5 = 180.75
    expect(screen.getByTestId("total-cost").textContent).toBe("$180.75");
  });

  it("adds a new entry with valid data", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("month-input"), "2024-04");
    await user.selectOptions(screen.getByTestId("source-select"), "Solar");
    await user.clear(screen.getByTestId("kwh-input"));
    await user.type(screen.getByTestId("kwh-input"), "100");
    await user.clear(screen.getByTestId("cost-input"));
    await user.type(screen.getByTestId("cost-input"), "0");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("entry-count").textContent).toBe("6");
  });

  it("shows error when month is missing", async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByTestId("kwh-input"));
    await user.type(screen.getByTestId("kwh-input"), "10");
    await user.clear(screen.getByTestId("cost-input"));
    await user.type(screen.getByTestId("cost-input"), "5");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "All fields are required"
    );
  });

  it("shows error for negative kWh", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("month-input"), "2024-04");
    await user.clear(screen.getByTestId("kwh-input"));
    await user.type(screen.getByTestId("kwh-input"), "-10");
    await user.clear(screen.getByTestId("cost-input"));
    await user.type(screen.getByTestId("cost-input"), "5");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "Values must be non-negative"
    );
  });

  it("deletes an entry and updates count", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.getByTestId("entry-count").textContent).toBe("4");
  });

  it("filters entries by source", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("source-filter"), "Gas");
    const list = screen.getByTestId("entry-list");
    expect(list.textContent).toContain("Gas");
    expect(list.textContent).not.toContain("Electricity");
  });

  it("stats are not affected by source filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("source-filter"), "Gas");
    expect(screen.getByTestId("entry-count").textContent).toBe("5");
    expect(screen.getByTestId("total-kwh").textContent).toBe("1205.0");
  });

  it("shows $0.00 total cost after deleting all entries", async () => {
    const user = userEvent.setup();
    for (const id of [1, 2, 3, 4, 5]) {
      await user.click(screen.getByTestId(`delete-${id}`));
    }
    expect(screen.getByTestId("total-cost").textContent).toBe("$0.00");
  });

  it("cost is displayed with two decimal places", () => {
    expect(screen.getByTestId("entry-cost-1").textContent).toBe("$48.00");
  });
});
