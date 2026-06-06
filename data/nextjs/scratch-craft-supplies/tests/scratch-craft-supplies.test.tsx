import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Craft Supplies Inventory", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByText("Craft Supplies Inventory")).toBeTruthy();
  });

  it("shows all 5 seed supplies on load", () => {
    expect(screen.getByTestId("supply-1")).toBeTruthy();
    expect(screen.getByTestId("supply-5")).toBeTruthy();
  });

  it("displays correct seed data fields", () => {
    expect(screen.getByTestId("supply-name-1").textContent).toBe("Red Acrylic Paint");
    expect(screen.getByTestId("supply-category-1").textContent).toBe("Paint");
    expect(screen.getByTestId("supply-quantity-1").textContent).toBe("3");
    expect(screen.getByTestId("supply-unit-1").textContent).toBe("bottles");
  });

  it("shows correct total count", () => {
    expect(screen.getByTestId("total-count").textContent).toBe("Total: 5 items");
  });

  it("increments quantity", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-increment-1"));
    expect(screen.getByTestId("supply-quantity-1").textContent).toBe("4");
  });

  it("decrements quantity", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-decrement-1"));
    expect(screen.getByTestId("supply-quantity-1").textContent).toBe("2");
  });

  it("quantity does not go below 0", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-decrement-2"));
    expect(screen.getByTestId("supply-quantity-2").textContent).toBe("0");
    await user.click(screen.getByTestId("btn-decrement-2"));
    expect(screen.getByTestId("supply-quantity-2").textContent).toBe("0");
  });

  it("deletes a supply", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-3"));
    expect(screen.queryByTestId("supply-3")).toBeNull();
  });

  it("total count updates after delete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.getByTestId("total-count").textContent).toBe("Total: 4 items");
  });

  it("adds a new supply", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Yarn Needle");
    await user.type(screen.getByTestId("input-quantity"), "20");
    await user.type(screen.getByTestId("input-unit"), "pieces");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("supply-6")).toBeTruthy();
    expect(screen.getByTestId("supply-name-6").textContent).toBe("Yarn Needle");
  });

  it("does not add supply with blank name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-quantity"), "5");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("supply-6")).toBeNull();
  });

  it("does not add supply with zero quantity", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Test Item");
    await user.type(screen.getByTestId("input-quantity"), "0");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("supply-6")).toBeNull();
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Tools");
    expect(screen.getByTestId("supply-3")).toBeTruthy();
    expect(screen.queryByTestId("supply-1")).toBeNull();
  });

  it("shows empty-msg when filter yields nothing", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Fabric");
    expect(screen.getByTestId("empty-msg").textContent).toBe("No supplies found");
  });

  it("total count unaffected by category filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Tools");
    expect(screen.getByTestId("total-count").textContent).toBe("Total: 5 items");
  });
});
