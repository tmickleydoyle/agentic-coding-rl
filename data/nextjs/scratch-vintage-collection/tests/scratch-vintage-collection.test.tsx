import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Vintage Collection", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByTestId("heading")).toHaveTextContent("Vintage Collection");
  });

  it("renders seed items in the list", () => {
    expect(screen.getByTestId("item-1")).toBeTruthy();
    expect(screen.getByTestId("item-name-1")).toHaveTextContent("Art Deco Lamp");
    expect(screen.getByTestId("item-3")).toBeTruthy();
    expect(screen.getByTestId("item-sold-3")).toHaveTextContent("SOLD");
  });

  it("shows summary with total items and unsold value", () => {
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toContain("5");
  });

  it("adds a new item via the form", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Deco Mirror");
    await user.selectOptions(screen.getByTestId("select-category"), "Furniture");
    await user.type(screen.getByTestId("input-year"), "1930");
    await user.type(screen.getByTestId("input-price"), "200");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("item-6")).toBeTruthy();
    expect(screen.getByTestId("item-name-6")).toHaveTextContent("Deco Mirror");
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Widget");
    await user.type(screen.getByTestId("input-year"), "1940");
    await user.type(screen.getByTestId("input-price"), "50");
    await user.click(screen.getByTestId("btn-add"));
    expect(nameInput.value).toBe("");
  });

  it("shows error when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-year"), "1940");
    await user.type(screen.getByTestId("input-price"), "50");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Name is required");
  });

  it("shows error when year is out of range", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Clock");
    await user.type(screen.getByTestId("input-year"), "500");
    await user.type(screen.getByTestId("input-price"), "100");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Year must be between 1000 and 2999");
  });

  it("shows error when price is zero or negative", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Vase");
    await user.type(screen.getByTestId("input-year"), "1920");
    await user.type(screen.getByTestId("input-price"), "0");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Price must be greater than 0");
  });

  it("marks an item as sold", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-sold-1"));
    expect(screen.getByTestId("item-sold-1")).toHaveTextContent("SOLD");
    expect(screen.queryByTestId("btn-sold-1")).toBeNull();
  });

  it("removes an item", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-remove-2"));
    expect(screen.queryByTestId("item-2")).toBeNull();
  });

  it("filters items by category", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Furniture");
    expect(screen.getByTestId("item-1")).toBeTruthy();
    expect(screen.queryByTestId("item-2")).toBeNull();
  });

  it("hides sold items when checkbox is checked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-hide-sold"));
    expect(screen.queryByTestId("item-3")).toBeNull();
    expect(screen.getByTestId("item-1")).toBeTruthy();
  });

  it("combines category and hide-sold filters", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Jewelry");
    await user.click(screen.getByTestId("filter-hide-sold"));
    expect(screen.queryByTestId("item-3")).toBeNull();
  });

  it("summary reflects all items regardless of filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Furniture");
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toContain("5");
  });
});
