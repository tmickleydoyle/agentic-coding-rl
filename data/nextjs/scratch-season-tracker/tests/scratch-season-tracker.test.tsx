import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

function getRows() {
  return screen.getAllByTestId("team-row");
}

function getRowField(row: HTMLElement, testId: string) {
  return within(row).getByTestId(testId).textContent ?? "";
}

describe("Season Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /season tracker/i })).toBeTruthy();
  });

  it("shows 6 team rows initially", () => {
    expect(getRows()).toHaveLength(6);
  });

  it("Summit City FC is ranked 1st initially", () => {
    const firstRow = getRows()[0];
    expect(getRowField(firstRow, "row-team")).toBe("Summit City FC");
    expect(getRowField(firstRow, "row-rank")).toBe("1");
  });

  it("Coastal Wanderers is ranked last initially", () => {
    const rows = getRows();
    const lastRow = rows[rows.length - 1];
    expect(getRowField(lastRow, "row-team")).toBe("Coastal Wanderers");
  });

  it("Summit City FC has 26 points initially", () => {
    const firstRow = getRows()[0];
    expect(getRowField(firstRow, "row-points")).toBe("26");
  });

  it("renders the standings table", () => {
    expect(screen.getByTestId("standings-table")).toBeTruthy();
  });

  it("renders home and away team selects", () => {
    expect(screen.getByTestId("select-home")).toBeTruthy();
    expect(screen.getByTestId("select-away")).toBeTruthy();
  });

  it("recording a home win increases home team wins", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-home"), "Coastal Wanderers");
    await user.selectOptions(screen.getByTestId("select-away"), "Harbor Hawks");
    await user.clear(screen.getByTestId("input-home-score"));
    await user.type(screen.getByTestId("input-home-score"), "3");
    await user.clear(screen.getByTestId("input-away-score"));
    await user.type(screen.getByTestId("input-away-score"), "0");
    await user.click(screen.getByTestId("btn-record"));
    const rows = getRows();
    const coastalRow = rows.find((r) => getRowField(r, "row-team") === "Coastal Wanderers")!;
    expect(parseInt(getRowField(coastalRow, "row-wins"))).toBe(2);
  });

  it("recording a draw increments both teams draws", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-home"), "Harbor Hawks");
    await user.selectOptions(screen.getByTestId("select-away"), "Coastal Wanderers");
    await user.clear(screen.getByTestId("input-home-score"));
    await user.type(screen.getByTestId("input-home-score"), "1");
    await user.clear(screen.getByTestId("input-away-score"));
    await user.type(screen.getByTestId("input-away-score"), "1");
    await user.click(screen.getByTestId("btn-record"));
    const rows = getRows();
    const harborRow = rows.find((r) => getRowField(r, "row-team") === "Harbor Hawks")!;
    const coastalRow = rows.find((r) => getRowField(r, "row-team") === "Coastal Wanderers")!;
    expect(parseInt(getRowField(harborRow, "row-draws"))).toBe(4);
    expect(parseInt(getRowField(coastalRow, "row-draws"))).toBe(3);
  });

  it("standings re-sort after a result", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-home"), "Coastal Wanderers");
    await user.selectOptions(screen.getByTestId("select-away"), "Summit City FC");
    await user.clear(screen.getByTestId("input-home-score"));
    await user.type(screen.getByTestId("input-home-score"), "5");
    await user.clear(screen.getByTestId("input-away-score"));
    await user.type(screen.getByTestId("input-away-score"), "0");
    await user.click(screen.getByTestId("btn-record"));
    const rows = getRows();
    const lastRow = rows[rows.length - 1];
    expect(getRowField(lastRow, "row-team")).not.toBe("Coastal Wanderers");
  });

  it("does not record result if home and away are same team", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-home"), "River Rovers");
    await user.selectOptions(screen.getByTestId("select-away"), "River Rovers");
    await user.clear(screen.getByTestId("input-home-score"));
    await user.type(screen.getByTestId("input-home-score"), "2");
    await user.click(screen.getByTestId("btn-record"));
    const rows = getRows();
    const riverRow = rows.find((r) => getRowField(r, "row-team") === "River Rovers")!;
    expect(getRowField(riverRow, "row-wins")).toBe("7");
  });

  it("GD computed correctly for initial seed", () => {
    const rows = getRows();
    const summitRow = rows.find((r) => getRowField(r, "row-team") === "Summit City FC")!;
    expect(getRowField(summitRow, "row-gd")).toBe("14");
  });

  it("GF and GA update after recording a result", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-home"), "Valley Athletic");
    await user.selectOptions(screen.getByTestId("select-away"), "Eastport United");
    await user.clear(screen.getByTestId("input-home-score"));
    await user.type(screen.getByTestId("input-home-score"), "2");
    await user.clear(screen.getByTestId("input-away-score"));
    await user.type(screen.getByTestId("input-away-score"), "1");
    await user.click(screen.getByTestId("btn-record"));
    const rows = getRows();
    const valleyRow = rows.find((r) => getRowField(r, "row-team") === "Valley Athletic")!;
    expect(parseInt(getRowField(valleyRow, "row-gf"))).toBe(20);
    expect(parseInt(getRowField(valleyRow, "row-ga"))).toBe(15);
  });
});
