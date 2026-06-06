import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Donation Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /donation log/i })).toBeDefined();
  });

  it("renders all seed entries", () => {
    expect(screen.getByTestId("entry-1")).toBeDefined();
    expect(screen.getByTestId("entry-5")).toBeDefined();
  });

  it("displays amount formatted as $X.XX", () => {
    expect(screen.getByTestId("entry-amount-2").textContent).toBe("$120.00");
  });

  it("shows correct total donations count", () => {
    expect(screen.getByTestId("total-donations").textContent).toContain("5");
  });

  it("shows correct total amount", () => {
    expect(screen.getByTestId("total-amount").textContent).toContain("$475.00");
  });

  it("shows correct unique donors count", () => {
    expect(screen.getByTestId("unique-donors").textContent).toContain("4");
  });

  it("adds a new donation and prepends it", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-donor-name"), "Frank Moore");
    await user.type(screen.getByTestId("input-email"), "frank@example.com");
    await user.type(screen.getByTestId("input-amount"), "90");
    await user.selectOptions(screen.getByTestId("input-cause"), "Arts");
    await user.type(screen.getByTestId("input-date"), "2024-04-05");
    await user.click(screen.getByTestId("btn-log"));
    const list = screen.getByTestId("entries-list");
    const items = within(list).getAllByRole("listitem");
    expect(items[0].textContent).toContain("Frank Moore");
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-donor-name"), "Frank Moore");
    await user.type(screen.getByTestId("input-email"), "frank@example.com");
    await user.type(screen.getByTestId("input-amount"), "90");
    await user.type(screen.getByTestId("input-date"), "2024-04-05");
    await user.click(screen.getByTestId("btn-log"));
    expect((screen.getByTestId("input-donor-name") as HTMLInputElement).value).toBe("");
  });

  it("rejects donation with invalid email (no @)", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-donor-name"), "Frank Moore");
    await user.type(screen.getByTestId("input-email"), "frankexample.com");
    await user.type(screen.getByTestId("input-amount"), "90");
    await user.type(screen.getByTestId("input-date"), "2024-04-05");
    await user.click(screen.getByTestId("btn-log"));
    expect(screen.queryByText("Frank Moore")).toBeNull();
  });

  it("rejects donation with zero amount", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-donor-name"), "Frank Moore");
    await user.type(screen.getByTestId("input-email"), "frank@example.com");
    await user.type(screen.getByTestId("input-amount"), "0");
    await user.type(screen.getByTestId("input-date"), "2024-04-05");
    await user.click(screen.getByTestId("btn-log"));
    expect(screen.queryByText("Frank Moore")).toBeNull();
  });

  it("deletes an entry", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("entry-1")).toBeNull();
  });

  it("updates totals after deletion", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.getByTestId("total-donations").textContent).toContain("4");
    expect(screen.getByTestId("total-amount").textContent).toContain("$425.00");
  });

  it("filters by cause", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-cause"), "Health");
    expect(screen.getByTestId("entry-2")).toBeDefined();
    expect(screen.getByTestId("entry-5")).toBeDefined();
    expect(screen.queryByTestId("entry-1")).toBeNull();
  });

  it("filters by date range - from", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-from"), "2024-03-01");
    expect(screen.getByTestId("entry-4")).toBeDefined();
    expect(screen.getByTestId("entry-5")).toBeDefined();
    expect(screen.queryByTestId("entry-1")).toBeNull();
  });

  it("summary totals unaffected by filters", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-cause"), "Health");
    expect(screen.getByTestId("total-donations").textContent).toContain("5");
    expect(screen.getByTestId("total-amount").textContent).toContain("$475.00");
  });

  it("shows empty message when all entries deleted", async () => {
    const user = userEvent.setup();
    for (const id of [1, 2, 3, 4, 5]) {
      await user.click(screen.getByTestId(`btn-delete-${id}`));
    }
    expect(screen.getByTestId("empty-message")).toBeDefined();
  });
});
