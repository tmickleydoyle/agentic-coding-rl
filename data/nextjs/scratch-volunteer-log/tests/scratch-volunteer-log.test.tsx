import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Volunteer Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /volunteer log/i })).toBeDefined();
  });

  it("renders seed entries in the list", () => {
    expect(screen.getByTestId("entry-1")).toBeDefined();
    expect(screen.getByTestId("entry-2")).toBeDefined();
    expect(screen.getByTestId("entry-5")).toBeDefined();
  });

  it("displays correct name for seed entry", () => {
    expect(screen.getByTestId("entry-name-1").textContent).toBe("Alice Johnson");
  });

  it("displays hours with one decimal place", () => {
    expect(screen.getByTestId("entry-hours-2").textContent).toContain("5.0");
  });

  it("shows total hours for all seed entries", () => {
    expect(screen.getByTestId("total-hours").textContent).toContain("20.0");
  });

  it("adds a new entry and prepends it to the list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Eve Turner");
    await user.type(screen.getByTestId("input-activity"), "Hospital Visit");
    await user.clear(screen.getByTestId("input-hours"));
    await user.type(screen.getByTestId("input-hours"), "2.5");
    await user.type(screen.getByTestId("input-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add"));
    const list = screen.getByTestId("entries-list");
    const items = within(list).getAllByRole("listitem");
    expect(items[0].textContent).toContain("Eve Turner");
  });

  it("clears the form after adding an entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Eve Turner");
    await user.type(screen.getByTestId("input-activity"), "Hospital Visit");
    await user.type(screen.getByTestId("input-hours"), "2.5");
    await user.type(screen.getByTestId("input-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-name") as HTMLInputElement).value).toBe("");
  });

  it("does not add entry with zero hours", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Eve Turner");
    await user.type(screen.getByTestId("input-activity"), "Hospital Visit");
    await user.type(screen.getByTestId("input-hours"), "0");
    await user.type(screen.getByTestId("input-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByText("Eve Turner")).toBeNull();
  });

  it("deletes an entry when delete button is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("entry-1")).toBeNull();
  });

  it("updates total hours after deletion", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    // Alice Johnson entry 1 had 3 hrs; total was 20.0, now should be 17.0
    expect(screen.getByTestId("total-hours").textContent).toContain("17.0");
  });

  it("shows empty message when all entries deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    await user.click(screen.getByTestId("btn-delete-2"));
    await user.click(screen.getByTestId("btn-delete-3"));
    await user.click(screen.getByTestId("btn-delete-4"));
    await user.click(screen.getByTestId("btn-delete-5"));
    expect(screen.getByTestId("empty-message")).toBeDefined();
  });

  it("filters entries by name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-name"), "Bob");
    expect(screen.getByTestId("entry-2")).toBeDefined();
    expect(screen.getByTestId("entry-5")).toBeDefined();
    expect(screen.queryByTestId("entry-1")).toBeNull();
  });

  it("filter is case insensitive", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-name"), "alice");
    expect(screen.getByTestId("entry-1")).toBeDefined();
    expect(screen.getByTestId("entry-3")).toBeDefined();
  });

  it("shows volunteer summary with per-person totals", () => {
    const summary = screen.getByTestId("volunteer-summary");
    expect(summary.textContent).toContain("Alice Johnson");
    expect(summary.textContent).toContain("Bob Smith");
  });

  it("total hours not affected by filter", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-name"), "Alice");
    expect(screen.getByTestId("total-hours").textContent).toContain("20.0");
  });
});
