import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Solar Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /solar log/i })).toBeTruthy();
  });

  it("loads seed data with 4 entries", () => {
    expect(screen.getByTestId("entry-count").textContent).toBe("4");
  });

  it("shows correct total kWh for seed data", () => {
    // 22.5 + 18.3 + 5.1 + 25.0 = 70.9
    expect(screen.getByTestId("total-kwh").textContent).toBe("70.9");
  });

  it("shows correct average kWh for seed data", () => {
    // 70.9 / 4 = 17.725 -> 17.7
    expect(screen.getByTestId("avg-kwh").textContent).toBe("17.7");
  });

  it("adds a new entry with valid data", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-06-05");
    await user.clear(screen.getByTestId("kwh-input"));
    await user.type(screen.getByTestId("kwh-input"), "30");
    await user.type(screen.getByTestId("notes-input"), "Great day");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("entry-count").textContent).toBe("5");
  });

  it("shows error when date is missing", async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByTestId("kwh-input"));
    await user.type(screen.getByTestId("kwh-input"), "10");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "Date and kWh are required"
    );
  });

  it("shows error when kWh is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-06-05");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "Date and kWh are required"
    );
  });

  it("shows error when kWh is negative", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-06-05");
    await user.clear(screen.getByTestId("kwh-input"));
    await user.type(screen.getByTestId("kwh-input"), "-5");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "kWh must be non-negative"
    );
  });

  it("deletes an entry", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.getByTestId("entry-count").textContent).toBe("3");
  });

  it("shows dash for empty notes", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-06-06");
    await user.clear(screen.getByTestId("kwh-input"));
    await user.type(screen.getByTestId("kwh-input"), "10");
    await user.click(screen.getByTestId("add-button"));
    const list = screen.getByTestId("entry-list");
    expect(list.textContent).toContain("—");
  });

  it("filters entries by notes", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-input"), "sunny");
    const list = screen.getByTestId("entry-list");
    expect(list.textContent).toContain("Sunny all day");
    expect(list.textContent).not.toContain("Partly cloudy");
  });

  it("stats are not affected by filter", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-input"), "sunny");
    expect(screen.getByTestId("entry-count").textContent).toBe("4");
    expect(screen.getByTestId("total-kwh").textContent).toBe("70.9");
  });

  it("shows 0.0 average when all entries deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    await user.click(screen.getByTestId("delete-4"));
    expect(screen.getByTestId("avg-kwh").textContent).toBe("0.0");
    expect(screen.getByTestId("total-kwh").textContent).toBe("0.0");
  });
});
