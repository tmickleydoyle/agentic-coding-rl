import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Repair History", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /repair history/i })).toBeTruthy();
  });

  it("shows seed repairs", () => {
    expect(screen.getByTestId("repair-row-1")).toBeTruthy();
    expect(screen.getByTestId("repair-row-5")).toBeTruthy();
  });

  it("shows total count of 5", () => {
    expect(screen.getByTestId("total-count").textContent).toContain("5");
  });

  it("shows total cost of all seed repairs (785)", () => {
    // 450+180+35+120+0 = 785
    expect(screen.getByTestId("total-cost").textContent).toContain("785");
  });

  it("adds a new repair", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-item"), "Fence");
    await user.type(screen.getByTestId("input-location"), "Backyard");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Fence")).toBeTruthy();
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const itemInput = screen.getByTestId("input-item") as HTMLInputElement;
    await user.type(itemInput, "Fence");
    await user.type(screen.getByTestId("input-location"), "Backyard");
    await user.click(screen.getByTestId("btn-add"));
    expect(itemInput.value).toBe("");
  });

  it("does not add when item is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-location"), "Backyard");
    const initialRows = screen.getAllByRole("row").length;
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByRole("row").length).toBe(initialRows);
  });

  it("does not add when location is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-item"), "Fence");
    const initialRows = screen.getAllByRole("row").length;
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByRole("row").length).toBe(initialRows);
  });

  it("deletes a repair", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("repair-row-1")).toBeNull();
  });

  it("filters by Pending", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Pending");
    expect(screen.getByTestId("repair-row-5")).toBeTruthy();
    expect(screen.queryByTestId("repair-row-1")).toBeNull();
  });

  it("filters by Completed", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Completed");
    expect(screen.getByTestId("repair-row-1")).toBeTruthy();
    expect(screen.queryByTestId("repair-row-5")).toBeNull();
  });

  it("total count unaffected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Pending");
    expect(screen.getByTestId("total-count").textContent).toContain("5");
  });

  it("total cost unaffected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Pending");
    expect(screen.getByTestId("total-cost").textContent).toContain("785");
  });

  it("shows cost with dollar sign", () => {
    expect(screen.getByTestId("repair-cost-1").textContent).toContain("$450");
  });

  it("sort by cost highest first changes order", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("sort-by"), "cost-desc");
    const rows = screen.getAllByTestId(/^repair-row-/);
    // First row should be the most expensive (Roof Leak = $450)
    expect(rows[0].getAttribute("data-testid")).toBe("repair-row-1");
  });
});
