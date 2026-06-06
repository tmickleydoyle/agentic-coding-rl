import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Offer Comparison", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByText("Offer Comparison")).toBeTruthy();
  });

  it("renders all 3 seed offer cards", () => {
    expect(screen.getByTestId("offer-card-1")).toBeTruthy();
    expect(screen.getByTestId("offer-card-2")).toBeTruthy();
    expect(screen.getByTestId("offer-card-3")).toBeTruthy();
  });

  it("calculates total comp for offer 1 correctly", () => {
    // 150000 + 15000 + 50000/4 + 12000 = 189500
    expect(screen.getByTestId("total-comp-1").textContent).toBe("189500");
  });

  it("calculates total comp for offer 2 correctly", () => {
    // 170000 + 20000 + 80000/4 + 10000 = 220000
    expect(screen.getByTestId("total-comp-2").textContent).toBe("220000");
  });

  it("calculates total comp for offer 3 correctly", () => {
    // 160000 + 25000 + 100000/4 + 15000 = 225000
    expect(screen.getByTestId("total-comp-3").textContent).toBe("225000");
  });

  it("shows correct ranking — offer 3 is rank 1", () => {
    expect(screen.getByTestId("rank-3").textContent).toBe("1");
  });

  it("shows best offer as Gamma LLC", () => {
    expect(screen.getByTestId("best-offer").textContent).toBe("Gamma LLC");
  });

  it("renders comparison table", () => {
    expect(screen.getByTestId("comparison-table")).toBeTruthy();
  });

  it("adds a new offer", async () => {
    await userEvent.type(screen.getByTestId("input-offer-company"), "NewCo");
    await userEvent.type(screen.getByTestId("input-offer-role"), "Engineer");
    fireEvent.click(screen.getByTestId("add-offer-btn"));
    expect(screen.getByTestId("offer-card-4")).toBeTruthy();
  });

  it("does not add offer with empty company", async () => {
    await userEvent.type(screen.getByTestId("input-offer-role"), "Engineer");
    fireEvent.click(screen.getByTestId("add-offer-btn"));
    expect(screen.queryByTestId("offer-card-4")).toBeNull();
  });

  it("deletes an offer and updates best", async () => {
    fireEvent.click(screen.getByTestId("delete-offer-3"));
    expect(screen.queryByTestId("offer-card-3")).toBeNull();
    // After deleting Gamma LLC (rank 1), Beta Inc becomes best
    expect(screen.getByTestId("best-offer").textContent).toBe("Beta Inc");
  });

  it("shows None as best offer when all deleted", async () => {
    fireEvent.click(screen.getByTestId("delete-offer-1"));
    fireEvent.click(screen.getByTestId("delete-offer-2"));
    fireEvent.click(screen.getByTestId("delete-offer-3"));
    expect(screen.getByTestId("best-offer").textContent).toBe("None");
  });

  it("recalculates ranks after deletion", async () => {
    fireEvent.click(screen.getByTestId("delete-offer-3"));
    // Beta Inc (220000) should now be rank 1
    expect(screen.getByTestId("rank-2").textContent).toBe("1");
  });
});
