import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Meditation Timer", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /meditation timer/i })).toBeTruthy();
  });

  it("shows seed sessions on mount", () => {
    expect(screen.getByTestId("session-1")).toBeTruthy();
    expect(screen.getByTestId("session-2")).toBeTruthy();
    expect(screen.getByTestId("session-3")).toBeTruthy();
  });

  it("shows correct total sessions on mount", () => {
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 3");
  });

  it("shows correct total minutes on mount", () => {
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 45");
  });

  it("shows correct longest session on mount", () => {
    expect(screen.getByTestId("longest-session").textContent).toBe("Longest session: 20 min");
  });

  it("shows seed session types", () => {
    expect(screen.getByTestId("session-type-1").textContent).toBe("Mindfulness");
    expect(screen.getByTestId("session-type-2").textContent).toBe("Focused");
    expect(screen.getByTestId("session-type-3").textContent).toBe("Body Scan");
  });

  it("adds a new session with valid inputs", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-02-10");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "30");
    await user.selectOptions(screen.getByLabelText("Type"), "Transcendental");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 4");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 75");
  });

  it("updates longest session after add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-02-10");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "60");
    await user.selectOptions(screen.getByLabelText("Type"), "Focused");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("longest-session").textContent).toBe("Longest session: 60 min");
  });

  it("clears form on successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-02-10");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "25");
    await user.selectOptions(screen.getByLabelText("Type"), "Mindfulness");
    await user.click(screen.getByTestId("add-button"));
    expect((screen.getByTestId("date-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("duration-input") as HTMLInputElement).value).toBe("");
  });

  it("shows error when date is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Duration (min)"), "10");
    await user.selectOptions(screen.getByLabelText("Type"), "Focused");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Date is required");
  });

  it("shows error when type is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-02-10");
    await user.type(screen.getByLabelText("Duration (min)"), "10");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Type is required");
  });

  it("shows error when duration is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-02-10");
    await user.selectOptions(screen.getByLabelText("Type"), "Mindfulness");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Duration must be positive");
  });

  it("deletes a session and updates totals", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-2")); // removes 20 min
    expect(screen.queryByTestId("session-2")).toBeNull();
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 25");
    expect(screen.getByTestId("longest-session").textContent).toBe("Longest session: 15 min");
  });

  it("shows zero stats when all deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 0");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 0");
    expect(screen.getByTestId("longest-session").textContent).toBe("Longest session: 0 min");
  });
});
