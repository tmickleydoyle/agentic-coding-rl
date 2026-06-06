import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Growth Chart", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /growth chart/i })).toBeTruthy();
  });

  it("renders all seed measurements", () => {
    expect(screen.getAllByTestId("measurement-item").length).toBe(5);
  });

  it("shows correct total measurements count", () => {
    expect(screen.getByTestId("total-measurements").textContent).toMatch(/5/);
  });

  it("shows latest weight from the first entry in list", () => {
    // seed data: newest-first = id5, weight 19.1
    expect(screen.getByTestId("latest-weight").textContent).toMatch(/19\.1/);
  });

  it("shows latest height from the first entry in list", () => {
    // seed data: newest-first = id5, height 28
    expect(screen.getByTestId("latest-height").textContent).toMatch(/28/);
  });

  it("adds a new measurement and places it at the top", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-12-01");
    await user.clear(screen.getByLabelText(/age \(months\)/i));
    await user.type(screen.getByLabelText(/age \(months\)/i), "12");
    await user.clear(screen.getByLabelText(/weight \(lbs\)/i));
    await user.type(screen.getByLabelText(/weight \(lbs\)/i), "21.5");
    await user.clear(screen.getByLabelText(/height \(in\)/i));
    await user.type(screen.getByLabelText(/height \(in\)/i), "29.5");
    await user.clear(screen.getByLabelText(/head circumference \(in\)/i));
    await user.type(screen.getByLabelText(/head circumference \(in\)/i), "18.0");
    await user.type(screen.getByLabelText(/notes/i), "12 month checkup");
    await user.click(screen.getByRole("button", { name: /add measurement/i }));

    const items = screen.getAllByTestId("measurement-item");
    expect(items.length).toBe(6);
    expect(within(items[0]).getByTestId("measurement-notes").textContent).toBe("12 month checkup");
  });

  it("updates latest weight after adding a new measurement", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-12-01");
    await user.clear(screen.getByLabelText(/weight \(lbs\)/i));
    await user.type(screen.getByLabelText(/weight \(lbs\)/i), "22.0");
    await user.clear(screen.getByLabelText(/height \(in\)/i));
    await user.type(screen.getByLabelText(/height \(in\)/i), "30.0");
    await user.clear(screen.getByLabelText(/head circumference \(in\)/i));
    await user.type(screen.getByLabelText(/head circumference \(in\)/i), "18.5");
    await user.click(screen.getByRole("button", { name: /add measurement/i }));

    expect(screen.getByTestId("latest-weight").textContent).toMatch(/22/);
  });

  it("resets form after adding a measurement", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-12-01");
    await user.clear(screen.getByLabelText(/weight \(lbs\)/i));
    await user.type(screen.getByLabelText(/weight \(lbs\)/i), "21.5");
    await user.clear(screen.getByLabelText(/height \(in\)/i));
    await user.type(screen.getByLabelText(/height \(in\)/i), "29.5");
    await user.clear(screen.getByLabelText(/head circumference \(in\)/i));
    await user.type(screen.getByLabelText(/head circumference \(in\)/i), "18.0");
    await user.type(screen.getByLabelText(/notes/i), "Test");
    await user.click(screen.getByRole("button", { name: /add measurement/i }));

    expect((screen.getByLabelText(/notes/i) as HTMLInputElement).value).toBe("");
  });

  it("does not add measurement when weight is zero", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^date$/i), "2024-12-01");
    await user.clear(screen.getByLabelText(/weight \(lbs\)/i));
    await user.type(screen.getByLabelText(/weight \(lbs\)/i), "0");
    await user.clear(screen.getByLabelText(/height \(in\)/i));
    await user.type(screen.getByLabelText(/height \(in\)/i), "29.5");
    await user.clear(screen.getByLabelText(/head circumference \(in\)/i));
    await user.type(screen.getByLabelText(/head circumference \(in\)/i), "18.0");
    await user.click(screen.getByRole("button", { name: /add measurement/i }));

    expect(screen.getAllByTestId("measurement-item").length).toBe(5);
  });

  it("does not add measurement when date is missing", async () => {
    const user = userEvent.setup();
    await user.clear(screen.getByLabelText(/weight \(lbs\)/i));
    await user.type(screen.getByLabelText(/weight \(lbs\)/i), "21.5");
    await user.clear(screen.getByLabelText(/height \(in\)/i));
    await user.type(screen.getByLabelText(/height \(in\)/i), "29.5");
    await user.clear(screen.getByLabelText(/head circumference \(in\)/i));
    await user.type(screen.getByLabelText(/head circumference \(in\)/i), "18.0");
    await user.click(screen.getByRole("button", { name: /add measurement/i }));

    expect(screen.getAllByTestId("measurement-item").length).toBe(5);
  });

  it("deletes a measurement", async () => {
    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);
    expect(screen.getAllByTestId("measurement-item").length).toBe(4);
  });

  it("updates total count after deletion", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    expect(screen.getByTestId("total-measurements").textContent).toMatch(/4/);
  });

  it("updates latest weight after deleting the first entry", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    // After deleting id5 (19.1), latest becomes id4 (16.4)
    expect(screen.getByTestId("latest-weight").textContent).toMatch(/16\.4/);
  });

  it("each measurement item shows all fields", () => {
    const item = within(screen.getAllByTestId("measurement-item")[0]);
    expect(item.getByTestId("measurement-date").textContent).toBeTruthy();
    expect(item.getByTestId("measurement-age").textContent).toBeTruthy();
    expect(item.getByTestId("measurement-weight").textContent).toBeTruthy();
    expect(item.getByTestId("measurement-height").textContent).toBeTruthy();
    expect(item.getByTestId("measurement-head").textContent).toBeTruthy();
  });
});
