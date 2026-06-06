import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Campus Events", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /campus events/i })).toBeTruthy();
  });

  it("shows 4 seed events", () => {
    expect(screen.getAllByTestId("event-item")).toHaveLength(4);
  });

  it("displays seed event titles", () => {
    const titles = screen.getAllByTestId("event-title").map((el) => el.textContent);
    expect(titles).toContain("Spring Career Fair");
    expect(titles).toContain("Culture Night");
  });

  it("shows correct summary counts for seed data", () => {
    expect(screen.getByTestId("count-total").textContent).toContain("4");
    expect(screen.getByTestId("count-rsvped").textContent).toContain("0");
  });

  it("adds a new event", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Art Show");
    await user.type(screen.getByTestId("input-location"), "Gallery");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("count-total").textContent).toContain("5");
    const titles = screen.getAllByTestId("event-title").map((el) => el.textContent);
    expect(titles).toContain("Art Show");
  });

  it("shows error when title is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-location"), "Somewhere");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
    expect(screen.getAllByTestId("event-item")).toHaveLength(4);
  });

  it("shows error when location is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Some Event");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Workshop");
    await user.type(screen.getByTestId("input-location"), "Room 101");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-title") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-location") as HTMLInputElement).value).toBe("");
  });

  it("RSVPs to an event and increments count", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("event-item");
    const rsvpBtn = within(items[0]).getByTestId("btn-rsvp");
    expect(rsvpBtn.textContent).toBe("RSVP");
    const initialCount = Number(within(items[0]).getByTestId("event-rsvp-count").textContent);
    await user.click(rsvpBtn);
    expect(within(items[0]).getByTestId("btn-rsvp").textContent).toBe("Cancel RSVP");
    expect(Number(within(items[0]).getByTestId("event-rsvp-count").textContent)).toBe(initialCount + 1);
    expect(screen.getByTestId("count-rsvped").textContent).toContain("1");
  });

  it("cancels RSVP and decrements count", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("event-item");
    await user.click(within(items[0]).getByTestId("btn-rsvp"));
    const afterRsvp = Number(within(items[0]).getByTestId("event-rsvp-count").textContent);
    await user.click(within(items[0]).getByTestId("btn-rsvp"));
    expect(Number(within(items[0]).getByTestId("event-rsvp-count").textContent)).toBe(afterRsvp - 1);
    expect(screen.getByTestId("count-rsvped").textContent).toContain("0");
  });

  it("deletes an event", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("event-item");
    await user.click(within(items[0]).getByTestId("btn-delete"));
    expect(screen.getAllByTestId("event-item")).toHaveLength(3);
    expect(screen.getByTestId("count-total").textContent).toContain("3");
  });

  it("filters by Academic category", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Academic"));
    const items = screen.getAllByTestId("event-item");
    expect(items).toHaveLength(2);
    items.forEach((item) => {
      expect(within(item).getByTestId("event-category").textContent).toBe("Academic");
    });
  });

  it("filter All restores full list", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Career"));
    expect(screen.getAllByTestId("event-item")).toHaveLength(1);
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("event-item")).toHaveLength(4);
  });

  it("filter for empty category shows no items", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Sports"));
    expect(screen.queryAllByTestId("event-item")).toHaveLength(0);
  });
});
