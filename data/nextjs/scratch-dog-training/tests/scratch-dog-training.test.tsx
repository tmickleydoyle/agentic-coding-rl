import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Dog Training Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the main heading", () => {
    expect(screen.getByRole("heading", { name: /dog training tracker/i })).toBeTruthy();
  });

  it("renders three dog buttons", () => {
    expect(screen.getByTestId("dog-btn-buddy")).toBeTruthy();
    expect(screen.getByTestId("dog-btn-luna")).toBeTruthy();
    expect(screen.getByTestId("dog-btn-max")).toBeTruthy();
  });

  it("shows Buddy as the default selected dog", () => {
    expect(screen.getByTestId("dog-name").textContent).toBe("Buddy");
    expect(screen.getByTestId("dog-breed").textContent).toBe("Golden Retriever");
  });

  it("shows Buddy's command mastery values", () => {
    expect(screen.getByTestId("mastery-sit").textContent).toBe("90%");
    expect(screen.getByTestId("mastery-stay").textContent).toBe("75%");
  });

  it("switches to Luna when her button is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("dog-btn-luna"));
    expect(screen.getByTestId("dog-name").textContent).toBe("Luna");
    expect(screen.getByTestId("dog-breed").textContent).toBe("Border Collie");
  });

  it("increments mastery by 5 when + is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("increment-stay"));
    expect(screen.getByTestId("mastery-stay").textContent).toBe("80%");
  });

  it("decrements mastery by 5 when − is clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("decrement-sit"));
    expect(screen.getByTestId("mastery-sit").textContent).toBe("85%");
  });

  it("mastery does not exceed 100", async () => {
    const user = userEvent.setup();
    // Max's sit is 95; increment twice to try to exceed 100
    await user.click(screen.getByTestId("dog-btn-max"));
    await user.click(screen.getByTestId("increment-sit"));
    await user.click(screen.getByTestId("increment-sit"));
    expect(screen.getByTestId("mastery-sit").textContent).toBe("100%");
  });

  it("shows no-sessions-msg initially", () => {
    expect(screen.getByTestId("no-sessions-msg")).toBeTruthy();
  });

  it("logs a session and shows it in the log", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("session-command-input"), "Sit");
    await user.type(screen.getByTestId("session-duration-input"), "10");
    await user.type(screen.getByTestId("session-notes-input"), "Great progress");
    await user.click(screen.getByRole("button", { name: /log session/i }));
    expect(screen.getByTestId("session-entry-0")).toBeTruthy();
    expect(screen.getByTestId("session-entry-0").textContent).toContain("Sit");
  });

  it("clears the form after logging a session", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("session-command-input"), "Heel");
    await user.click(screen.getByRole("button", { name: /log session/i }));
    const input = screen.getByTestId("session-command-input") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("does not log a session if command is empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /log session/i }));
    expect(screen.getByTestId("no-sessions-msg")).toBeTruthy();
  });

  it("sessions are per-dog and switching dogs shows correct sessions", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("session-command-input"), "Sit");
    await user.click(screen.getByRole("button", { name: /log session/i }));
    await user.click(screen.getByTestId("dog-btn-luna"));
    expect(screen.getByTestId("no-sessions-msg")).toBeTruthy();
  });
});
