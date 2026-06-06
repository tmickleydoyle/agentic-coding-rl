import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Postmortem Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /postmortem tracker/i })).toBeTruthy();
  });

  it("shows all 3 seed postmortems", () => {
    expect(screen.getByTestId("pm-card-1")).toBeTruthy();
    expect(screen.getByTestId("pm-card-2")).toBeTruthy();
    expect(screen.getByTestId("pm-card-3")).toBeTruthy();
  });

  it("pm-card-3 appears before pm-card-1 (newest-first)", () => {
    const list = screen.getByRole("region", { name: /postmortem list/i });
    const cards = within(list).getAllByTestId(/^pm-card-/);
    const ids = cards.map((c) => c.getAttribute("data-testid"));
    expect(ids.indexOf("pm-card-3")).toBeLessThan(ids.indexOf("pm-card-1"));
  });

  it("shows correct done count for PM 1 (1/3 done)", () => {
    expect(screen.getByTestId("pm-done-1").textContent).toBe("1/3 done");
  });

  it("shows contributing factors for PM 1", () => {
    expect(screen.getByTestId("factor-1-0").textContent).toContain("Connection leak");
  });

  it("shows error when creating with empty fields", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-create"));
    expect(screen.getByTestId("form-error").textContent).toMatch(/all fields are required/i);
  });

  it("creates a new postmortem and prepends it", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "New Outage");
    await user.type(screen.getByTestId("input-incident-date"), "2024-03-15");
    await user.type(screen.getByTestId("input-author"), "dave");
    await user.selectOptions(screen.getByTestId("input-severity"), "P3");
    await user.type(screen.getByTestId("input-summary"), "Brief outage on service X.");
    await user.click(screen.getByTestId("btn-create"));

    const list = screen.getByRole("region", { name: /postmortem list/i });
    const cards = within(list).getAllByTestId(/^pm-card-/);
    expect(cards[0].textContent).toContain("New Outage");
  });

  it("new postmortem shows 0/0 done", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Empty PM");
    await user.type(screen.getByTestId("input-incident-date"), "2024-03-15");
    await user.type(screen.getByTestId("input-author"), "eve");
    await user.selectOptions(screen.getByTestId("input-severity"), "P2");
    await user.type(screen.getByTestId("input-summary"), "Something happened.");
    await user.click(screen.getByTestId("btn-create"));

    const list = screen.getByRole("region", { name: /postmortem list/i });
    const cards = within(list).getAllByTestId(/^pm-card-/);
    const newId = cards[0].getAttribute("data-testid")?.replace("pm-card-", "");
    expect(screen.getByTestId(`pm-done-${newId}`).textContent).toBe("0/0 done");
  });

  it("clears form after creating", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Test PM");
    await user.type(screen.getByTestId("input-incident-date"), "2024-03-15");
    await user.type(screen.getByTestId("input-author"), "tester");
    await user.selectOptions(screen.getByTestId("input-severity"), "P1");
    await user.type(screen.getByTestId("input-summary"), "Summary.");
    await user.click(screen.getByTestId("btn-create"));
    expect((screen.getByTestId("input-title") as HTMLInputElement).value).toBe("");
  });

  it("toggles action item done and updates count", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("action-check-1-2"));
    expect(screen.getByTestId("pm-done-1").textContent).toBe("2/3 done");
  });

  it("toggling action in PM 1 does not affect PM 2", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("action-check-1-2"));
    expect(screen.getByTestId("pm-done-2").textContent).toBe("1/2 done");
  });

  it("adds a contributing factor", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("factor-input-2"), "Missing runbook");
    await user.click(screen.getByTestId("btn-add-factor-2"));
    const factorsList = screen.getByTestId("pm-factors-2");
    expect(within(factorsList).getByText("Missing runbook")).toBeTruthy();
  });

  it("does not add empty contributing factor", async () => {
    const user = userEvent.setup();
    const factorsList = screen.getByTestId("pm-factors-1");
    const before = within(factorsList).getAllByRole("listitem").length;
    await user.click(screen.getByTestId("btn-add-factor-1"));
    expect(within(factorsList).getAllByRole("listitem").length).toBe(before);
  });

  it("adds an action item", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("action-input-3"), "Write runbook");
    await user.click(screen.getByTestId("btn-add-action-3"));
    const actionsList = screen.getByTestId("pm-actions-3");
    expect(within(actionsList).getByText("Write runbook")).toBeTruthy();
    expect(screen.getByTestId("pm-done-3").textContent).toBe("1/4 done");
  });

  it("clears action input after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("action-input-2"), "Some action");
    await user.click(screen.getByTestId("btn-add-action-2"));
    expect((screen.getByTestId("action-input-2") as HTMLInputElement).value).toBe("");
  });

  it("filter by P1 shows only P1 postmortems", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-P1"));
    expect(screen.getByTestId("pm-card-1")).toBeTruthy();
    expect(screen.queryByTestId("pm-card-2")).toBeNull();
    expect(screen.queryByTestId("pm-card-3")).toBeNull();
  });

  it("search filters by title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-search"), "CDN");
    expect(screen.getByTestId("pm-card-3")).toBeTruthy();
    expect(screen.queryByTestId("pm-card-1")).toBeNull();
  });

  it("search and severity filter combine", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-P2"));
    await user.type(screen.getByTestId("input-search"), "token");
    expect(screen.getByTestId("pm-card-2")).toBeTruthy();
    expect(screen.queryByTestId("pm-card-3")).toBeNull();
  });

  it("shows empty message when nothing matches", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-search"), "xyzzy_no_match");
    expect(screen.getByTestId("empty-message")).toBeTruthy();
  });
});
