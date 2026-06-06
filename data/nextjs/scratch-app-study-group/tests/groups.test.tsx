import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Groups", () => {
  function goToGroups() {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-groups"));
  }

  it("shows seed groups", () => {
    goToGroups();
    expect(screen.getByTestId("group-item-g1")).toBeTruthy();
    expect(screen.getByTestId("group-item-g3")).toBeTruthy();
  });

  it("shows group member count", () => {
    goToGroups();
    expect(screen.getByTestId("group-count-g1").textContent).toContain("2");
  });

  it("adds a new group", () => {
    goToGroups();
    fireEvent.change(screen.getByTestId("input-group-name"), { target: { value: "Science Squad" } });
    fireEvent.change(screen.getByTestId("input-max-members"), { target: { value: "5" } });
    fireEvent.click(screen.getByTestId("btn-add-group"));
    expect(screen.getByTestId("group-list").textContent).toContain("Science Squad");
  });

  it("shows error for empty name", () => {
    goToGroups();
    fireEvent.click(screen.getByTestId("btn-add-group"));
    expect(screen.getByTestId("group-error")).toBeTruthy();
  });

  it("deletes a group", () => {
    goToGroups();
    fireEvent.click(screen.getByTestId("btn-delete-group-g2"));
    expect(screen.queryByTestId("group-item-g2")).toBeNull();
  });
});
