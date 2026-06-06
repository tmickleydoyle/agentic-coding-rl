import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

beforeEach(() => {
  render(<App />);
});

describe("Seed data", () => {
  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /library wishlist/i })).toBeTruthy();
  });

  it("shows The Road", () => {
    expect(screen.getByTestId("wish-title-1").textContent).toBe("The Road");
  });

  it("shows priority for The Road", () => {
    expect(screen.getByTestId("wish-priority-1").textContent).toBe("Priority: High");
  });

  it("shows all three seed items", () => {
    const list = screen.getByTestId("wishlist");
    expect(within(list).getAllByRole("listitem").length).toBe(3);
  });
});

describe("Add item", () => {
  it("adds a valid item", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Brave New World");
    await user.type(screen.getByTestId("input-author"), "Aldous Huxley");
    await user.type(screen.getByTestId("input-genre"), "Dystopia");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Brave New World")).toBeTruthy();
  });

  it("resets form after add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Reset Book");
    await user.type(screen.getByTestId("input-author"), "Author A");
    await user.type(screen.getByTestId("input-genre"), "Genre B");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-title") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("select-priority") as HTMLSelectElement).value).toBe("Medium");
  });

  it("rejects add when title is blank", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-author"), "Author");
    await user.type(screen.getByTestId("input-genre"), "Genre");
    await user.click(screen.getByTestId("btn-add"));
    const list = screen.getByTestId("wishlist");
    expect(within(list).getAllByRole("listitem").length).toBe(3);
  });

  it("allows adding item without notes", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "No Notes Book");
    await user.type(screen.getByTestId("input-author"), "Author B");
    await user.type(screen.getByTestId("input-genre"), "History");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("No Notes Book")).toBeTruthy();
  });
});

describe("Delete item", () => {
  it("removes item when Delete is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("wish-card-1")).toBeNull();
  });

  it("leaves other items intact", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.getByTestId("wish-card-2")).toBeTruthy();
  });
});

describe("Filter by priority", () => {
  it("filters to High priority items", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-priority"), "High");
    expect(screen.getByTestId("wish-card-1")).toBeTruthy();
    expect(screen.queryByTestId("wish-card-2")).toBeNull();
    expect(screen.queryByTestId("wish-card-3")).toBeNull();
  });

  it("All shows all items", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-priority"), "High");
    await user.selectOptions(screen.getByTestId("filter-priority"), "All");
    expect(screen.getByTestId("wish-card-2")).toBeTruthy();
    expect(screen.getByTestId("wish-card-3")).toBeTruthy();
  });
});

describe("Sort by priority", () => {
  it("sorts items High > Medium > Low", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-sort"));
    const list = screen.getByTestId("wishlist");
    const items = within(list).getAllByRole("listitem");
    const firstPriority = items[0].querySelector("[data-testid^='wish-priority-']")?.textContent ?? "";
    expect(firstPriority).toContain("High");
    const lastPriority = items[items.length - 1].querySelector("[data-testid^='wish-priority-']")?.textContent ?? "";
    expect(lastPriority).toContain("Low");
  });
});
