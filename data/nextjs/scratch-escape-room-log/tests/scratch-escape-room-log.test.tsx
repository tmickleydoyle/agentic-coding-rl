import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Escape Room Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: "Escape Room Log" })).toBeTruthy();
  });

  it("shows correct initial stats", () => {
    expect(screen.getByTestId("total-attempts").textContent).toBe("3");
    expect(screen.getByTestId("completed-count").textContent).toBe("2");
    expect(screen.getByTestId("success-rate").textContent).toBe("67%");
  });

  it("renders seed attempt cards", () => {
    expect(screen.getByTestId("attempt-card-1")).toBeTruthy();
    expect(screen.getByTestId("attempt-card-2")).toBeTruthy();
    expect(screen.getByTestId("attempt-card-3")).toBeTruthy();
  });

  it("shows correct room names for seed data", () => {
    expect(screen.getByTestId("room-name-1").textContent).toBe("The Haunted Mansion");
    expect(screen.getByTestId("room-name-2").textContent).toBe("Nuclear Bunker");
  });

  it("shows completed and failed statuses for seed data", () => {
    expect(screen.getByTestId("attempt-status-1").textContent).toBe("Completed");
    expect(screen.getByTestId("attempt-status-2").textContent).toBe("Failed");
  });

  it("shows correct clue counts for seed data", () => {
    expect(screen.getByTestId("clue-count-1").textContent).toBe("2");
    expect(screen.getByTestId("clue-count-3").textContent).toBe("3");
  });

  it("shows clue items for seed data", () => {
    expect(screen.getByTestId("clue-item-1-0").textContent).toBe("Hidden key behind mirror");
    expect(screen.getByTestId("clue-item-3-2").textContent).toBe("Pearl necklace unlocks door");
  });

  it("adds a new attempt and updates stats", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("room-name-input"), "Lost Temple");
    await user.type(screen.getByTestId("date-input"), "2024-04-01");
    await user.clear(screen.getByTestId("duration-input"));
    await user.type(screen.getByTestId("duration-input"), "50");
    await user.click(screen.getByTestId("add-attempt-btn"));
    expect(screen.getByTestId("total-attempts").textContent).toBe("4");
  });

  it("does not add attempt when fields are missing", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("room-name-input"), "Incomplete Room");
    await user.click(screen.getByTestId("add-attempt-btn"));
    expect(screen.getByTestId("total-attempts").textContent).toBe("3");
  });

  it("deletes an attempt and updates stats", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-attempt-2"));
    expect(screen.queryByTestId("attempt-card-2")).toBeNull();
    expect(screen.getByTestId("total-attempts").textContent).toBe("2");
  });

  it("toggles completion status", async () => {
    const user = userEvent.setup();
    expect(screen.getByTestId("attempt-status-2").textContent).toBe("Failed");
    await user.click(screen.getByTestId("toggle-status-2"));
    expect(screen.getByTestId("attempt-status-2").textContent).toBe("Completed");
  });

  it("toggle button text changes with status", async () => {
    const user = userEvent.setup();
    expect(screen.getByTestId("toggle-status-1").textContent).toBe("Mark Failed");
    await user.click(screen.getByTestId("toggle-status-1"));
    expect(screen.getByTestId("toggle-status-1").textContent).toBe("Mark Complete");
  });

  it("adds a clue to an attempt", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("clue-input-2"), "Check the bookshelf");
    await user.click(screen.getByTestId("add-clue-btn-2"));
    expect(screen.getByTestId("clue-count-2").textContent).toBe("2");
    expect(screen.getByTestId("clue-item-2-1").textContent).toBe("Check the bookshelf");
  });

  it("ignores empty clue input", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-clue-btn-1"));
    expect(screen.getByTestId("clue-count-1").textContent).toBe("2");
  });

  it("clears clue input after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("clue-input-1"), "New clue");
    await user.click(screen.getByTestId("add-clue-btn-1"));
    expect((screen.getByTestId("clue-input-1") as HTMLInputElement).value).toBe("");
  });
});
