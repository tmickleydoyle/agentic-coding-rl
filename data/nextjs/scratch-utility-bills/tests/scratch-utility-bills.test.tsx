import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Utility Bills Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(
      screen.getByRole("heading", { name: /utility bills tracker/i })
    ).toBeTruthy();
  });

  it("loads 5 seed bills", () => {
    // 3 unpaid
    expect(screen.getByTestId("unpaid-count").textContent).toBe("3");
  });

  it("shows correct total amount for seed data", () => {
    // 87.5 + 34.2 + 92 + 59.99 + 45 = 318.69
    expect(screen.getByTestId("total-amount").textContent).toBe("$318.69");
  });

  it("shows correct unpaid amount for seed data", () => {
    // 92 + 59.99 + 45 = 196.99
    expect(screen.getByTestId("unpaid-amount").textContent).toBe("$196.99");
  });

  it("adds a new unpaid bill", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-07-01");
    await user.selectOptions(screen.getByTestId("utility-select"), "Trash");
    await user.clear(screen.getByTestId("amount-input"));
    await user.type(screen.getByTestId("amount-input"), "25");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("unpaid-count").textContent).toBe("4");
  });

  it("shows error when date is missing", async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByTestId("amount-input"));
    await user.type(screen.getByTestId("amount-input"), "50");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "Date and amount are required"
    );
  });

  it("shows error when amount is zero", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2024-07-01");
    await user.clear(screen.getByTestId("amount-input"));
    await user.type(screen.getByTestId("amount-input"), "0");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-message").textContent).toContain(
      "Amount must be greater than zero"
    );
  });

  it("marks a bill as paid", async () => {
    const user = userEvent.setup();
    // bill 3 is Unpaid
    await user.click(screen.getByTestId("mark-paid-3"));
    expect(screen.getByTestId("bill-status-3").textContent).toBe("Paid");
    expect(screen.getByTestId("unpaid-count").textContent).toBe("2");
  });

  it("mark paid button disappears after marking paid", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("mark-paid-3"));
    expect(screen.queryByTestId("mark-paid-3")).toBeNull();
  });

  it("deletes a bill", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("bill-1")).toBeNull();
  });

  it("filters bills by Unpaid status", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("status-filter"), "Unpaid");
    const list = screen.getByTestId("bill-list");
    expect(list.textContent).not.toContain("2024-05-15");
  });

  it("stats unaffected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("status-filter"), "Paid");
    expect(screen.getByTestId("total-amount").textContent).toBe("$318.69");
    expect(screen.getByTestId("unpaid-count").textContent).toBe("3");
  });

  it("shows $0.00 unpaid after marking all paid", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("mark-paid-3"));
    await user.click(screen.getByTestId("mark-paid-4"));
    await user.click(screen.getByTestId("mark-paid-5"));
    expect(screen.getByTestId("unpaid-amount").textContent).toBe("$0.00");
    expect(screen.getByTestId("unpaid-count").textContent).toBe("0");
  });
});
