import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Sleep Schedule", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /sleep schedule/i })).toBeTruthy();
  });

  it("renders all seed sleep sessions", () => {
    expect(screen.getAllByTestId("sleep-item").length).toBe(5);
  });

  it("shows correct average duration for seed data", () => {
    // (10 + 5.5 + 1.5 + 10 + 1) / 5 = 28 / 5 = 5.6
    expect(screen.getByTestId("avg-duration").textContent).toMatch(/5\.6/);
  });

  it("shows correct good quality count for seed data", () => {
    // sessions 1, 3, 4 are good = 3
    expect(screen.getByTestId("count-good").textContent).toMatch(/3/);
  });

  it("shows correct poor quality count for seed data", () => {
    // session 2 is poor = 1
    expect(screen.getByTestId("count-poor").textContent).toMatch(/1/);
  });

  it("adds a new sleep session and shows it at the top", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-01-18");
    await user.type(screen.getByLabelText(/sleep time/i), "21:00");
    await user.type(screen.getByLabelText(/wake time/i), "07:00");
    await user.clear(screen.getByLabelText(/duration \(hours\)/i));
    await user.type(screen.getByLabelText(/duration \(hours\)/i), "10");
    await user.type(screen.getByLabelText(/notes/i), "Excellent night");
    await user.click(screen.getByRole("button", { name: /add sleep session/i }));

    const items = screen.getAllByTestId("sleep-item");
    expect(items.length).toBe(6);
    expect(within(items[0]).getByTestId("sleep-notes").textContent).toBe("Excellent night");
  });

  it("resets form after adding a session", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-01-18");
    await user.type(screen.getByLabelText(/sleep time/i), "21:00");
    await user.type(screen.getByLabelText(/wake time/i), "07:00");
    await user.clear(screen.getByLabelText(/duration \(hours\)/i));
    await user.type(screen.getByLabelText(/duration \(hours\)/i), "8");
    await user.type(screen.getByLabelText(/notes/i), "Good night");
    await user.click(screen.getByRole("button", { name: /add sleep session/i }));

    expect((screen.getByLabelText(/notes/i) as HTMLInputElement).value).toBe("");
  });

  it("does not add session when duration is zero", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-01-18");
    await user.type(screen.getByLabelText(/sleep time/i), "21:00");
    await user.type(screen.getByLabelText(/wake time/i), "07:00");
    await user.clear(screen.getByLabelText(/duration \(hours\)/i));
    await user.type(screen.getByLabelText(/duration \(hours\)/i), "0");
    await user.click(screen.getByRole("button", { name: /add sleep session/i }));

    expect(screen.getAllByTestId("sleep-item").length).toBe(5);
  });

  it("does not add session when date is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/sleep time/i), "21:00");
    await user.type(screen.getByLabelText(/wake time/i), "07:00");
    await user.clear(screen.getByLabelText(/duration \(hours\)/i));
    await user.type(screen.getByLabelText(/duration \(hours\)/i), "10");
    await user.click(screen.getByRole("button", { name: /add sleep session/i }));

    expect(screen.getAllByTestId("sleep-item").length).toBe(5);
  });

  it("deletes a sleep session", async () => {
    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);
    expect(screen.getAllByTestId("sleep-item").length).toBe(4);
  });

  it("updates average duration after deletion", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("sleep-item");
    // Delete first item in list (seed data newest-first = id5, 1 hour, fair)
    await user.click(within(items[0]).getByRole("button", { name: /delete/i }));
    // (10 + 5.5 + 1.5 + 10) / 4 = 27 / 4 = 6.75 -> 6.8
    expect(screen.getByTestId("avg-duration").textContent).toMatch(/6\.8/);
  });

  it("updates quality counts when a good session is added", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-01-18");
    await user.type(screen.getByLabelText(/sleep time/i), "20:00");
    await user.type(screen.getByLabelText(/wake time/i), "06:00");
    await user.clear(screen.getByLabelText(/duration \(hours\)/i));
    await user.type(screen.getByLabelText(/duration \(hours\)/i), "10");
    await user.selectOptions(screen.getByLabelText(/quality/i), "good");
    await user.click(screen.getByRole("button", { name: /add sleep session/i }));

    expect(screen.getByTestId("count-good").textContent).toMatch(/4/);
  });

  it("updates quality counts when a poor session is deleted", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("sleep-item");
    // Find the poor quality item and delete it
    let poorItemIndex = -1;
    for (let i = 0; i < items.length; i++) {
      if (within(items[i]).getByTestId("sleep-quality").textContent === "poor") {
        poorItemIndex = i;
        break;
      }
    }
    if (poorItemIndex >= 0) {
      await user.click(within(items[poorItemIndex]).getByRole("button", { name: /delete/i }));
      expect(screen.getByTestId("count-poor").textContent).toMatch(/0/);
    }
  });

  it("displays all fields in each sleep item", () => {
    const item = within(screen.getAllByTestId("sleep-item")[0]);
    expect(item.getByTestId("sleep-date").textContent).toBeTruthy();
    expect(item.getByTestId("sleep-time").textContent).toBeTruthy();
    expect(item.getByTestId("wake-time").textContent).toBeTruthy();
    expect(item.getByTestId("sleep-duration").textContent).toBeTruthy();
    expect(item.getByTestId("sleep-quality").textContent).toBeTruthy();
  });
});
