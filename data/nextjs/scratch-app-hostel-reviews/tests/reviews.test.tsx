import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home", () => {
  it("shows review count", () => {
    render(<App />);
    expect(screen.getByTestId("home-review-count").textContent).toBe("3");
  });

  it("shows average rating", () => {
    render(<App />);
    // avg = (5+4+2)/3 = 11/3 = 3.7
    expect(screen.getByTestId("home-avg-rating").textContent).toBe("3.7");
  });
});

describe("Reviews list", () => {
  it("shows 3 review cards", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reviews"));
    expect(screen.getAllByTestId("review-card").length).toBe(3);
  });

  it("shows hostel name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reviews"));
    const names = screen.getAllByTestId("review-hostel").map((el) => el.textContent);
    expect(names).toContain("Sakura Hostel");
  });
});

describe("Add review", () => {
  it("adds review and navigates", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-review"));
    fireEvent.change(screen.getByTestId("input-hostel-name"), { target: { value: "Ocean View" } });
    fireEvent.change(screen.getByTestId("input-city"), { target: { value: "Lisbon" } });
    fireEvent.change(screen.getByTestId("input-country"), { target: { value: "Portugal" } });
    fireEvent.change(screen.getByTestId("input-rating"), { target: { value: "4" } });
    fireEvent.change(screen.getByTestId("input-date"), { target: { value: "2024-06-01" } });
    fireEvent.click(screen.getByTestId("submit-review"));
    expect(screen.getByTestId("reviews-page")).toBeTruthy();
    expect(screen.getAllByTestId("review-card").length).toBe(4);
  });
});

describe("Top rated", () => {
  it("shows 2 top-rated cards (rating >= 4)", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-top-rated"));
    expect(screen.getAllByTestId("top-card").length).toBe(2);
  });

  it("first card is highest rated", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-top-rated"));
    const hostels = screen.getAllByTestId("top-hostel").map((el) => el.textContent);
    expect(hostels[0]).toBe("Sakura Hostel");
  });

  it("excludes Budget Inn (rating 2)", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-top-rated"));
    const hostels = screen.getAllByTestId("top-hostel").map((el) => el.textContent);
    expect(hostels).not.toContain("Budget Inn");
  });
});
