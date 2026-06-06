import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Interview Prep", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByText("Interview Prep")).toBeTruthy();
  });

  it("shows all 5 seed questions initially", () => {
    expect(screen.getByTestId("question-card-1")).toBeTruthy();
    expect(screen.getByTestId("question-card-5")).toBeTruthy();
  });

  it("shows stat-total as 5", () => {
    expect(screen.getByTestId("stat-total").textContent).toBe("5");
  });

  it("shows stat-practiced as 0 initially", () => {
    expect(screen.getByTestId("stat-practiced").textContent).toBe("0");
  });

  it("shows answer when show-answer clicked", async () => {
    fireEvent.click(screen.getByTestId("show-answer-1"));
    expect(screen.getByTestId("answer-1")).toBeTruthy();
  });

  it("hides answer initially", () => {
    expect(screen.queryByTestId("answer-1")).toBeNull();
  });

  it("marks a question correct and updates stats", async () => {
    fireEvent.click(screen.getByTestId("show-answer-1"));
    fireEvent.click(screen.getByTestId("mark-correct-1"));
    expect(screen.getByTestId("result-1").textContent).toBe("Correct");
    expect(screen.getByTestId("stat-practiced").textContent).toBe("1");
    expect(screen.getByTestId("stat-correct").textContent).toBe("1");
  });

  it("marks a question incorrect and updates stats", async () => {
    fireEvent.click(screen.getByTestId("show-answer-2"));
    fireEvent.click(screen.getByTestId("mark-incorrect-2"));
    expect(screen.getByTestId("result-2").textContent).toBe("Incorrect");
    expect(screen.getByTestId("stat-practiced").textContent).toBe("1");
    expect(screen.getByTestId("stat-correct").textContent).toBe("0");
  });

  it("filters by category", async () => {
    const filter = screen.getByTestId("category-filter");
    await userEvent.selectOptions(filter, "System Design");
    expect(screen.queryByTestId("question-card-5")).toBeTruthy();
    expect(screen.queryByTestId("question-card-1")).toBeNull();
  });

  it("filters by difficulty", async () => {
    const filter = screen.getByTestId("difficulty-filter");
    await userEvent.selectOptions(filter, "Hard");
    expect(screen.queryByTestId("question-card-4")).toBeTruthy();
    expect(screen.queryByTestId("question-card-1")).toBeNull();
  });

  it("resets all practice results", async () => {
    fireEvent.click(screen.getByTestId("show-answer-1"));
    fireEvent.click(screen.getByTestId("mark-correct-1"));
    fireEvent.click(screen.getByTestId("reset-btn"));
    expect(screen.getByTestId("stat-practiced").textContent).toBe("0");
    expect(screen.getByTestId("stat-correct").textContent).toBe("0");
    expect(screen.queryByTestId("result-1")).toBeNull();
  });

  it("adds a new question", async () => {
    await userEvent.type(screen.getByTestId("input-question"), "What is React?");
    await userEvent.type(screen.getByTestId("input-answer"), "A JS library for UIs");
    fireEvent.click(screen.getByTestId("add-question-btn"));
    expect(screen.getByTestId("question-card-6")).toBeTruthy();
    expect(screen.getByTestId("stat-total").textContent).toBe("6");
  });

  it("does not add question with empty answer", async () => {
    await userEvent.type(screen.getByTestId("input-question"), "What is React?");
    fireEvent.click(screen.getByTestId("add-question-btn"));
    expect(screen.queryByTestId("question-card-6")).toBeNull();
  });
});
