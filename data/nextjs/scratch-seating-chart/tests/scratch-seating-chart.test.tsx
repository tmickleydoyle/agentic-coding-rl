import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Seating Chart", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /seating chart/i })).toBeTruthy();
  });

  it("shows correct summary", () => {
    const summary = screen.getByTestId("seating-summary");
    // Total seats: 6+8+8+6=28, Assigned: 5, Unassigned: 3
    expect(summary.textContent).toMatch(/Total Seats: 28/);
    expect(summary.textContent).toMatch(/Assigned: 5/);
    expect(summary.textContent).toMatch(/Unassigned: 3/);
  });

  it("shows unassigned guests section", () => {
    expect(screen.getByTestId("unassigned-section")).toBeTruthy();
    expect(screen.getByTestId("unassigned-guest-2")).toBeTruthy();
    expect(screen.getByTestId("unassigned-guest-5")).toBeTruthy();
    expect(screen.getByTestId("unassigned-guest-8")).toBeTruthy();
  });

  it("does not show assigned guests in unassigned section", () => {
    expect(screen.queryByTestId("unassigned-guest-1")).toBeNull();
    expect(screen.queryByTestId("unassigned-guest-4")).toBeNull();
  });

  it("renders all table cards", () => {
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByTestId(`table-card-${i}`)).toBeTruthy();
    }
  });

  it("shows correct table headings with counts", () => {
    expect(screen.getByTestId("table-heading-1").textContent).toMatch(/Head Table \(2\/6\)/);
    expect(screen.getByTestId("table-heading-2").textContent).toMatch(/Family Table \(2\/8\)/);
  });

  it("shows assigned guests in correct table", () => {
    expect(screen.getByTestId("table-guest-1-1")).toBeTruthy(); // Alice at Head Table
    expect(screen.getByTestId("table-guest-1-3")).toBeTruthy(); // Carol at Head Table
    expect(screen.getByTestId("table-guest-2-4")).toBeTruthy(); // David at Family Table
  });

  it("assigns an unassigned guest to a table", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("assign-select-2"), "2");
    await user.click(screen.getByTestId("assign-btn-2"));
    expect(screen.queryByTestId("unassigned-guest-2")).toBeNull();
    expect(screen.getByTestId("table-guest-2-2")).toBeTruthy();
    expect(screen.getByTestId("seating-summary").textContent).toMatch(/Assigned: 6/);
  });

  it("removes a guest from a table back to unassigned", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("remove-btn-1"));
    expect(screen.getByTestId("unassigned-guest-1")).toBeTruthy();
    expect(screen.queryByTestId("table-guest-1-1")).toBeNull();
    expect(screen.getByTestId("seating-summary").textContent).toMatch(/Assigned: 4/);
  });

  it("updates table heading count after assign", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("assign-select-2"), "3");
    await user.click(screen.getByTestId("assign-btn-2"));
    expect(screen.getByTestId("table-heading-3").textContent).toMatch(/Friends Table \(2\/8\)/);
  });

  it("shows add table form when button clicked", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-table-btn"));
    expect(screen.getByTestId("table-form")).toBeTruthy();
  });

  it("adds a new table", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-table-btn"));
    await user.type(screen.getByLabelText(/table name/i), "VIP Table");
    await user.type(screen.getByLabelText(/capacity/i), "4");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.getByTestId("table-card-5")).toBeTruthy();
    expect(screen.getByTestId("seating-summary").textContent).toMatch(/Total Seats: 32/);
  });

  it("cancel table form does not add table", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-table-btn"));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByTestId("table-form")).toBeNull();
    expect(screen.queryByTestId("table-card-5")).toBeNull();
  });

  it("does not add table with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("add-table-btn"));
    await user.type(screen.getByLabelText(/capacity/i), "4");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(screen.queryByTestId("table-card-5")).toBeNull();
  });
});
