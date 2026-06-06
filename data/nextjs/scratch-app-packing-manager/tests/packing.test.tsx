import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home counts", () => {
  it("shows list count", () => {
    render(<App />);
    expect(screen.getByTestId("home-list-count").textContent).toBe("2");
  });

  it("shows total item count", () => {
    render(<App />);
    expect(screen.getByTestId("home-item-count").textContent).toBe("5");
  });

  it("shows checked item count", () => {
    render(<App />);
    expect(screen.getByTestId("home-checked-count").textContent).toBe("2");
  });
});

describe("Lists page", () => {
  it("shows 2 list cards", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-lists"));
    expect(screen.getAllByTestId("list-card").length).toBe(2);
  });

  it("shows trip name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-lists"));
    const names = screen.getAllByTestId("list-name").map((el) => el.textContent);
    expect(names).toContain("Japan Trip");
  });

  it("shows item count per list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-lists"));
    const counts = screen.getAllByTestId("list-item-count").map((el) => el.textContent);
    expect(counts[0]).toBe("3");
  });
});

describe("Add list", () => {
  it("adds a new list and navigates", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-list"));
    fireEvent.change(screen.getByTestId("input-trip-name"), { target: { value: "Bali Surf" } });
    fireEvent.change(screen.getByTestId("input-destination"), { target: { value: "Bali" } });
    fireEvent.change(screen.getByTestId("input-departure-date"), { target: { value: "2024-08-01" } });
    fireEvent.click(screen.getByTestId("submit-list"));
    expect(screen.getByTestId("lists-page")).toBeTruthy();
    expect(screen.getAllByTestId("list-card").length).toBe(3);
  });
});

describe("Checklist", () => {
  it("shows all 5 items", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-checklist"));
    expect(screen.getAllByTestId("checklist-item").length).toBe(5);
  });

  it("filter-checked shows only checked items", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-checklist"));
    fireEvent.click(screen.getByTestId("filter-checked"));
    expect(screen.getAllByTestId("checklist-item").length).toBe(2);
  });

  it("filter-all restores all items", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-checklist"));
    fireEvent.click(screen.getByTestId("filter-checked"));
    fireEvent.click(screen.getByTestId("filter-all"));
    expect(screen.getAllByTestId("checklist-item").length).toBe(5);
  });

  it("shows checked status as yes/no", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-checklist"));
    const statuses = screen.getAllByTestId("checklist-item-checked").map((el) => el.textContent);
    expect(statuses).toContain("yes");
    expect(statuses).toContain("no");
  });
});
