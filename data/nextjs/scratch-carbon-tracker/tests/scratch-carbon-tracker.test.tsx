import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Carbon Footprint Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(
      screen.getByRole("heading", { name: /carbon footprint tracker/i })
    ).toBeTruthy();
  });

  it("loads 5 seed entries", () => {
    expect(screen.getByTestId("entry-count").textContent).toBe("5");
  });

  it("shows correct total kg CO2 for seed data", () => {
    // 5.4 + 6.0 + 3.2 + 90.0 + 0.8 = 105.4
    expect(screen.getByTestId("total-kgco2").textContent).toBe("105.4");
  });

  it("shows correct average kg CO2 for seed data", () => {
    // 105.4 / 5 = 21.08 -> 21.1
    expect(screen.getByTestId("avg-kgco2").textContent).toBe("21.1");
  });

  it("shows Transport as top category for seed data", () => {
    // Transport: 5.4 + 90.0 = 95.4 (highest)
    expect(screen.getByTestId("top-category").textContent).toBe("Transport");
  });

  it("adds a new entry with valid data", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-05-15");
    await user.selectOptions(screen.getByTestId("category-select"), "Shopping");
    await user.type(screen.getByTestId("activity-input"), "New shirt");
    await user.clear(screen.getByTestId("kgco2-input"));
    await user.type(screen.getByTestId("kgco2-input"), "2.5");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("entry-count").textContent).toBe("6");
  });

  it("shows error when activity is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-05-15");
    await user.clear(screen.getByTestId("kgco2-input"));
    await user.type(screen.getByTestId("kgco2-input"), "2");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "All fields are required"
    );
  });

  it("shows error for negative kg CO2", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-05-15");
    await user.type(screen.getByTestId("activity-input"), "Test");
    await user.clear(screen.getByTestId("kgco2-input"));
    await user.type(screen.getByTestId("kgco2-input"), "-1");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "kg CO2 must be non-negative"
    );
  });

  it("deletes an entry", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.getByTestId("entry-count").textContent).toBe("4");
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("cat-filter"), "Food");
    const list = screen.getByTestId("entry-list");
    expect(list.textContent).toContain("Beef meal");
    expect(list.textContent).not.toContain("Car commute");
  });

  it("stats unaffected by category filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("cat-filter"), "Food");
    expect(screen.getByTestId("total-kgco2").textContent).toBe("105.4");
    expect(screen.getByTestId("entry-count").textContent).toBe("5");
  });

  it("shows None top category after deleting all entries", async () => {
    const user = userEvent.setup();
    for (const id of [1, 2, 3, 4, 5]) {
      await user.click(screen.getByTestId(`delete-${id}`));
    }
    expect(screen.getByTestId("top-category").textContent).toBe("None");
    expect(screen.getByTestId("avg-kgco2").textContent).toBe("0.0");
  });
});
