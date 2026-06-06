import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Progress Report App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByTestId("app-title")).toHaveTextContent("Progress Report");
  });

  it("renders all seed students", () => {
    expect(screen.getByTestId("student-item-1")).toBeDefined();
    expect(screen.getByTestId("student-item-2")).toBeDefined();
    expect(screen.getByTestId("student-item-3")).toBeDefined();
  });

  it("displays student names", () => {
    expect(screen.getByTestId("student-name-1")).toHaveTextContent("Alice Johnson");
    expect(screen.getByTestId("student-name-2")).toHaveTextContent("Bob Smith");
  });

  it("displays student grades", () => {
    expect(screen.getByTestId("student-grade-math-1")).toHaveTextContent("92");
    expect(screen.getByTestId("student-grade-science-1")).toHaveTextContent("88");
    expect(screen.getByTestId("student-grade-english-1")).toHaveTextContent("95");
    expect(screen.getByTestId("student-grade-history-1")).toHaveTextContent("79");
  });

  it("shows correct student averages", () => {
    expect(screen.getByTestId("student-avg-1")).toHaveTextContent("89");
    expect(screen.getByTestId("student-avg-2")).toHaveTextContent("77");
    expect(screen.getByTestId("student-avg-3")).toHaveTextContent("61");
  });

  it("shows correct passing/failing status", () => {
    expect(screen.getByTestId("student-status-1")).toHaveTextContent("Passing");
    expect(screen.getByTestId("student-status-2")).toHaveTextContent("Passing");
    expect(screen.getByTestId("student-status-3")).toHaveTextContent("Failing");
  });

  it("shows correct class summary", () => {
    expect(screen.getByTestId("passing-count")).toHaveTextContent("2 passing");
    expect(screen.getByTestId("failing-count")).toHaveTextContent("1 failing");
  });

  it("shows class average", () => {
    expect(screen.getByTestId("class-avg")).toHaveTextContent("Class Avg:");
  });

  it("deletes a student and updates summary", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-3"));
    expect(screen.queryByTestId("student-item-3")).toBeNull();
    expect(screen.getByTestId("failing-count")).toHaveTextContent("0 failing");
    expect(screen.getByTestId("passing-count")).toHaveTextContent("2 passing");
  });

  it("adds a new student", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-name"), "New Student");
    await user.type(screen.getByTestId("input-grade-math"), "80");
    await user.type(screen.getByTestId("input-grade-science"), "75");
    await user.type(screen.getByTestId("input-grade-english"), "85");
    await user.type(screen.getByTestId("input-grade-history"), "90");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("student-item-4")).toBeDefined();
    expect(screen.getByTestId("student-name-4")).toHaveTextContent("New Student");
    expect(screen.getByTestId("student-avg-4")).toHaveTextContent("83");
  });

  it("does not add student with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("student-item-4")).toBeNull();
  });

  it("edits a grade and saves", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-edit-grade-1-math"));
    const input = screen.getByTestId("input-edit-grade-1-math");
    await user.clear(input);
    await user.type(input, "100");
    await user.click(screen.getByTestId("btn-save-grade-1-math"));
    expect(screen.getByTestId("student-grade-math-1")).toHaveTextContent("100");
  });

  it("cancels a grade edit and restores original value", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-edit-grade-1-math"));
    const input = screen.getByTestId("input-edit-grade-1-math");
    await user.clear(input);
    await user.type(input, "50");
    await user.click(screen.getByTestId("btn-cancel-grade-1-math"));
    expect(screen.getByTestId("student-grade-math-1")).toHaveTextContent("92");
  });
});
