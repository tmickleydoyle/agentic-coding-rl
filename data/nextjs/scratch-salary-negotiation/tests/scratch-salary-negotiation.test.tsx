import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Salary Negotiation Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByText("Salary Negotiation Tracker")).toBeTruthy();
  });

  it("shows active company and role", () => {
    expect(screen.getByTestId("active-company").textContent).toBe("TechCorp");
    expect(screen.getByTestId("active-role").textContent).toBe("Senior Engineer");
  });

  it("shows initial offer and target salary", () => {
    expect(screen.getByTestId("initial-offer").textContent).toBe("130000");
    expect(screen.getByTestId("target-salary").textContent).toBe("155000");
  });

  it("shows deadline", () => {
    expect(screen.getByTestId("deadline").textContent).toBe("2024-02-15");
  });

  it("renders all 3 seed rounds", () => {
    expect(screen.getByTestId("round-card-1")).toBeTruthy();
    expect(screen.getByTestId("round-card-2")).toBeTruthy();
    expect(screen.getByTestId("round-card-3")).toBeTruthy();
  });

  it("shows correct status for round 3", () => {
    expect(screen.getByTestId("round-status-3").textContent).toBe("Accepted");
  });

  it("gap reflects latest counter (round 3 counter = 155000, gap = 0)", () => {
    expect(screen.getByTestId("gap").textContent).toBe("0");
  });

  it("renders tactics library", () => {
    expect(screen.getByTestId("tactic-0")).toBeTruthy();
    expect(screen.getByTestId("tactic-3")).toBeTruthy();
  });

  it("copy tactic populates tactic input", async () => {
    fireEvent.click(screen.getByTestId("copy-tactic-2"));
    const tacticInput = screen.getByTestId("input-round-tactic") as HTMLInputElement;
    expect(tacticInput.value).toBe("Request signing bonus as a compromise");
  });

  it("adds a new negotiation round", async () => {
    await userEvent.type(screen.getByTestId("input-round-offer"), "148000");
    await userEvent.type(screen.getByTestId("input-round-counter"), "158000");
    fireEvent.click(screen.getByTestId("add-round-btn"));
    expect(screen.getByTestId("round-card-4")).toBeTruthy();
  });

  it("does not add round with empty offer", async () => {
    await userEvent.type(screen.getByTestId("input-round-counter"), "158000");
    fireEvent.click(screen.getByTestId("add-round-btn"));
    expect(screen.queryByTestId("round-card-4")).toBeNull();
  });

  it("deletes a round", async () => {
    fireEvent.click(screen.getByTestId("delete-round-1"));
    expect(screen.queryByTestId("round-card-1")).toBeNull();
  });

  it("changes round status via select", async () => {
    const select = screen.getByTestId("status-select-1");
    await userEvent.selectOptions(select, "Rejected");
    expect(screen.getByTestId("round-status-1").textContent).toBe("Rejected");
  });

  it("renders progress bar", () => {
    expect(screen.getByTestId("progress-bar")).toBeTruthy();
  });
});
