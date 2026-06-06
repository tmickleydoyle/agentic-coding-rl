import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Property Compare", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /property compare/i })).toBeTruthy();
  });

  it("renders all 5 property options", () => {
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`property-option-${i}`)).toBeTruthy();
    }
  });

  it("compare table is hidden when nothing selected", () => {
    expect(screen.queryByTestId("compare-table")).toBeNull();
  });

  it("compare table appears when one property is selected", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("123 Maple St"));
    expect(screen.getByTestId("compare-table")).toBeTruthy();
  });

  it("shows selected property details in table", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("123 Maple St"));
    const table = screen.getByTestId("compare-table");
    expect(table.textContent).toContain("123 Maple St");
    expect(table.textContent).toContain("$450,000");
  });

  it("shows HOA as None when hoa is 0", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("123 Maple St"));
    const table = screen.getByTestId("compare-table");
    expect(table.textContent).toContain("None");
  });

  it("shows formatted HOA when hoa > 0", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("456 Oak Ave"));
    const table = screen.getByTestId("compare-table");
    expect(table.textContent).toContain("$250");
  });

  it("allows up to 3 properties to be selected", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("123 Maple St"));
    await user.click(screen.getByLabelText("456 Oak Ave"));
    await user.click(screen.getByLabelText("789 Pine Rd"));
    const table = screen.getByTestId("compare-table");
    expect(table.querySelectorAll("thead tr th").length).toBe(4); // Feature + 3 properties
  });

  it("disables unselected checkboxes after 3 selected", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("123 Maple St"));
    await user.click(screen.getByLabelText("456 Oak Ave"));
    await user.click(screen.getByLabelText("789 Pine Rd"));
    const elmCheckbox = screen.getByLabelText("101 Elm Blvd");
    expect((elmCheckbox as HTMLInputElement).disabled).toBe(true);
  });

  it("clears all selections on Clear All click", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("123 Maple St"));
    await user.click(screen.getByTestId("clear-all"));
    expect(screen.queryByTestId("compare-table")).toBeNull();
  });

  it("re-enables checkboxes after clearing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("123 Maple St"));
    await user.click(screen.getByLabelText("456 Oak Ave"));
    await user.click(screen.getByLabelText("789 Pine Rd"));
    await user.click(screen.getByTestId("clear-all"));
    const elmCheckbox = screen.getByLabelText("101 Elm Blvd");
    expect((elmCheckbox as HTMLInputElement).disabled).toBe(false);
  });

  it("shows year built in comparison table", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("123 Maple St"));
    const table = screen.getByTestId("compare-table");
    expect(table.textContent).toContain("1998");
  });
});
