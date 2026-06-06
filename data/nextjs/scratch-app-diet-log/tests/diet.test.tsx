import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Log", () => {
  it("shows 4 seed entries", () => {
    render(<App />);
    expect(screen.getByTestId("entry-count").textContent).toContain("4");
  });

  it("lists all diet entries", () => {
    render(<App />);
    expect(screen.getAllByTestId("diet-entry").length).toBe(4);
  });

  it("delete removes entry", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-btn-d1"));
    expect(screen.getByTestId("entry-count").textContent).toContain("3");
  });
});

describe("Summary", () => {
  it("shows total calories for 2024-03-15", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-calories").textContent).toContain("1180");
  });

  it("shows total protein", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-protein").textContent).toContain("101");
  });
});

describe("Add Entry", () => {
  it("shows error on empty food name", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-entry"));
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("error-message")).toBeTruthy();
  });

  it("adds entry and returns to log", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-entry"));
    fireEvent.change(screen.getByTestId("input-food-name"), { target: { value: "Apple" } });
    fireEvent.change(screen.getByTestId("input-calories"), { target: { value: "95" } });
    fireEvent.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("entry-count").textContent).toContain("5");
  });
});
