import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("bills page", () => {
  it("has bill inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    expect(screen.getByTestId("bill-month-input")).toBeTruthy();
    expect(screen.getByTestId("bill-amount-input")).toBeTruthy();
    expect(screen.getByTestId("add-bill-btn")).toBeTruthy();
  });

  it("has bill list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    expect(screen.getByTestId("bill-list")).toBeTruthy();
  });

  it("calls POST on add bill", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-bills"));
    fireEvent.change(screen.getByTestId("bill-month-input"), { target: { value: "2024-07" } });
    fireEvent.change(screen.getByTestId("bill-amount-input"), { target: { value: "100" } });
    fireEvent.click(screen.getByTestId("add-bill-btn"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });
});

describe("utilities page", () => {
  it("has utility inputs and list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-utilities"));
    expect(screen.getByTestId("utility-name-input")).toBeTruthy();
    expect(screen.getByTestId("utility-list")).toBeTruthy();
    expect(screen.getByTestId("add-utility-btn")).toBeTruthy();
  });
});
