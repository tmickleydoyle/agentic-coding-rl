import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Aftercare Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /aftercare log/i })).toBeTruthy();
  });

  it("renders 4 seed log cards", () => {
    expect(screen.getAllByTestId("log-card").length).toBe(4);
  });

  it("shows initial progress: 2 / 4 steps completed", () => {
    expect(screen.getByTestId("progress-summary").textContent).toMatch(/2\s*\/\s*4/);
  });

  it("renders completed-badge on pre-completed entries", () => {
    expect(screen.getAllByTestId("completed-badge").length).toBe(2);
  });

  it("adds a new log entry", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("piece-input"), "Right shoulder tattoo");
    await user.type(screen.getByTestId("step-input"), "Pat dry after shower");
    await user.type(screen.getByTestId("due-date-input"), "2024-06-10");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("log-card").length).toBe(5);
    expect(screen.getByText("Pat dry after shower")).toBeTruthy();
  });

  it("clears fields after adding", async () => {
    const user = userEvent.setup();
    const pieceInput = screen.getByTestId("piece-input") as HTMLInputElement;
    const stepInput = screen.getByTestId("step-input") as HTMLInputElement;
    const dateInput = screen.getByTestId("due-date-input") as HTMLInputElement;
    await user.type(pieceInput, "Test piece");
    await user.type(stepInput, "Test step");
    await user.type(dateInput, "2024-06-15");
    await user.click(screen.getByTestId("add-button"));
    expect(pieceInput.value).toBe("");
    expect(stepInput.value).toBe("");
    expect(dateInput.value).toBe("");
  });

  it("does not add when piece is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("step-input"), "Clean");
    await user.type(screen.getByTestId("due-date-input"), "2024-06-01");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("log-card").length).toBe(4);
  });

  it("does not add when step is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("piece-input"), "Ear piercing");
    await user.type(screen.getByTestId("due-date-input"), "2024-06-01");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("log-card").length).toBe(4);
  });

  it("does not add when due date is empty", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("piece-input"), "Ear piercing");
    await user.type(screen.getByTestId("step-input"), "Saline spray");
    await user.click(screen.getByTestId("add-button"));
    expect(screen.getAllByTestId("log-card").length).toBe(4);
  });

  it("toggles completed on an entry", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("log-card");
    // card[1] = Apply moisturizer, not completed
    expect(within(cards[1]).queryByTestId("completed-badge")).toBeNull();
    await user.click(within(cards[1]).getByTestId("toggle-completed-button"));
    expect(within(cards[1]).getByTestId("completed-badge")).toBeTruthy();
  });

  it("deletes a log entry", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("log-card");
    await user.click(within(cards[0]).getByTestId("delete-button"));
    expect(screen.getAllByTestId("log-card").length).toBe(3);
  });

  it("filters by piece", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("piece-filter"), "Nostril piercing");
    expect(screen.getAllByTestId("log-card").length).toBe(1);
  });

  it("progress summary reflects filtered entries", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("piece-filter"), "Left arm tattoo");
    expect(screen.getByTestId("progress-summary").textContent).toMatch(/1\s*\/\s*2/);
  });

  it("new piece appears in filter dropdown", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("piece-input"), "Brand new piece");
    await user.type(screen.getByTestId("step-input"), "Some step");
    await user.type(screen.getByTestId("due-date-input"), "2024-06-20");
    await user.click(screen.getByTestId("add-button"));
    const filter = screen.getByTestId("piece-filter") as HTMLSelectElement;
    const options = Array.from(filter.options).map((o) => o.value);
    expect(options).toContain("Brand new piece");
  });
});
