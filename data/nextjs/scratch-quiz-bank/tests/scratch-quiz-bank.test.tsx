import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Quiz Bank App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByTestId("app-title")).toHaveTextContent("Quiz Bank");
  });

  it("renders all seed questions", () => {
    expect(screen.getByTestId("question-item-1")).toBeDefined();
    expect(screen.getByTestId("question-item-2")).toBeDefined();
    expect(screen.getByTestId("question-item-3")).toBeDefined();
    expect(screen.getByTestId("question-item-4")).toBeDefined();
  });

  it("shows correct question count", () => {
    expect(screen.getByTestId("question-count")).toHaveTextContent("4 questions");
  });

  it("shows correct used count", () => {
    expect(screen.getByTestId("used-count")).toHaveTextContent("1 used");
  });

  it("displays question details", () => {
    expect(screen.getByTestId("question-text-1")).toHaveTextContent("What is the Pythagorean theorem?");
    expect(screen.getByTestId("question-topic-1")).toHaveTextContent("Math");
    expect(screen.getByTestId("question-difficulty-1")).toHaveTextContent("Easy");
  });

  it("answer is hidden by default", () => {
    expect(screen.queryByTestId("question-answer-1")).toBeNull();
  });

  it("shows Show Answer button initially", () => {
    expect(screen.getByTestId("btn-toggle-answer-1")).toHaveTextContent("Show Answer");
  });

  it("toggles answer visibility", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-toggle-answer-1"));
    expect(screen.getByTestId("question-answer-1")).toHaveTextContent("a² + b² = c²");
    expect(screen.getByTestId("btn-toggle-answer-1")).toHaveTextContent("Hide Answer");
    await user.click(screen.getByTestId("btn-toggle-answer-1"));
    expect(screen.queryByTestId("question-answer-1")).toBeNull();
  });

  it("marks a question as used", async () => {
    const user = userEvent.setup();
    expect(screen.getByTestId("btn-mark-used-1")).toHaveTextContent("Mark Used");
    await user.click(screen.getByTestId("btn-mark-used-1"));
    expect(screen.getByTestId("btn-mark-used-1")).toHaveTextContent("Used");
    expect(screen.getByTestId("used-count")).toHaveTextContent("2 used");
  });

  it("seed question 2 is already used", () => {
    expect(screen.getByTestId("btn-mark-used-2")).toHaveTextContent("Used");
  });

  it("deletes a question", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-4"));
    expect(screen.queryByTestId("question-item-4")).toBeNull();
    expect(screen.getByTestId("question-count")).toHaveTextContent("3 questions");
  });

  it("filters by topic", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-topic"), "Math");
    expect(screen.getByTestId("question-item-1")).toBeDefined();
    expect(screen.queryByTestId("question-item-3")).toBeNull();
    expect(screen.getByTestId("question-count")).toHaveTextContent("1 questions");
  });

  it("filters by difficulty", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-difficulty"), "Medium");
    expect(screen.getByTestId("question-item-3")).toBeDefined();
    expect(screen.getByTestId("question-item-4")).toBeDefined();
    expect(screen.queryByTestId("question-item-1")).toBeNull();
    expect(screen.getByTestId("question-count")).toHaveTextContent("2 questions");
  });

  it("adds a new question", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-question"), "What is gravity?");
    await user.selectOptions(screen.getByTestId("select-topic"), "Science");
    await user.selectOptions(screen.getByTestId("select-difficulty"), "Hard");
    await user.type(screen.getByTestId("input-answer"), "A fundamental force");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("question-count")).toHaveTextContent("5 questions");
    expect(screen.getByTestId("question-text-5")).toHaveTextContent("What is gravity?");
  });

  it("does not add question with empty question text", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-answer"), "some answer");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("question-count")).toHaveTextContent("4 questions");
  });
});
