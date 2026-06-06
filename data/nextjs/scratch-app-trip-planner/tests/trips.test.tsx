import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home counts", () => {
  it("shows planned count", () => {
    render(<App />);
    expect(screen.getByTestId("home-planned-count").textContent).toBe("1");
  });

  it("shows active count", () => {
    render(<App />);
    expect(screen.getByTestId("home-active-count").textContent).toBe("1");
  });

  it("shows done count", () => {
    render(<App />);
    expect(screen.getByTestId("home-done-count").textContent).toBe("1");
  });
});

describe("Trips list", () => {
  it("renders 3 trip cards", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trips"));
    expect(screen.getAllByTestId("trip-card").length).toBe(3);
  });

  it("shows trip name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trips"));
    const names = screen.getAllByTestId("trip-name").map((el) => el.textContent);
    expect(names).toContain("Spring Break");
  });

  it("shows trip status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trips"));
    const statuses = screen.getAllByTestId("trip-status").map((el) => el.textContent);
    expect(statuses).toContain("done");
  });

  it("shows trip dates", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-trips"));
    const dates = screen.getAllByTestId("trip-dates").map((el) => el.textContent);
    expect(dates[0]).toContain("to");
  });
});

describe("New trip form", () => {
  it("adds a trip and navigates to trips", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-new-trip"));
    fireEvent.change(screen.getByTestId("input-name"), { target: { value: "Winter Escape" } });
    fireEvent.change(screen.getByTestId("input-destination"), { target: { value: "Vienna" } });
    fireEvent.change(screen.getByTestId("input-start-date"), { target: { value: "2024-12-20" } });
    fireEvent.change(screen.getByTestId("input-end-date"), { target: { value: "2024-12-28" } });
    fireEvent.click(screen.getByTestId("submit-trip"));
    expect(screen.getByTestId("trips-page")).toBeTruthy();
    expect(screen.getAllByTestId("trip-card").length).toBe(4);
  });

  it("shows error when end date is before start date", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-new-trip"));
    fireEvent.change(screen.getByTestId("input-start-date"), { target: { value: "2024-12-28" } });
    fireEvent.change(screen.getByTestId("input-end-date"), { target: { value: "2024-12-20" } });
    fireEvent.click(screen.getByTestId("submit-trip"));
    expect(screen.getByTestId("form-error")).toBeTruthy();
  });
});

describe("Calendar", () => {
  it("shows all trips", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-calendar"));
    expect(screen.getAllByTestId("calendar-trip").length).toBe(3);
  });

  it("shows trip range with arrow", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-calendar"));
    const ranges = screen.getAllByTestId("calendar-trip-range").map((el) => el.textContent);
    expect(ranges[0]).toContain("→");
  });

  it("sorts trips by start date", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-calendar"));
    const names = screen.getAllByTestId("calendar-trip-name").map((el) => el.textContent);
    expect(names[0]).toBe("Spring Break");
  });
});
