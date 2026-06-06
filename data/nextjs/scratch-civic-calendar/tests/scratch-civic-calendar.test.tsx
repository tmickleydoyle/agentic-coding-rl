import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Civic Calendar", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /civic calendar/i })).toBeTruthy();
  });

  it("renders 5 event cards from seed data", () => {
    expect(screen.getAllByTestId("event-card").length).toBe(5);
  });

  it("displays event titles, dates, categories, and descriptions", () => {
    const titles = screen.getAllByTestId("event-title").map((el) => el.textContent);
    expect(titles).toContain("Primary Election Day");
    expect(titles).toContain("Candidate Forum");
  });

  it("events are sorted by date ascending", () => {
    const dates = screen.getAllByTestId("event-date").map((el) => el.textContent!);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });

  it("filter by Election shows 2 cards", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-election"));
    expect(screen.getAllByTestId("event-card").length).toBe(2);
  });

  it("filter by Registration shows 2 cards", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-registration"));
    expect(screen.getAllByTestId("event-card").length).toBe(2);
  });

  it("filter by Debate shows 1 card", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-debate"));
    expect(screen.getAllByTestId("event-card").length).toBe(1);
    expect(screen.getByTestId("event-title").textContent).toBe("Candidate Forum");
  });

  it("All filter shows all 5 cards after switching back", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-election"));
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("event-card").length).toBe(5);
  });

  it("active filter button has aria-pressed=true", async () => {
    const user = userEvent.setup();
    const electionBtn = screen.getByTestId("filter-election");
    await user.click(electionBtn);
    expect(electionBtn.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("filter-all").getAttribute("aria-pressed")).toBe("false");
  });

  it("adds a new event and it appears in sorted position", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("title-input"), "Early Voting Begins");
    await user.type(screen.getByTestId("date-input"), "2026-09-01");
    await user.selectOptions(screen.getByTestId("category-select"), "Election");
    await user.type(screen.getByTestId("description-textarea"), "Two weeks of early voting");
    await user.click(screen.getByTestId("add-event-btn"));

    const cards = screen.getAllByTestId("event-card");
    expect(cards.length).toBe(6);
    const dates = screen.getAllByTestId("event-date").map((el) => el.textContent!);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });

  it("clears the add form after successful submission", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("title-input"), "New Event");
    await user.type(screen.getByTestId("date-input"), "2026-08-15");
    await user.click(screen.getByTestId("add-event-btn"));

    expect((screen.getByTestId("title-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("date-input") as HTMLInputElement).value).toBe("");
  });

  it("does not add event when title is blank", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("date-input"), "2026-08-15");
    await user.click(screen.getByTestId("add-event-btn"));
    expect(screen.getAllByTestId("event-card").length).toBe(5);
  });

  it("deletes an event", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("event-card");
    const forumCard = cards.find((c) =>
      within(c).getByTestId("event-title").textContent === "Candidate Forum"
    );
    await user.click(within(forumCard!).getByTestId("delete-event-btn"));
    expect(screen.getAllByTestId("event-card").length).toBe(4);
  });

  it("filter remains active after deleting an event", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-debate"));
    const cards = screen.getAllByTestId("event-card");
    await user.click(within(cards[0]).getByTestId("delete-event-btn"));
    expect(screen.getByTestId("filter-debate").getAttribute("aria-pressed")).toBe("true");
  });
});
