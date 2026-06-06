import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Stamp Catalog", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByTestId("heading")).toHaveTextContent("Stamp Catalog");
  });

  it("renders seed stamps", () => {
    expect(screen.getByTestId("stamp-1")).toBeTruthy();
    expect(screen.getByTestId("stamp-name-1")).toHaveTextContent("Penny Black");
    expect(screen.getByTestId("stamp-3")).toBeTruthy();
  });

  it("shows stats with total and mint count", () => {
    const stats = screen.getByTestId("stats");
    expect(stats.textContent).toContain("5");
    expect(screen.getByTestId("count-mint")).toBeTruthy();
  });

  it("adds a new stamp", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Red Mercury");
    await user.type(screen.getByTestId("input-country"), "Germany");
    await user.type(screen.getByTestId("input-year"), "1900");
    await user.type(screen.getByTestId("input-denomination"), "5pf");
    await user.selectOptions(screen.getByTestId("select-condition"), "Good");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("stamp-6")).toBeTruthy();
    expect(screen.getByTestId("stamp-name-6")).toHaveTextContent("Red Mercury");
  });

  it("clears the form after adding", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    await user.type(nameInput, "Test Stamp");
    await user.type(screen.getByTestId("input-country"), "France");
    await user.type(screen.getByTestId("input-year"), "1900");
    await user.type(screen.getByTestId("input-denomination"), "1c");
    await user.click(screen.getByTestId("btn-add"));
    expect(nameInput.value).toBe("");
  });

  it("shows error when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-country"), "France");
    await user.type(screen.getByTestId("input-year"), "1900");
    await user.type(screen.getByTestId("input-denomination"), "1c");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Name is required");
  });

  it("shows error when country is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Stamp");
    await user.type(screen.getByTestId("input-year"), "1900");
    await user.type(screen.getByTestId("input-denomination"), "1c");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Country is required");
  });

  it("shows error when year is out of range", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Stamp");
    await user.type(screen.getByTestId("input-country"), "Italy");
    await user.type(screen.getByTestId("input-year"), "1800");
    await user.type(screen.getByTestId("input-denomination"), "1c");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("form-error")).toHaveTextContent("Year must be between 1840 and 2100");
  });

  it("upgrades condition from Poor to Good", async () => {
    const user = userEvent.setup();
    // stamp-3 is Blue Mauritius with Poor condition
    await user.click(screen.getByTestId("btn-upgrade-3"));
    expect(screen.getByTestId("stamp-3").textContent).toContain("Good");
  });

  it("hides upgrade button for Mint stamps", () => {
    // stamp-1 is Mint
    expect(screen.queryByTestId("btn-upgrade-1")).toBeNull();
  });

  it("deletes a stamp", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-2"));
    expect(screen.queryByTestId("stamp-2")).toBeNull();
  });

  it("filters by country (case-insensitive partial match)", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("filter-country"), "united");
    expect(screen.getByTestId("stamp-1")).toBeTruthy(); // United Kingdom
    expect(screen.getByTestId("stamp-2")).toBeTruthy(); // United States
    expect(screen.queryByTestId("stamp-3")).toBeNull(); // Mauritius
  });

  it("filters by condition", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-condition"), "Fine");
    expect(screen.getByTestId("stamp-2")).toBeTruthy();
    expect(screen.queryByTestId("stamp-1")).toBeNull();
  });

  it("stats reflect all stamps regardless of filters", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-condition"), "Mint");
    const stats = screen.getByTestId("stats");
    expect(stats.textContent).toContain("5");
  });
});
