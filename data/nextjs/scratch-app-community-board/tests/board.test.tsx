import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

describe("Posts Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed posts", () => {
    render(<App />);
    expect(screen.getByTestId("post-row-p1")).toBeTruthy();
    expect(screen.getByTestId("post-row-p3")).toBeTruthy();
  });

  it("shows post title", () => {
    render(<App />);
    expect(screen.getByTestId("post-title-p1").textContent).toBe("Park cleanup this Saturday");
  });

  it("adds a new post", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("post-title"), { target: { value: "New notice" } });
    fireEvent.change(screen.getByTestId("post-author"), { target: { value: "Dave" } });
    fireEvent.change(screen.getByTestId("post-content"), { target: { value: "Details here" } });
    fireEvent.click(screen.getByTestId("post-submit"));
    expect(screen.getByText("New notice")).toBeTruthy();
  });
});

describe("Members Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed members", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-members"));
    expect(screen.getByTestId("member-row-m1")).toBeTruthy();
    expect(screen.getByTestId("member-row-m2")).toBeTruthy();
  });

  it("shows member roles", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-members"));
    expect(screen.getByTestId("member-role-m1").textContent).toBe("Admin");
    expect(screen.getByTestId("member-role-m2").textContent).toBe("Member");
  });

  it("promotes member to admin", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-members"));
    fireEvent.click(screen.getByTestId("promote-m2"));
    expect(screen.getByTestId("member-role-m2").textContent).toBe("Admin");
  });
});

describe("Events Page", () => {
  beforeEach(() => { __reset(); });

  it("shows seed events", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    expect(screen.getByTestId("event-row-e1")).toBeTruthy();
  });

  it("RSVP increments attendees", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-events"));
    const before = screen.getByTestId("event-attendees-e1").textContent;
    fireEvent.click(screen.getByTestId("rsvp-e1"));
    const after = screen.getByTestId("event-attendees-e1").textContent;
    expect(Number(after)).toBe(Number(before) + 1);
  });
});
