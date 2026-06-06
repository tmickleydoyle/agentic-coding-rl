import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Stretch Routine Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /stretch routine log/i })).toBeTruthy();
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
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 65");
  });

  it("shows correct total stretches on mount", () => {
    expect(screen.getByTestId("total-stretches").textContent).toBe("Total stretches: 21");
  });

  it("shows seed focus areas", () => {
    expect(screen.getByTestId("session-focus-1").textContent).toBe("Hamstrings");
    expect(screen.getByTestId("session-focus-2").textContent).toBe("Shoulders");
    expect(screen.getByTestId("session-focus-3").textContent).toBe("Full Body");
  });

  it("adds a new session with valid inputs", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-04-10");
    await user.selectOptions(screen.getByLabelText("Focus Area"), "Back");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "25");
    await user.clear(screen.getByLabelText("Stretches"));
    await user.type(screen.getByLabelText("Stretches"), "8");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 4");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 90");
    expect(screen.getByTestId("total-stretches").textContent).toBe("Total stretches: 29");
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-04-10");
    await user.selectOptions(screen.getByLabelText("Focus Area"), "Calves");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "10");
    await user.clear(screen.getByLabelText("Stretches"));
    await user.type(screen.getByLabelText("Stretches"), "4");
    await user.click(screen.getByTestId("add-button"));
    expect((screen.getByTestId("date-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("duration-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("stretches-input") as HTMLInputElement).value).toBe("");
  });

  it("shows error when date is missing", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Focus Area"), "Back");
    await user.type(screen.getByLabelText("Duration (min)"), "10");
    await user.type(screen.getByLabelText("Stretches"), "4");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Date is required");
  });

  it("shows error when focus area is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-04-10");
    await user.type(screen.getByLabelText("Duration (min)"), "10");
    await user.type(screen.getByLabelText("Stretches"), "4");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Focus Area is required");
  });

  it("shows error when duration is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-04-10");
    await user.selectOptions(screen.getByLabelText("Focus Area"), "Hip Flexors");
    await user.type(screen.getByLabelText("Stretches"), "4");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Duration must be positive");
  });

  it("shows error when stretches is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-04-10");
    await user.selectOptions(screen.getByLabelText("Focus Area"), "Calves");
    await user.type(screen.getByLabelText("Duration (min)"), "10");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Stretches must be positive");
  });

  it("deletes a session and updates totals", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-2")); // removes 15 min, 5 stretches
    expect(screen.queryByTestId("session-2")).toBeNull();
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 50");
    expect(screen.getByTestId("total-stretches").textContent).toBe("Total stretches: 16");
  });

  it("shows zero stats when all deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 0");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 0");
    expect(screen.getByTestId("total-stretches").textContent).toBe("Total stretches: 0");
  });
});
