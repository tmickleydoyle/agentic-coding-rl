import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Knitting Pattern Manager", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByText("Knitting Pattern Manager")).toBeTruthy();
  });

  it("shows all 4 seed patterns on load", () => {
    expect(screen.getByTestId("pattern-1")).toBeTruthy();
    expect(screen.getByTestId("pattern-2")).toBeTruthy();
    expect(screen.getByTestId("pattern-3")).toBeTruthy();
    expect(screen.getByTestId("pattern-4")).toBeTruthy();
  });

  it("displays correct seed data fields", () => {
    expect(screen.getByTestId("pattern-name-1").textContent).toBe("Cozy Scarf");
    expect(screen.getByTestId("pattern-yarn-1").textContent).toBe("Merino Wool");
    expect(screen.getByTestId("pattern-needle-1").textContent).toBe("5mm");
    expect(screen.getByTestId("pattern-rows-1").textContent).toBe("120");
    expect(screen.getByTestId("pattern-status-1").textContent).toBe("active");
  });

  it("shows correct summary with seed data", () => {
    expect(screen.getByTestId("summary").textContent).toBe("4 patterns (2 active, 2 complete)");
  });

  it("active patterns have Mark Complete button, complete do not", () => {
    expect(screen.getByTestId("btn-complete-1")).toBeTruthy();
    expect(screen.queryByTestId("btn-complete-3")).toBeNull();
  });

  it("marks a pattern as complete when button clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-complete-1"));
    expect(screen.getByTestId("pattern-status-1").textContent).toBe("complete");
    expect(screen.queryByTestId("btn-complete-1")).toBeNull();
  });

  it("summary updates after marking complete", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-complete-1"));
    expect(screen.getByTestId("summary").textContent).toBe("4 patterns (1 active, 3 complete)");
  });

  it("deletes a pattern", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-2"));
    expect(screen.queryByTestId("pattern-2")).toBeNull();
    expect(screen.getByTestId("summary").textContent).toBe("3 patterns (1 active, 2 complete)");
  });

  it("adds a new pattern", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Lace Shawl");
    await user.type(screen.getByTestId("input-yarn"), "Silk Blend");
    await user.type(screen.getByTestId("input-needle"), "3mm");
    await user.type(screen.getByTestId("input-rows"), "150");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("pattern-5")).toBeTruthy();
    expect(screen.getByTestId("pattern-name-5").textContent).toBe("Lace Shawl");
    expect(screen.getByTestId("pattern-status-5").textContent).toBe("active");
  });

  it("does not add pattern with blank name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-rows"), "50");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("pattern-5")).toBeNull();
  });

  it("does not add pattern with zero rows", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Test");
    await user.type(screen.getByTestId("input-rows"), "0");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("pattern-5")).toBeNull();
  });

  it("filters to active only", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-active"));
    expect(screen.getByTestId("pattern-1")).toBeTruthy();
    expect(screen.getByTestId("pattern-2")).toBeTruthy();
    expect(screen.queryByTestId("pattern-3")).toBeNull();
    expect(screen.queryByTestId("pattern-4")).toBeNull();
  });

  it("filters to complete only", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-complete"));
    expect(screen.queryByTestId("pattern-1")).toBeNull();
    expect(screen.getByTestId("pattern-3")).toBeTruthy();
  });

  it("shows empty-msg when filter yields no results", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    await user.click(screen.getByTestId("btn-delete-2"));
    await user.click(screen.getByTestId("filter-active"));
    expect(screen.getByTestId("empty-msg").textContent).toBe("No patterns found");
  });

  it("summary is unaffected by active filter", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-complete"));
    expect(screen.getByTestId("summary").textContent).toBe("4 patterns (2 active, 2 complete)");
  });
});
