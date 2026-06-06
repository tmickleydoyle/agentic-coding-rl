import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Incident Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /incident log/i })).toBeTruthy();
  });

  it("shows all 5 seed incidents", () => {
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`incident-card-${i}`)).toBeTruthy();
    }
  });

  it("incident 5 appears before incident 1 (newest-first)", () => {
    const list = screen.getByRole("region", { name: /incident list/i });
    const cards = within(list).getAllByTestId(/^incident-card-/);
    const ids = cards.map((c) => c.getAttribute("data-testid"));
    expect(ids.indexOf("incident-card-5")).toBeLessThan(ids.indexOf("incident-card-1"));
  });

  it("shows seed notes for incident 1", () => {
    expect(screen.getByTestId("note-1-1")).toBeTruthy();
    expect(screen.getByTestId("note-1-2")).toBeTruthy();
  });

  it("shows error when adding incident with empty fields", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add-incident"));
    expect(screen.getByTestId("form-error").textContent).toMatch(/all required fields/i);
  });

  it("adds a new incident and prepends it", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Redis OOM");
    await user.type(screen.getByTestId("input-service"), "cache");
    await user.selectOptions(screen.getByTestId("input-severity"), "P2");
    await user.selectOptions(screen.getByTestId("input-status"), "investigating");
    await user.type(screen.getByTestId("input-started-at"), "2024-03-10 12:00");
    await user.type(screen.getByTestId("input-description"), "Redis out of memory.");
    await user.click(screen.getByTestId("btn-add-incident"));

    const list = screen.getByRole("region", { name: /incident list/i });
    const cards = within(list).getAllByTestId(/^incident-card-/);
    expect(cards[0].textContent).toContain("Redis OOM");
  });

  it("clears form after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Test incident");
    await user.type(screen.getByTestId("input-service"), "svc");
    await user.selectOptions(screen.getByTestId("input-severity"), "P3");
    await user.selectOptions(screen.getByTestId("input-status"), "resolved");
    await user.type(screen.getByTestId("input-started-at"), "2024-03-10 08:00");
    await user.type(screen.getByTestId("input-description"), "Some issue.");
    await user.click(screen.getByTestId("btn-add-incident"));
    expect((screen.getByTestId("input-title") as HTMLInputElement).value).toBe("");
    expect((screen.getByTestId("input-service") as HTMLInputElement).value).toBe("");
  });

  it("changes incident status via dropdown", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("status-select-3"), "monitoring");
    expect((screen.getByTestId("status-select-3") as HTMLSelectElement).value).toBe("monitoring");
  });

  it("adds a timeline note to an incident", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("note-input-ts-3"), "2024-03-07 12:00");
    await user.type(screen.getByTestId("note-input-text-3"), "Escalated to on-call lead.");
    await user.click(screen.getByTestId("btn-add-note-3"));
    const notesList = screen.getByTestId("notes-list-3");
    expect(within(notesList).getByText("Escalated to on-call lead.")).toBeTruthy();
  });

  it("clears note input after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("note-input-ts-3"), "2024-03-07 12:00");
    await user.type(screen.getByTestId("note-input-text-3"), "Some note.");
    await user.click(screen.getByTestId("btn-add-note-3"));
    expect((screen.getByTestId("note-input-text-3") as HTMLInputElement).value).toBe("");
  });

  it("shows per-card error when note fields are empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add-note-4"));
    expect(screen.getByTestId("note-error-4").textContent).toMatch(/note fields required/i);
  });

  it("filter by status investigating", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-status-investigating"));
    expect(screen.getByTestId("incident-card-3")).toBeTruthy();
    expect(screen.queryByTestId("incident-card-1")).toBeNull();
  });

  it("filter by status resolved", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-status-resolved"));
    expect(screen.getByTestId("incident-card-1")).toBeTruthy();
    expect(screen.getByTestId("incident-card-2")).toBeTruthy();
    expect(screen.queryByTestId("incident-card-3")).toBeNull();
  });

  it("filter-status-all restores all", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-status-monitoring"));
    await user.click(screen.getByTestId("filter-status-all"));
    expect(screen.getByTestId("incident-card-1")).toBeTruthy();
    expect(screen.getByTestId("incident-card-3")).toBeTruthy();
  });

  it("filter by severity P1", async () => {
    const user = userEvent.setup();
    await userEvent.selectOptions(screen.getByTestId("filter-severity-select"), "P1");
    expect(screen.getByTestId("incident-card-1")).toBeTruthy();
    expect(screen.getByTestId("incident-card-3")).toBeTruthy();
    expect(screen.queryByTestId("incident-card-5")).toBeNull();
  });

  it("status and severity filters combine", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-status-resolved"));
    await userEvent.selectOptions(screen.getByTestId("filter-severity-select"), "P1");
    expect(screen.getByTestId("incident-card-1")).toBeTruthy();
    expect(screen.queryByTestId("incident-card-2")).toBeNull();
  });

  it("shows empty message when no incidents match", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-status-monitoring"));
    await userEvent.selectOptions(screen.getByTestId("filter-severity-select"), "P1");
    expect(screen.getByTestId("empty-message")).toBeTruthy();
  });
});
