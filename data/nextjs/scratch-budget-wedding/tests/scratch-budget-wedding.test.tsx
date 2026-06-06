import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Wedding Budget", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /wedding budget/i })).toBeTruthy();
  });

  it("shows correct overall summary", () => {
    const summary = screen.getByTestId("overall-summary");
    // total spent = 9500+8200+2800+1800+1500+3100 = 26900
    expect(summary.textContent).toMatch(/Total Budget: \$30000/);
    expect(summary.textContent).toMatch(/Total Spent: \$26900/);
    expect(summary.textContent).toMatch(/Remaining: \$3100/);
  });

  it("renders overall progress bar", () => {
    const bar = screen.getByTestId("overall-progress");
    expect(bar.textContent).toMatch(/\d+%/);
  });

  it("renders all category rows", () => {
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`category-row-${i}`)).toBeTruthy();
    }
  });

  it("shows over-budget warning for catering (id=2)", () => {
    expect(screen.getByTestId("over-budget-2")).toBeTruthy();
  });

  it("shows over-budget warning for attire (id=6)", () => {
    expect(screen.getByTestId("over-budget-6")).toBeTruthy();
  });

  it("does not show over-budget for venue (id=1)", () => {
    expect(screen.queryByTestId("over-budget-1")).toBeNull();
  });

  it("shows category detail for venue", () => {
    const detail = screen.getByTestId("category-detail-1");
    expect(detail.textContent).toMatch(/Budgeted: \$10000/);
    expect(detail.textContent).toMatch(/Spent: \$9500/);
    expect(detail.textContent).toMatch(/Remaining: \$500/);
  });

  it("shows add expense form when button clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-expense-btn"));
    expect(screen.getByTestId("expense-form")).toBeTruthy();
  });

  it("adds an expense to a category", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-expense-btn"));
    await user.selectOptions(screen.getByLabelText(/expense category/i), "1");
    await user.type(screen.getByLabelText(/expense amount/i), "200");
    await user.click(screen.getByRole("button", { name: /save/i }));
    const detail = screen.getByTestId("category-detail-1");
    expect(detail.textContent).toMatch(/Spent: \$9700/);
    const summary = screen.getByTestId("overall-summary");
    expect(summary.textContent).toMatch(/Total Spent: \$27100/);
  });

  it("cancel expense form does not change spent", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-expense-btn"));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByTestId("expense-form")).toBeNull();
    expect(screen.getByTestId("overall-summary").textContent).toMatch(/Total Spent: \$26900/);
  });

  it("adds a new category", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-category-btn"));
    await user.type(screen.getByLabelText(/category name/i), "Transportation");
    await user.type(screen.getByLabelText(/budget amount/i), "1000");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByText("Transportation")).toBeTruthy();
  });

  it("does not add category with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-category-btn"));
    await user.type(screen.getByLabelText(/budget amount/i), "500");
    await user.click(screen.getByRole("button", { name: /save/i }));
    // still 6 categories
    expect(screen.queryByTestId("category-row-7")).toBeNull();
  });

  it("over-budget appears immediately after expense pushes over limit", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-expense-btn"));
    // Photography (id=3): budgeted 3000, spent 2800; add 300 -> 3100 over budget
    await user.selectOptions(screen.getByLabelText(/expense category/i), "3");
    await user.type(screen.getByLabelText(/expense amount/i), "300");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByTestId("over-budget-3")).toBeTruthy();
  });
});
