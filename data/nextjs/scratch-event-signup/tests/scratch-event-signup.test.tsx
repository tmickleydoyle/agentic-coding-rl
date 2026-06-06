import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Event Signup", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /event signup/i })).toBeDefined();
  });

  it("renders seed events", () => {
    expect(screen.getByTestId("event-1")).toBeDefined();
    expect(screen.getByTestId("event-2")).toBeDefined();
    expect(screen.getByTestId("event-3")).toBeDefined();
  });

  it("displays correct spots filled for seed event 1", () => {
    expect(screen.getByTestId("event-spots-1").textContent).toContain("2 / 20");
  });

  it("shows total events in summary", () => {
    expect(screen.getByTestId("total-events").textContent).toContain("3");
  });

  it("shows total signups in summary", () => {
    expect(screen.getByTestId("total-signups").textContent).toContain("3");
  });

  it("shows available spots in summary", () => {
    // (20-2) + (15-1) + (30-0) = 18 + 14 + 30 = 62
    expect(screen.getByTestId("available-spots").textContent).toContain("62");
  });

  it("adds a new event", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-event-name"), "Tree Planting");
    await user.type(screen.getByTestId("input-event-date"), "2024-05-01");
    await user.type(screen.getByTestId("input-event-location"), "City Park");
    await user.type(screen.getByTestId("input-event-capacity"), "10");
    await user.click(screen.getByTestId("btn-add-event"));
    expect(screen.getByText("Tree Planting")).toBeDefined();
  });

  it("clears event form after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-event-name"), "Tree Planting");
    await user.type(screen.getByTestId("input-event-date"), "2024-05-01");
    await user.type(screen.getByTestId("input-event-location"), "City Park");
    await user.type(screen.getByTestId("input-event-capacity"), "10");
    await user.click(screen.getByTestId("btn-add-event"));
    expect((screen.getByTestId("input-event-name") as HTMLInputElement).value).toBe("");
  });

  it("does not add event with zero capacity", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-event-name"), "Bad Event");
    await user.type(screen.getByTestId("input-event-date"), "2024-05-01");
    await user.type(screen.getByTestId("input-event-location"), "Nowhere");
    await user.type(screen.getByTestId("input-event-capacity"), "0");
    await user.click(screen.getByTestId("btn-add-event"));
    expect(screen.queryByText("Bad Event")).toBeNull();
  });

  it("signs up a volunteer to an event", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-event"), "1");
    await user.type(screen.getByTestId("input-signup-name"), "Eve Turner");
    await user.type(screen.getByTestId("input-signup-email"), "eve@example.com");
    await user.click(screen.getByTestId("btn-signup"));
    expect(screen.getByTestId("event-spots-1").textContent).toContain("3 / 20");
  });

  it("clears signup form after signing up", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-event"), "1");
    await user.type(screen.getByTestId("input-signup-name"), "Eve Turner");
    await user.type(screen.getByTestId("input-signup-email"), "eve@example.com");
    await user.click(screen.getByTestId("btn-signup"));
    expect((screen.getByTestId("input-signup-name") as HTMLInputElement).value).toBe("");
  });

  it("rejects duplicate email for same event", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-event"), "1");
    await user.type(screen.getByTestId("input-signup-name"), "Duplicate");
    await user.type(screen.getByTestId("input-signup-email"), "alice@example.com");
    await user.click(screen.getByTestId("btn-signup"));
    expect(screen.getByTestId("event-spots-1").textContent).toContain("2 / 20");
  });

  it("cancels an event and removes its signups", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-cancel-1"));
    expect(screen.queryByTestId("event-1")).toBeNull();
    expect(screen.getByTestId("total-signups").textContent).toContain("1");
  });

  it("updates available spots after cancellation", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-cancel-3"));
    // available was 62, beach cleanup had 30 spots available, now 62-30=32
    expect(screen.getByTestId("available-spots").textContent).toContain("32");
  });

  it("shows no events message when all cancelled", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-cancel-1"));
    await user.click(screen.getByTestId("btn-cancel-2"));
    await user.click(screen.getByTestId("btn-cancel-3"));
    expect(screen.getByTestId("no-events")).toBeDefined();
  });

  it("full events do not appear in signup dropdown", async () => {
    // Event 2 has capacity 15, 1 signup. Fill it up.
    const user = userEvent.setup();
    for (let i = 0; i < 14; i++) {
      await user.selectOptions(screen.getByTestId("select-event"), "2");
      await user.type(screen.getByTestId("input-signup-name"), `Volunteer ${i}`);
      await user.type(screen.getByTestId("input-signup-email"), `vol${i}@example.com`);
      await user.click(screen.getByTestId("btn-signup"));
    }
    const select = screen.getByTestId("select-event") as HTMLSelectElement;
    const options = Array.from(select.options).map((o) => o.value);
    expect(options).not.toContain("2");
  });

  it("shows full badge when event is full", async () => {
    const user = userEvent.setup();
    for (let i = 0; i < 14; i++) {
      await user.selectOptions(screen.getByTestId("select-event"), "2");
      await user.type(screen.getByTestId("input-signup-name"), `Volunteer ${i}`);
      await user.type(screen.getByTestId("input-signup-email"), `vol${i}@example.com`);
      await user.click(screen.getByTestId("btn-signup"));
    }
    expect(screen.getByTestId("full-badge-2")).toBeDefined();
  });
});
