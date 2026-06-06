import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Badge Scanner", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /badge scanner/i })).toBeTruthy();
  });

  it("shows first session as default in select", () => {
    const select = screen.getByTestId("session-select") as HTMLSelectElement;
    expect(select.value).toBe("s1");
  });

  it("shows 0 / 3 checked in for first session initially", () => {
    expect(screen.getByTestId("attendance-count").textContent).toContain("0 / 3");
  });

  it("checks in a valid attendee", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "A001");
    await user.click(screen.getByTestId("checkin-btn"));
    expect(screen.getByTestId("checkedin-A001")).toBeTruthy();
    expect(screen.getByTestId("attendance-count").textContent).toContain("1 / 3");
  });

  it("shows attendee name after check-in", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "A002");
    await user.click(screen.getByTestId("checkin-btn"));
    expect(screen.getByTestId("checkedin-name-A002").textContent).toBe("Ben Okafor");
  });

  it("clears badge input after successful check-in", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "A003");
    await user.click(screen.getByTestId("checkin-btn"));
    expect((screen.getByTestId("badge-input") as HTMLInputElement).value).toBe("");
  });

  it("shows error for unknown badge ID", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "X999");
    await user.click(screen.getByTestId("checkin-btn"));
    expect(screen.getByTestId("error-message").textContent).toContain("Unknown badge ID");
  });

  it("shows error for already checked in attendee", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "A001");
    await user.click(screen.getByTestId("checkin-btn"));
    await user.type(screen.getByTestId("badge-input"), "A001");
    await user.click(screen.getByTestId("checkin-btn"));
    expect(screen.getByTestId("error-message").textContent).toContain("Already checked in");
  });

  it("shows error when session is full", async () => {
    const user = userEvent.setup();
    for (const badge of ["A001", "A002", "A003"]) {
      await user.type(screen.getByTestId("badge-input"), badge);
      await user.click(screen.getByTestId("checkin-btn"));
    }
    await user.type(screen.getByTestId("badge-input"), "A004");
    await user.click(screen.getByTestId("checkin-btn"));
    expect(screen.getByTestId("error-message").textContent).toContain("Session is full");
  });

  it("checks out an attendee", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "A001");
    await user.click(screen.getByTestId("checkin-btn"));
    await user.click(screen.getByTestId("checkout-btn-A001"));
    expect(screen.queryByTestId("checkedin-A001")).toBeNull();
    expect(screen.getByTestId("attendance-count").textContent).toContain("0 / 3");
  });

  it("session summary table shows all sessions", () => {
    expect(screen.getByTestId("summary-row-s1")).toBeTruthy();
    expect(screen.getByTestId("summary-row-s2")).toBeTruthy();
    expect(screen.getByTestId("summary-row-s3")).toBeTruthy();
  });

  it("session summary updates check-in count", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "A001");
    await user.click(screen.getByTestId("checkin-btn"));
    expect(screen.getByTestId("summary-count-s1").textContent).toBe("1");
  });

  it("switching sessions does not clear previous session data", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "A001");
    await user.click(screen.getByTestId("checkin-btn"));
    await user.selectOptions(screen.getByTestId("session-select"), "s2");
    expect(screen.getByTestId("summary-count-s1").textContent).toBe("1");
  });

  it("badge ID is case-sensitive", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("badge-input"), "a001");
    await user.click(screen.getByTestId("checkin-btn"));
    expect(screen.getByTestId("error-message").textContent).toContain("Unknown badge ID");
  });
});
