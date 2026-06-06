import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Breathing Exercise Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /breathing exercise log/i })).toBeTruthy();
  });

  it("shows seed sessions on mount", () => {
    expect(screen.getByTestId("session-1")).toBeTruthy();
    expect(screen.getByTestId("session-2")).toBeTruthy();
    expect(screen.getByTestId("session-3")).toBeTruthy();
  });

  it("shows correct total sessions on mount", () => {
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 3");
  });

  it("shows correct total rounds on mount", () => {
    expect(screen.getByTestId("total-rounds").textContent).toBe("Total rounds: 11");
  });

  it("shows correct total minutes on mount", () => {
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 33");
  });

  it("shows seed techniques", () => {
    expect(screen.getByTestId("session-technique-1").textContent).toBe("Box Breathing");
    expect(screen.getByTestId("session-technique-2").textContent).toBe("4-7-8");
    expect(screen.getByTestId("session-technique-3").textContent).toBe("Wim Hof");
  });

  it("adds a new session with valid inputs", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-03-10");
    await user.selectOptions(screen.getByLabelText("Technique"), "Diaphragmatic");
    await user.clear(screen.getByLabelText("Rounds"));
    await user.type(screen.getByLabelText("Rounds"), "4");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "12");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 4");
    expect(screen.getByTestId("total-rounds").textContent).toBe("Total rounds: 15");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 45");
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-03-10");
    await user.selectOptions(screen.getByLabelText("Technique"), "Wim Hof");
    await user.clear(screen.getByLabelText("Rounds"));
    await user.type(screen.getByLabelText("Rounds"), "2");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "10");
    await user.click(screen.getByTestId("add-button"));
    expect((screen.getByTestId("date-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("rounds-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("duration-input") as HTMLInputElement).value).toBe("");
  });

  it("shows error when date is missing", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Technique"), "4-7-8");
    await user.type(screen.getByLabelText("Rounds"), "3");
    await user.type(screen.getByLabelText("Duration (min)"), "5");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Date is required");
  });

  it("shows error when technique is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-03-10");
    await user.type(screen.getByLabelText("Rounds"), "3");
    await user.type(screen.getByLabelText("Duration (min)"), "5");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Technique is required");
  });

  it("shows error when rounds is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-03-10");
    await user.selectOptions(screen.getByLabelText("Technique"), "Box Breathing");
    await user.type(screen.getByLabelText("Duration (min)"), "5");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Rounds must be positive");
  });

  it("shows error when duration is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-03-10");
    await user.selectOptions(screen.getByLabelText("Technique"), "Box Breathing");
    await user.type(screen.getByLabelText("Rounds"), "3");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Duration must be positive");
  });

  it("deletes a session and updates totals", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1")); // removes 5 rounds, 10 min
    expect(screen.queryByTestId("session-1")).toBeNull();
    expect(screen.getByTestId("total-rounds").textContent).toBe("Total rounds: 6");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 23");
  });

  it("shows zero stats when all deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 0");
    expect(screen.getByTestId("total-rounds").textContent).toBe("Total rounds: 0");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 0");
  });
});
