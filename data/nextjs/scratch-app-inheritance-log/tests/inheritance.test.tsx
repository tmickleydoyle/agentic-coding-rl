import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Entries", () => {
  it("shows seed entries", () => {
    render(<App />);
    expect(screen.getByTestId("entry-heir-e1").textContent).toBe("Alice");
    expect(screen.getByTestId("entry-status-e1").textContent).toBe("Transferred");
  });

  it("adds a new entry", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("entry-heir-input"), { target: { value: "Dave" } });
    fireEvent.change(screen.getByTestId("entry-amount-input"), { target: { value: "10000" } });
    fireEvent.change(screen.getByTestId("entry-date-input"), { target: { value: "2024-06-01" } });
    fireEvent.click(screen.getByTestId("add-entry-btn"));
    expect(screen.getByText("Dave")).toBeTruthy();
  });

  it("deletes an entry", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-entry-e2"));
    expect(screen.queryByTestId("entry-item-e2")).toBeNull();
  });

  it("ignores invalid amount", () => {
    render(<App />);
    const before = screen.getByTestId("entry-list").children.length;
    fireEvent.change(screen.getByTestId("entry-heir-input"), { target: { value: "X" } });
    fireEvent.change(screen.getByTestId("entry-amount-input"), { target: { value: "-500" } });
    fireEvent.change(screen.getByTestId("entry-date-input"), { target: { value: "2024-06-01" } });
    fireEvent.click(screen.getByTestId("add-entry-btn"));
    expect(screen.getByTestId("entry-list").children.length).toBe(before);
  });
});

describe("Heirs", () => {
  it("shows seed heirs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-heirs"));
    expect(screen.getByTestId("heir-name-h1").textContent).toBe("Alice");
    expect(screen.getByTestId("heir-share-h1").textContent).toBe("50%");
  });

  it("shows 100% total with no warning", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-heirs"));
    expect(screen.getByTestId("total-share").textContent).toContain("100");
    expect(screen.queryByTestId("share-warning")).toBeNull();
  });

  it("shows warning when total != 100", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-heirs"));
    fireEvent.click(screen.getByTestId("delete-heir-h3"));
    expect(screen.getByTestId("share-warning")).toBeTruthy();
  });

  it("adds an heir", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-heirs"));
    fireEvent.change(screen.getByTestId("heir-name-input"), { target: { value: "Eve" } });
    fireEvent.change(screen.getByTestId("heir-share-input"), { target: { value: "10" } });
    fireEvent.click(screen.getByTestId("add-heir-btn"));
    expect(screen.getByText("Eve")).toBeTruthy();
  });
});

describe("Timeline", () => {
  it("shows entries sorted by date", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-timeline"));
    const list = screen.getByTestId("timeline-list");
    const items = list.querySelectorAll("[data-testid^='timeline-item-']");
    const dates = Array.from(items).map((item) => item.querySelector("[data-testid^='timeline-date-']")?.textContent);
    expect(dates[0]).toBe("2024-01-15");
    expect(dates[1]).toBe("2024-02-10");
    expect(dates[2]).toBe("2024-03-20");
  });
});
