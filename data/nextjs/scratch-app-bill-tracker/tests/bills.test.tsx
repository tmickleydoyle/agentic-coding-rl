import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Dashboard", () => {
  it("shows total monthly active bills", () => {
    render(<App />);
    // active: 1500+120+60 = 1680
    expect(screen.getByTestId("total-monthly").textContent).toContain("1680.00");
  });
  it("shows active bill count", () => {
    render(<App />);
    expect(screen.getByTestId("active-count").textContent).toBe("3");
  });
  it("shows bills due soon from day 1", () => {
    render(<App />);
    // day 1 to 8: b1(day1), b4(day5) but b4 inactive => only b1
    expect(screen.getByTestId("due-soon-count").textContent).toBe("1");
  });
});

describe("Bills", () => {
  it("lists all bills", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    expect(screen.getByTestId("bill-b1")).toBeTruthy();
    expect(screen.getByTestId("bill-b4")).toBeTruthy();
  });
  it("shows b4 as inactive", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    expect(screen.getByTestId("bill-active-b4").textContent).toBe("inactive");
  });
  it("toggles a bill", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    fireEvent.click(screen.getByTestId("toggle-bill-b4"));
    expect(screen.getByTestId("bill-active-b4").textContent).toBe("active");
  });
  it("adds a bill", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    fireEvent.change(screen.getByTestId("bill-name"), { target: { value: "Netflix" } });
    fireEvent.change(screen.getByTestId("bill-amount"), { target: { value: "15" } });
    fireEvent.change(screen.getByTestId("bill-due-day"), { target: { value: "10" } });
    fireEvent.click(screen.getByTestId("add-bill-btn"));
    expect(screen.getByText("Netflix")).toBeTruthy();
  });
  it("deletes a bill", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    fireEvent.click(screen.getByTestId("delete-bill-b4"));
    expect(screen.queryByTestId("bill-b4")).toBeNull();
  });
});

describe("Calendar", () => {
  it("shows bill on its due day", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-calendar"));
    expect(screen.getByTestId("calendar-day-1")).toBeTruthy();
    expect(screen.getByTestId("cal-bill-b1")).toBeTruthy();
  });
  it("does not show inactive bills in calendar", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-calendar"));
    expect(screen.queryByTestId("cal-bill-b4")).toBeNull();
  });
});
