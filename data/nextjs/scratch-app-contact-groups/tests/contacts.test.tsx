import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "../app/page";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => [] }));
});

describe("contacts page", () => {
  it("has name input and add button", () => {
    render(<App />);
    expect(screen.getByTestId("contact-name-input")).toBeTruthy();
    expect(screen.getByTestId("add-contact-btn")).toBeTruthy();
  });

  it("has contact list", () => {
    render(<App />);
    expect(screen.getByTestId("contact-list")).toBeTruthy();
  });

  it("calls POST on add contact", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    fireEvent.change(screen.getByTestId("contact-name-input"), { target: { value: "Dave" } });
    fireEvent.click(screen.getByTestId("add-contact-btn"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: "POST" })));
  });
});

describe("groups page", () => {
  it("has group inputs and list", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-groups"));
    expect(screen.getByTestId("group-name-input")).toBeTruthy();
    expect(screen.getByTestId("group-list")).toBeTruthy();
    expect(screen.getByTestId("add-group-btn")).toBeTruthy();
  });
});

describe("import page", () => {
  it("has csv textarea and import button", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-import"));
    expect(screen.getByTestId("import-csv-input")).toBeTruthy();
    expect(screen.getByTestId("import-btn")).toBeTruthy();
    expect(screen.getByTestId("import-count")).toBeTruthy();
  });
});
