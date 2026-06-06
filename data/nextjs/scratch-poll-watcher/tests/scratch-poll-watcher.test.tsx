import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Poll Watcher Dashboard", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByRole("heading", { name: /poll watcher dashboard/i })).toBeTruthy();
  });

  it("shows correct counts from seed data", () => {
    expect(screen.getByTestId("open-count").textContent).toBe("2");
    expect(screen.getByTestId("closed-count").textContent).toBe("1");
    expect(screen.getByTestId("issue-count").textContent).toBe("1");
  });

  it("renders 4 station cards from seed data", () => {
    expect(screen.getAllByTestId("station-card").length).toBe(4);
  });

  it("shows station names and districts", () => {
    const names = screen.getAllByTestId("station-name").map((el) => el.textContent);
    expect(names).toContain("Lincoln Elementary");
    expect(names).toContain("City Hall Annex");
  });

  it("shows issue input only for station with Issue status draft", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("station-card");
    // City Hall Annex already has Issue status — its select is Issue
    const cityHallCard = cards.find((card) =>
      within(card).getByTestId("station-name").textContent === "City Hall Annex"
    );
    expect(within(cityHallCard!).queryByTestId("issue-input")).toBeTruthy();

    // Lincoln Elementary is Open, no issue input
    const lincolnCard = cards.find((card) =>
      within(card).getByTestId("station-name").textContent === "Lincoln Elementary"
    );
    expect(within(lincolnCard!).queryByTestId("issue-input")).toBeNull();
  });

  it("updates station status and updates summary counts", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("station-card");
    const lincolnCard = cards.find((card) =>
      within(card).getByTestId("station-name").textContent === "Lincoln Elementary"
    );
    const select = within(lincolnCard!).getByTestId("status-select");
    await user.selectOptions(select, "Closed");
    await user.click(within(lincolnCard!).getByTestId("update-btn"));

    expect(screen.getByTestId("open-count").textContent).toBe("1");
    expect(screen.getByTestId("closed-count").textContent).toBe("2");
  });

  it("requires non-empty issue text when setting status to Issue", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("station-card");
    const lincolnCard = cards.find((card) =>
      within(card).getByTestId("station-name").textContent === "Lincoln Elementary"
    );
    await user.selectOptions(within(lincolnCard!).getByTestId("status-select"), "Issue");
    // issue input should appear but leave it empty
    await user.click(within(lincolnCard!).getByTestId("update-btn"));
    // status should NOT change
    expect(within(lincolnCard!).getByTestId("station-status").textContent).toBe("Open");
  });

  it("clears issue when changing status away from Issue", async () => {
    const user = userEvent.setup();
    const cards = screen.getAllByTestId("station-card");
    const cityHallCard = cards.find((card) =>
      within(card).getByTestId("station-name").textContent === "City Hall Annex"
    );
    await user.selectOptions(within(cityHallCard!).getByTestId("status-select"), "Open");
    await user.click(within(cityHallCard!).getByTestId("update-btn"));
    expect(within(cityHallCard!).getByTestId("station-status").textContent).toBe("Open");
    expect(screen.getByTestId("issue-count").textContent).toBe("0");
  });

  it("adds a new station with Open status", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("station-name-input"), "New Precinct Hall");
    await user.type(screen.getByTestId("station-district-input"), "East");
    await user.click(screen.getByTestId("add-station-btn"));

    const cards = screen.getAllByTestId("station-card");
    expect(cards.length).toBe(5);
    expect(screen.getByTestId("open-count").textContent).toBe("3");
  });

  it("clears inputs after adding a station", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByTestId("station-name-input") as HTMLInputElement;
    const districtInput = screen.getByTestId("station-district-input") as HTMLInputElement;
    await user.type(nameInput, "Test Hall");
    await user.type(districtInput, "East");
    await user.click(screen.getByTestId("add-station-btn"));
    expect(nameInput.value).toBe("");
    expect(districtInput.value).toBe("");
  });

  it("does not add station if name is blank", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("station-district-input"), "East");
    await user.click(screen.getByTestId("add-station-btn"));
    expect(screen.getAllByTestId("station-card").length).toBe(4);
  });
});
