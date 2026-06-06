import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Episode Queue", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /episode queue/i })).toBeTruthy();
  });

  it("shows 3 seed episodes on load", () => {
    expect(screen.getAllByTestId("episode-card").length).toBe(3);
  });

  it("shows correct queued count initially", () => {
    expect(screen.getByTestId("queue-count").textContent).toContain("2");
  });

  it("displays show names in seed data", () => {
    const shows = screen.getAllByTestId("episode-show");
    expect(shows[0].textContent).toBe("99% Invisible");
  });

  it("adds a new episode when all fields filled", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/show/i), "New Show");
    await user.type(screen.getByLabelText(/title/i), "Great Episode");
    await user.type(screen.getByLabelText(/duration/i), "30:00");
    await user.click(screen.getByRole("button", { name: /add episode/i }));
    expect(screen.getAllByTestId("episode-card").length).toBe(4);
  });

  it("new episode starts as queued", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/show/i), "New Show");
    await user.type(screen.getByLabelText(/title/i), "Great Episode");
    await user.type(screen.getByLabelText(/duration/i), "30:00");
    await user.click(screen.getByRole("button", { name: /add episode/i }));
    const cards = screen.getAllByTestId("episode-card");
    const lastCard = cards[cards.length - 1];
    expect(within(lastCard).getByTestId("episode-status").textContent).toBe("queued");
  });

  it("shows error when fields are empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add episode/i }));
    expect(screen.getByTestId("error-message").textContent).toContain("All fields are required");
  });

  it("marks episode as listened", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("episode-card");
    await user.click(within(cards[0]).getByRole("button", { name: /mark listened/i }));
    expect(within(cards[0]).getByTestId("episode-status").textContent).toBe("listened");
  });

  it("hides Mark Listened button after marking", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("episode-card");
    await user.click(within(cards[0]).getByRole("button", { name: /mark listened/i }));
    expect(within(cards[0]).queryByRole("button", { name: /mark listened/i })).toBeNull();
  });

  it("removes an episode", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("episode-card");
    await user.click(within(cards[0]).getByRole("button", { name: /remove/i }));
    expect(screen.getAllByTestId("episode-card").length).toBe(2);
  });

  it("updates queued count after marking listened", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("episode-card");
    await user.click(within(cards[0]).getByRole("button", { name: /mark listened/i }));
    expect(screen.getByTestId("queue-count").textContent).toContain("1");
  });

  it("filters to show only queued episodes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^queued$/i }));
    expect(screen.getAllByTestId("episode-card").length).toBe(2);
  });

  it("filters to show only listened episodes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^listened$/i }));
    expect(screen.getAllByTestId("episode-card").length).toBe(1);
  });

  it("All filter shows all episodes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^listened$/i }));
    await user.click(screen.getByRole("button", { name: /^all$/i }));
    expect(screen.getAllByTestId("episode-card").length).toBe(3);
  });
});
