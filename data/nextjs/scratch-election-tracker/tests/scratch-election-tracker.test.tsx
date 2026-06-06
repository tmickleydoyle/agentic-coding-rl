import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Election Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /election tracker/i })).toBeTruthy();
  });

  it("renders three candidate cards from seed data", () => {
    const cards = screen.getAllByTestId("candidate-card");
    expect(cards.length).toBe(3);
  });

  it("shows total votes from seed data", () => {
    const total = screen.getByTestId("total-votes");
    expect(total.textContent).toBe("32100");
  });

  it("shows a LEADING badge on Alice Mercer (highest votes)", () => {
    const cards = screen.getAllByTestId("candidate-card");
    const aliceCard = cards.find((card) =>
      within(card).getByTestId("candidate-name").textContent === "Alice Mercer"
    );
    expect(aliceCard).toBeTruthy();
    expect(within(aliceCard!).getByTestId("leading-badge")).toBeTruthy();
  });

  it("does not show LEADING badge on Carol Nguyen (lowest votes)", () => {
    const cards = screen.getAllByTestId("candidate-card");
    const carolCard = cards.find((card) =>
      within(card).getByTestId("candidate-name").textContent === "Carol Nguyen"
    );
    expect(carolCard).toBeTruthy();
    expect(within(carolCard!).queryByTestId("leading-badge")).toBeNull();
  });

  it("shows candidate party affiliations", () => {
    const parties = screen.getAllByTestId("candidate-party").map((el) => el.textContent);
    expect(parties).toContain("Progressive");
    expect(parties).toContain("Conservative");
    expect(parties).toContain("Independent");
  });

  it("adds votes to a candidate and updates total", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("candidate-select");
    const input = screen.getByTestId("votes-input");
    const btn = screen.getByTestId("add-votes-btn");

    await user.selectOptions(select, "Alice Mercer");
    await user.clear(input);
    await user.type(input, "500");
    await user.click(btn);

    const total = screen.getByTestId("total-votes");
    expect(total.textContent).toBe("32600");
  });

  it("clears the votes input after submission", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("candidate-select");
    const input = screen.getByTestId("votes-input") as HTMLInputElement;
    const btn = screen.getByTestId("add-votes-btn");

    await user.selectOptions(select, "Bob Harrington");
    await user.clear(input);
    await user.type(input, "200");
    await user.click(btn);

    expect(input.value).toBe("");
  });

  it("does not change votes when input is 0 or negative", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("candidate-select");
    const input = screen.getByTestId("votes-input");
    const btn = screen.getByTestId("add-votes-btn");

    await user.selectOptions(select, "Carol Nguyen");
    await user.clear(input);
    await user.type(input, "0");
    await user.click(btn);

    const total = screen.getByTestId("total-votes");
    expect(total.textContent).toBe("32100");
  });

  it("resets all vote counts when Reset is clicked", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("candidate-select");
    const input = screen.getByTestId("votes-input");
    const addBtn = screen.getByTestId("add-votes-btn");
    const resetBtn = screen.getByTestId("reset-btn");

    await user.selectOptions(select, "Alice Mercer");
    await user.clear(input);
    await user.type(input, "1000");
    await user.click(addBtn);

    await user.click(resetBtn);

    const total = screen.getByTestId("total-votes");
    expect(total.textContent).toBe("32100");
  });

  it("updates LEADING badge after adding votes changes the leader", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("candidate-select");
    const input = screen.getByTestId("votes-input");
    const btn = screen.getByTestId("add-votes-btn");

    // Give Bob enough to take the lead
    await user.selectOptions(select, "Bob Harrington");
    await user.clear(input);
    await user.type(input, "1000");
    await user.click(btn);

    const cards = screen.getAllByTestId("candidate-card");
    const bobCard = cards.find((card) =>
      within(card).getByTestId("candidate-name").textContent === "Bob Harrington"
    );
    expect(within(bobCard!).getByTestId("leading-badge")).toBeTruthy();

    const aliceCard = cards.find((card) =>
      within(card).getByTestId("candidate-name").textContent === "Alice Mercer"
    );
    expect(within(aliceCard!).queryByTestId("leading-badge")).toBeNull();
  });

  it("updates percentage display after adding votes", async () => {
    const user = userEvent.setup();
    const select = screen.getByTestId("candidate-select");
    const input = screen.getByTestId("votes-input");
    const btn = screen.getByTestId("add-votes-btn");

    await user.selectOptions(select, "Carol Nguyen");
    await user.clear(input);
    await user.type(input, "900");
    await user.click(btn);

    // Carol now has 5000 / 33000 = 15.2%
    const cards = screen.getAllByTestId("candidate-card");
    const carolCard = cards.find((card) =>
      within(card).getByTestId("candidate-name").textContent === "Carol Nguyen"
    );
    const pct = within(carolCard!).getByTestId("candidate-pct");
    expect(pct.textContent).toContain("15.2");
  });
});
