import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Trusts", () => {
  it("shows seed trusts", () => {
    render(<App />);
    expect(screen.getByTestId("trust-name-t1").textContent).toBe("Family Trust");
    expect(screen.getByTestId("trust-trustee-t1").textContent).toBe("Alice");
  });

  it("adds a trust", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("trust-name-input"), { target: { value: "Charity Trust" } });
    fireEvent.change(screen.getByTestId("trust-trustee-input"), { target: { value: "Eve" } });
    fireEvent.change(screen.getByTestId("trust-principal-input"), { target: { value: "75000" } });
    fireEvent.click(screen.getByTestId("add-trust-btn"));
    expect(screen.getByText("Charity Trust")).toBeTruthy();
  });

  it("deletes a trust", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-trust-t2"));
    expect(screen.queryByTestId("trust-item-t2")).toBeNull();
  });

  it("ignores non-positive principal", () => {
    render(<App />);
    const before = screen.getByTestId("trust-list").children.length;
    fireEvent.change(screen.getByTestId("trust-name-input"), { target: { value: "Bad" } });
    fireEvent.change(screen.getByTestId("trust-trustee-input"), { target: { value: "X" } });
    fireEvent.change(screen.getByTestId("trust-principal-input"), { target: { value: "0" } });
    fireEvent.click(screen.getByTestId("add-trust-btn"));
    expect(screen.getByTestId("trust-list").children.length).toBe(before);
  });
});

describe("Distributions", () => {
  it("shows seed distributions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-distributions"));
    expect(screen.getByTestId("dist-beneficiary-d1").textContent).toBe("Carol");
  });

  it("adds a distribution", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-distributions"));
    fireEvent.change(screen.getByTestId("dist-trust-input"), { target: { value: "Family Trust" } });
    fireEvent.change(screen.getByTestId("dist-beneficiary-input"), { target: { value: "Frank" } });
    fireEvent.change(screen.getByTestId("dist-amount-input"), { target: { value: "5000" } });
    fireEvent.change(screen.getByTestId("dist-date-input"), { target: { value: "2024-07-01" } });
    fireEvent.click(screen.getByTestId("add-dist-btn"));
    expect(screen.getByText("Frank")).toBeTruthy();
  });

  it("deletes a distribution", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-distributions"));
    fireEvent.click(screen.getByTestId("delete-dist-d1"));
    expect(screen.queryByTestId("dist-item-d1")).toBeNull();
  });
});

describe("Overview", () => {
  it("shows total principal", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-overview"));
    expect(screen.getByTestId("total-principal").textContent).toContain("650,000");
  });

  it("shows total distributed", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-overview"));
    expect(screen.getByTestId("total-distributed").textContent).toContain("35,000");
  });

  it("shows total remaining", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-overview"));
    expect(screen.getByTestId("total-remaining").textContent).toContain("615,000");
  });

  it("shows per-trust breakdown", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-overview"));
    expect(screen.getByTestId("breakdown-name-t1").textContent).toBe("Family Trust");
    expect(screen.getByTestId("breakdown-distributed-t1").textContent).toContain("25,000");
  });
});
