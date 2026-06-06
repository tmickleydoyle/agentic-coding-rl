import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders directory by default", () => {
    render(<App />);
    expect(screen.getByTestId("directory-page")).toBeTruthy();
  });
  it("navigates to issues", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-issues"));
    expect(screen.getByTestId("issues-page")).toBeTruthy();
  });
  it("navigates to announcements", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-announcements"));
    expect(screen.getByTestId("announcements-page")).toBeTruthy();
  });
});
