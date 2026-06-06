import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Charity Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /charity tracker/i })).toBeDefined();
  });

  it("renders seed records", () => {
    expect(screen.getByTestId("record-1")).toBeDefined();
    expect(screen.getByTestId("record-5")).toBeDefined();
  });

  it("displays amount formatted as $X.XX", () => {
    expect(screen.getByTestId("record-amount-1").textContent).toBe("$100.00");
  });

  it("shows correct total donated for seed data", () => {
    expect(screen.getByTestId("total-donated").textContent).toContain("$575.00");
  });

  it("adds a new donation and prepends to list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-charity"), "Hope Foundation");
    await user.selectOptions(screen.getByTestId("input-category"), "Education");
    await user.type(screen.getByTestId("input-amount"), "60");
    await user.type(screen.getByTestId("input-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add"));
    const list = screen.getByTestId("records-list");
    const items = within(list).getAllByRole("listitem");
    expect(items[0].textContent).toContain("Hope Foundation");
  });

  it("clears form after adding a donation", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-charity"), "Hope Foundation");
    await user.type(screen.getByTestId("input-amount"), "60");
    await user.type(screen.getByTestId("input-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-charity") as HTMLInputElement).value).toBe("");
  });

  it("does not add donation with zero amount", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-charity"), "Hope Foundation");
    await user.type(screen.getByTestId("input-amount"), "0");
    await user.type(screen.getByTestId("input-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Hope Foundation")).toBeNull();
  });

  it("removes a record when remove button clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-remove-1"));
    expect(screen.queryByTestId("record-1")).toBeNull();
  });

  it("updates total donated after removal", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-remove-1"));
    expect(screen.getByTestId("total-donated").textContent).toContain("$475.00");
  });

  it("shows empty message when all records removed", async () => {
    const user = userEvent.setup();
    for (const id of [1, 2, 3, 4, 5]) {
      await user.click(screen.getByTestId(`btn-remove-${id}`));
    }
    expect(screen.getByTestId("empty-message")).toBeDefined();
  });

  it("filters records by category", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Disaster");
    expect(screen.getByTestId("record-1")).toBeDefined();
    expect(screen.getByTestId("record-4")).toBeDefined();
    expect(screen.queryByTestId("record-2")).toBeNull();
  });

  it("All filter shows all records", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Disaster");
    await user.selectOptions(screen.getByTestId("filter-category"), "All");
    expect(screen.getByTestId("record-2")).toBeDefined();
  });

  it("total donated unaffected by category filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Hunger");
    expect(screen.getByTestId("total-donated").textContent).toContain("$575.00");
  });

  it("shows per-charity totals in summary", () => {
    const summary = screen.getByTestId("charity-summary");
    expect(summary.textContent).toContain("Red Cross");
    expect(summary.textContent).toContain("$300.00");
  });

  it("per-charity total updates after deletion", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-remove-1"));
    const summary = screen.getByTestId("charity-summary");
    expect(summary.textContent).toContain("$200.00");
  });
});
