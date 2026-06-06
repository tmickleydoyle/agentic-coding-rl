import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Summary", () => {
  it("shows total assets", () => {
    render(<App />);
    // 5000+350000+85000 = 440000
    expect(screen.getByTestId("total-assets").textContent).toContain("440000.00");
  });
  it("shows total liabilities", () => {
    render(<App />);
    // 280000+12000 = 292000
    expect(screen.getByTestId("total-liabilities").textContent).toContain("292000.00");
  });
  it("shows net worth", () => {
    render(<App />);
    // 440000-292000 = 148000
    expect(screen.getByTestId("net-worth").textContent).toContain("148000.00");
  });
});

describe("Assets", () => {
  it("lists seed assets", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    expect(screen.getByTestId("asset-a1")).toBeTruthy();
    expect(screen.getByTestId("asset-a2")).toBeTruthy();
  });
  it("adds an asset", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    fireEvent.change(screen.getByTestId("asset-name"), { target: { value: "Savings" } });
    fireEvent.change(screen.getByTestId("asset-value"), { target: { value: "10000" } });
    fireEvent.click(screen.getByTestId("add-asset-btn"));
    expect(screen.getByText("Savings")).toBeTruthy();
  });
  it("deletes an asset", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    fireEvent.click(screen.getByTestId("delete-asset-a1"));
    expect(screen.queryByTestId("asset-a1")).toBeNull();
  });
});

describe("Liabilities", () => {
  it("lists seed liabilities", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-liabilities"));
    expect(screen.getByTestId("liability-l1")).toBeTruthy();
  });
  it("deletes a liability", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-liabilities"));
    fireEvent.click(screen.getByTestId("delete-liability-l2"));
    expect(screen.queryByTestId("liability-l2")).toBeNull();
  });
});

describe("History", () => {
  it("shows existing snapshot", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("snapshot-s1")).toBeTruthy();
  });
  it("shows current net worth preview", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByTestId("snapshot-preview").textContent).toContain("148000.00");
  });
});
