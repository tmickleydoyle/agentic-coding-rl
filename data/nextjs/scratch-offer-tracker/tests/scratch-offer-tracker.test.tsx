import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Offer Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /offer tracker/i })).toBeTruthy();
  });

  it("shows 3 pre-loaded offer cards", () => {
    expect(screen.getByTestId("offer-card-1")).toBeTruthy();
    expect(screen.getByTestId("offer-card-2")).toBeTruthy();
    expect(screen.getByTestId("offer-card-3")).toBeTruthy();
  });

  it("shows total offers as 3", () => {
    expect(screen.getByTestId("total-offers").textContent).toContain("3");
  });

  it("shows accepted count as 1", () => {
    expect(screen.getByTestId("accepted-count").textContent).toContain("1");
  });

  it("shows average offer price", () => {
    const avg = screen.getByTestId("avg-offer").textContent;
    expect(avg).toContain("$");
  });

  it("shows status badge for each offer", () => {
    expect(screen.getByTestId("status-badge-1").textContent).toBe("Pending");
    expect(screen.getByTestId("status-badge-2").textContent).toBe("Rejected");
    expect(screen.getByTestId("status-badge-3").textContent).toBe("Accepted");
  });

  it("shows price diff over ask for offer 1", () => {
    expect(screen.getByTestId("price-diff-1").textContent).toContain("over ask");
  });

  it("shows price diff under ask for offer 2", () => {
    expect(screen.getByTestId("price-diff-2").textContent).toContain("under ask");
  });

  it("filters by Accepted status", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Accepted"));
    expect(screen.queryByTestId("offer-card-1")).toBeNull();
    expect(screen.getByTestId("offer-card-3")).toBeTruthy();
  });

  it("active filter label updates on click", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Rejected"));
    expect(screen.getByTestId("active-filter").textContent).toContain("Rejected");
  });

  it("adds a new offer", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Address"), "555 New Blvd");
    await user.type(screen.getByLabelText("Offer Price"), "500000");
    await user.type(screen.getByLabelText("List Price"), "495000");
    await user.type(screen.getByLabelText("Date"), "2024-04-01");
    await user.click(screen.getByRole("button", { name: /add offer/i }));
    expect(screen.getByTestId("offer-card-4")).toBeTruthy();
  });

  it("shows form error when required fields missing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add offer/i }));
    expect(screen.getByTestId("form-error").textContent).toContain("Please fill in all required fields");
  });

  it("deletes an offer", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-offer-1"));
    expect(screen.queryByTestId("offer-card-1")).toBeNull();
  });

  it("stats do not change when filter is applied", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-Accepted"));
    expect(screen.getByTestId("total-offers").textContent).toContain("3");
  });
});
