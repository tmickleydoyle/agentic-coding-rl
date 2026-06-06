import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../app/page";

describe("Waiver Wire", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders app title", () => {
    expect(screen.getByTestId("app-title").textContent).toContain("Waiver Wire");
  });

  it("renders all 7 available players", () => {
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByTestId(`waiver-player-${i}`)).toBeTruthy();
    }
  });

  it("shows initial claims count of 2", () => {
    expect(screen.getByTestId("claims-heading").textContent).toContain("2");
  });

  it("shows initial claim rows", () => {
    expect(screen.getByTestId("claim-row-1")).toBeTruthy();
    expect(screen.getByTestId("claim-row-2")).toBeTruthy();
  });

  it("shows player name for available player", () => {
    expect(screen.getByTestId("waiver-name-1").textContent).toContain("Miles Sanders");
  });

  it("shows ownership percentage for available player", () => {
    expect(screen.getByTestId("waiver-ownership-1").textContent).toContain("12%");
  });

  it("shows waiver order for available player", () => {
    expect(screen.getByTestId("waiver-order-3").textContent).toContain("3");
  });

  it("shows position badge for available player", () => {
    expect(screen.getByTestId("waiver-pos-5").textContent).toBe("TE");
  });

  it("clicking Claim opens the inline claim form", () => {
    fireEvent.click(screen.getByTestId("claim-btn-1"));
    expect(screen.getByTestId("claim-form-1")).toBeTruthy();
  });

  it("submitting a claim with drop player adds to My Claims", () => {
    fireEvent.click(screen.getByTestId("claim-btn-1"));
    fireEvent.change(screen.getByTestId("drop-input-1"), { target: { value: "Old Player" } });
    fireEvent.click(screen.getByTestId("submit-claim-1"));
    expect(screen.getByTestId("claims-heading").textContent).toContain("3");
  });

  it("does not add claim when drop input is empty", () => {
    fireEvent.click(screen.getByTestId("claim-btn-1"));
    fireEvent.click(screen.getByTestId("submit-claim-1"));
    expect(screen.getByTestId("claims-heading").textContent).toContain("2");
  });

  it("canceling a claim removes it from My Claims", () => {
    fireEvent.click(screen.getByTestId("cancel-claim-1"));
    expect(screen.queryByTestId("claim-row-1")).toBeNull();
    expect(screen.getByTestId("claims-heading").textContent).toContain("1");
  });

  it("shows no-claims message when all claims canceled", () => {
    fireEvent.click(screen.getByTestId("cancel-claim-1"));
    fireEvent.click(screen.getByTestId("cancel-claim-2"));
    expect(screen.getByTestId("no-claims")).toBeTruthy();
  });

  it("shows add and drop info for claim rows", () => {
    expect(screen.getByTestId("claim-add-1").textContent).toContain("Rashod Bateman");
    expect(screen.getByTestId("claim-drop-1").textContent).toContain("Diontae Johnson");
  });

  it("available player remains after claim is submitted", () => {
    fireEvent.click(screen.getByTestId("claim-btn-4"));
    fireEvent.change(screen.getByTestId("drop-input-4"), { target: { value: "Someone" } });
    fireEvent.click(screen.getByTestId("submit-claim-4"));
    expect(screen.getByTestId("waiver-player-4")).toBeTruthy();
  });
});
