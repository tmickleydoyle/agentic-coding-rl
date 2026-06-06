import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Room Planner", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /room planner/i })).toBeTruthy();
  });

  it("shows seed rooms", () => {
    expect(screen.getByTestId("room-row-1")).toBeTruthy();
    expect(screen.getByTestId("room-row-5")).toBeTruthy();
  });

  it("shows total count of 5", () => {
    expect(screen.getByTestId("total-count").textContent).toContain("5");
  });

  it("shows total area of seed rooms", () => {
    // 14*16 + 18*22 + 12*14 + 10*12 + 11*13 = 224+396+168+120+143 = 1051
    expect(screen.getByTestId("total-area").textContent).toContain("1051");
  });

  it("displays area in sq ft", () => {
    expect(screen.getByTestId("room-area-1").textContent).toContain("sq ft");
    // 14*16 = 224
    expect(screen.getByTestId("room-area-1").textContent).toContain("224");
  });

  it("displays dimensions with x", () => {
    expect(screen.getByTestId("room-dimensions-1").textContent).toContain("14x16");
  });

  it("adds a new room", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Laundry Room");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByText("Laundry Room")).toBeTruthy();
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Laundry Room");
    await user.click(screen.getByTestId("btn-add"));
    expect(nameInput.value).toBe("");
  });

  it("does not add when name is empty", async () => {
    const user = userEvent.setup();
    const initialRows = screen.getAllByRole("row").length;
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getAllByRole("row").length).toBe(initialRows);
  });

  it("removes a room", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-remove-1"));
    expect(screen.queryByTestId("room-row-1")).toBeNull();
  });

  it("filters by type Bedroom", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-type"), "Bedroom");
    expect(screen.getByTestId("room-row-1")).toBeTruthy();
    expect(screen.getByTestId("room-row-5")).toBeTruthy();
    expect(screen.queryByTestId("room-row-2")).toBeNull();
  });

  it("filters by floor", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-floor"), "Floor 1");
    expect(screen.getByTestId("room-row-2")).toBeTruthy();
    expect(screen.getByTestId("room-row-3")).toBeTruthy();
    expect(screen.queryByTestId("room-row-1")).toBeNull();
  });

  it("summary unaffected by type filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-type"), "Kitchen");
    expect(screen.getByTestId("total-count").textContent).toContain("5");
    expect(screen.getByTestId("total-area").textContent).toContain("1051");
  });

  it("combined type and floor filter works", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-type"), "Bedroom");
    await user.selectOptions(screen.getByTestId("filter-floor"), "Floor 2");
    // Both Master Bedroom (id=1) and Guest Bedroom (id=5) are Bedroom on floor 2
    expect(screen.getByTestId("room-row-1")).toBeTruthy();
    expect(screen.getByTestId("room-row-5")).toBeTruthy();
    // Living Room (id=2) is on floor 1 and type Living, so not shown
    expect(screen.queryByTestId("room-row-2")).toBeNull();
  });

  it("shows notes for rooms with notes", () => {
    expect(screen.getByTestId("room-notes-1").textContent).toContain("walk-in closet");
  });
});
