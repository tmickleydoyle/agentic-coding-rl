import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Warranty Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /warranty tracker/i })).toBeTruthy();
  });

  it("shows seed warranties", () => {
    expect(screen.getByTestId("warranty-row-1")).toBeTruthy();
    expect(screen.getByTestId("warranty-row-5")).toBeTruthy();
  });

  it("shows total count of 5", () => {
    expect(screen.getByTestId("total-count").textContent).toContain("5");
  });

  it("shows expired count (items 1, 3, 5 expired with past expiry dates)", () => {
    const expiredText = screen.getByTestId("expired-count").textContent ?? "";
    const count = parseInt(expiredText.replace(/\D/g, ""), 10);
    expect(count).toBeGreaterThan(0);
  });

  it("expired items show Expired status", () => {
    // Item 3 (Laptop) expired 2022-09-10
    expect(screen.getByTestId("warranty-status-3").textContent).toBe("Expired");
  });

  it("active items show Active status", () => {
    // Item 4 (Air Conditioner) expires 2028-05-20
    expect(screen.getByTestId("warranty-status-4").textContent).toBe("Active");
  });

  it("adds a new warranty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-product"), "Blender");
    await user.type(screen.getByTestId("input-brand"), "Vitamix");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Blender")).toBeTruthy();
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const productInput = screen.getByTestId("input-product") as HTMLInputElement;
    await user.type(productInput, "Blender");
    await user.type(screen.getByTestId("input-brand"), "Vitamix");
    await user.click(screen.getByTestId("btn-add"));
    expect(productInput.value).toBe("");
  });

  it("does not add when product is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-brand"), "Vitamix");
    const initialRows = screen.getAllByRole("row").length;
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByRole("row").length).toBe(initialRows);
  });

  it("does not add when brand is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-product"), "Blender");
    const initialRows = screen.getAllByRole("row").length;
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByRole("row").length).toBe(initialRows);
  });

  it("deletes a warranty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("warranty-row-1")).toBeNull();
  });

  it("filters by Expired", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Expired");
    expect(screen.queryByTestId("warranty-row-4")).toBeNull();
  });

  it("filters by Active", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Active");
    // Item 4 (expires 2028) should be visible
    expect(screen.getByTestId("warranty-row-4")).toBeTruthy();
    // Item 3 (expired 2022) should not be visible
    expect(screen.queryByTestId("warranty-row-3")).toBeNull();
  });

  it("summary totals unaffected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Active");
    expect(screen.getByTestId("total-count").textContent).toContain("5");
  });

  it("shows notes for items with notes", () => {
    expect(screen.getByTestId("warranty-notes-1").textContent).toContain("Extended plan");
  });
});
