import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Yoga Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /yoga log/i })).toBeTruthy();
  });

  it("shows seed sessions on mount", () => {
    expect(screen.getByTestId("session-1")).toBeTruthy();
    expect(screen.getByTestId("session-2")).toBeTruthy();
    expect(screen.getByTestId("session-3")).toBeTruthy();
  });

  it("displays correct total sessions count on mount", () => {
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 3");
  });

  it("displays correct total minutes on mount", () => {
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 135");
  });

  it("shows seed session styles", () => {
    expect(screen.getByTestId("session-style-1").textContent).toBe("Hatha");
    expect(screen.getByTestId("session-style-2").textContent).toBe("Vinyasa");
    expect(screen.getByTestId("session-style-3").textContent).toBe("Yin");
  });

  it("adds a new session with valid inputs", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-01-20");
    await user.selectOptions(screen.getByLabelText("Style"), "Ashtanga");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "50");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 4");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 185");
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-01-20");
    await user.selectOptions(screen.getByLabelText("Style"), "Hatha");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "30");
    await user.click(screen.getByTestId("add-button"));
    expect((screen.getByTestId("date-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("style-select") as HTMLSelectElement).value).toBe("");
    expect((screen.getByTestId("duration-input") as HTMLInputElement).value).toBe("");
  });

  it("shows error when date is missing", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Style"), "Yin");
    await user.type(screen.getByLabelText("Duration (min)"), "20");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Date is required");
  });

  it("shows error when style is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-01-20");
    await user.type(screen.getByLabelText("Duration (min)"), "20");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Style is required");
  });

  it("shows error when duration is zero or missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-01-20");
    await user.selectOptions(screen.getByLabelText("Style"), "Hatha");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Duration must be positive");
  });

  it("deletes a session", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("session-1")).toBeNull();
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 2");
  });

  it("updates total minutes after deletion", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1")); // removes 45 min
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 90");
  });

  it("shows zero totals when all sessions deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 0");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 0");
  });
});
