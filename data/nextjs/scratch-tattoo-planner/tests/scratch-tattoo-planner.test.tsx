import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Tattoo Planner", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /tattoo planner/i })).toBeTruthy();
  });

  it("renders seed data — 4 idea cards", () => {
    const cards = screen.getAllByTestId("idea-card");
    expect(cards.length).toBe(4);
  });

  it("shows initial completion count", () => {
    expect(screen.getByTestId("completion-count").textContent).toMatch(/1\s*\/\s*4/);
  });

  it("adds a new idea and shows it in the list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Koi fish");
    await user.type(screen.getByTestId("placement-input"), "Back");
    await user.click(screen.getByTestId("add-button"));
    const cards = screen.getAllByTestId("idea-card");
    expect(cards.length).toBe(5);
    expect(screen.getByText("Koi fish")).toBeTruthy();
  });

  it("clears name and placement fields after adding", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("name-input") as HTMLInputElement;
    const placementInput = screen.getByTestId("placement-input") as HTMLInputElement;
    await user.type(nameInput, "Dragon");
    await user.type(placementInput, "Thigh");
    await user.click(screen.getByTestId("add-button"));
    expect(nameInput.value).toBe("");
    expect(placementInput.value).toBe("");
  });

  it("does not add an idea when name is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("placement-input"), "Shoulder");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("idea-card").length).toBe(4);
  });

  it("does not add an idea when placement is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("name-input"), "Phoenix");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("idea-card").length).toBe(4);
  });

  it("toggles done on an idea card", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("idea-card");
    const firstCard = cards[0];
    expect(within(firstCard).queryByTestId("idea-done")).toBeNull();
    await user.click(within(firstCard).getByTestId("toggle-done-button"));
    expect(within(firstCard).getByTestId("idea-done")).toBeTruthy();
  });

  it("deletes an idea card", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("idea-card");
    await user.click(within(cards[0]).getByTestId("delete-button"));
    expect(screen.getAllByTestId("idea-card").length).toBe(3);
  });

  it("filters by style", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-select"), "Fine line");
    const cards = screen.getAllByTestId("idea-card");
    expect(cards.length).toBe(1);
    expect(screen.getByText("Minimalist sun")).toBeTruthy();
  });

  it("shows empty list when no ideas match filter", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-select"), "Blackwork");
    expect(screen.queryAllByTestId("idea-card").length).toBe(0);
  });

  it("completion count updates when filter is applied", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-select"), "Traditional");
    expect(screen.getByTestId("completion-count").textContent).toMatch(/1\s*\/\s*1/);
  });

  it("completion count updates after toggling done", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("idea-card");
    await user.click(within(cards[0]).getByTestId("toggle-done-button"));
    expect(screen.getByTestId("completion-count").textContent).toMatch(/2\s*\/\s*4/);
  });
});
