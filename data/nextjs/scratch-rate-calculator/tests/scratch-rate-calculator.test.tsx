import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Rate Calculator", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByTestId("page-heading")).toHaveTextContent("Rate Calculator");
  });

  it("shows results panel", () => {
    expect(screen.getByTestId("results-panel")).toBeInTheDocument();
  });

  it("shows default gross income needed for Full-time defaults", () => {
    // income 80000, tax 25% = 20000, expenses 5000 => gross = 105000
    expect(screen.getByTestId("result-gross")).toHaveTextContent("$105000.00");
  });

  it("shows default billable hours for Full-time defaults", () => {
    // 48 weeks * 40 hrs = 1920 total, 70% billable = 1344
    expect(screen.getByTestId("result-billable-hours")).toHaveTextContent("1344");
  });

  it("shows default minimum rate", () => {
    // 105000 / 1344 = ~78.13
    const minRate = screen.getByTestId("result-min-rate").textContent ?? "";
    expect(minRate).toMatch(/^\$\d+\.\d{2}$/);
  });

  it("shows recommended rate higher than minimum rate", () => {
    const minText = screen.getByTestId("result-min-rate").textContent ?? "";
    const recText = screen.getByTestId("result-recommended-rate").textContent ?? "";
    const minVal = parseFloat(minText.replace("$", ""));
    const recVal = parseFloat(recText.replace("$", ""));
    expect(recVal).toBeCloseTo(minVal * 1.2, 1);
  });

  it("Part-time preset sets correct values", async () => {
    await userEvent.click(screen.getByTestId("preset-part-time"));
    expect(screen.getByTestId("input-income-goal")).toHaveValue(40000);
    expect(screen.getByTestId("input-weeks")).toHaveValue(48);
    expect(screen.getByTestId("input-hours-per-week")).toHaveValue(20);
  });

  it("Full-time preset sets correct values", async () => {
    await userEvent.click(screen.getByTestId("preset-full-time"));
    expect(screen.getByTestId("input-income-goal")).toHaveValue(80000);
    expect(screen.getByTestId("input-hours-per-week")).toHaveValue(40);
    expect(screen.getByTestId("input-tax-rate")).toHaveValue(25);
  });

  it("Consulting preset sets correct values", async () => {
    await userEvent.click(screen.getByTestId("preset-consulting"));
    expect(screen.getByTestId("input-income-goal")).toHaveValue(150000);
    expect(screen.getByTestId("input-weeks")).toHaveValue(46);
    expect(screen.getByTestId("input-expenses")).toHaveValue(15000);
  });

  it("results update when income goal changes", async () => {
    const input = screen.getByTestId("input-income-goal");
    await userEvent.clear(input);
    await userEvent.type(input, "100000");
    const minRate = screen.getByTestId("result-min-rate").textContent ?? "";
    expect(minRate).not.toBe("N/A");
    expect(minRate).toMatch(/^\$\d+\.\d{2}$/);
  });

  it("shows N/A when weeks is 0", async () => {
    const input = screen.getByTestId("input-weeks");
    await userEvent.clear(input);
    await userEvent.type(input, "0");
    expect(screen.getByTestId("result-min-rate")).toHaveTextContent("N/A");
    expect(screen.getByTestId("result-recommended-rate")).toHaveTextContent("N/A");
  });

  it("shows N/A when hours per week is 0", async () => {
    const input = screen.getByTestId("input-hours-per-week");
    await userEvent.clear(input);
    await userEvent.type(input, "0");
    expect(screen.getByTestId("result-min-rate")).toHaveTextContent("N/A");
  });

  it("shows N/A when non-billable is 100", async () => {
    const input = screen.getByTestId("input-non-billable");
    await userEvent.clear(input);
    await userEvent.type(input, "100");
    expect(screen.getByTestId("result-min-rate")).toHaveTextContent("N/A");
  });

  it("gross needed includes expenses", async () => {
    await userEvent.click(screen.getByTestId("preset-part-time"));
    // income 40000, tax 20% = 8000, expenses 2000 => gross = 50000
    expect(screen.getByTestId("result-gross")).toHaveTextContent("$50000.00");
  });
});
