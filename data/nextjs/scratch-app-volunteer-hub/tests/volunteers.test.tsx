import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Volunteers Page", () => {
  beforeEach(() => { __reset(); });

  it("lists seed volunteers", () => {
    render(<App />);
    expect(screen.getByTestId("volunteer-row-v1")).toBeTruthy();
    expect(screen.getByTestId("volunteer-row-v2")).toBeTruthy();
    expect(screen.getByTestId("volunteer-row-v3")).toBeTruthy();
  });

  it("shows volunteer names", () => {
    render(<App />);
    expect(screen.getByTestId("volunteer-name-v1").textContent).toBe("Alice Chen");
  });

  it("shows volunteer status", () => {
    render(<App />);
    expect(screen.getByTestId("volunteer-status-v1").textContent).toBe("Active");
    expect(screen.getByTestId("volunteer-status-v3").textContent).toBe("Inactive");
  });

  it("toggles volunteer status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("toggle-status-v1"));
    expect(screen.getByTestId("volunteer-status-v1").textContent).toBe("Inactive");
  });

  it("toggle is reversible", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("toggle-status-v3"));
    expect(screen.getByTestId("volunteer-status-v3").textContent).toBe("Active");
  });
});
