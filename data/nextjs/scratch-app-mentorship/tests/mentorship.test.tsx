import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Dashboard", () => {
  it("shows active mentor count", () => {
    render(<App />);
    expect(screen.getByTestId("mentor-count").textContent).toBe("2");
  });

  it("shows upcoming session count", () => {
    render(<App />);
    expect(screen.getByTestId("upcoming-count").textContent).toBe("1");
  });

  it("shows goals progress", () => {
    render(<App />);
    expect(screen.getByTestId("goals-progress").textContent).toBe("1/3 completed");
  });
});

describe("Mentors page", () => {
  it("lists all mentors", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-mentors"));
    const items = screen.getAllByTestId("mentor-item");
    expect(items.length).toBe(3);
  });

  it("adds a new mentor", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-mentors"));
    fireEvent.change(screen.getByTestId("mentor-name-input"), { target: { value: "New Mentor" } });
    fireEvent.change(screen.getByTestId("mentor-specialty-input"), { target: { value: "Product" } });
    fireEvent.change(screen.getByTestId("mentor-email-input"), { target: { value: "new@mentor.com" } });
    fireEvent.click(screen.getByTestId("add-mentor-btn"));
    const items = screen.getAllByTestId("mentor-item");
    expect(items.length).toBe(4);
  });

  it("filters by specialty", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-mentors"));
    fireEvent.change(screen.getByTestId("specialty-filter"), { target: { value: "Design" } });
    const items = screen.getAllByTestId("mentor-item");
    expect(items.length).toBe(1);
  });
});

describe("Goals page", () => {
  it("shows all goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    const items = screen.getAllByTestId("goal-item");
    expect(items.length).toBe(3);
  });

  it("filters incomplete goals", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.click(screen.getByTestId("filter-incomplete"));
    const items = screen.getAllByTestId("goal-item");
    expect(items.length).toBe(2);
  });

  it("toggles goal completion", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-goals"));
    fireEvent.click(screen.getByTestId("filter-incomplete"));
    const checkboxes = screen.getAllByTestId("goal-complete");
    fireEvent.click(checkboxes[0]);
    const items = screen.getAllByTestId("goal-item");
    expect(items.length).toBe(1);
  });
});
