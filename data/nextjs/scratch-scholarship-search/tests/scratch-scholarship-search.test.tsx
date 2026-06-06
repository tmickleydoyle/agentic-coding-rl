import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Scholarship Search", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /scholarship search/i })).toBeTruthy();
  });

  it("shows 5 seed scholarships", () => {
    expect(screen.getAllByTestId("scholarship-item")).toHaveLength(5);
  });

  it("displays correct seed names", () => {
    const names = screen.getAllByTestId("scholarship-name").map((el) => el.textContent);
    expect(names).toContain("Gates Millennium");
    expect(names).toContain("Rhodes Scholarship");
  });

  it("shows correct summary counts", () => {
    expect(screen.getByTestId("count-total").textContent).toContain("5");
    expect(screen.getByTestId("count-applied").textContent).toContain("2");
  });

  it("shows correct total potential (non-applied sum)", () => {
    // Non-applied: 10000 + 20000 + 5000 = 35000
    expect(screen.getByTestId("total-potential").textContent).toContain("35000");
  });

  it("filters by search term", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-search"), "gates");
    const items = screen.getAllByTestId("scholarship-item");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByTestId("scholarship-name").textContent).toBe("Gates Millennium");
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    await userEvent.selectOptions(screen.getByTestId("select-category"), "STEM");
    const items = screen.getAllByTestId("scholarship-item");
    expect(items).toHaveLength(2);
    items.forEach((item) => {
      expect(within(item).getByTestId("scholarship-category").textContent).toBe("STEM");
    });
  });

  it("combines search and category filter", async () => {
    const user = userEvent.setup();
    await userEvent.selectOptions(screen.getByTestId("select-category"), "General");
    await user.type(screen.getByTestId("input-search"), "coca");
    const items = screen.getAllByTestId("scholarship-item");
    expect(items).toHaveLength(1);
    expect(within(items[0]).getByTestId("scholarship-name").textContent).toBe("Coca-Cola Scholars");
  });

  it("adds a new scholarship", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Rotary Foundation");
    await user.type(screen.getByTestId("input-amount"), "15000");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("count-total").textContent).toContain("6");
    const names = screen.getAllByTestId("scholarship-name").map((el) => el.textContent);
    expect(names).toContain("Rotary Foundation");
  });

  it("shows error when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-amount"), "5000");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("shows error when amount is zero or negative", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Bad Grant");
    await user.type(screen.getByTestId("input-amount"), "0");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("toggles applied status", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("scholarship-item");
    // First item (Gates Millennium) is not applied
    const toggleBtn = within(items[0]).getByTestId("btn-toggle-applied");
    expect(toggleBtn.textContent).toBe("Mark Applied");
    await user.click(toggleBtn);
    expect(within(items[0]).getByTestId("btn-toggle-applied").textContent).toBe("Unmark");
    expect(screen.getByTestId("count-applied").textContent).toContain("3");
  });

  it("deletes a scholarship", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("scholarship-item");
    await user.click(within(items[0]).getByTestId("btn-delete"));
    expect(screen.getByTestId("count-total").textContent).toContain("4");
    expect(screen.getAllByTestId("scholarship-item")).toHaveLength(4);
  });

  it("updates total potential after toggle", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("scholarship-item");
    // Toggle Gates Millennium (10000) to applied — removes from potential
    await user.click(within(items[0]).getByTestId("btn-toggle-applied"));
    // Now potential = 20000 + 5000 = 25000
    expect(screen.getByTestId("total-potential").textContent).toContain("25000");
  });
});
