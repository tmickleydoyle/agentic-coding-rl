import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("gifts page", () => {
  it("has gift inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-gifts"));
    expect(screen.getByTestId("gift-title-input")).toBeTruthy();
    expect(screen.getByTestId("gift-price-input")).toBeTruthy();
    expect(screen.getByTestId("add-gift-btn")).toBeTruthy();
  });

  it("has gift list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-gifts"));
    expect(screen.getByTestId("gift-list")).toBeTruthy();
  });

  it("calls POST on add gift", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-gifts"));
    fireEvent.change(screen.getByTestId("gift-title-input"), { target: { value: "Book" } });
    fireEvent.click(screen.getByTestId("add-gift-btn"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "POST" })));
  });
});

describe("occasions page", () => {
  it("has occasion inputs and list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-occasions"));
    expect(screen.getByTestId("occasion-name-input")).toBeTruthy();
    expect(screen.getByTestId("occasion-list")).toBeTruthy();
    expect(screen.getByTestId("add-occasion-btn")).toBeTruthy();
  });

  it("has recipient inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-occasions"));
    expect(screen.getByTestId("recipient-name-input")).toBeTruthy();
    expect(screen.getByTestId("add-recipient-btn")).toBeTruthy();
  });
});

describe("ideas page", () => {
  it("shows ideas count and list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-ideas"));
    expect(screen.getByTestId("ideas-count")).toBeTruthy();
    expect(screen.getByTestId("ideas-list")).toBeTruthy();
  });
});
