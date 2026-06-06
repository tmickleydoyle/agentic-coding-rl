import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Dashboard", () => {
  it("shows conference count", () => {
    render(<App />);
    expect(screen.getByTestId("conference-count").textContent).toBe("2");
  });

  it("shows talk count", () => {
    render(<App />);
    expect(screen.getByTestId("talk-count").textContent).toBe("3");
  });

  it("shows speaker count", () => {
    render(<App />);
    expect(screen.getByTestId("speaker-count").textContent).toBe("3");
  });
});

describe("Conferences page", () => {
  it("lists all conferences", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-conferences"));
    const items = screen.getAllByTestId("conference-item");
    expect(items.length).toBe(2);
  });

  it("shows attended badge for attended conference", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-conferences"));
    expect(screen.getByTestId("attended-badge")).toBeTruthy();
  });

  it("adds a conference", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-conferences"));
    fireEvent.change(screen.getByTestId("conf-name-input"), { target: { value: "New Conf" } });
    fireEvent.change(screen.getByTestId("conf-date-input"), { target: { value: "2024-09-20" } });
    fireEvent.change(screen.getByTestId("conf-location-input"), { target: { value: "NYC" } });
    fireEvent.click(screen.getByTestId("add-conference-btn"));
    const items = screen.getAllByTestId("conference-item");
    expect(items.length).toBe(3);
  });
});

describe("Talks page", () => {
  it("lists all talks", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-talks"));
    const items = screen.getAllByTestId("talk-item");
    expect(items.length).toBe(3);
  });

  it("filters talks by conference", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-talks"));
    fireEvent.change(screen.getByTestId("conference-filter"), { target: { value: "conf1" } });
    const items = screen.getAllByTestId("talk-item");
    expect(items.length).toBe(2);
  });

  it("searches talks by title", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-talks"));
    fireEvent.change(screen.getByTestId("search-input"), { target: { value: "Deno" } });
    const items = screen.getAllByTestId("talk-item");
    expect(items.length).toBe(1);
  });
});
