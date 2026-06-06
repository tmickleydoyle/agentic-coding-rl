import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Feeding Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /feeding log/i })).toBeTruthy();
  });

  it("renders all seed feeding entries", () => {
    expect(screen.getAllByTestId("feeding-item").length).toBe(5);
  });

  it("shows correct total feedings count", () => {
    expect(screen.getByTestId("total-feedings").textContent).toMatch(/5/);
  });

  it("shows correct total oz from seed data", () => {
    // seed: 0+4+0+3+0 = 7 oz
    expect(screen.getByTestId("total-oz").textContent).toMatch(/7/);
  });

  it("shows correct total duration from seed data", () => {
    // seed: 20+15+18+10+25 = 88 minutes
    expect(screen.getByTestId("total-duration").textContent).toMatch(/88/);
  });

  it("adds a new feeding and shows it at the top", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/method/i), "bottle");
    await user.type(screen.getByLabelText(/start time/i), "08:00");
    await user.clear(screen.getByLabelText(/duration \(min\)/i));
    await user.type(screen.getByLabelText(/duration \(min\)/i), "12");
    await user.clear(screen.getByLabelText(/amount \(oz\)/i));
    await user.type(screen.getByLabelText(/amount \(oz\)/i), "5");
    await user.type(screen.getByLabelText(/notes/i), "Morning bottle");
    await user.click(screen.getByRole("button", { name: /add feeding/i }));

    const items = screen.getAllByTestId("feeding-item");
    expect(items.length).toBe(6);
    expect(within(items[0]).getByTestId("feeding-notes").textContent).toBe("Morning bottle");
  });

  it("resets form fields after submission", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/start time/i), "08:00");
    await user.clear(screen.getByLabelText(/duration \(min\)/i));
    await user.type(screen.getByLabelText(/duration \(min\)/i), "10");
    await user.type(screen.getByLabelText(/notes/i), "Test");
    await user.click(screen.getByRole("button", { name: /add feeding/i }));

    expect((screen.getByLabelText(/notes/i) as HTMLInputElement).value).toBe("");
  });

  it("does not add feeding when notes is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/start time/i), "08:00");
    await user.clear(screen.getByLabelText(/duration \(min\)/i));
    await user.type(screen.getByLabelText(/duration \(min\)/i), "10");
    await user.click(screen.getByRole("button", { name: /add feeding/i }));

    expect(screen.getAllByTestId("feeding-item").length).toBe(5);
  });

  it("does not add feeding when duration is zero", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/start time/i), "08:00");
    await user.clear(screen.getByLabelText(/duration \(min\)/i));
    await user.type(screen.getByLabelText(/duration \(min\)/i), "0");
    await user.type(screen.getByLabelText(/notes/i), "Test note");
    await user.click(screen.getByRole("button", { name: /add feeding/i }));

    expect(screen.getAllByTestId("feeding-item").length).toBe(5);
  });

  it("removes a feeding entry", async () => {
    const user = userEvent.setup();
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);
    expect(screen.getAllByTestId("feeding-item").length).toBe(4);
  });

  it("updates totals after removing an entry", async () => {
    const user = userEvent.setup();
    // Remove first entry (newest-first seed = id 5, solid, 0 oz, 25 min)
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(screen.getByTestId("total-feedings").textContent).toMatch(/4/);
  });

  it("updates total-oz after adding a bottle entry", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/method/i), "bottle");
    await user.type(screen.getByLabelText(/start time/i), "09:00");
    await user.clear(screen.getByLabelText(/duration \(min\)/i));
    await user.type(screen.getByLabelText(/duration \(min\)/i), "10");
    await user.clear(screen.getByLabelText(/amount \(oz\)/i));
    await user.type(screen.getByLabelText(/amount \(oz\)/i), "3");
    await user.type(screen.getByLabelText(/notes/i), "Extra bottle");
    await user.click(screen.getByRole("button", { name: /add feeding/i }));

    // 7 + 3 = 10
    expect(screen.getByTestId("total-oz").textContent).toMatch(/10/);
  });

  it("each feeding item shows method, time, duration, amount, and notes", () => {
    const items = screen.getAllByTestId("feeding-item");
    const first = within(items[0]);
    expect(first.getByTestId("feeding-method").textContent).toBeTruthy();
    expect(first.getByTestId("feeding-time").textContent).toBeTruthy();
    expect(first.getByTestId("feeding-duration").textContent).toBeTruthy();
    expect(first.getByTestId("feeding-amount").textContent).toBeTruthy();
    expect(first.getByTestId("feeding-notes").textContent).toBeTruthy();
  });
});
