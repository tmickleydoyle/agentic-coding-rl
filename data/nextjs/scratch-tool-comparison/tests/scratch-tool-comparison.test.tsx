import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Tool Comparison", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /tool comparison/i })).toBeTruthy();
  });

  it("renders comparison table", () => {
    expect(screen.getByTestId("comparison-table")).toBeTruthy();
  });

  it("renders all 4 seed tools as rows", () => {
    expect(screen.getAllByTestId("tool-row").length).toBe(4);
  });

  it("shows tool names in rows", () => {
    const names = screen.getAllByTestId("tool-name").map((n) => n.textContent);
    expect(names).toContain("GitHub Actions");
    expect(names).toContain("Jenkins");
  });

  it("shows score-0 for first criterion", () => {
    const scores = screen.getAllByTestId("score-0");
    expect(scores.length).toBe(4);
    // GitHub Actions ease-of-use = 9
    expect(scores[0].textContent).toBe("9");
  });

  it("shows tool averages to 1 decimal", () => {
    const avgs = screen.getAllByTestId("tool-average");
    expect(avgs.length).toBe(4);
    // GitHub Actions: (9+8+7+10)/4 = 8.5
    expect(avgs[0].textContent).toBe("8.5");
  });

  it("highlight best button toggles and marks best tool row", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("highlight-best-btn"));
    expect(screen.getByTestId("best-tool")).toBeTruthy();
    // GitHub Actions avg 8.5 is highest
    expect(screen.getByTestId("best-tool").textContent).toContain("GitHub Actions");
  });

  it("highlight best toggling off removes best-tool testid", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("highlight-best-btn"));
    await user.click(screen.getByTestId("highlight-best-btn"));
    expect(screen.queryByTestId("best-tool")).toBeNull();
  });

  it("can remove a tool", async () => {
    const user = userEvent.setup();
    const rows = screen.getAllByTestId("tool-row");
    await user.click(within(rows[0]).getByTestId("remove-tool-btn"));
    expect(screen.getAllByTestId("tool-row").length).toBe(3);
  });

  it("can add a new tool", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-tool-name"), "Travis CI");
    await user.click(screen.getByRole("button", { name: /add tool/i }));
    expect(screen.getAllByTestId("tool-row").length).toBe(5);
  });

  it("does not add tool with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add tool/i }));
    expect(screen.getAllByTestId("tool-row").length).toBe(4);
  });

  it("can add a new criterion", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-criterion"), "Documentation");
    await user.click(screen.getByRole("button", { name: /add criterion/i }));
    // New score column should appear: score-4
    const scores4 = screen.getAllByTestId("score-4");
    expect(scores4.length).toBe(4);
  });

  it("new criterion defaults existing tools to 0", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-criterion"), "Support");
    await user.click(screen.getByRole("button", { name: /add criterion/i }));
    const scores4 = screen.getAllByTestId("score-4");
    scores4.forEach((s) => expect(s.textContent).toBe("0"));
  });

  it("does not add criterion with empty name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /add criterion/i }));
    expect(screen.queryByTestId("score-4")).toBeNull();
  });
});
