import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Location Scout", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /location scout/i })).toBeTruthy();
  });

  it("shows 3 locations on load", () => {
    expect(screen.getByTestId("location-count").textContent).toContain("3");
  });

  it("shows avg rating on load", () => {
    expect(screen.getByTestId("avg-rating").textContent).toContain("4.0");
  });

  it("renders all seed locations", () => {
    expect(screen.getByTestId("location-1")).toBeTruthy();
    expect(screen.getByTestId("location-2")).toBeTruthy();
    expect(screen.getByTestId("location-3")).toBeTruthy();
  });

  it("displays rating for seed location", () => {
    expect(screen.getByTestId("location-rating-1").textContent).toBe("5");
  });

  it("displays access type for seed location", () => {
    expect(screen.getByTestId("location-access-2").textContent).toBe("Permit");
  });

  it("adds a new location", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "City Park");
    await user.type(screen.getByTestId("input-address"), "1 Park Ave");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "4");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("location-count").textContent).toContain("4");
    expect(screen.getByText("City Park")).toBeTruthy();
  });

  it("does not submit with rating 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Bad Place");
    await user.type(screen.getByTestId("input-address"), "Nowhere");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "0");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("location-count").textContent).toContain("3");
  });

  it("does not submit with rating 6", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "Bad Place");
    await user.type(screen.getByTestId("input-address"), "Nowhere");
    await user.clear(screen.getByTestId("input-rating"));
    await user.type(screen.getByTestId("input-rating"), "6");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("location-count").textContent).toContain("3");
  });

  it("deletes a location", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("location-1")).toBeNull();
    expect(screen.getByTestId("location-count").textContent).toContain("2");
  });

  it("shows avg rating dash when all deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    await user.click(screen.getByTestId("delete-2"));
    await user.click(screen.getByTestId("delete-3"));
    expect(screen.getByTestId("avg-rating").textContent).toContain("—");
  });

  it("sort button toggles text", async () => {
    const user = userEvent.setup();
    expect(screen.getByTestId("sort-btn").textContent).toContain("Sort by Rating");
    await user.click(screen.getByTestId("sort-btn"));
    expect(screen.getByTestId("sort-btn").textContent).toContain("Sort by Default");
  });

  it("sort by rating puts highest first", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("sort-btn"));
    const items = screen.getByTestId("location-list").querySelectorAll("li");
    const firstRating = items[0].querySelector("[data-testid^='location-rating-']");
    expect(firstRating?.textContent).toBe("5");
  });
});
