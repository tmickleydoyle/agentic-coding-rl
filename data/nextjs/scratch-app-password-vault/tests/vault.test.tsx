import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("vault page", () => {
  it("has credential inputs", () => {
    render(<App />);
    expect(screen.getByTestId("cred-site-input")).toBeTruthy();
    expect(screen.getByTestId("cred-username-input")).toBeTruthy();
    expect(screen.getByTestId("cred-password-input")).toBeTruthy();
    expect(screen.getByTestId("add-cred-btn")).toBeTruthy();
  });

  it("has cred list", () => {
    render(<App />);
    expect(screen.getByTestId("cred-list")).toBeTruthy();
  });

  it("calls POST on add credential", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.change(screen.getByTestId("cred-site-input"), { target: { value: "Google" } });
    fireEvent.change(screen.getByTestId("cred-username-input"), { target: { value: "user@g.com" } });
    fireEvent.change(screen.getByTestId("cred-password-input"), { target: { value: "pass123" } });
    fireEvent.click(screen.getByTestId("add-cred-btn"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "POST" })));
  });
});

describe("generate page", () => {
  it("has generate inputs and button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-generate"));
    expect(screen.getByTestId("gen-length-input")).toBeTruthy();
    expect(screen.getByTestId("gen-btn")).toBeTruthy();
    expect(screen.getByTestId("gen-result")).toBeTruthy();
  });
});

describe("audit page", () => {
  it("shows weak-count and list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-audit"));
    expect(screen.getByTestId("weak-count")).toBeTruthy();
    expect(screen.getByTestId("weak-list")).toBeTruthy();
  });
});
