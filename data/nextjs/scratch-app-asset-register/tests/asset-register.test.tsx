import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Register", () => {
  it("shows seed assets", () => {
    render(<App />);
    expect(screen.getByTestId("asset-name-a1").textContent).toBe("Main Residence");
    expect(screen.getByTestId("asset-category-a1").textContent).toBe("Property");
  });

  it("adds an asset", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("asset-name-input"), { target: { value: "Art Collection" } });
    fireEvent.click(screen.getByTestId("add-asset-btn"));
    expect(screen.getByText("Art Collection")).toBeTruthy();
  });

  it("deletes an asset", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-asset-a2"));
    expect(screen.queryByTestId("asset-item-a2")).toBeNull();
  });

  it("ignores add with empty name", () => {
    render(<App />);
    const before = screen.getByTestId("asset-list").children.length;
    fireEvent.click(screen.getByTestId("add-asset-btn"));
    expect(screen.getByTestId("asset-list").children.length).toBe(before);
  });
});

describe("Valuations", () => {
  it("shows seed valuations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-valuations"));
    expect(screen.getByTestId("val-asset-v1").textContent).toBe("Main Residence");
  });

  it("adds a valuation", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-valuations"));
    fireEvent.change(screen.getByTestId("val-asset-input"), { target: { value: "ISA Account" } });
    fireEvent.change(screen.getByTestId("val-value-input"), { target: { value: "50000" } });
    fireEvent.change(screen.getByTestId("val-date-input"), { target: { value: "2024-12-01" } });
    fireEvent.click(screen.getByTestId("add-val-btn"));
    const items = screen.getAllByText("ISA Account");
    expect(items.length).toBeGreaterThan(0);
  });

  it("deletes a valuation", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-valuations"));
    fireEvent.click(screen.getByTestId("delete-val-v1"));
    expect(screen.queryByTestId("val-item-v1")).toBeNull();
  });
});

describe("Summary", () => {
  it("shows total value from latest valuations", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    // 500000 + 35000 + 45000 = 580000
    expect(screen.getByTestId("total-value").textContent).toContain("580,000");
  });

  it("shows latest valuation for Main Residence", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("summary-value-a1").textContent).toContain("500,000");
    expect(screen.getByTestId("summary-date-a1").textContent).toBe("2024-06-01");
  });
});
