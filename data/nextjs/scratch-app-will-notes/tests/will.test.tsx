import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Clauses", () => {
  it("shows seed clauses", () => {
    render(<App />);
    expect(screen.getByTestId("clause-title-c1").textContent).toBe("Executor Appointment");
    expect(screen.getByTestId("clause-title-c2").textContent).toBe("Asset Distribution");
  });

  it("adds a new clause", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("clause-title-input"), { target: { value: "Guardianship" } });
    fireEvent.change(screen.getByTestId("clause-body-input"), { target: { value: "Guardian shall be Bob." } });
    fireEvent.click(screen.getByTestId("add-clause-btn"));
    expect(screen.getByText("Guardianship")).toBeTruthy();
  });

  it("ignores add when title is empty", () => {
    render(<App />);
    const before = screen.getByTestId("clause-list").children.length;
    fireEvent.change(screen.getByTestId("clause-body-input"), { target: { value: "Something" } });
    fireEvent.click(screen.getByTestId("add-clause-btn"));
    expect(screen.getByTestId("clause-list").children.length).toBe(before);
  });

  it("deletes a clause", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-clause-c1"));
    expect(screen.queryByTestId("clause-item-c1")).toBeNull();
  });
});

describe("Witnesses", () => {
  it("shows seed witnesses", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-witnesses"));
    expect(screen.getByTestId("witness-name-w1").textContent).toBe("John Smith");
    expect(screen.getByTestId("witness-status-w1").textContent).toBe("Signed");
  });

  it("adds a witness defaulting to Pending", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-witnesses"));
    fireEvent.change(screen.getByTestId("witness-name-input"), { target: { value: "Dave Lee" } });
    fireEvent.click(screen.getByTestId("add-witness-btn"));
    const items = screen.getAllByText("Pending");
    expect(items.length).toBeGreaterThan(0);
  });

  it("toggles witness status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-witnesses"));
    fireEvent.click(screen.getByTestId("toggle-witness-w2"));
    expect(screen.getByTestId("witness-status-w2").textContent).toBe("Signed");
  });
});

describe("Summary", () => {
  it("shows clause count", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("clause-count").textContent).toContain("2");
  });

  it("shows signed count", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("signed-count").textContent).toContain("1");
  });

  it("no will-complete badge with only 1 signed", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.queryByTestId("will-complete-badge")).toBeNull();
  });

  it("shows will-complete badge when 2 signed", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-witnesses"));
    fireEvent.click(screen.getByTestId("toggle-witness-w2"));
    fireEvent.click(screen.getByTestId("nav-summary"));
    expect(screen.getByTestId("will-complete-badge")).toBeTruthy();
  });
});
