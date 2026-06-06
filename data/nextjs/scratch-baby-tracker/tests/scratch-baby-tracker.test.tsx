import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Baby Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /baby tracker/i })).toBeTruthy();
  });

  it("renders seed activity items", () => {
    const items = screen.getAllByTestId("activity-item");
    expect(items.length).toBe(5);
  });

  it("shows correct seed summary counts", () => {
    expect(screen.getByTestId("count-feeding").textContent).toMatch(/2/);
    expect(screen.getByTestId("count-diaper").textContent).toMatch(/2/);
    expect(screen.getByTestId("count-sleep").textContent).toMatch(/1/);
  });

  it("adds a new activity and updates the list", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/activity type/i), "sleep");
    await user.type(screen.getByLabelText(/^time$/i), "14:00");
    await user.type(screen.getByLabelText(/^note$/i), "Afternoon nap");
    await user.click(screen.getByRole("button", { name: /log activity/i }));

    const items = screen.getAllByTestId("activity-item");
    expect(items.length).toBe(6);
  });

  it("new activity appears at the top of the list", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/activity type/i), "diaper");
    await user.type(screen.getByLabelText(/^time$/i), "15:00");
    await user.type(screen.getByLabelText(/^note$/i), "Wet diaper");
    await user.click(screen.getByRole("button", { name: /log activity/i }));

    const items = screen.getAllByTestId("activity-item");
    const firstItem = within(items[0]);
    expect(firstItem.getByTestId("activity-note").textContent).toBe("Wet diaper");
  });

  it("resets form after submission", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^time$/i), "14:00");
    await user.type(screen.getByLabelText(/^note$/i), "Test note");
    await user.click(screen.getByRole("button", { name: /log activity/i }));

    expect((screen.getByLabelText(/^note$/i) as HTMLInputElement).value).toBe("");
  });

  it("does not add activity when time is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^note$/i), "No time entry");
    await user.click(screen.getByRole("button", { name: /log activity/i }));

    expect(screen.getAllByTestId("activity-item").length).toBe(5);
  });

  it("does not add activity when note is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^time$/i), "14:00");
    await user.click(screen.getByRole("button", { name: /log activity/i }));

    expect(screen.getAllByTestId("activity-item").length).toBe(5);
  });

  it("deletes an activity", async () => {
    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    expect(screen.getAllByTestId("activity-item").length).toBe(4);
  });

  it("updates summary counts after deletion", async () => {
    const user = userEvent.setup();
    // Delete first item (newest first = id:5, diaper)
    const items = screen.getAllByTestId("activity-item");
    const firstDeleteBtn = within(items[0]).getByRole("button", { name: /delete/i });
    await user.click(firstDeleteBtn);

    // One of the counts should decrease
    const feedingCount = screen.getByTestId("count-feeding").textContent ?? "";
    const diaperCount = screen.getByTestId("count-diaper").textContent ?? "";
    const sleepCount = screen.getByTestId("count-sleep").textContent ?? "";
    const total =
      parseInt(feedingCount.replace(/\D/g, "")) +
      parseInt(diaperCount.replace(/\D/g, "")) +
      parseInt(sleepCount.replace(/\D/g, ""));
    expect(total).toBe(4);
  });

  it("filters by feeding type", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/filter by type/i), "feeding");
    const items = screen.getAllByTestId("activity-item");
    items.forEach((item) => {
      expect(within(item).getByTestId("activity-type").textContent).toBe("feeding");
    });
  });

  it("shows all items when filter is All", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/filter by type/i), "diaper");
    await user.selectOptions(screen.getByLabelText(/filter by type/i), "all");
    expect(screen.getAllByTestId("activity-item").length).toBe(5);
  });

  it("new item appears in filtered list when type matches filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(/filter by type/i), "sleep");
    await user.selectOptions(screen.getByLabelText(/activity type/i), "sleep");
    await user.type(screen.getByLabelText(/^time$/i), "15:00");
    await user.type(screen.getByLabelText(/^note$/i), "Another nap");
    await user.click(screen.getByRole("button", { name: /log activity/i }));

    const items = screen.getAllByTestId("activity-item");
    expect(items.length).toBe(2);
  });

  it("displays activity time and note in each item", () => {
    const items = screen.getAllByTestId("activity-item");
    const last = within(items[items.length - 1]);
    expect(last.getByTestId("activity-time").textContent).toBeTruthy();
    expect(last.getByTestId("activity-note").textContent).toBeTruthy();
  });
});
