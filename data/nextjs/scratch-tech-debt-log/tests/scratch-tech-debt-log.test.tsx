import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Tech Debt Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /tech debt log/i })).toBeTruthy();
  });

  it("renders all 6 seed rows", () => {
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`debt-row-${i}`)).toBeTruthy();
    }
  });

  it("shows severity values", () => {
    expect(screen.getByTestId("severity-1").textContent).toBe("high");
    expect(screen.getByTestId("severity-3").textContent).toBe("low");
    expect(screen.getByTestId("severity-4").textContent).toBe("medium");
  });

  it("shows effort values", () => {
    expect(screen.getByTestId("effort-1").textContent).toBe("3");
    expect(screen.getByTestId("effort-2").textContent).toBe("5");
  });

  it("shows status values", () => {
    expect(screen.getByTestId("status-1").textContent).toBe("open");
    expect(screen.getByTestId("status-3").textContent).toBe("resolved");
  });

  it("shows correct stats", () => {
    expect(screen.getByTestId("stat-total").textContent).toContain("6");
    expect(screen.getByTestId("stat-open").textContent).toContain("4");
    // (3+5+1+4+3+2)/6 = 3.0
    expect(screen.getByTestId("stat-avg-effort").textContent).toContain("3.0");
  });

  it("resolve button toggles status", async () => {
    const btn = screen.getByTestId("btn-toggle-1");
    expect(btn.textContent).toBe("Resolve");
    await userEvent.click(btn);
    expect(screen.getByTestId("status-1").textContent).toBe("resolved");
    expect(screen.getByTestId("btn-toggle-1").textContent).toBe("Reopen");
  });

  it("reopen button toggles back", async () => {
    await userEvent.click(screen.getByTestId("btn-toggle-3"));
    expect(screen.getByTestId("status-3").textContent).toBe("open");
  });

  it("filters by frontend area", async () => {
    await userEvent.click(screen.getByTestId("filter-frontend"));
    expect(screen.getByTestId("debt-row-1")).toBeTruthy();
    expect(screen.getByTestId("debt-row-4")).toBeTruthy();
    expect(screen.queryByTestId("debt-row-2")).toBeNull();
  });

  it("filter-all restores all rows", async () => {
    await userEvent.click(screen.getByTestId("filter-backend"));
    await userEvent.click(screen.getByTestId("filter-all"));
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByTestId(`debt-row-${i}`)).toBeTruthy();
    }
  });

  it("filters by open status", async () => {
    await userEvent.click(screen.getByTestId("filter-open"));
    expect(screen.getByTestId("debt-row-1")).toBeTruthy();
    expect(screen.queryByTestId("debt-row-3")).toBeNull();
  });

  it("filters by resolved status", async () => {
    await userEvent.click(screen.getByTestId("filter-resolved-status"));
    expect(screen.getByTestId("debt-row-3")).toBeTruthy();
    expect(screen.getByTestId("debt-row-6")).toBeTruthy();
    expect(screen.queryByTestId("debt-row-1")).toBeNull();
  });

  it("area and status filters combine", async () => {
    await userEvent.click(screen.getByTestId("filter-frontend"));
    await userEvent.click(screen.getByTestId("filter-open"));
    // frontend+open: id 1, 4
    expect(screen.getByTestId("debt-row-1")).toBeTruthy();
    expect(screen.getByTestId("debt-row-4")).toBeTruthy();
    expect(screen.queryByTestId("debt-row-6")).toBeNull(); // frontend but resolved
  });

  it("adds a new debt item", async () => {
    await userEvent.type(screen.getByTestId("input-title"), "Upgrade Node version");
    await userEvent.click(screen.getByTestId("btn-add-debt"));
    expect(screen.getByTestId("debt-row-7")).toBeTruthy();
    expect(screen.getByTestId("status-7").textContent).toBe("open");
  });

  it("does not add item with empty title", async () => {
    await userEvent.click(screen.getByTestId("btn-add-debt"));
    expect(screen.queryByTestId("debt-row-7")).toBeNull();
  });

  it("deletes a debt item", async () => {
    await userEvent.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("debt-row-1")).toBeNull();
    expect(screen.getByTestId("stat-total").textContent).toContain("5");
  });

  it("stats not affected by filters", async () => {
    await userEvent.click(screen.getByTestId("filter-backend"));
    expect(screen.getByTestId("stat-total").textContent).toContain("6");
  });
});
