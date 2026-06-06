import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Coach Notes", () => {
  it("shows seed athletes", () => {
    render(<App />);
    expect(screen.getByTestId("athlete-item-a1")).toBeTruthy();
    expect(screen.getByTestId("athlete-item-a2")).toBeTruthy();
  });

  it("adds an athlete", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("input-athlete-name"), { target: { value: "Sam Park" } });
    fireEvent.click(screen.getByTestId("btn-add-athlete"));
    expect(screen.getByText("Sam Park")).toBeTruthy();
  });

  it("deletes an athlete", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-delete-athlete-a1"));
    expect(screen.queryByTestId("athlete-item-a1")).toBeNull();
  });

  it("sessions page shows no-active-athlete initially", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-sessions"));
    expect(screen.getByTestId("no-active-athlete")).toBeTruthy();
  });

  it("sessions page shows form when athlete selected", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-select-athlete-a1"));
    fireEvent.click(screen.getByTestId("nav-sessions"));
    expect(screen.getByTestId("add-session-form")).toBeTruthy();
  });

  it("review shows total sessions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-review"));
    expect(screen.getByTestId("review-total-sessions").textContent).toContain("2");
  });

  it("review shows total minutes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-review"));
    expect(screen.getByTestId("review-total-minutes").textContent).toContain("150");
  });
});
