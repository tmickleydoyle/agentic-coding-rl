import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Dashboard", () => {
  it("shows speaker count", () => {
    render(<App />);
    expect(screen.getByTestId("speaker-count").textContent).toBe("3");
  });

  it("shows watched count", () => {
    render(<App />);
    expect(screen.getByTestId("watched-count").textContent).toBe("2");
  });

  it("shows upcoming events count", () => {
    render(<App />);
    expect(screen.getByTestId("upcoming-events").textContent).toBe("2");
  });
});

describe("Speakers page", () => {
  it("lists all speakers", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-speakers"));
    const items = screen.getAllByTestId("speaker-item");
    expect(items.length).toBe(3);
  });

  it("filters to following only", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-speakers"));
    fireEvent.click(screen.getByTestId("following-filter"));
    const items = screen.getAllByTestId("speaker-item");
    expect(items.length).toBe(2);
  });

  it("toggles follow status", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-speakers"));
    const buttons = screen.getAllByTestId("follow-btn");
    const unfollowBtn = buttons.find((b) => b.textContent === "Unfollow");
    if (unfollowBtn) fireEvent.click(unfollowBtn);
    fireEvent.click(screen.getByTestId("following-filter"));
    const items = screen.getAllByTestId("speaker-item");
    expect(items.length).toBe(1);
  });
});

describe("Talks page", () => {
  it("shows all talks", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-talks"));
    const items = screen.getAllByTestId("talk-item");
    expect(items.length).toBe(3);
  });

  it("marks a talk as watched", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-talks"));
    const markBtns = screen.getAllByTestId("mark-watched");
    fireEvent.click(markBtns[0]);
    const watchedBadges = screen.getAllByTestId("watched-badge");
    expect(watchedBadges.length).toBe(3);
  });

  it("filters unwatched talks", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-talks"));
    fireEvent.click(screen.getByTestId("filter-unwatched"));
    const items = screen.getAllByTestId("talk-item");
    expect(items.length).toBe(1);
  });
});
