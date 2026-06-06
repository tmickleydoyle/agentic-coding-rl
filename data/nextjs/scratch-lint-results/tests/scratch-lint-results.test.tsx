import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Lint Results", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /lint results/i })).toBeTruthy();
  });

  it("renders all 7 seed rows", () => {
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByTestId(`lint-row-${i}`)).toBeTruthy();
    }
  });

  it("shows level values", () => {
    expect(screen.getByTestId("level-1").textContent).toBe("warning");
    expect(screen.getByTestId("level-2").textContent).toBe("error");
  });

  it("shows line values", () => {
    expect(screen.getByTestId("line-1").textContent).toBe("14");
    expect(screen.getByTestId("line-5").textContent).toBe("5");
  });

  it("shows suppressed badges only for suppressed items", () => {
    expect(screen.getByTestId("suppressed-badge-3")).toBeTruthy();
    expect(screen.getByTestId("suppressed-badge-6")).toBeTruthy();
    expect(screen.queryByTestId("suppressed-badge-1")).toBeNull();
  });

  it("shows correct stats", () => {
    expect(screen.getByTestId("stat-total").textContent).toContain("7");
    expect(screen.getByTestId("stat-errors").textContent).toContain("3");
    expect(screen.getByTestId("stat-warnings").textContent).toContain("4");
    expect(screen.getByTestId("stat-suppressed").textContent).toContain("2");
  });

  it("suppress button toggles to unsuppress", async () => {
    const btn = screen.getByTestId("btn-suppress-1");
    expect(btn.textContent).toBe("Suppress");
    await userEvent.click(btn);
    expect(screen.getByTestId("btn-suppress-1").textContent).toBe("Unsuppress");
    expect(screen.getByTestId("suppressed-badge-1")).toBeTruthy();
  });

  it("unsuppress button toggles back", async () => {
    await userEvent.click(screen.getByTestId("btn-suppress-3"));
    expect(screen.getByTestId("btn-suppress-3").textContent).toBe("Suppress");
    expect(screen.queryByTestId("suppressed-badge-3")).toBeNull();
  });

  it("filters by error level", async () => {
    await userEvent.click(screen.getByTestId("filter-error"));
    expect(screen.getByTestId("lint-row-2")).toBeTruthy();
    expect(screen.getByTestId("lint-row-5")).toBeTruthy();
    expect(screen.getByTestId("lint-row-7")).toBeTruthy();
    expect(screen.queryByTestId("lint-row-1")).toBeNull();
  });

  it("filters by warning level", async () => {
    await userEvent.click(screen.getByTestId("filter-warning"));
    expect(screen.getByTestId("lint-row-1")).toBeTruthy();
    expect(screen.queryByTestId("lint-row-2")).toBeNull();
  });

  it("filter all restores all rows", async () => {
    await userEvent.click(screen.getByTestId("filter-error"));
    await userEvent.click(screen.getByTestId("filter-all"));
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByTestId(`lint-row-${i}`)).toBeTruthy();
    }
  });

  it("active only hides suppressed rows", async () => {
    await userEvent.click(screen.getByTestId("filter-active"));
    expect(screen.queryByTestId("lint-row-3")).toBeNull();
    expect(screen.queryByTestId("lint-row-6")).toBeNull();
    expect(screen.getByTestId("lint-row-1")).toBeTruthy();
  });

  it("suppressed only shows only suppressed rows", async () => {
    await userEvent.click(screen.getByTestId("filter-suppressed"));
    expect(screen.getByTestId("lint-row-3")).toBeTruthy();
    expect(screen.getByTestId("lint-row-6")).toBeTruthy();
    expect(screen.queryByTestId("lint-row-1")).toBeNull();
  });

  it("level and suppressed filters combine", async () => {
    await userEvent.click(screen.getByTestId("filter-warning"));
    await userEvent.click(screen.getByTestId("filter-active"));
    // warnings that are not suppressed: 1, 4
    expect(screen.getByTestId("lint-row-1")).toBeTruthy();
    expect(screen.getByTestId("lint-row-4")).toBeTruthy();
    expect(screen.queryByTestId("lint-row-3")).toBeNull(); // warning but suppressed
    expect(screen.queryByTestId("lint-row-2")).toBeNull(); // not warning
  });

  it("adds a new lint result", async () => {
    await userEvent.type(screen.getByTestId("input-file"), "src/new.ts");
    await userEvent.type(screen.getByTestId("input-message"), "New lint issue");
    await userEvent.click(screen.getByTestId("btn-add-result"));
    expect(screen.getByTestId("lint-row-8")).toBeTruthy();
    expect(screen.queryByTestId("suppressed-badge-8")).toBeNull();
  });

  it("does not add result with empty file", async () => {
    await userEvent.type(screen.getByTestId("input-message"), "Some message");
    await userEvent.click(screen.getByTestId("btn-add-result"));
    expect(screen.queryByTestId("lint-row-8")).toBeNull();
  });

  it("does not add result with empty message", async () => {
    await userEvent.type(screen.getByTestId("input-file"), "src/something.ts");
    await userEvent.click(screen.getByTestId("btn-add-result"));
    expect(screen.queryByTestId("lint-row-8")).toBeNull();
  });

  it("deletes a row", async () => {
    await userEvent.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("lint-row-1")).toBeNull();
    expect(screen.getByTestId("stat-total").textContent).toContain("6");
  });

  it("stats are global not filtered", async () => {
    await userEvent.click(screen.getByTestId("filter-error"));
    expect(screen.getByTestId("stat-total").textContent).toContain("7");
  });
});
