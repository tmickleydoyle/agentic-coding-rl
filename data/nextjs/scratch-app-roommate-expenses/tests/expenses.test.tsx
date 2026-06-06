import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("expenses page", () => {
  it("has expense inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getByTestId("expense-description-input")).toBeTruthy();
    expect(screen.getByTestId("expense-amount-input")).toBeTruthy();
  });

  it("has add expense button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getByTestId("add-expense-btn")).toBeTruthy();
  });

  it("has expense list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    expect(screen.getByTestId("expense-list")).toBeTruthy();
  });

  it("calls fetch on add expense", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-expenses"));
    fireEvent.change(screen.getByTestId("expense-description-input"), { target: { value: "Dinner" } });
    fireEvent.change(screen.getByTestId("expense-amount-input"), { target: { value: "50" } });
    fireEvent.click(screen.getByTestId("add-expense-btn"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });
});

describe("roommates page", () => {
  it("has roommate inputs and add button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-roommates"));
    expect(screen.getByTestId("roommate-name-input")).toBeTruthy();
    expect(screen.getByTestId("add-roommate-btn")).toBeTruthy();
  });

  it("has roommate list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-roommates"));
    expect(screen.getByTestId("roommate-list")).toBeTruthy();
  });
});
