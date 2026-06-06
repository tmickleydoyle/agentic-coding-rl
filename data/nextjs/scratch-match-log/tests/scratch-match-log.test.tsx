import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

function getEntries() {
  return screen.getAllByTestId("match-entry");
}

function getEntryField(entry: HTMLElement, testId: string) {
  return within(entry).getByTestId(testId).textContent ?? "";
}

describe("Match Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /match log/i })).toBeTruthy();
  });

  it("shows 5 seed match entries initially", () => {
    expect(getEntries()).toHaveLength(5);
  });

  it("shows correct initial summary counts", () => {
    expect(screen.getByTestId("summary-wins").textContent).toBe("2");
    expect(screen.getByTestId("summary-losses").textContent).toBe("2");
    expect(screen.getByTestId("summary-draws").textContent).toBe("1");
  });

  it("renders the result filter select", () => {
    expect(screen.getByTestId("result-filter")).toBeTruthy();
  });

  it("filters by Win shows 2 entries", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("result-filter"), "Win");
    expect(getEntries()).toHaveLength(2);
    getEntries().forEach((e) => {
      expect(getEntryField(e, "entry-result")).toBe("Win");
    });
  });

  it("filters by Draw shows 1 entry", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("result-filter"), "Draw");
    expect(getEntries()).toHaveLength(1);
    expect(getEntryField(getEntries()[0], "entry-result")).toBe("Draw");
  });

  it("restores all entries when filter set to All", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("result-filter"), "Loss");
    await user.selectOptions(screen.getByTestId("result-filter"), "All");
    expect(getEntries()).toHaveLength(5);
  });

  it("adds a new win match and appears at the top", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-opponent"), "Test FC");
    await user.clear(screen.getByTestId("input-our-score"));
    await user.type(screen.getByTestId("input-our-score"), "3");
    await user.clear(screen.getByTestId("input-their-score"));
    await user.type(screen.getByTestId("input-their-score"), "1");
    await user.click(screen.getByTestId("btn-add-match"));
    const entries = getEntries();
    expect(entries).toHaveLength(6);
    expect(getEntryField(entries[0], "entry-opponent")).toBe("Test FC");
    expect(getEntryField(entries[0], "entry-result")).toBe("Win");
  });

  it("auto-computes Draw result when scores are equal", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-opponent"), "Draw Opponent");
    await user.clear(screen.getByTestId("input-our-score"));
    await user.type(screen.getByTestId("input-our-score"), "2");
    await user.clear(screen.getByTestId("input-their-score"));
    await user.type(screen.getByTestId("input-their-score"), "2");
    await user.click(screen.getByTestId("btn-add-match"));
    const entries = getEntries();
    expect(getEntryField(entries[0], "entry-result")).toBe("Draw");
  });

  it("summary updates after adding a win", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-opponent"), "New Team");
    await user.clear(screen.getByTestId("input-our-score"));
    await user.type(screen.getByTestId("input-our-score"), "5");
    await user.clear(screen.getByTestId("input-their-score"));
    await user.type(screen.getByTestId("input-their-score"), "0");
    await user.click(screen.getByTestId("btn-add-match"));
    expect(screen.getByTestId("summary-wins").textContent).toBe("3");
  });

  it("does not add entry if opponent is empty", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-add-match"));
    expect(getEntries()).toHaveLength(5);
  });

  it("form clears after submitting", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-opponent"), "Cleared Team");
    await user.click(screen.getByTestId("btn-add-match"));
    expect((screen.getByTestId("input-opponent") as HTMLInputElement).value).toBe("");
  });

  it("seed entry opponent names are present", () => {
    const entries = getEntries();
    const opponents = entries.map((e) => getEntryField(e, "entry-opponent"));
    expect(opponents).toContain("River City FC");
    expect(opponents).toContain("Hilltop Rangers");
    expect(opponents).toContain("Northern Wolves");
  });
});
