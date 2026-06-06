import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

function getRows() {
  return screen.getAllByTestId("player-row");
}

function getCellText(row: HTMLElement, testId: string) {
  return within(row).getByTestId(testId).textContent ?? "";
}

describe("Sports Stats Dashboard", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /sports stats/i })).toBeTruthy();
  });

  it("renders all 6 players by default", () => {
    expect(getRows()).toHaveLength(6);
  });

  it("renders the position filter select", () => {
    expect(screen.getByTestId("position-filter")).toBeTruthy();
  });

  it("renders the stats table", () => {
    expect(screen.getByTestId("stats-table")).toBeTruthy();
  });

  it("filters players by Guard position", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("position-filter"), "Guard");
    const rows = getRows();
    expect(rows).toHaveLength(2);
    const names = rows.map((r) => getCellText(r, "cell-name"));
    expect(names).toContain("Marcus Jordan");
    expect(names).toContain("Layla Thompson");
  });

  it("filters players by Center position", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("position-filter"), "Center");
    const rows = getRows();
    expect(rows).toHaveLength(2);
    const names = rows.map((r) => getCellText(r, "cell-name"));
    expect(names).toContain("Chris Okafor");
    expect(names).toContain("Tony Kowalski");
  });

  it("restores all players when filter set to All", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("position-filter"), "Forward");
    await user.selectOptions(screen.getByTestId("position-filter"), "All");
    expect(getRows()).toHaveLength(6);
  });

  it("sorts by Points ascending on first click", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /points/i }));
    const rows = getRows();
    const points = rows.map((r) => parseFloat(getCellText(r, "cell-points")));
    expect(points[0]).toBe(9.4);
    expect(points[5]).toBe(24.5);
  });

  it("sorts by Points descending on second click", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /points/i }));
    await user.click(screen.getByRole("button", { name: /points/i }));
    const rows = getRows();
    const points = rows.map((r) => parseFloat(getCellText(r, "cell-points")));
    expect(points[0]).toBe(24.5);
    expect(points[5]).toBe(9.4);
  });

  it("sorts by Rebounds ascending", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /rebounds/i }));
    const rows = getRows();
    const rebounds = rows.map((r) => parseFloat(getCellText(r, "cell-rebounds")));
    expect(rebounds[0]).toBe(3.2);
    expect(rebounds[5]).toBe(13.2);
  });

  it("combines filter and sort: Forwards sorted by Rebounds descending", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("position-filter"), "Forward");
    await user.click(screen.getByRole("button", { name: /rebounds/i }));
    await user.click(screen.getByRole("button", { name: /rebounds/i }));
    const rows = getRows();
    expect(rows).toHaveLength(2);
    expect(getCellText(rows[0], "cell-name")).toBe("Devon Williams");
    expect(getCellText(rows[1], "cell-name")).toBe("Sam Reyes");
  });

  it("sorts by FG% numerically", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /fg%/i }));
    const rows = getRows();
    const fg = rows.map((r) => parseFloat(getCellText(r, "cell-fg")));
    expect(fg[0]).toBe(44.7);
    expect(fg[5]).toBe(58.8);
  });

  it("switching sort column resets to ascending", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /points/i }));
    await user.click(screen.getByRole("button", { name: /points/i }));
    await user.click(screen.getByRole("button", { name: /assists/i }));
    const rows = getRows();
    const assists = rows.map((r) => parseFloat(getCellText(r, "cell-assists")));
    expect(assists[0]).toBeLessThan(assists[1]);
  });

  it("each player row shows correct position cell", () => {
    const rows = getRows();
    const positions = rows.map((r) => getCellText(r, "cell-position"));
    expect(positions.filter((p) => p === "Guard")).toHaveLength(2);
    expect(positions.filter((p) => p === "Forward")).toHaveLength(2);
    expect(positions.filter((p) => p === "Center")).toHaveLength(2);
  });
});
