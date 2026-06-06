import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Pet Weight Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the main heading", () => {
    expect(screen.getByRole("heading", { name: /pet weight tracker/i })).toBeTruthy();
  });

  it("shows three pet buttons", () => {
    expect(screen.getByTestId("pet-btn-whiskers")).toBeTruthy();
    expect(screen.getByTestId("pet-btn-rex")).toBeTruthy();
    expect(screen.getByTestId("pet-btn-peanut")).toBeTruthy();
  });

  it("shows Whiskers as default with species Cat", () => {
    expect(screen.getByTestId("pet-name").textContent).toBe("Whiskers");
    expect(screen.getByTestId("pet-species").textContent).toBe("Cat");
  });

  it("renders the weight table with 3 rows for Whiskers", () => {
    expect(screen.getByTestId("weight-row-0")).toBeTruthy();
    expect(screen.getByTestId("weight-row-1")).toBeTruthy();
    expect(screen.getByTestId("weight-row-2")).toBeTruthy();
  });

  it("shows trend indicators correctly for Whiskers (all increasing)", () => {
    expect(screen.getByTestId("trend-0").textContent).toBe("—");
    expect(screen.getByTestId("trend-1").textContent).toBe("↑");
    expect(screen.getByTestId("trend-2").textContent).toBe("↑");
  });

  it("shows trend summary as Up for Whiskers", () => {
    expect(screen.getByTestId("trend-summary").textContent).toContain("Up");
  });

  it("shows latest weight for Whiskers", () => {
    expect(screen.getByTestId("latest-weight").textContent).toContain("9.8");
  });

  it("switches to Rex and shows his data", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("pet-btn-rex"));
    expect(screen.getByTestId("pet-name").textContent).toBe("Rex");
    expect(screen.getByTestId("trend-summary").textContent).toContain("Down");
  });

  it("adds a new weight entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("weight-date-input"), "2024-04-01");
    await user.type(screen.getByTestId("weight-value-input"), "10.1");
    await user.click(screen.getByRole("button", { name: /add entry/i }));
    expect(screen.getByTestId("weight-row-3")).toBeTruthy();
  });

  it("clears form after adding entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("weight-date-input"), "2024-04-01");
    await user.type(screen.getByTestId("weight-value-input"), "10.1");
    await user.click(screen.getByRole("button", { name: /add entry/i }));
    const dateInput = screen.getByTestId("weight-date-input") as HTMLInputElement;
    expect(dateInput.value).toBe("");
  });

  it("does not add entry when weight is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("weight-date-input"), "2024-04-01");
    await user.click(screen.getByRole("button", { name: /add entry/i }));
    expect(screen.queryByTestId("weight-row-3")).toBeNull();
  });

  it("deletes a weight entry", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-weight-0"));
    expect(screen.queryByTestId("weight-row-2")).toBeNull();
  });

  it("shows no-weight-msg when all entries deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-weight-2"));
    await user.click(screen.getByTestId("delete-weight-1"));
    await user.click(screen.getByTestId("delete-weight-0"));
    expect(screen.getByTestId("no-weight-msg")).toBeTruthy();
  });

  it("pet data is independent across pets", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-weight-0"));
    await user.click(screen.getByTestId("pet-btn-rex"));
    expect(screen.getByTestId("weight-row-0")).toBeTruthy();
  });
});
