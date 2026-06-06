import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Pet Expense Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the main heading", () => {
    expect(screen.getByRole("heading", { name: /pet expense tracker/i })).toBeTruthy();
  });

  it("shows two pet buttons", () => {
    expect(screen.getByTestId("pet-btn-charlie")).toBeTruthy();
    expect(screen.getByTestId("pet-btn-cleo")).toBeTruthy();
  });

  it("shows Charlie as default with species Dog", () => {
    expect(screen.getByTestId("pet-name").textContent).toBe("Charlie");
    expect(screen.getByTestId("pet-species").textContent).toBe("Dog");
  });

  it("shows correct total for Charlie ($187.50)", () => {
    expect(screen.getByTestId("total-expenses").textContent).toContain("187.50");
  });

  it("shows category breakdown for Charlie", () => {
    expect(screen.getByTestId("category-food").textContent).toContain("45.00");
    expect(screen.getByTestId("category-vet").textContent).toContain("120.00");
    expect(screen.getByTestId("category-toys").textContent).toContain("22.50");
  });

  it("renders 3 expense rows for Charlie", () => {
    expect(screen.getByTestId("expense-row-0")).toBeTruthy();
    expect(screen.getByTestId("expense-row-1")).toBeTruthy();
    expect(screen.getByTestId("expense-row-2")).toBeTruthy();
  });

  it("switches to Cleo and shows her total ($115.00)", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("pet-btn-cleo"));
    expect(screen.getByTestId("pet-name").textContent).toBe("Cleo");
    expect(screen.getByTestId("total-expenses").textContent).toContain("115.00");
  });

  it("adds a new expense", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("expense-date-input"), "2024-04-01");
    await user.type(screen.getByTestId("expense-amount-input"), "55.00");
    await user.type(screen.getByTestId("expense-note-input"), "Grooming session");
    await user.click(screen.getByRole("button", { name: /add expense/i }));
    expect(screen.getByTestId("expense-row-3")).toBeTruthy();
  });

  it("updates total after adding expense", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("expense-date-input"), "2024-04-01");
    await user.type(screen.getByTestId("expense-amount-input"), "12.50");
    await user.click(screen.getByRole("button", { name: /add expense/i }));
    expect(screen.getByTestId("total-expenses").textContent).toContain("200.00");
  });

  it("does not add expense when amount is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("expense-date-input"), "2024-04-01");
    await user.click(screen.getByRole("button", { name: /add expense/i }));
    expect(screen.queryByTestId("expense-row-3")).toBeNull();
  });

  it("deletes an expense and updates total", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-expense-0"));
    expect(screen.queryByTestId("expense-row-2")).toBeNull();
    expect(screen.getByTestId("total-expenses").textContent).toContain("142.50");
  });

  it("shows no-expenses-msg when all deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-expense-2"));
    await user.click(screen.getByTestId("delete-expense-1"));
    await user.click(screen.getByTestId("delete-expense-0"));
    expect(screen.getByTestId("no-expenses-msg")).toBeTruthy();
  });

  it("expenses are independent between pets", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-expense-0"));
    await user.click(screen.getByTestId("pet-btn-cleo"));
    expect(screen.getByTestId("expense-row-0")).toBeTruthy();
  });
});
