import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("PR Checklist", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /pr checklist/i })).toBeTruthy();
  });

  it("shows all 3 seed PRs on load", () => {
    expect(screen.getByTestId("pr-card-1")).toBeTruthy();
    expect(screen.getByTestId("pr-card-2")).toBeTruthy();
    expect(screen.getByTestId("pr-card-3")).toBeTruthy();
  });

  it("displays PR number and title", () => {
    expect(screen.getByTestId("pr-title-1").textContent).toContain("101");
    expect(screen.getByTestId("pr-title-1").textContent).toContain("Add user authentication");
  });

  it("shows correct completion count for PR 1 (1/4)", () => {
    expect(screen.getByTestId("pr-completion-1").textContent).toBe("1/4 items");
  });

  it("shows Ready to merge! for fully checked PR 3", () => {
    expect(screen.getByTestId("pr-completion-3").textContent).toBe("Ready to merge!");
  });

  it("toggles a checklist item and updates completion count", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("checkbox-1-1"));
    expect(screen.getByTestId("pr-completion-1").textContent).toBe("2/4 items");
  });

  it("toggling item in PR 1 does not affect PR 2", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("checkbox-1-1"));
    expect(screen.getByTestId("pr-completion-2").textContent).toBe("0/4 items");
  });

  it("adds a checklist item to a PR", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("item-input-2"), "Check accessibility");
    await user.click(screen.getByTestId("btn-add-item-2"));
    const card = screen.getByTestId("pr-card-2");
    expect(within(card).getByText("Check accessibility")).toBeTruthy();
    expect(screen.getByTestId("pr-completion-2").textContent).toBe("0/5 items");
  });

  it("clears item input after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("item-input-1"), "New item");
    await user.click(screen.getByTestId("btn-add-item-1"));
    expect((screen.getByTestId("item-input-1") as HTMLInputElement).value).toBe("");
  });

  it("does not add item when input is empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add-item-1"));
    expect(screen.getByTestId("pr-completion-1").textContent).toBe("1/4 items");
  });

  it("shows error when adding PR with empty fields", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add-pr"));
    expect(screen.getByTestId("form-error").textContent).toMatch(/all fields are required/i);
  });

  it("adds a new PR and prepends it to the list", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-pr-number"), "104");
    await user.type(screen.getByTestId("input-title"), "New feature");
    await user.type(screen.getByTestId("input-author"), "dave");
    await user.selectOptions(screen.getByTestId("input-status"), "open");
    await user.click(screen.getByTestId("btn-add-pr"));

    const list = screen.getByRole("region", { name: /pr list/i });
    const cards = within(list).getAllByTestId(/^pr-card-/);
    expect(cards[0].textContent).toContain("New feature");
  });

  it("new PR starts with No items", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-pr-number"), "105");
    await user.type(screen.getByTestId("input-title"), "Empty PR");
    await user.type(screen.getByTestId("input-author"), "eve");
    await user.selectOptions(screen.getByTestId("input-status"), "merged");
    await user.click(screen.getByTestId("btn-add-pr"));
    const list = screen.getByRole("region", { name: /pr list/i });
    const cards = within(list).getAllByTestId(/^pr-card-/);
    const newCard = cards[0];
    const newId = newCard.getAttribute("data-testid")?.replace("pr-card-", "");
    expect(screen.getByTestId(`pr-completion-${newId}`).textContent).toBe("No items");
  });

  it("filter Open shows only open PRs", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-open"));
    expect(screen.getByTestId("pr-card-1")).toBeTruthy();
    expect(screen.getByTestId("pr-card-2")).toBeTruthy();
    expect(screen.queryByTestId("pr-card-3")).toBeNull();
  });

  it("filter Merged shows only merged PRs", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-merged"));
    expect(screen.queryByTestId("pr-card-1")).toBeNull();
    expect(screen.getByTestId("pr-card-3")).toBeTruthy();
  });

  it("filter All restores all PRs", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-merged"));
    await user.click(screen.getByTestId("filter-all"));
    expect(screen.getByTestId("pr-card-1")).toBeTruthy();
    expect(screen.getByTestId("pr-card-3")).toBeTruthy();
  });
});
