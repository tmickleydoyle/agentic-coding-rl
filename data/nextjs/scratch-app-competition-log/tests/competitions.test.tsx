import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Competitions", () => {
  it("shows seed competitions", () => {
    render(<App />);
    expect(screen.getByTestId("competition-item-c1")).toBeTruthy();
    expect(screen.getByTestId("competition-item-c2")).toBeTruthy();
  });

  it("adds a competition", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("input-comp-name"), { target: { value: "National Finals" } });
    fireEvent.click(screen.getByTestId("btn-add-competition"));
    expect(screen.getByText("National Finals")).toBeTruthy();
  });

  it("deletes a competition", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-delete-comp-c1"));
    expect(screen.queryByTestId("competition-item-c1")).toBeNull();
  });

  it("results page shows no-active-competition initially", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-results"));
    expect(screen.getByTestId("no-active-competition")).toBeTruthy();
  });

  it("results page shows form when competition selected", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-select-comp-c1"));
    fireEvent.click(screen.getByTestId("nav-results"));
    expect(screen.getByTestId("add-result-form")).toBeTruthy();
  });

  it("rankings shows Alice with 2 podiums", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-rankings"));
    expect(screen.getByTestId("ranking-count-alice").textContent).toContain("2");
  });

  it("history shows seed competitions and results", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("history-comp-c1")).toBeTruthy();
    expect(screen.getByTestId("history-result-r1")).toBeTruthy();
  });
});
