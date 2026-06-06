import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("policies page", () => {
  it("has policy inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    expect(screen.getByTestId("policy-name-input")).toBeTruthy();
    expect(screen.getByTestId("policy-provider-input")).toBeTruthy();
    expect(screen.getByTestId("add-policy-btn")).toBeTruthy();
  });

  it("has policy list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    expect(screen.getByTestId("policy-list")).toBeTruthy();
  });

  it("calls POST on add policy", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-policies"));
    fireEvent.change(screen.getByTestId("policy-name-input"), { target: { value: "Life Insurance" } });
    fireEvent.change(screen.getByTestId("policy-provider-input"), { target: { value: "LifeCo" } });
    fireEvent.click(screen.getByTestId("add-policy-btn"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "POST" })));
  });
});

describe("claims page", () => {
  it("has claim inputs and list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-claims"));
    expect(screen.getByTestId("claim-description-input")).toBeTruthy();
    expect(screen.getByTestId("claim-list")).toBeTruthy();
    expect(screen.getByTestId("add-claim-btn")).toBeTruthy();
  });
});
