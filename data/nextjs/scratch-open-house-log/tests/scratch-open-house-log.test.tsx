import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Open House Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /open house log/i })).toBeTruthy();
  });

  it("shows 3 pre-loaded visit cards", () => {
    const cards = screen.getAllByTestId("visit-card");
    expect(cards.length).toBe(3);
  });

  it("shows star rating for visit 3 as 5 stars", () => {
    expect(screen.getByTestId("visit-rating-3").textContent).toBe("★★★★★");
  });

  it("shows star rating for visit 2 as 3 stars", () => {
    expect(screen.getByTestId("visit-rating-2").textContent).toBe("★★★☆☆");
  });

  it("adds a new visit", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Address"), "999 New St");
    await user.type(screen.getByLabelText("Date"), "2024-04-01");
    await user.type(screen.getByLabelText("Agent Name"), "John Doe");
    await user.clear(screen.getByLabelText("Rating (1-5)"));
    await user.type(screen.getByLabelText("Rating (1-5)"), "4");
    await user.click(screen.getByRole("button", { name: /add visit/i }));
    const cards = screen.getAllByTestId("visit-card");
    expect(cards.length).toBe(4);
  });

  it("shows error if required fields missing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add visit/i }));
    expect(screen.getByTestId("form-error").textContent).toContain("Please fill in all required fields");
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Address"), "999 New St");
    await user.type(screen.getByLabelText("Date"), "2024-04-01");
    await user.type(screen.getByLabelText("Agent Name"), "John Doe");
    await user.clear(screen.getByLabelText("Rating (1-5)"));
    await user.type(screen.getByLabelText("Rating (1-5)"), "4");
    await user.click(screen.getByRole("button", { name: /add visit/i }));
    expect((screen.getByLabelText("Address") as HTMLInputElement).value).toBe("");
  });

  it("deletes a visit", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-visit-1"));
    const cards = screen.getAllByTestId("visit-card");
    expect(cards.length).toBe(2);
  });

  it("shows empty state after deleting all visits", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-visit-1"));
    await user.click(screen.getByTestId("delete-visit-2"));
    await user.click(screen.getByTestId("delete-visit-3"));
    expect(screen.getByTestId("empty-state")).toBeTruthy();
  });

  it("sorts by Date (Oldest) correctly", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("sort-select"), "Date (Oldest)");
    const cards = screen.getAllByTestId("visit-card");
    expect(cards[0].textContent).toContain("123 Maple St");
  });

  it("sorts by Rating (High) correctly", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("sort-select"), "Rating (High)");
    const cards = screen.getAllByTestId("visit-card");
    expect(cards[0].textContent).toContain("789 Pine Rd");
  });

  it("rejects rating of 0 as invalid", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Address"), "999 New St");
    await user.type(screen.getByLabelText("Date"), "2024-04-01");
    await user.type(screen.getByLabelText("Agent Name"), "John Doe");
    await user.clear(screen.getByLabelText("Rating (1-5)"));
    await user.type(screen.getByLabelText("Rating (1-5)"), "0");
    await user.click(screen.getByRole("button", { name: /add visit/i }));
    expect(screen.getByTestId("form-error")).toBeTruthy();
    const cards = screen.getAllByTestId("visit-card");
    expect(cards.length).toBe(3);
  });
});
