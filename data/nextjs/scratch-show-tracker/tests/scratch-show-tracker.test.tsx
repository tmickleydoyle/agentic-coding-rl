import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Show Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /show tracker/i })).toBeTruthy();
  });

  it("shows 3 seed shows", () => {
    expect(screen.getAllByTestId("show-card").length).toBe(3);
  });

  it("shows correct initial show count", () => {
    expect(screen.getByTestId("show-count").textContent).toContain("3");
  });

  it("shows correct initial subscribed count", () => {
    expect(screen.getByTestId("subscribed-count").textContent).toContain("2");
  });

  it("displays seed show names", () => {
    const names = screen.getAllByTestId("show-name");
    expect(names[1].textContent).toBe("Serial");
  });

  it("adds a new show", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/name/i), "New Podcast");
    await user.type(screen.getByLabelText(/host/i), "Jane Doe");
    await user.type(screen.getByLabelText(/category/i), "Tech");
    await user.type(screen.getByLabelText(/episodes/i), "50");
    await user.click(screen.getByRole("button", { name: /add show/i }));
    expect(screen.getAllByTestId("show-card").length).toBe(4);
  });

  it("new show starts unsubscribed", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/name/i), "New Podcast");
    await user.type(screen.getByLabelText(/host/i), "Jane Doe");
    await user.type(screen.getByLabelText(/category/i), "Tech");
    await user.type(screen.getByLabelText(/episodes/i), "50");
    await user.click(screen.getByRole("button", { name: /add show/i }));
    const cards = screen.getAllByTestId("show-card");
    expect(within(cards[cards.length - 1]).getByTestId("show-subscribed").textContent).toBe("not subscribed");
  });

  it("shows error when fields empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add show/i }));
    expect(screen.getByTestId("error-message").textContent).toContain("Invalid input");
  });

  it("shows error for invalid episode count", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/name/i), "Show");
    await user.type(screen.getByLabelText(/host/i), "Host");
    await user.type(screen.getByLabelText(/category/i), "Cat");
    await user.type(screen.getByLabelText(/episodes/i), "-5");
    await user.click(screen.getByRole("button", { name: /add show/i }));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("subscribes to unsubscribed show", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("show-card");
    // Card at index 2 (Planet Money) is unsubscribed
    await user.click(within(cards[2]).getByRole("button", { name: /subscribe/i }));
    expect(within(cards[2]).getByTestId("show-subscribed").textContent).toBe("subscribed");
  });

  it("unsubscribes from subscribed show", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("show-card");
    await user.click(within(cards[0]).getByRole("button", { name: /unsubscribe/i }));
    expect(within(cards[0]).getByTestId("show-subscribed").textContent).toBe("not subscribed");
  });

  it("updates subscribed count after toggle", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("show-card");
    await user.click(within(cards[0]).getByRole("button", { name: /unsubscribe/i }));
    expect(screen.getByTestId("subscribed-count").textContent).toContain("1");
  });

  it("deletes a show", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("show-card");
    await user.click(within(cards[0]).getByRole("button", { name: /delete/i }));
    expect(screen.getAllByTestId("show-card").length).toBe(2);
  });

  it("updates show count after delete", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("show-card");
    await user.click(within(cards[0]).getByRole("button", { name: /delete/i }));
    expect(screen.getByTestId("show-count").textContent).toContain("2");
  });
});
