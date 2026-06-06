import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Fundraiser", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /fundraiser/i })).toBeDefined();
  });

  it("renders seed campaigns", () => {
    expect(screen.getByTestId("campaign-1")).toBeDefined();
    expect(screen.getByTestId("campaign-2")).toBeDefined();
  });

  it("shows correct raised amount for campaign 1", () => {
    expect(screen.getByTestId("campaign-raised-1").textContent).toBe("$350.00");
  });

  it("shows correct progress percentage for campaign 1", () => {
    expect(screen.getByTestId("campaign-progress-1").textContent).toBe("35.0%");
  });

  it("renders progress bar for each campaign", () => {
    expect(screen.getByTestId("progress-bar-1")).toBeDefined();
    expect(screen.getByTestId("progress-bar-2")).toBeDefined();
  });

  it("shows grand total raised across all campaigns", () => {
    expect(screen.getByTestId("grand-total").textContent).toContain("$525.00");
  });

  it("shows total donors count", () => {
    expect(screen.getByTestId("total-donors").textContent).toContain("4");
  });

  it("adds a new campaign", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-campaign-name"), "Winter Coats");
    await user.type(screen.getByTestId("input-campaign-goal"), "750");
    await user.click(screen.getByTestId("btn-add-campaign"));
    expect(screen.getByText("Winter Coats")).toBeDefined();
  });

  it("clears campaign form after adding", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-campaign-name"), "Winter Coats");
    await user.type(screen.getByTestId("input-campaign-goal"), "750");
    await user.click(screen.getByTestId("btn-add-campaign"));
    expect((screen.getByTestId("input-campaign-name") as HTMLInputElement).value).toBe("");
  });

  it("does not add campaign with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-campaign-goal"), "500");
    await user.click(screen.getByTestId("btn-add-campaign"));
    const list = screen.getByTestId("campaigns-list");
    expect(within(list).getAllByRole("listitem").length).toBe(2);
  });

  it("adds a donation to a campaign", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-campaign"), "1");
    await user.type(screen.getByTestId("input-donor-name"), "New Donor");
    await user.type(screen.getByTestId("input-donor-amount"), "50");
    await user.type(screen.getByTestId("input-donor-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add-donation"));
    expect(screen.getByTestId("campaign-raised-1").textContent).toBe("$400.00");
  });

  it("clears donation form after adding", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-campaign"), "1");
    await user.type(screen.getByTestId("input-donor-name"), "New Donor");
    await user.type(screen.getByTestId("input-donor-amount"), "50");
    await user.type(screen.getByTestId("input-donor-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add-donation"));
    expect((screen.getByTestId("input-donor-name") as HTMLInputElement).value).toBe("");
  });

  it("deletes a campaign and its donations", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-campaign-1"));
    expect(screen.queryByTestId("campaign-1")).toBeNull();
    expect(screen.getByTestId("grand-total").textContent).toContain("$175.00");
  });

  it("shows no campaigns message when all deleted", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-campaign-1"));
    await user.click(screen.getByTestId("btn-delete-campaign-2"));
    expect(screen.getByTestId("no-campaigns")).toBeDefined();
  });

  it("progress bar capped at 100% when raised exceeds goal", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("select-campaign"), "2");
    await user.type(screen.getByTestId("input-donor-name"), "Big Donor");
    await user.type(screen.getByTestId("input-donor-amount"), "1000");
    await user.type(screen.getByTestId("input-donor-date"), "2024-04-01");
    await user.click(screen.getByTestId("btn-add-donation"));
    const progressText = screen.getByTestId("campaign-progress-2").textContent;
    expect(progressText).toBe("100.0%");
  });
});
