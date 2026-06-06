import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Injuries", () => {
  it("shows seed injuries", () => {
    render(<App />);
    expect(screen.getByTestId("injury-item-i1")).toBeTruthy();
    expect(screen.getByTestId("injury-item-i2")).toBeTruthy();
  });

  it("adds an injury", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("input-body-part"), { target: { value: "Right Ankle" } });
    fireEvent.click(screen.getByTestId("btn-add-injury"));
    expect(screen.getByText("Right Ankle")).toBeTruthy();
  });

  it("deletes an injury", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-delete-injury-i1"));
    expect(screen.queryByTestId("injury-item-i1")).toBeNull();
  });

  it("treatment page shows no-active-injury initially", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-treatment"));
    expect(screen.getByTestId("no-active-injury")).toBeTruthy();
  });

  it("treatment page shows form when injury active", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("btn-select-injury-i1"));
    fireEvent.click(screen.getByTestId("nav-treatment"));
    expect(screen.getByTestId("add-treatment-form")).toBeTruthy();
  });

  it("timeline shows injuries", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-timeline"));
    expect(screen.getByTestId("timeline-item-i1")).toBeTruthy();
    expect(screen.getByTestId("timeline-item-i2")).toBeTruthy();
  });

  it("timeline is sorted descending by date", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-timeline"));
    const list = screen.getByTestId("timeline-list");
    const items = list.querySelectorAll("li");
    expect(items[0].getAttribute("data-testid")).toBe("timeline-item-i2");
  });
});
