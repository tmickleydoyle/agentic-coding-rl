import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("On-Call Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /on-call log/i })).toBeTruthy();
  });

  it("shows 5 seed entries on load", () => {
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`entry-card-${i}`)).toBeTruthy();
    }
  });

  it("entry 5 appears before entry 1 (newest-first)", () => {
    const list = screen.getByRole("region", { name: /log entries/i });
    const cards = within(list).getAllByTestId(/^entry-card-/);
    const ids = cards.map((c) => c.getAttribute("data-testid"));
    expect(ids.indexOf("entry-card-5")).toBeLessThan(ids.indexOf("entry-card-1"));
  });

  it("shows unresolved count in stats (1 unresolved in seed)", () => {
    expect(screen.getByTestId("stat-unresolved").textContent).toContain("1");
  });

  it("shows correct visible count in stats (5 initially)", () => {
    expect(screen.getByTestId("stat-visible").textContent).toContain("5");
  });

  it("shows error when adding with empty fields", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-log"));
    expect(screen.getByTestId("form-error").textContent).toMatch(/all fields are required/i);
  });

  it("adds a new entry and prepends it", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-timestamp"), "2024-02-08 10:00");
    await user.type(screen.getByTestId("input-service"), "cache");
    await user.selectOptions(screen.getByTestId("input-severity"), "info");
    await user.type(screen.getByTestId("input-summary"), "Cache miss rate elevated");
    await user.type(screen.getByTestId("input-action"), "Flushed stale keys.");
    await user.click(screen.getByTestId("btn-log"));

    const list = screen.getByRole("region", { name: /log entries/i });
    const cards = within(list).getAllByTestId(/^entry-card-/);
    expect(cards[0].textContent).toContain("Cache miss rate elevated");
  });

  it("clears form after adding entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-timestamp"), "2024-02-08 10:00");
    await user.type(screen.getByTestId("input-service"), "cache");
    await user.selectOptions(screen.getByTestId("input-severity"), "info");
    await user.type(screen.getByTestId("input-summary"), "Summary text");
    await user.type(screen.getByTestId("input-action"), "Action text");
    await user.click(screen.getByTestId("btn-log"));
    expect((screen.getByTestId("input-timestamp") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-service") as HTMLInputElement).value).toBe("");
  });

  it("toggles resolved state", async () => {
    const user = userEvent.setup();
    expect(screen.getByTestId("entry-resolved-3").textContent).toBe("unresolved");
    await user.click(screen.getByTestId("btn-toggle-3"));
    expect(screen.getByTestId("entry-resolved-3").textContent).toBe("resolved");
  });

  it("unresolved count updates after toggle", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-toggle-3"));
    expect(screen.getByTestId("stat-unresolved").textContent).toContain("0");
  });

  it("filter by critical shows only critical entries", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-critical"));
    expect(screen.getByTestId("entry-card-1")).toBeTruthy();
    expect(screen.getByTestId("entry-card-3")).toBeTruthy();
    expect(screen.queryByTestId("entry-card-2")).toBeNull();
  });

  it("filter-all restores all entries", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-warning"));
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getByTestId("stat-visible").textContent).toContain("5");
  });

  it("show only unresolved filter", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-unresolved"));
    expect(screen.getByTestId("entry-card-3")).toBeTruthy();
    expect(screen.queryByTestId("entry-card-1")).toBeNull();
  });

  it("severity and unresolved filters work together", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-critical"));
    await user.click(screen.getByTestId("filter-unresolved"));
    expect(screen.getByTestId("entry-card-3")).toBeTruthy();
    expect(screen.queryByTestId("entry-card-1")).toBeNull();
  });

  it("shows empty message when no entries match", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-info"));
    await user.click(screen.getByTestId("filter-unresolved"));
    expect(screen.getByTestId("empty-message")).toBeTruthy();
  });

  it("active filter has aria-pressed true", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-warning"));
    expect(screen.getByTestId("filter-warning").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("filter-all").getAttribute("aria-pressed")).toBe("false");
  });
});
