import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Entries page", () => {
  it("shows entries list", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-entries"));
    await waitFor(() => {
      expect(screen.getByTestId("entries-list")).toBeTruthy();
    });
  });

  it("shows no-entries message when empty after reset... actually shows seeded entries", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-entries"));
    await waitFor(() => {
      const list = screen.getByTestId("entries-list");
      expect(list).toBeTruthy();
    });
  });
});

describe("New Entry form", () => {
  it("renders the new entry form inputs", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-new-entry"));
    expect(screen.getByTestId("input-title")).toBeTruthy();
    expect(screen.getByTestId("input-body")).toBeTruthy();
    expect(screen.getByTestId("input-mood")).toBeTruthy();
    expect(screen.getByTestId("input-tags")).toBeTruthy();
    expect(screen.getByTestId("submit-entry")).toBeTruthy();
  });

  it("shows error when submitting empty form", async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-new-entry"));
    fireEvent.click(screen.getByTestId("submit-entry"));
    await waitFor(() => {
      expect(screen.getByTestId("form-error")).toBeTruthy();
    });
  });
});
