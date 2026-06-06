import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Photography Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /photography log/i })).toBeTruthy();
  });

  it("shows 3 sessions on load", () => {
    expect(screen.getByTestId("session-count").textContent).toContain("3");
  });

  it("renders all seed sessions", () => {
    expect(screen.getByTestId("session-1")).toBeTruthy();
    expect(screen.getByTestId("session-2")).toBeTruthy();
    expect(screen.getByTestId("session-3")).toBeTruthy();
  });

  it("displays location for each seed session", () => {
    expect(screen.getByTestId("session-location-1").textContent).toBe("Central Park");
    expect(screen.getByTestId("session-location-2").textContent).toBe("Brooklyn Bridge");
  });

  it("displays camera for seed session", () => {
    expect(screen.getByTestId("session-camera-1").textContent).toBe("Sony A7III");
  });

  it("adds a new session when form is submitted", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-date"), "2024-06-01");
    await user.type(screen.getByTestId("input-location"), "Times Square");
    await user.type(screen.getByTestId("input-camera"), "Nikon Z6");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("session-count").textContent).toContain("4");
    expect(screen.getByText("Times Square")).toBeTruthy();
  });

  it("clears form after submission", async () => {
    const user = userEvent.setup();
    const locInput = screen.getByTestId("input-location") as HTMLInputElement;
    await user.type(screen.getByTestId("input-date"), "2024-06-01");
    await user.type(locInput, "Times Square");
    await user.type(screen.getByTestId("input-camera"), "Nikon Z6");
    await user.click(screen.getByTestId("submit-btn"));
    expect(locInput.value).toBe("");
  });

  it("does not submit when location is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-date"), "2024-06-01");
    await user.type(screen.getByTestId("input-camera"), "Nikon Z6");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("session-count").textContent).toContain("3");
  });

  it("does not submit when camera is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-date"), "2024-06-01");
    await user.type(screen.getByTestId("input-location"), "Midtown");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("session-count").textContent).toContain("3");
  });

  it("deletes a session", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("session-1")).toBeNull();
    expect(screen.getByTestId("session-count").textContent).toContain("2");
  });

  it("shows 0 sessions after deleting all", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    expect(screen.getByTestId("session-count").textContent).toContain("0");
  });

  it("session list is present", () => {
    expect(screen.getByTestId("session-list")).toBeTruthy();
  });

  it("notes are displayed for seed sessions", () => {
    expect(screen.getByTestId("session-notes-1").textContent).toContain("Golden hour");
  });
});
