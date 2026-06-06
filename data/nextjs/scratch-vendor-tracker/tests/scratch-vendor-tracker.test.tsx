import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Vendor Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /vendor tracker/i })).toBeTruthy();
  });

  it("shows correct summary totals", () => {
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/Total Budget: \$19500/);
    expect(summary.textContent).toMatch(/Total Paid: \$8500/);
    expect(summary.textContent).toMatch(/Balance: \$11000/);
  });

  it("renders all seed vendor cards", () => {
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`vendor-card-${i}`)).toBeTruthy();
    }
  });

  it("shows correct contract badge values", () => {
    expect(screen.getByTestId("contract-badge-1").textContent).toBe("Signed");
    expect(screen.getByTestId("contract-badge-3").textContent).toBe("Pending");
  });

  it("shows per-vendor balance", () => {
    const balance1 = screen.getByTestId("vendor-balance-1");
    expect(balance1.textContent).toMatch(/Total: \$8000/);
    expect(balance1.textContent).toMatch(/Paid: \$4000/);
    expect(balance1.textContent).toMatch(/Balance: \$4000/);
  });

  it("filter contract pending shows only unsigned vendors", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-contract-pending"));
    expect(screen.getByTestId("vendor-card-3")).toBeTruthy();
    expect(screen.getByTestId("vendor-card-5")).toBeTruthy();
    expect(screen.queryByTestId("vendor-card-1")).toBeNull();
  });

  it("filter contract signed shows only signed vendors", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-contract-signed"));
    expect(screen.getByTestId("vendor-card-1")).toBeTruthy();
    expect(screen.queryByTestId("vendor-card-3")).toBeNull();
  });

  it("filter all restores all vendors", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-contract-signed"));
    await user.click(screen.getByTestId("filter-all"));
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`vendor-card-${i}`)).toBeTruthy();
    }
  });

  it("deletes a vendor and updates summary", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-btn-4"));
    expect(screen.queryByTestId("vendor-card-4")).toBeNull();
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/Total Budget: \$18000/);
  });

  it("adds a new vendor", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-vendor-btn"));
    await user.type(screen.getByLabelText(/^name/i), "Lovely Cakes");
    await user.clear(screen.getByLabelText(/total cost/i));
    await user.type(screen.getByLabelText(/total cost/i), "1200");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByText("Lovely Cakes")).toBeTruthy();
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/Total Budget: \$20700/);
  });

  it("does not add vendor with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-vendor-btn"));
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByTestId("summary").textContent).toMatch(/Total Budget: \$19500/);
  });

  it("edits a vendor", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-3"));
    const contractCheckbox = screen.getByLabelText(/contract signed/i);
    await user.click(contractCheckbox);
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByTestId("contract-badge-3").textContent).toBe("Signed");
  });

  it("cancel edit does not change vendor", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-3"));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.getByTestId("contract-badge-3").textContent).toBe("Pending");
  });

  it("clamps amountPaid to totalCost on save", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("edit-btn-5"));
    await user.clear(screen.getByLabelText(/amount paid/i));
    await user.type(screen.getByLabelText(/amount paid/i), "9999");
    await user.click(screen.getByRole("button", { name: /save/i }));
    const balance = screen.getByTestId("vendor-balance-5");
    expect(balance.textContent).toMatch(/Balance: \$0/);
  });
});
