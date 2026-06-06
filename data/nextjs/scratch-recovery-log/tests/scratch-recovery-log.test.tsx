import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Recovery Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /recovery log/i })).toBeTruthy();
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
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 95");
  });

  it("shows correct high intensity count on mount", () => {
    expect(screen.getByTestId("high-intensity-sessions").textContent).toBe("High intensity sessions: 1");
  });

  it("shows seed activities", () => {
    expect(screen.getByTestId("session-activity-1").textContent).toBe("Ice Bath");
    expect(screen.getByTestId("session-activity-2").textContent).toBe("Foam Rolling");
    expect(screen.getByTestId("session-activity-3").textContent).toBe("Massage");
  });

  it("shows seed intensities", () => {
    expect(screen.getByTestId("session-intensity-1").textContent).toBe("High");
    expect(screen.getByTestId("session-intensity-2").textContent).toBe("Low");
    expect(screen.getByTestId("session-intensity-3").textContent).toBe("Medium");
  });

  it("adds a new session with valid inputs", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-05-10");
    await user.selectOptions(screen.getByLabelText("Activity"), "Sauna");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "30");
    await user.selectOptions(screen.getByLabelText("Intensity"), "High");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 4");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 125");
    expect(screen.getByTestId("high-intensity-sessions").textContent).toBe("High intensity sessions: 2");
  });

  it("clears form after successful add", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-05-10");
    await user.selectOptions(screen.getByLabelText("Activity"), "Sleep");
    await user.clear(screen.getByLabelText("Duration (min)"));
    await user.type(screen.getByLabelText("Duration (min)"), "480");
    await user.selectOptions(screen.getByLabelText("Intensity"), "Low");
    await user.click(screen.getByTestId("add-button"));
    expect((screen.getByTestId("date-input") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("duration-input") as HTMLInputElement).value).toBe("");
  });

  it("shows error when date is missing", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Activity"), "Sauna");
    await user.type(screen.getByLabelText("Duration (min)"), "20");
    await user.selectOptions(screen.getByLabelText("Intensity"), "Low");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Date is required");
  });

  it("shows error when activity is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-05-10");
    await user.type(screen.getByLabelText("Duration (min)"), "20");
    await user.selectOptions(screen.getByLabelText("Intensity"), "Low");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Activity is required");
  });

  it("shows error when duration is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-05-10");
    await user.selectOptions(screen.getByLabelText("Activity"), "Sauna");
    await user.selectOptions(screen.getByLabelText("Intensity"), "Medium");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Duration must be positive");
  });

  it("shows error when intensity is missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Date"), "2024-05-10");
    await user.selectOptions(screen.getByLabelText("Activity"), "Sauna");
    await user.type(screen.getByLabelText("Duration (min)"), "20");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("error-list").textContent).toContain("Intensity is required");
  });

  it("deletes a session and updates totals", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1")); // removes 15 min, 1 high intensity
    expect(screen.queryByTestId("session-1")).toBeNull();
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 80");
    expect(screen.getByTestId("high-intensity-sessions").textContent).toBe("High intensity sessions: 0");
  });

  it("shows zero stats when all deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    expect(screen.getByTestId("total-sessions").textContent).toBe("Total sessions: 0");
    expect(screen.getByTestId("total-minutes").textContent).toBe("Total minutes: 0");
    expect(screen.getByTestId("high-intensity-sessions").textContent).toBe("High intensity sessions: 0");
  });
});
