import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Code Review Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /code review log/i })).toBeTruthy();
  });

  it("renders all 5 seed rows", () => {
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`review-row-${i}`)).toBeTruthy();
    }
  });

  it("shows status badges for seed data", () => {
    expect(screen.getByTestId("status-badge-1").textContent).toBe("approved");
    expect(screen.getByTestId("status-badge-2").textContent).toBe("rejected");
    expect(screen.getByTestId("status-badge-3").textContent).toBe("pending");
  });

  it("shows correct comment counts", () => {
    expect(screen.getByTestId("comments-1").textContent).toBe("3");
    expect(screen.getByTestId("comments-2").textContent).toBe("7");
  });

  it("shows stat-total as 5", () => {
    expect(screen.getByTestId("stat-total").textContent).toContain("5");
  });

  it("shows stat-approved as 2", () => {
    expect(screen.getByTestId("stat-approved").textContent).toContain("2");
  });

  it("shows correct average comments", () => {
    // (3+7+2+1+4)/5 = 3.4
    expect(screen.getByTestId("stat-avg-comments").textContent).toContain("3.4");
  });

  it("filters to approved only", async () => {
    await userEvent.click(screen.getByTestId("filter-approved"));
    expect(screen.getByTestId("review-row-1")).toBeTruthy();
    expect(screen.getByTestId("review-row-4")).toBeTruthy();
    expect(screen.queryByTestId("review-row-2")).toBeNull();
    expect(screen.queryByTestId("review-row-3")).toBeNull();
  });

  it("filters to rejected only", async () => {
    await userEvent.click(screen.getByTestId("filter-rejected"));
    expect(screen.getByTestId("review-row-2")).toBeTruthy();
    expect(screen.queryByTestId("review-row-1")).toBeNull();
  });

  it("filter all restores all rows", async () => {
    await userEvent.click(screen.getByTestId("filter-approved"));
    await userEvent.click(screen.getByTestId("filter-all"));
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`review-row-${i}`)).toBeTruthy();
    }
  });

  it("adds a new review on valid submit", async () => {
    await userEvent.type(screen.getByTestId("input-reviewer"), "eve");
    await userEvent.type(screen.getByTestId("input-pr-title"), "New feature branch");
    await userEvent.click(screen.getByTestId("btn-add-review"));
    expect(screen.getByTestId("review-row-6")).toBeTruthy();
  });

  it("does not add review with empty reviewer", async () => {
    await userEvent.type(screen.getByTestId("input-pr-title"), "Some PR");
    await userEvent.click(screen.getByTestId("btn-add-review"));
    expect(screen.queryByTestId("review-row-6")).toBeNull();
  });

  it("does not add review with empty pr_title", async () => {
    await userEvent.type(screen.getByTestId("input-reviewer"), "frank");
    await userEvent.click(screen.getByTestId("btn-add-review"));
    expect(screen.queryByTestId("review-row-6")).toBeNull();
  });

  it("clears form after valid add", async () => {
    const reviewerInput = screen.getByTestId("input-reviewer") as HTMLInputElement;
    await userEvent.type(reviewerInput, "grace");
    await userEvent.type(screen.getByTestId("input-pr-title"), "Fix typo");
    await userEvent.click(screen.getByTestId("btn-add-review"));
    expect(reviewerInput.value).toBe("");
  });

  it("deletes a row on delete button click", async () => {
    await userEvent.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("review-row-1")).toBeNull();
    expect(screen.getByTestId("stat-total").textContent).toContain("4");
  });

  it("stats reflect all entries not filtered view", async () => {
    await userEvent.click(screen.getByTestId("filter-approved"));
    expect(screen.getByTestId("stat-total").textContent).toContain("5");
  });
});
