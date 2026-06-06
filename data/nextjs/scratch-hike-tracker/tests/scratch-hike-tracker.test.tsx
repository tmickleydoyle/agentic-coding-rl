import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Hike Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /hike tracker/i })).toBeTruthy();
  });

  it("shows correct planned count in stats", () => {
    expect(screen.getByTestId("stat-planned").textContent).toContain("3");
  });

  it("shows correct completed count in stats", () => {
    expect(screen.getByTestId("stat-completed").textContent).toContain("3");
  });

  it("shows total miles completed in stats", () => {
    // 16.4 + 5.4 + 7.4 = 29.2
    expect(screen.getByTestId("stat-miles").textContent).toContain("29.2");
  });

  it("shows total elevation for completed hikes", () => {
    // 4800 + 1488 + 1800 = 8088
    expect(screen.getByTestId("stat-elevation").textContent).toContain("8088");
  });

  it("completed hike shows Completed label", () => {
    expect(screen.getByTestId("completed-label-1")).toBeTruthy();
    expect(screen.getByTestId("completed-label-1").textContent).toContain("Completed");
  });

  it("planned hike shows Planned label", () => {
    expect(screen.getByTestId("planned-label-3")).toBeTruthy();
  });

  it("planned hike has Mark Done button", () => {
    expect(screen.getByTestId("mark-done-3")).toBeTruthy();
  });

  it("completed hike does not have Mark Done button", () => {
    expect(screen.queryByTestId("mark-done-1")).toBeNull();
  });

  it("marking a hike done updates stats", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("mark-done-3"));
    expect(screen.getByTestId("stat-planned").textContent).toContain("2");
    expect(screen.getByTestId("stat-completed").textContent).toContain("4");
  });

  it("marking done replaces Planned label with Completed label", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("mark-done-3"));
    expect(screen.getByTestId("completed-label-3")).toBeTruthy();
    expect(screen.queryByTestId("planned-label-3")).toBeNull();
  });

  it("filter Planned shows only planned hikes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-planned"));
    expect(screen.queryByTestId("hike-1")).toBeNull();
    expect(screen.getByTestId("hike-3")).toBeTruthy();
  });

  it("filter Completed shows only completed hikes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-completed"));
    expect(screen.getByTestId("hike-1")).toBeTruthy();
    expect(screen.queryByTestId("hike-3")).toBeNull();
  });

  it("removing a hike updates stats", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove-1"));
    expect(screen.getByTestId("stat-completed").textContent).toContain("2");
  });

  it("adding a hike with empty name does nothing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-hike-btn"));
    expect(screen.getByTestId("stat-planned").textContent).toContain("3");
  });

  it("adding a valid hike increases planned count", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("form-name"), "Mount Whitney");
    await user.type(screen.getByTestId("form-distance"), "22.0");
    await user.click(screen.getByTestId("add-hike-btn"));
    expect(screen.getByTestId("stat-planned").textContent).toContain("4");
    expect(screen.getByText("Mount Whitney")).toBeTruthy();
  });

  it("form clears after successful add", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("form-name") as HTMLInputElement;
    await user.type(input, "Test Hike");
    await user.type(screen.getByTestId("form-distance"), "5.0");
    await user.click(screen.getByTestId("add-hike-btn"));
    expect(input.value).toBe("");
  });
});
