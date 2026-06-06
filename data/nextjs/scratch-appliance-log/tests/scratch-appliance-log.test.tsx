import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Appliance Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /appliance log/i })).toBeTruthy();
  });

  it("shows seed appliances", () => {
    expect(screen.getByTestId("appliance-row-1")).toBeTruthy();
    expect(screen.getByTestId("appliance-row-5")).toBeTruthy();
  });

  it("shows correct total count", () => {
    expect(screen.getByTestId("total-count").textContent).toContain("5");
  });

  it("shows correct active count (4 active in seed)", () => {
    expect(screen.getByTestId("active-count").textContent).toContain("4");
  });

  it("adds a new appliance", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Dryer");
    await user.type(screen.getByTestId("input-brand"), "Whirlpool");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Dryer")).toBeTruthy();
    expect(screen.getByText("Whirlpool")).toBeTruthy();
  });

  it("clears form after adding appliance", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Dryer");
    await user.type(screen.getByTestId("input-brand"), "Whirlpool");
    await user.click(screen.getByTestId("btn-add"));
    expect(nameInput.value).toBe("");
  });

  it("does not add if name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-brand"), "Whirlpool");
    const initialRows = screen.getAllByRole("row").length;
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByRole("row").length).toBe(initialRows);
  });

  it("does not add if brand is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Dryer");
    const initialRows = screen.getAllByRole("row").length;
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByRole("row").length).toBe(initialRows);
  });

  it("removes an appliance", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-remove-1"));
    expect(screen.queryByTestId("appliance-row-1")).toBeNull();
  });

  it("filters by status", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Retired");
    expect(screen.getByTestId("appliance-row-5")).toBeTruthy();
    expect(screen.queryByTestId("appliance-row-1")).toBeNull();
  });

  it("total count not affected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-status"), "Retired");
    expect(screen.getByTestId("total-count").textContent).toContain("5");
  });

  it("updates status inline", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("appliance-status-1"), "Needs Repair");
    expect((screen.getByTestId("appliance-status-1") as HTMLSelectElement).value).toBe("Needs Repair");
  });

  it("active count decreases when status changed from Active", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("appliance-status-1"), "Retired");
    expect(screen.getByTestId("active-count").textContent).toContain("3");
  });

  it("shows price with dollar sign", () => {
    expect(screen.getByTestId("appliance-price-1").textContent).toContain("$");
    expect(screen.getByTestId("appliance-price-1").textContent).toContain("1400");
  });
});
