import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Mortgage Calculator", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /mortgage calculator/i })).toBeTruthy();
  });

  it("shows loan amount on load", () => {
    expect(screen.getByTestId("loan-amount").textContent).toContain("$320,000");
  });

  it("shows monthly payment on load", () => {
    const mp = screen.getByTestId("monthly-payment").textContent;
    expect(mp).toMatch(/\$2,\d{3}/);
  });

  it("shows total payment on load", () => {
    const tp = screen.getByTestId("total-payment").textContent;
    expect(tp).toContain("$");
  });

  it("shows total interest on load", () => {
    const ti = screen.getByTestId("total-interest").textContent;
    expect(ti).toContain("$");
  });

  it("shows amortization table on load", () => {
    expect(screen.getByTestId("amortization-table")).toBeTruthy();
  });

  it("shows 12 rows by default", () => {
    const rows = screen.getAllByTestId(/^amort-row-\d+$/);
    expect(rows.length).toBe(12);
  });

  it("toggle shows full schedule", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-schedule"));
    const rows = screen.getAllByTestId(/^amort-row-\d+$/);
    expect(rows.length).toBe(360);
  });

  it("toggle button text changes after click", async () => {
    const user = userEvent.setup();
    const btn = screen.getByTestId("toggle-schedule");
    expect(btn.textContent).toContain("Show Full Schedule");
    await user.click(btn);
    expect(btn.textContent).toContain("Hide Full Schedule");
  });

  it("shows error when down payment >= home price", async () => {
    const user = userEvent.setup();
    const dpInput = screen.getByLabelText("Down Payment ($)");
    await user.clear(dpInput);
    await user.type(dpInput, "400000");
    expect(screen.getByTestId("input-error")).toBeTruthy();
  });

  it("hides results when input error present", async () => {
    const user = userEvent.setup();
    const dpInput = screen.getByLabelText("Down Payment ($)");
    await user.clear(dpInput);
    await user.type(dpInput, "400000");
    expect(screen.queryByTestId("loan-amount")).toBeNull();
  });

  it("updates loan amount when home price changes", async () => {
    const user = userEvent.setup();
    const hpInput = screen.getByLabelText("Home Price ($)");
    await user.clear(hpInput);
    await user.type(hpInput, "500000");
    expect(screen.getByTestId("loan-amount").textContent).toContain("$420,000");
  });

  it("15 year term shows 180 rows when full schedule shown", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Loan Term (years)"), "15");
    await user.click(screen.getByTestId("toggle-schedule"));
    const rows = screen.getAllByTestId(/^amort-row-\d+$/);
    expect(rows.length).toBe(180);
  });

  it("shows row 1 with correct data-testid", () => {
    expect(screen.getByTestId("amort-row-1")).toBeTruthy();
  });
});
