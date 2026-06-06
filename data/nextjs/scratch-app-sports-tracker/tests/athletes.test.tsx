import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset, getAthletes } from "../lib/store";

beforeEach(() => {
  __reset();
  cleanup();
});

describe("athletes", () => {
  it("shows seed athletes", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-athletes"));
    expect(screen.getByTestId("athlete-name-1").textContent).toBe("Alice Johnson");
    expect(screen.getByTestId("athlete-name-2").textContent).toBe("Bob Smith");
  });

  it("adds a new athlete", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-athletes"));
    fireEvent.change(screen.getByTestId("athlete-name-input"), { target: { value: "Carol Davis" } });
    fireEvent.change(screen.getByTestId("athlete-sport-input"), { target: { value: "Tennis" } });
    fireEvent.change(screen.getByTestId("athlete-position-input"), { target: { value: "Singles" } });
    fireEvent.click(screen.getByTestId("add-athlete-btn"));
    expect(getAthletes().length).toBe(3);
    expect(screen.getByTestId("athlete-name-3").textContent).toBe("Carol Davis");
  });

  it("removes an athlete", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-athletes"));
    fireEvent.click(screen.getByTestId("remove-athlete-1"));
    expect(getAthletes().length).toBe(1);
    expect(screen.queryByTestId("athlete-item-1")).toBeNull();
  });

  it("dashboard shows correct athlete count", () => {
    render(<App />);
    expect(screen.getByTestId("athlete-count").textContent).toBe("2");
  });
});
