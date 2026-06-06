import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Home Inventory", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /home inventory/i })).toBeTruthy();
  });

  it("shows seed items in the list", () => {
    expect(screen.getByTestId("item-row-1")).toBeTruthy();
    expect(screen.getByTestId("item-row-4")).toBeTruthy();
    expect(screen.getByTestId("item-row-7")).toBeTruthy();
  });

  it("shows total count of seed items", () => {
    const counter = screen.getByTestId("total-count");
    expect(counter.textContent).toContain("7");
  });

  it("shows total value of seed items", () => {
    const totalValue = screen.getByTestId("total-value");
    // 800+1200+300+950+120+600+1100 = 5070
    expect(totalValue.textContent).toContain("5070");
  });

  it("adds a new item to the list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Bookshelf");
    await user.clear(screen.getByTestId("input-quantity"));
    await user.type(screen.getByTestId("input-quantity"), "2");
    await user.clear(screen.getByTestId("input-value"));
    await user.type(screen.getByTestId("input-value"), "250");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Bookshelf")).toBeTruthy();
  });

  it("clears form after adding an item", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Mirror");
    await user.click(screen.getByTestId("btn-add"));
    expect(nameInput.value).toBe("");
  });

  it("does not add an item if name is empty", async () => {
    const user = userEvent.setup();
    const initialRows = screen.getAllByRole("row").length;
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByRole("row").length).toBe(initialRows);
  });

  it("deletes an item", async () => {
    const user = userEvent.setup();
    expect(screen.getByTestId("item-row-1")).toBeTruthy();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("item-row-1")).toBeNull();
  });

  it("filters items by room", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-room"), "Kitchen");
    expect(screen.getByText("Refrigerator")).toBeTruthy();
    expect(screen.queryByText("Sofa")).toBeNull();
  });

  it("total count and value are not affected by filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-room"), "Bedroom");
    expect(screen.getByTestId("total-count").textContent).toContain("7");
    expect(screen.getByTestId("total-value").textContent).toContain("5070");
  });

  it("shows all items when filter is All Rooms", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-room"), "Kitchen");
    await user.selectOptions(screen.getByTestId("filter-room"), "All Rooms");
    expect(screen.getByTestId("item-row-1")).toBeTruthy();
    expect(screen.getByTestId("item-row-4")).toBeTruthy();
  });

  it("displays value formatted with $ sign", () => {
    const valueCell = screen.getByTestId("item-value-1");
    expect(valueCell.textContent).toContain("$");
  });

  it("total count updates after adding an item", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Lamp");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("total-count").textContent).toContain("8");
  });

  it("total count updates after deleting an item", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.getByTestId("total-count").textContent).toContain("6");
  });
});
