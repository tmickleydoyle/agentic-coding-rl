import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Shot List", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /shot list/i })).toBeTruthy();
  });

  it("shows correct summary on load", () => {
    expect(screen.getByTestId("summary").textContent).toContain("1 of 4 completed");
  });

  it("renders all seed shots", () => {
    expect(screen.getByTestId("shot-1")).toBeTruthy();
    expect(screen.getByTestId("shot-3")).toBeTruthy();
  });

  it("shot 3 is checked on load", () => {
    const checkbox = screen.getByTestId("checkbox-3") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("shot 1 is not checked on load", () => {
    const checkbox = screen.getByTestId("checkbox-1") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it("toggling checkbox updates summary", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("checkbox-1"));
    expect(screen.getByTestId("summary").textContent).toContain("2 of 4 completed");
  });

  it("adds a new shot", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("input-subject"), "Reception toast");
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("summary").textContent).toContain("of 5");
    expect(screen.getByText("Reception toast")).toBeTruthy();
  });

  it("clears subject input after add", async () => {
    const user = userEvent.setup();
    const input = screen.getByTestId("input-subject") as HTMLInputElement;
    await user.type(input, "Test shot");
    await user.click(screen.getByTestId("submit-btn"));
    expect(input.value).toBe("");
  });

  it("does not add shot with empty subject", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("summary").textContent).toContain("of 4");
  });

  it("deletes a shot", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("delete-4"));
    expect(screen.queryByTestId("shot-4")).toBeNull();
    expect(screen.getByTestId("summary").textContent).toContain("of 3");
  });

  it("hide completed button hides done shots", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-completed"));
    expect(screen.queryByTestId("shot-3")).toBeNull();
    expect(screen.getByTestId("shot-1")).toBeTruthy();
  });

  it("show completed restores hidden shots", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-completed"));
    await user.click(screen.getByTestId("toggle-completed"));
    expect(screen.getByTestId("shot-3")).toBeTruthy();
  });

  it("summary is unchanged when hiding completed", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("toggle-completed"));
    expect(screen.getByTestId("summary").textContent).toContain("1 of 4 completed");
  });
});
