import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home stats", () => {
  it("shows entry count on home", () => {
    render(<App />);
    expect(screen.getByTestId("home-entry-count").textContent).toBe("3");
  });

  it("shows country count on home", () => {
    render(<App />);
    expect(screen.getByTestId("home-country-count").textContent).toBe("2");
  });
});

describe("Journal list", () => {
  it("renders entry cards", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-journal"));
    expect(screen.getAllByTestId("entry-card").length).toBe(3);
  });

  it("shows entry title", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-journal"));
    const titles = screen.getAllByTestId("entry-title").map((el) => el.textContent);
    expect(titles).toContain("Arrival in Tokyo");
  });

  it("shows entry country", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-journal"));
    const countries = screen.getAllByTestId("entry-country").map((el) => el.textContent);
    expect(countries).toContain("Japan");
  });
});

describe("New entry form", () => {
  it("adds a new entry and navigates to journal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-new-entry"));
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "Paris Day 1" } });
    fireEvent.change(screen.getByTestId("input-country"), { target: { value: "France" } });
    fireEvent.change(screen.getByTestId("input-city"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-06-01" } });
    fireEvent.change(screen.getByTestId("input-body"), { target: { value: "Great day!" } });
    fireEvent.change(screen.getByTestId("input-rating"), { target: { value: "5" } });
    fireEvent.click(screen.getByTestId("submit-entry"));
    expect(screen.getByTestId("journal-page")).toBeTruthy();
    expect(screen.getAllByTestId("entry-card").length).toBe(4);
  });
});

describe("Stats", () => {
  it("shows total entries", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stat-total-entries").textContent).toBe("3");
  });

  it("shows sorted unique countries", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stat-countries").textContent).toBe("Italy, Japan");
  });

  it("shows average rating", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stat-avg-rating").textContent).toBe("4.0");
  });

  it("shows top mood", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-stats"));
    expect(screen.getByTestId("stat-top-mood").textContent).toBe("happy");
  });
});
