import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Navigation", () => {
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });

  it("shows home by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });

  it("navigates to groups", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-groups"));
    expect(screen.getByTestId("groups-page")).toBeTruthy();
  });

  it("navigates to members", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-members"));
    expect(screen.getByTestId("members-page")).toBeTruthy();
  });

  it("navigates to sessions", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-sessions"));
    expect(screen.getByTestId("sessions-page")).toBeTruthy();
  });
});
