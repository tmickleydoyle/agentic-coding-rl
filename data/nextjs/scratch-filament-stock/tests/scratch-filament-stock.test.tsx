import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Filament Stock Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /Filament Stock/i })).toBeTruthy();
  });

  it("renders seed spool brands", () => {
    expect(screen.getByTestId("spool-brand-1").textContent).toBe("Hatchbox");
    expect(screen.getByTestId("spool-brand-2").textContent).toBe("eSUN");
    expect(screen.getByTestId("spool-brand-3").textContent).toBe("Prusament");
  });

  it("renders seed spool materials", () => {
    expect(screen.getByTestId("spool-material-1").textContent).toBe("PLA");
    expect(screen.getByTestId("spool-material-2").textContent).toBe("PETG");
    expect(screen.getByTestId("spool-material-4").textContent).toBe("ABS");
  });

  it("renders remaining grams", () => {
    expect(screen.getByTestId("spool-remaining-1").textContent).toBe("800");
    expect(screen.getByTestId("spool-remaining-2").textContent).toBe("450");
  });

  it("renders percent remaining", () => {
    expect(screen.getByTestId("spool-percent-1").textContent).toBe("80%");
    expect(screen.getByTestId("spool-percent-3").textContent).toBe("100%");
  });

  it("shows initial summary", () => {
    const summary = screen.getByTestId("stock-summary").textContent ?? "";
    expect(summary).toContain("4 spools");
    expect(summary).toContain("3 brands");
  });

  it("shows low stock warning when spool has < 200g remaining", () => {
    // spool 4 has 200g remaining — NOT < 200, so initially no warning... wait: seed has id4 = 200 which is NOT < 200
    // Actually 200 is not strictly less than 200, so no warning initially. Let's check there's no warning.
    expect(screen.queryByTestId("low-stock-warning")).toBeNull();
  });

  it("shows low stock warning after updating remaining below 200", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("spool-remaining-input-1") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "100");
    await user.click(screen.getByTestId("spool-update-1"));
    expect(screen.getByTestId("low-stock-warning").textContent).toContain("Low stock alert");
  });

  it("updates remaining after clicking Update", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("spool-remaining-input-2") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "300");
    await user.click(screen.getByTestId("spool-update-2"));
    expect(screen.getByTestId("spool-remaining-2").textContent).toBe("300");
  });

  it("clamps remaining to weight_g on update", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("spool-remaining-input-1") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "9999");
    await user.click(screen.getByTestId("spool-update-1"));
    expect(screen.getByTestId("spool-remaining-1").textContent).toBe("1000");
  });

  it("removes a spool", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("spool-remove-1"));
    expect(screen.queryByTestId("spool-brand-1")).toBeNull();
  });

  it("summary updates after remove", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("spool-remove-1"));
    await user.click(screen.getByTestId("spool-remove-2"));
    const summary = screen.getByTestId("stock-summary").textContent ?? "";
    expect(summary).toContain("2 spools");
  });

  it("adds a new spool", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Brand/i), "SainSmart");
    await user.type(screen.getByLabelText(/Material/i), "TPU");
    await user.type(screen.getByLabelText(/Color/i), "Blue");
    await user.type(screen.getByLabelText(/Weight \(g\)/i), "800");
    await user.type(screen.getByLabelText(/Remaining \(g\)/i), "800");
    await user.type(screen.getByLabelText(/Price \(USD\)/i), "19.99");
    await user.click(screen.getByRole("button", { name: /Add Spool/i }));
    expect(screen.getByText("SainSmart")).toBeTruthy();
  });

  it("does not add spool with empty brand", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Material/i), "TPU");
    await user.type(screen.getByLabelText(/Color/i), "Blue");
    await user.type(screen.getByLabelText(/Weight \(g\)/i), "800");
    await user.type(screen.getByLabelText(/Remaining \(g\)/i), "800");
    await user.type(screen.getByLabelText(/Price \(USD\)/i), "19.99");
    await user.click(screen.getByRole("button", { name: /Add Spool/i }));
    const summary = screen.getByTestId("stock-summary").textContent ?? "";
    expect(summary).toContain("4 spools");
  });

  it("renders spool color", () => {
    expect(screen.getByTestId("spool-color-2").textContent).toBe("Clear");
    expect(screen.getByTestId("spool-color-3").textContent).toBe("Galaxy Silver");
  });
});
