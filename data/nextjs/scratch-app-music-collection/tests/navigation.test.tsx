import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Navigation", () => {
  it("renders home page by default", () => {
    render(<App />);
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
  it("renders navbar", () => {
    render(<App />);
    expect(screen.getByTestId("navbar")).toBeTruthy();
  });
  it("navigates to library", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-library"));
    expect(screen.getByTestId("library-page")).toBeTruthy();
  });
  it("navigates to playlists", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-playlists"));
    expect(screen.getByTestId("playlists-page")).toBeTruthy();
  });
  it("navigates to artists", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-artists"));
    expect(screen.getByTestId("artists-page")).toBeTruthy();
  });
  it("navigates back to home", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-library"));
    fireEvent.click(screen.getByTestId("nav-home"));
    expect(screen.getByTestId("home-page")).toBeTruthy();
  });
});
