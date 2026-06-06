import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Vocabulary", () => {
  function goToVocab() {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-vocabulary"));
  }

  it("shows existing vocab words", () => {
    goToVocab();
    expect(screen.getByTestId("vocab-item-v1")).toBeTruthy();
    expect(screen.getByTestId("vocab-item-v2")).toBeTruthy();
  });

  it("shows mastered count", () => {
    goToVocab();
    expect(screen.getByTestId("mastered-count").textContent).toContain("1");
  });

  it("adds a new vocab word", () => {
    goToVocab();
    fireEvent.change(screen.getByTestId("input-word"), { target: { value: "merci" } });
    fireEvent.change(screen.getByTestId("input-translation"), { target: { value: "thank you" } });
    fireEvent.click(screen.getByTestId("btn-add-word"));
    const list = screen.getByTestId("vocab-list");
    expect(list.textContent).toContain("merci");
  });

  it("shows error when word is empty", () => {
    goToVocab();
    fireEvent.click(screen.getByTestId("btn-add-word"));
    expect(screen.getByTestId("vocab-error")).toBeTruthy();
  });

  it("toggles mastered state", () => {
    goToVocab();
    fireEvent.click(screen.getByTestId("btn-toggle-v1"));
    expect(screen.getByTestId("mastered-count").textContent).toContain("2");
  });
});
