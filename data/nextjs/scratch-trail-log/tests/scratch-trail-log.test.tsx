import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Trail Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /trail log/i })).toBeTruthy();
  });

  it("shows 5 trails initially", () => {
    const statTotal = screen.getByTestId("stat-total");
    expect(statTotal.textContent).toContain("5");
  });

  it("shows total miles for all trails", () => {
    const statMiles = screen.getByTestId("stat-miles");
    // 6.2 + 3.1 + 9.8 + 1.5 + 5.0 = 25.6
    expect(statMiles.textContent).toContain("25.6");
  });

  it("shows average rating", () => {
    const statAvg = screen.getByTestId("stat-avg-rating");
    // (5+4+4+3+5)/5 = 4.2
    expect(statAvg.textContent).toContain("4.2");
  });

  it("renders trail names from seed data", () => {
    expect(screen.getByTestId("trail-name-1").textContent).toBe("Eagle Peak");
    expect(screen.getByTestId("trail-name-2").textContent).toBe("River Loop");
  });

  it("displays distance with 1 decimal", () => {
    expect(screen.getByTestId("trail-distance-1").textContent).toContain("6.2");
  });

  it("displays star rating correctly", () => {
    // Eagle Peak: rating 5 = 5 filled
    const rating = screen.getByTestId("trail-rating-1");
    expect(rating.textContent).toBe("★★★★★");
  });

  it("filtering by Easy shows only easy trails", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("difficulty-filter"), "Easy");
    expect(screen.getByTestId("stat-total").textContent).toContain("2");
    expect(screen.queryByTestId("trail-1")).toBeNull();
    expect(screen.getByTestId("trail-2")).toBeTruthy();
  });

  it("shows No trails found when filter has no matches after deleting", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("difficulty-filter"), "Moderate");
    await user.click(screen.getByTestId("delete-5"));
    expect(screen.getByTestId("no-trails")).toBeTruthy();
  });

  it("deleting a trail removes it from the list", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-1"));
    expect(screen.queryByTestId("trail-1")).toBeNull();
    expect(screen.getByTestId("stat-total").textContent).toContain("4");
  });

  it("adding a trail with empty name does nothing", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("log-trail-btn"));
    expect(screen.getByTestId("stat-total").textContent).toContain("5");
  });

  it("adding a valid trail appends to list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("form-name"), "Lakeside Path");
    await user.type(screen.getByTestId("form-distance"), "4.5");
    await user.click(screen.getByTestId("log-trail-btn"));
    expect(screen.getByTestId("stat-total").textContent).toContain("6");
    expect(screen.getByText("Lakeside Path")).toBeTruthy();
  });

  it("form name clears after successful add", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("form-name") as HTMLInputElement;
    await user.type(input, "New Trail");
    await user.type(screen.getByTestId("form-distance"), "2.0");
    await user.click(screen.getByTestId("log-trail-btn"));
    expect(input.value).toBe("");
  });

  it("stats update after filter change", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("difficulty-filter"), "Hard");
    // Hard trails: Eagle Peak 6.2 + Summit Trail 9.8 = 16.0
    expect(screen.getByTestId("stat-miles").textContent).toContain("16.0");
  });
});
