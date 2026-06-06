import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Home counts", () => {
  it("shows applied count", () => {
    render(<App />);
    expect(screen.getByTestId("home-applied-count").textContent).toBe("1");
  });

  it("shows approved count", () => {
    render(<App />);
    expect(screen.getByTestId("home-approved-count").textContent).toBe("2");
  });

  it("shows expired count", () => {
    render(<App />);
    expect(screen.getByTestId("home-expired-count").textContent).toBe("1");
  });
});

describe("Visa list", () => {
  it("shows 4 visa cards", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-visas"));
    expect(screen.getAllByTestId("visa-card").length).toBe(4);
  });

  it("shows country names", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-visas"));
    const countries = screen.getAllByTestId("visa-country").map((el) => el.textContent);
    expect(countries).toContain("Japan");
  });

  it("shows visa status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-visas"));
    const statuses = screen.getAllByTestId("visa-status").map((el) => el.textContent);
    expect(statuses).toContain("approved");
  });
});

describe("Add visa", () => {
  it("adds visa and navigates to visas", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-add-visa"));
    fireEvent.change(screen.getByTestId("input-country"), { target: { value: "Australia" } });
    fireEvent.change(screen.getByTestId("input-visa-type"), { target: { value: "Tourist" } });
    fireEvent.change(screen.getByTestId("input-applied-date"), { target: { value: "2024-06-01" } });
    fireEvent.change(screen.getByTestId("input-expiry-date"), { target: { value: "2024-09-01" } });
    fireEvent.change(screen.getByTestId("input-passport"), { target: { value: "B9999999" } });
    fireEvent.click(screen.getByTestId("submit-visa"));
    expect(screen.getByTestId("visas-page")).toBeTruthy();
    expect(screen.getAllByTestId("visa-card").length).toBe(5);
  });
});

describe("Reminders", () => {
  it("shows Japan as expiring soon", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reminders"));
    const countries = screen.getAllByTestId("reminder-country").map((el) => el.textContent);
    expect(countries).toContain("Japan");
  });

  it("does not show USA (expires Dec 31)", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reminders"));
    const countries = screen.getAllByTestId("reminder-country").map((el) => el.textContent);
    expect(countries).not.toContain("USA");
  });

  it("shows days until expiry for Japan", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-reminders"));
    const days = screen.getAllByTestId("reminder-days").map((el) => el.textContent);
    expect(days[0]).toBe("9");
  });
});
