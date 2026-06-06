import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Camping Checklist", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /camping checklist/i })).toBeTruthy();
  });

  it("shows summary with initial packed count", () => {
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/4 of 9 items packed/i);
  });

  it("renders all three category headings", () => {
    expect(screen.getByTestId("category-heading-Shelter")).toBeTruthy();
    expect(screen.getByTestId("category-heading-Food-Water")).toBeTruthy();
    expect(screen.getByTestId("category-heading-Clothing")).toBeTruthy();
  });

  it("category heading shows packed count", () => {
    const shelterHeading = screen.getByTestId("category-heading-Shelter");
    expect(shelterHeading.textContent).toContain("1/3");
  });

  it("packed items have strikethrough style", () => {
    // Item 2 = Sleeping bag, packed: true
    const nameEl = screen.getByTestId("item-name-2");
    expect(nameEl.style.textDecoration).toBe("line-through");
  });

  it("unpacked items have no strikethrough", () => {
    const nameEl = screen.getByTestId("item-name-1");
    expect(nameEl.style.textDecoration).toBe("none");
  });

  it("toggling a checkbox updates packed state and summary", async () => {
    const user = userEvent.setup();
    const checkbox = screen.getByTestId("checkbox-1");
    await user.click(checkbox);
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/5 of 9 items packed/i);
  });

  it("removing an item decreases total count", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove-1"));
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/of 8 items packed/i);
  });

  it("adding an item with empty name does nothing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-item-btn"));
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/of 9 items packed/i);
  });

  it("adding a new item increases total and resets input", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("new-item-name");
    await user.type(input, "Headlamp");
    await user.click(screen.getByTestId("add-item-btn"));
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/of 10 items packed/i);
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("new item appears unpacked", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("new-item-name"), "Map");
    await user.click(screen.getByTestId("add-item-btn"));
    const nameEls = screen.getAllByText("Map");
    expect(nameEls.length).toBeGreaterThan(0);
  });

  it("clear packed button removes all packed items", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("clear-packed"));
    const summary = screen.getByTestId("summary");
    expect(summary.textContent).toMatch(/0 of 5 items packed/i);
  });

  it("removing all items in a category hides that category", async () => {
    const user = userEvent.setup();
    // Remove all Shelter items (1,2,3)
    await user.click(screen.getByTestId("remove-1"));
    await user.click(screen.getByTestId("remove-2"));
    await user.click(screen.getByTestId("remove-3"));
    expect(screen.queryByTestId("category-heading-Shelter")).toBeNull();
  });
});
