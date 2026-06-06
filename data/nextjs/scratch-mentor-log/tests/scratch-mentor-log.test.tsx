import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Mentor Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /mentor log/i })).toBeTruthy();
  });

  it("shows 3 seed sessions", () => {
    expect(screen.getAllByTestId("session-item")).toHaveLength(3);
  });

  it("displays seed mentor names", () => {
    const mentors = screen.getAllByTestId("session-mentor").map((el) => el.textContent);
    expect(mentors).toContain("Dr. Smith");
    expect(mentors).toContain("Prof. Lee");
  });

  it("shows correct average rating for seed data", () => {
    expect(screen.getByTestId("avg-rating").textContent).toContain("4.0");
  });

  it("adds a new session", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-mentor"), "Jane Doe");
    await user.type(screen.getByTestId("input-topic"), "Goal Setting");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "4");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByTestId("session-item")).toHaveLength(4);
    const mentors = screen.getAllByTestId("session-mentor").map((el) => el.textContent);
    expect(mentors).toContain("Jane Doe");
  });

  it("shows error when mentor is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-topic"), "Some Topic");
    await user.type(screen.getByTestId("input-rating"), "3");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
    expect(screen.getAllByTestId("session-item")).toHaveLength(3);
  });

  it("shows error when topic is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-mentor"), "Alice");
    await user.type(screen.getByTestId("input-rating"), "3");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("shows error when rating is out of range", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-mentor"), "Bob");
    await user.type(screen.getByTestId("input-topic"), "Topic");
    await user.type(screen.getByTestId("input-rating"), "6");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-mentor"), "Carol");
    await user.type(screen.getByTestId("input-topic"), "Interviews");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "5");
    await user.click(screen.getByTestId("btn-add"));
    expect((screen.getByTestId("input-mentor") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-topic") as HTMLInputElement).value).toBe("");
  });

  it("deletes a session", async () => {
    const user = userEvent.setup();
    const items = screen.getAllByTestId("session-item");
    await user.click(within(items[0]).getByTestId("btn-delete"));
    expect(screen.getAllByTestId("session-item")).toHaveLength(2);
  });

  it("recalculates average after delete", async () => {
    const user = userEvent.setup();
    // delete Dr. Smith (rating 5) → avg of 4 + 3 = 3.5
    const items = screen.getAllByTestId("session-item");
    await user.click(within(items[0]).getByTestId("btn-delete"));
    expect(screen.getByTestId("avg-rating").textContent).toContain("3.5");
  });

  it("sorts by date ascending", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-date"));
    const dates = screen.getAllByTestId("session-date").map((el) => el.textContent);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });

  it("sorts by rating descending", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-rating"));
    const ratings = screen.getAllByTestId("session-rating").map((el) => Number(el.textContent));
    for (let i = 0; i < ratings.length - 1; i++) {
      expect(ratings[i]).toBeGreaterThanOrEqual(ratings[i + 1]);
    }
  });
});
