import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Valuation Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByTestId("heading")).toHaveTextContent("Valuation Log");
  });

  it("renders seed entries", () => {
    expect(screen.getByTestId("entry-1")).toBeTruthy();
    expect(screen.getByTestId("entry-name-1")).toHaveTextContent("Tiffany Floor Lamp");
    expect(screen.getByTestId("entry-notes-1")).toHaveTextContent("Excellent original shade");
  });

  it("shows summary with avg value and top item", () => {
    expect(screen.getByTestId("avg-value")).toBeTruthy();
    expect(screen.getByTestId("top-item")).toHaveTextContent("Tiffany Floor Lamp");
  });

  it("adds a new entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-item-name"), "Chippendale Chair");
    await user.selectOptions(screen.getByTestId("select-category"), "Furniture");
    await user.type(screen.getByTestId("input-valued-by"), "Tom Baker");
    await user.type(screen.getByTestId("input-date"), "2024-05-01");
    await user.type(screen.getByTestId("input-estimated-value"), "5000");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("entry-6")).toBeTruthy();
    expect(screen.getByTestId("entry-name-6")).toHaveTextContent("Chippendale Chair");
  });

  it("clears the form after adding", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-item-name") as HTMLInputElement;
    await user.type(nameInput, "Test Item");
    await user.type(screen.getByTestId("input-valued-by"), "Appraiser");
    await user.type(screen.getByTestId("input-date"), "2024-01-01");
    await user.type(screen.getByTestId("input-estimated-value"), "500");
    await user.click(screen.getByTestId("btn-add"));
    expect(nameInput.value).toBe("");
  });

  it("shows error for empty item name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-valued-by"), "Expert");
    await user.type(screen.getByTestId("input-date"), "2024-01-01");
    await user.type(screen.getByTestId("input-estimated-value"), "500");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Item name is required");
  });

  it("shows error for empty valued by", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-item-name"), "Lamp");
    await user.type(screen.getByTestId("input-date"), "2024-01-01");
    await user.type(screen.getByTestId("input-estimated-value"), "500");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Valued by is required");
  });

  it("shows error for estimated value <= 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-item-name"), "Chair");
    await user.type(screen.getByTestId("input-valued-by"), "Expert");
    await user.type(screen.getByTestId("input-date"), "2024-01-01");
    await user.type(screen.getByTestId("input-estimated-value"), "0");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Estimated value must be greater than 0");
  });

  it("edits a value inline", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-edit-2"));
    const editInput = screen.getByTestId("edit-input-2") as HTMLInputElement;
    expect(editInput).toBeTruthy();
    await user.clear(editInput);
    await user.type(editInput, "4000");
    await user.click(screen.getByTestId("btn-save-2"));
    expect(screen.getByTestId("entry-value-2").textContent).toContain("4,000");
    expect(screen.queryByTestId("edit-input-2")).toBeNull();
  });

  it("deletes an entry", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-3"));
    expect(screen.queryByTestId("entry-3")).toBeNull();
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Jewelry");
    expect(screen.getByTestId("entry-3")).toBeTruthy();
    expect(screen.queryByTestId("entry-1")).toBeNull();
  });

  it("sorts by value descending", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("sort-by"), "value-desc");
    const list = screen.getByTestId("entry-list");
    const names = list.querySelectorAll("[data-testid^='entry-name-']");
    expect(names[0].textContent).toBe("Tiffany Floor Lamp");
  });

  it("sorts by date ascending", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("sort-by"), "date-asc");
    const list = screen.getByTestId("entry-list");
    const names = list.querySelectorAll("[data-testid^='entry-name-']");
    expect(names[0].textContent).toBe("Tiffany Floor Lamp");
  });

  it("summary reflects all entries regardless of filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-category"), "Jewelry");
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toContain("5");
  });
});
