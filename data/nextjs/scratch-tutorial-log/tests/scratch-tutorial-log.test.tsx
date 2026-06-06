import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Tutorial Log", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByText("Tutorial Log")).toBeTruthy();
  });

  it("shows all 4 seed tutorials on load", () => {
    expect(screen.getByTestId("tutorial-1")).toBeTruthy();
    expect(screen.getByTestId("tutorial-4")).toBeTruthy();
  });

  it("displays correct seed data fields", () => {
    expect(screen.getByTestId("tutorial-title-1").textContent).toBe("Beginner Crochet Basics");
    expect(screen.getByTestId("tutorial-source-1").textContent).toBe("YouTube");
    expect(screen.getByTestId("tutorial-duration-1").textContent).toBe("45 min");
    expect(screen.getByTestId("tutorial-rating-1").textContent).toBe("5/5");
    expect(screen.getByTestId("tutorial-watched-1").textContent).toBe("Watched");
  });

  it("shows correct total watch time (watched only)", () => {
    // tutorials 1 (45) and 3 (30) are watched = 75
    expect(screen.getByTestId("total-watch-time").textContent).toBe("Total: 75 min");
  });

  it("shows correct total tutorial count", () => {
    expect(screen.getByTestId("total-tutorials").textContent).toBe("4 tutorials");
  });

  it("watched tutorials have no Mark Watched button", () => {
    expect(screen.queryByTestId("btn-watch-1")).toBeNull();
    expect(screen.queryByTestId("btn-watch-3")).toBeNull();
  });

  it("unwatched tutorials have Mark Watched button", () => {
    expect(screen.getByTestId("btn-watch-2")).toBeTruthy();
    expect(screen.getByTestId("btn-watch-4")).toBeTruthy();
  });

  it("marks tutorial as watched", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-watch-2"));
    expect(screen.getByTestId("tutorial-watched-2").textContent).toBe("Watched");
    expect(screen.queryByTestId("btn-watch-2")).toBeNull();
  });

  it("total watch time updates after marking watched", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-watch-2"));
    // 45 + 90 + 30 = 165
    expect(screen.getByTestId("total-watch-time").textContent).toBe("Total: 165 min");
  });

  it("deletes a tutorial", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("btn-delete-1"));
    expect(screen.queryByTestId("tutorial-1")).toBeNull();
  });

  it("adds a new tutorial", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Loom Weaving Basics");
    await user.type(screen.getByTestId("input-source"), "YouTube");
    await user.type(screen.getByTestId("input-duration"), "50");
    await user.type(screen.getByTestId("input-rating"), "4");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.getByTestId("tutorial-5")).toBeTruthy();
    expect(screen.getByTestId("tutorial-title-5").textContent).toBe("Loom Weaving Basics");
    expect(screen.getByTestId("tutorial-watched-5").textContent).toBe("Unwatched");
  });

  it("does not add tutorial with blank title", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-duration"), "30");
    await user.type(screen.getByTestId("input-rating"), "3");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("tutorial-5")).toBeNull();
  });

  it("does not add tutorial with invalid rating", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-title"), "Bad Rating");
    await user.type(screen.getByTestId("input-duration"), "30");
    await user.type(screen.getByTestId("input-rating"), "6");
    await user.click(screen.getByTestId("btn-add"));
    expect(screen.queryByTestId("tutorial-5")).toBeNull();
  });

  it("filters to watched only", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-watched"));
    expect(screen.getByTestId("tutorial-1")).toBeTruthy();
    expect(screen.getByTestId("tutorial-3")).toBeTruthy();
    expect(screen.queryByTestId("tutorial-2")).toBeNull();
    expect(screen.queryByTestId("tutorial-4")).toBeNull();
  });

  it("filters to unwatched only", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-unwatched"));
    expect(screen.getByTestId("tutorial-2")).toBeTruthy();
    expect(screen.queryByTestId("tutorial-1")).toBeNull();
  });

  it("min rating filter hides lower rated tutorials", async () => {
    const user = userEvent.setup();
    await user.selectOptions(screen.getByTestId("filter-min-rating"), "5");
    expect(screen.getByTestId("tutorial-1")).toBeTruthy();
    expect(screen.getByTestId("tutorial-3")).toBeTruthy();
    expect(screen.queryByTestId("tutorial-2")).toBeNull();
    expect(screen.queryByTestId("tutorial-4")).toBeNull();
  });

  it("combined filters (unwatched + min rating 4)", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-unwatched"));
    await user.selectOptions(screen.getByTestId("filter-min-rating"), "4");
    expect(screen.getByTestId("tutorial-2")).toBeTruthy();
    expect(screen.queryByTestId("tutorial-4")).toBeNull();
  });

  it("shows empty-msg when no tutorials match", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-unwatched"));
    await user.selectOptions(screen.getByTestId("filter-min-rating"), "5");
    expect(screen.getByTestId("empty-msg").textContent).toBe("No tutorials found");
  });
});
