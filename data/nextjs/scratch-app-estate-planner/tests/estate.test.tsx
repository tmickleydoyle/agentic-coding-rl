import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Dashboard", () => {
  it("shows total value of seed assets", () => {
    render(<App />);
    expect(screen.getByTestId("total-value").textContent).toContain("600,000");
  });

  it("shows asset count", () => {
    render(<App />);
    expect(screen.getByTestId("asset-count").textContent).toContain("3");
  });

  it("shows beneficiary count", () => {
    render(<App />);
    expect(screen.getByTestId("beneficiary-count").textContent).toContain("2");
  });

  it("shows notes preview", () => {
    render(<App />);
    expect(screen.getByTestId("notes-preview").textContent).toContain("Review asset allocation");
  });
});

describe("Assets", () => {
  it("lists seed assets", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    expect(screen.getByTestId("asset-name-a1").textContent).toBe("Family Home");
    expect(screen.getByTestId("asset-name-a2").textContent).toBe("Stock Portfolio");
  });

  it("adds a new asset", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    fireEvent.change(screen.getByTestId("asset-name-input"), { target: { value: "Boat" } });
    fireEvent.change(screen.getByTestId("asset-value-input"), { target: { value: "15000" } });
    fireEvent.change(screen.getByTestId("asset-beneficiary-input"), { target: { value: "Alice" } });
    fireEvent.click(screen.getByTestId("add-asset-btn"));
    expect(screen.getByText("Boat")).toBeTruthy();
  });

  it("deletes an asset", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    fireEvent.click(screen.getByTestId("delete-asset-a1"));
    expect(screen.queryByTestId("asset-item-a1")).toBeNull();
  });

  it("ignores invalid asset value", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-assets"));
    const before = screen.getByTestId("asset-list").children.length;
    fireEvent.change(screen.getByTestId("asset-name-input"), { target: { value: "Bad" } });
    fireEvent.change(screen.getByTestId("asset-value-input"), { target: { value: "-100" } });
    fireEvent.change(screen.getByTestId("asset-beneficiary-input"), { target: { value: "X" } });
    fireEvent.click(screen.getByTestId("add-asset-btn"));
    expect(screen.getByTestId("asset-list").children.length).toBe(before);
  });
});

describe("Beneficiaries", () => {
  it("lists seed beneficiaries", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-beneficiaries"));
    expect(screen.getByTestId("beneficiary-name-b1").textContent).toBe("Alice");
    expect(screen.getByTestId("beneficiary-name-b2").textContent).toBe("Bob");
  });

  it("adds a new beneficiary", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-beneficiaries"));
    fireEvent.change(screen.getByTestId("beneficiary-name-input"), { target: { value: "Carol" } });
    fireEvent.click(screen.getByTestId("add-beneficiary-btn"));
    expect(screen.getByText("Carol")).toBeTruthy();
  });

  it("deletes a beneficiary", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-beneficiaries"));
    fireEvent.click(screen.getByTestId("delete-beneficiary-b2"));
    expect(screen.queryByTestId("beneficiary-item-b2")).toBeNull();
  });
});

describe("Notes", () => {
  it("shows existing notes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-notes"));
    const ta = screen.getByTestId("notes-textarea") as HTMLTextAreaElement;
    expect(ta.value).toContain("Review asset allocation");
  });

  it("saves updated notes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-notes"));
    fireEvent.change(screen.getByTestId("notes-textarea"), { target: { value: "New note text" } });
    fireEvent.click(screen.getByTestId("save-notes-btn"));
    fireEvent.click(screen.getByTestId("nav-dashboard"));
    expect(screen.getByTestId("notes-preview").textContent).toContain("New note text");
  });
});
