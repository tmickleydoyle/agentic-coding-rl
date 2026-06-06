import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Dashboard", () => {
  it("shows skill count", () => {
    render(<App />);
    expect(screen.getByTestId("skill-count").textContent).toBe("3");
  });

  it("shows total hours logged", () => {
    render(<App />);
    expect(screen.getByTestId("hours-this-week").textContent).toBe("6");
  });

  it("shows advanced skill count", () => {
    render(<App />);
    expect(screen.getByTestId("advanced-count").textContent).toBe("1");
  });
});

describe("Skills page", () => {
  it("lists all skills", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-skills"));
    const items = screen.getAllByTestId("skill-item");
    expect(items.length).toBe(3);
  });

  it("filters by category", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-skills"));
    fireEvent.change(screen.getByTestId("category-filter"), { target: { value: "Frontend" } });
    const items = screen.getAllByTestId("skill-item");
    expect(items.length).toBe(1);
  });

  it("adds a new skill", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-skills"));
    fireEvent.change(screen.getByTestId("skill-name-input"), { target: { value: "Rust" } });
    fireEvent.change(screen.getByTestId("skill-category-input"), { target: { value: "Systems" } });
    fireEvent.click(screen.getByTestId("add-skill-btn"));
    const items = screen.getAllByTestId("skill-item");
    expect(items.length).toBe(4);
  });
});

describe("Resources page", () => {
  it("lists all resources", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-resources"));
    const items = screen.getAllByTestId("resource-item");
    expect(items.length).toBe(3);
  });

  it("filters by type", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-resources"));
    fireEvent.change(screen.getByTestId("type-filter"), { target: { value: "course" } });
    const items = screen.getAllByTestId("resource-item");
    expect(items.length).toBe(1);
  });

  it("toggles resource completion", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-resources"));
    const checkboxes = screen.getAllByTestId("resource-complete");
    const unchecked = checkboxes.find((c) => !(c as HTMLInputElement).checked);
    if (unchecked) fireEvent.click(unchecked);
    const nowChecked = screen.getAllByTestId("resource-complete").filter((c) => (c as HTMLInputElement).checked);
    expect(nowChecked.length).toBe(2);
  });
});
