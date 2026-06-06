import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Craft Skill Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByText("Craft Skill Tracker")).toBeTruthy();
  });

  it("shows all 4 seed skills on load", () => {
    expect(screen.getByTestId("skill-1")).toBeTruthy();
    expect(screen.getByTestId("skill-4")).toBeTruthy();
  });

  it("displays correct seed data", () => {
    expect(screen.getByTestId("skill-name-1").textContent).toBe("Knitting");
    expect(screen.getByTestId("skill-level-1").textContent).toBe("Beginner");
    expect(screen.getByTestId("skill-hours-1").textContent).toBe("12 hrs");
  });

  it("shows correct total hours", () => {
    // 12+35+5+120 = 172
    expect(screen.getByTestId("total-hours").textContent).toBe("Total: 172 hrs");
  });

  it("Advanced skills have no Promote button", () => {
    expect(screen.queryByTestId("btn-promote-4")).toBeNull();
  });

  it("non-Advanced skills have Promote button", () => {
    expect(screen.getByTestId("btn-promote-1")).toBeTruthy();
    expect(screen.getByTestId("btn-promote-2")).toBeTruthy();
  });

  it("adds 1 hour to skill", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-hour-1"));
    expect(screen.getByTestId("skill-hours-1").textContent).toBe("13 hrs");
  });

  it("total hours updates after +1 Hour", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-hour-3"));
    expect(screen.getByTestId("total-hours").textContent).toBe("Total: 173 hrs");
  });

  it("promotes Beginner to Intermediate", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-promote-1"));
    expect(screen.getByTestId("skill-level-1").textContent).toBe("Intermediate");
  });

  it("promotes Intermediate to Advanced and hides promote button", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-promote-2"));
    expect(screen.getByTestId("skill-level-2").textContent).toBe("Advanced");
    expect(screen.queryByTestId("btn-promote-2")).toBeNull();
  });

  it("deletes a skill", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-3"));
    expect(screen.queryByTestId("skill-3")).toBeNull();
  });

  it("adds a new skill", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Sewing");
    await user.type(screen.getByTestId("input-hours"), "8");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("skill-5")).toBeTruthy();
    expect(screen.getByTestId("skill-name-5").textContent).toBe("Sewing");
  });

  it("does not add skill with blank name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-hours"), "10");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("skill-5")).toBeNull();
  });

  it("filters by Beginner level", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-beginner"));
    expect(screen.getByTestId("skill-1")).toBeTruthy();
    expect(screen.getByTestId("skill-3")).toBeTruthy();
    expect(screen.queryByTestId("skill-2")).toBeNull();
    expect(screen.queryByTestId("skill-4")).toBeNull();
  });

  it("shows empty-msg when filter matches nothing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-advanced"));
    await user.click(screen.getByTestId("btn-delete-4"));
    expect(screen.getByTestId("empty-msg").textContent).toBe("No skills found");
  });

  it("total hours unaffected by filter", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-beginner"));
    expect(screen.getByTestId("total-hours").textContent).toBe("Total: 172 hrs");
  });
});
