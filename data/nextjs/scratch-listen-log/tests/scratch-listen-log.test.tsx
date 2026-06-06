import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Listen Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /listen log/i })).toBeTruthy();
  });

  it("shows 3 seed entries on load", () => {
    expect(screen.getAllByTestId("log-card").length).toBe(3);
  });

  it("shows correct initial entry count", () => {
    expect(screen.getByTestId("log-count").textContent).toContain("3");
  });

  it("shows correct initial average rating", () => {
    // (5 + 4 + 3) / 3 = 4.0
    expect(screen.getByTestId("avg-rating").textContent).toContain("4.0");
  });

  it("displays first seed show name", () => {
    const shows = screen.getAllByTestId("log-show");
    expect(shows[0].textContent).toBe("The Daily");
  });

  it("displays seed entry thoughts", () => {
    const thoughtsList = screen.getAllByTestId("log-thoughts");
    expect(thoughtsList[1].textContent).toBe("Very informative");
  });

  it("logs a new episode", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/show/i), "Test Show");
    await user.type(screen.getByLabelText(/episode/i), "Test Ep");
    await user.type(screen.getByLabelText(/date/i), "2024-12-01");
    await user.type(screen.getByLabelText(/rating/i), "4");
    await user.type(screen.getByLabelText(/thoughts/i), "Great listen");
    await user.click(screen.getByRole("button", { name: /log episode/i }));
    expect(screen.getAllByTestId("log-card").length).toBe(4);
  });

  it("clears form after logging", async () => {
    const user = userEvent.setup();
    const showInput = screen.getByLabelText(/show/i);
    await user.type(showInput, "Test Show");
    await user.type(screen.getByLabelText(/episode/i), "Test Ep");
    await user.type(screen.getByLabelText(/date/i), "2024-12-01");
    await user.type(screen.getByLabelText(/rating/i), "4");
    await user.type(screen.getByLabelText(/thoughts/i), "Great");
    await user.click(screen.getByRole("button", { name: /log episode/i }));
    expect((showInput as HTMLInputElement).value).toBe("");
  });

  it("shows error when fields are empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /log episode/i }));
    expect(screen.getByTestId("error-message").textContent).toContain("Invalid input");
  });

  it("rejects rating of 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/show/i), "Show");
    await user.type(screen.getByLabelText(/episode/i), "Ep");
    await user.type(screen.getByLabelText(/date/i), "2024-01-01");
    await user.type(screen.getByLabelText(/rating/i), "0");
    await user.type(screen.getByLabelText(/thoughts/i), "OK");
    await user.click(screen.getByRole("button", { name: /log episode/i }));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("rejects rating above 5", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/show/i), "Show");
    await user.type(screen.getByLabelText(/episode/i), "Ep");
    await user.type(screen.getByLabelText(/date/i), "2024-01-01");
    await user.type(screen.getByLabelText(/rating/i), "6");
    await user.type(screen.getByLabelText(/thoughts/i), "OK");
    await user.click(screen.getByRole("button", { name: /log episode/i }));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("deletes an entry", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("log-card");
    await user.click(within(cards[0]).getByRole("button", { name: /delete/i }));
    expect(screen.getAllByTestId("log-card").length).toBe(2);
  });

  it("updates count after delete", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("log-card");
    await user.click(within(cards[0]).getByRole("button", { name: /delete/i }));
    expect(screen.getByTestId("log-count").textContent).toContain("2");
  });

  it("updates average after delete", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("log-card");
    // delete rating 5 entry → (4+3)/2 = 3.5
    await user.click(within(cards[0]).getByRole("button", { name: /delete/i }));
    expect(screen.getByTestId("avg-rating").textContent).toContain("3.5");
  });
});
