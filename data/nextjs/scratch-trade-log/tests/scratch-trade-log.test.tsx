import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Trade Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders app title", () => {
    expect(screen.getByTestId("app-title").textContent).toContain("Trade Log");
  });

  it("shows initial trade count of 3", () => {
    expect(screen.getByTestId("trade-count").textContent).toContain("3");
  });

  it("renders all 3 initial trade rows", () => {
    expect(screen.getByTestId("trade-row-1")).toBeTruthy();
    expect(screen.getByTestId("trade-row-2")).toBeTruthy();
    expect(screen.getByTestId("trade-row-3")).toBeTruthy();
  });

  it("shows correct date for trade 1", () => {
    expect(screen.getByTestId("trade-date-1").textContent).toContain("2024-09-15");
  });

  it("shows players gave for trade 1", () => {
    expect(screen.getByTestId("trade-gave-1").textContent).toContain("Patrick Mahomes");
  });

  it("shows players got for trade 1", () => {
    expect(screen.getByTestId("trade-got-1").textContent).toContain("Justin Jefferson");
  });

  it("shows opponent for trade 2", () => {
    expect(screen.getByTestId("trade-opponent-2").textContent).toContain("Team Alpha");
  });

  it("shows status badge for trade 3 as Pending", () => {
    expect(screen.getByTestId("trade-status-3").textContent).toBe("Pending");
  });

  it("filters trades by Accepted status", () => {
    fireEvent.change(screen.getByTestId("status-filter"), { target: { value: "Accepted" } });
    expect(screen.getByTestId("trade-row-1")).toBeTruthy();
    expect(screen.getByTestId("trade-row-2")).toBeTruthy();
    expect(screen.queryByTestId("trade-row-3")).toBeNull();
  });

  it("updates trade count after filtering", () => {
    fireEvent.change(screen.getByTestId("status-filter"), { target: { value: "Pending" } });
    expect(screen.getByTestId("trade-count").textContent).toContain("1");
  });

  it("adds a new trade via form submission", () => {
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-10-10" } });
    fireEvent.change(screen.getByTestId("input-gave"), { target: { value: "Cooper Kupp" } });
    fireEvent.change(screen.getByTestId("input-opponent"), { target: { value: "Team Delta" } });
    fireEvent.change(screen.getByTestId("input-got"), { target: { value: "Alvin Kamara" } });
    fireEvent.change(screen.getByTestId("input-status"), { target: { value: "Accepted" } });
    fireEvent.submit(screen.getByTestId("trade-form"));
    expect(screen.getByTestId("trade-count").textContent).toContain("4");
  });

  it("clears form after submission", () => {
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-10-10" } });
    fireEvent.change(screen.getByTestId("input-gave"), { target: { value: "Cooper Kupp" } });
    fireEvent.change(screen.getByTestId("input-opponent"), { target: { value: "Team Delta" } });
    fireEvent.change(screen.getByTestId("input-got"), { target: { value: "Alvin Kamara" } });
    fireEvent.submit(screen.getByTestId("trade-form"));
    const gaveInput = screen.getByTestId("input-gave") as HTMLInputElement;
    expect(gaveInput.value).toBe("");
  });

  it("does not add trade when players gave is empty", () => {
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-10-10" } });
    fireEvent.change(screen.getByTestId("input-opponent"), { target: { value: "Team Delta" } });
    fireEvent.change(screen.getByTestId("input-got"), { target: { value: "Alvin Kamara" } });
    fireEvent.submit(screen.getByTestId("trade-form"));
    expect(screen.getByTestId("trade-count").textContent).toContain("3");
  });
});
