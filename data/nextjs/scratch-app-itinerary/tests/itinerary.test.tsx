import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home", () => {
  it("shows total days", () => {
    render(<App />);
    expect(screen.getByTestId("home-total-days").textContent).toBe("3");
  });

  it("shows total activities", () => {
    render(<App />);
    expect(screen.getByTestId("home-total-activities").textContent).toBe("5");
  });

  it("shows total cost", () => {
    render(<App />);
    // 0+0+25+80+0 = 105
    expect(screen.getByTestId("home-total-cost").textContent).toBe("105");
  });
});

describe("Schedule", () => {
  it("shows 3 day groups", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    expect(screen.getAllByTestId("day-group").length).toBe(3);
  });

  it("shows day labels", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    const labels = screen.getAllByTestId("day-label").map((el) => el.textContent);
    expect(labels).toContain("Day 1");
    expect(labels).toContain("Day 3");
  });

  it("shows all 5 activity cards", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    expect(screen.getAllByTestId("activity-card").length).toBe(5);
  });

  it("shows activity title", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-schedule"));
    const titles = screen.getAllByTestId("activity-title").map((el) => el.textContent);
    expect(titles).toContain("Fushimi Inari");
  });
});

describe("Add Activity", () => {
  it("adds activity and navigates to schedule", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-activity"));
    fireEvent.change(screen.getByTestId("input-day"), { target: { value: "4" } });
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "Nishiki Market" } });
    fireEvent.change(screen.getByTestId("input-location"), { target: { value: "Kyoto" } });
    fireEvent.click(screen.getByTestId("submit-activity"));
    expect(screen.getByTestId("schedule-page")).toBeTruthy();
    expect(screen.getAllByTestId("activity-card").length).toBe(6);
  });
});

describe("Map View", () => {
  it("shows 2 location groups", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-map-view"));
    expect(screen.getAllByTestId("location-group").length).toBe(2);
  });

  it("shows Tokyo with 4 activities", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-map-view"));
    const names = screen.getAllByTestId("location-name").map((el) => el.textContent);
    const counts = screen.getAllByTestId("location-activity-count").map((el) => el.textContent);
    const tokyoIdx = names.indexOf("Tokyo");
    expect(counts[tokyoIdx]).toBe("4");
  });

  it("shows Kyoto with 1 activity", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-map-view"));
    const names = screen.getAllByTestId("location-name").map((el) => el.textContent);
    const counts = screen.getAllByTestId("location-activity-count").map((el) => el.textContent);
    const kyotoIdx = names.indexOf("Kyoto");
    expect(counts[kyotoIdx]).toBe("1");
  });
});
