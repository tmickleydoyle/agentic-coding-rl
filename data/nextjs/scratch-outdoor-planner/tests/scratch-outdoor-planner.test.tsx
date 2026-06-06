import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Outdoor Planner", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /outdoor planner/i })).toBeTruthy();
  });

  it("shows 2 upcoming and 1 completed in summary", () => {
    expect(screen.getByTestId("upcoming-count").textContent).toContain("2");
    expect(screen.getByTestId("completed-count").textContent).toContain("1");
  });

  it("renders all three trip names", () => {
    expect(screen.getByTestId("trip-name-1").textContent).toBe("Yosemite Weekend");
    expect(screen.getByTestId("trip-name-2").textContent).toBe("Desert Star Camp");
    expect(screen.getByTestId("trip-name-3").textContent).toBe("Coastal Backpack");
  });

  it("completed trip shows Completed badge", () => {
    expect(screen.getByTestId("trip-completed-badge-3")).toBeTruthy();
  });

  it("upcoming trip does not show Completed badge", () => {
    expect(screen.queryByTestId("trip-completed-badge-1")).toBeNull();
  });

  it("upcoming trip has Mark Trip Complete button", () => {
    expect(screen.getByTestId("mark-complete-1")).toBeTruthy();
  });

  it("trip progress shows correct fraction", () => {
    // Yosemite: 1/3 done
    expect(screen.getByTestId("trip-progress-1").textContent).toContain("1/3");
  });

  it("coastal backpack shows 3/3 done", () => {
    expect(screen.getByTestId("trip-progress-3").textContent).toContain("3/3");
  });

  it("toggling activity checkbox updates progress", async () => {
    const user = userEvent.setup();
    // Find an unchecked activity in trip 1 and check it
    const actList = screen.getByTestId("activity-list-1");
    const checkboxes = actList.querySelectorAll('input[type="checkbox"]');
    // Second activity is unchecked (index 1)
    await user.click(checkboxes[1]);
    expect(screen.getByTestId("trip-progress-1").textContent).toContain("2/3");
  });

  it("marking trip complete updates summary", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("mark-complete-1"));
    expect(screen.getByTestId("upcoming-count").textContent).toContain("1");
    expect(screen.getByTestId("completed-count").textContent).toContain("2");
  });

  it("marking trip complete shows Completed badge", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("mark-complete-1"));
    expect(screen.getByTestId("trip-completed-badge-1")).toBeTruthy();
  });

  it("removing a trip updates summary", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove-trip-1"));
    expect(screen.queryByTestId("trip-1")).toBeNull();
    expect(screen.getByTestId("upcoming-count").textContent).toContain("1");
  });

  it("adding a trip with empty name does nothing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-trip-btn"));
    expect(screen.getByTestId("upcoming-count").textContent).toContain("2");
  });

  it("adding a valid trip increases upcoming count", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("form-name"), "Alpine Adventure");
    await user.click(screen.getByTestId("add-trip-btn"));
    expect(screen.getByTestId("upcoming-count").textContent).toContain("3");
    expect(screen.getByText("Alpine Adventure")).toBeTruthy();
  });

  it("new trip shows 0/0 activities done", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("form-name"), "Empty Trip");
    await user.click(screen.getByTestId("add-trip-btn"));
    const newTrip = screen.getByTestId("trip-4");
    const progress = newTrip.querySelector("[data-testid^='trip-progress-']");
    expect(progress?.textContent).toContain("0/0");
  });

  it("adding activity to a trip updates its progress", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("act-input-2"), "Pack gear");
    await user.click(screen.getByTestId("add-activity-2"));
    expect(screen.getByTestId("trip-progress-2").textContent).toContain("0/3");
  });

  it("activity input clears after add", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("act-input-2") as HTMLInputElement;
    await user.type(input, "New activity");
    await user.click(screen.getByTestId("add-activity-2"));
    expect(input.value).toBe("");
  });
});
