import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Model Library", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /Model Library/i })).toBeTruthy();
  });

  it("renders seed model names", () => {
    expect(screen.getByTestId("model-name-1").textContent).toBe("Benchy Boat");
    expect(screen.getByTestId("model-name-4").textContent).toBe("Dragon Full Body");
  });

  it("renders model category", () => {
    expect(screen.getByTestId("model-category-2").textContent).toBe("decorative");
    expect(screen.getByTestId("model-category-5").textContent).toBe("utility");
  });

  it("renders model source", () => {
    expect(screen.getByTestId("model-source-3").textContent).toBe("Thingiverse");
    expect(screen.getByTestId("model-source-4").textContent).toBe("MyMiniFactory");
  });

  it("renders model favorited status", () => {
    expect(screen.getByTestId("model-favorited-1").textContent).toBe("true");
    expect(screen.getByTestId("model-favorited-2").textContent).toBe("false");
  });

  it("shows initial library count", () => {
    expect(screen.getByTestId("library-count").textContent).toContain("5 models");
  });

  it("shows initial favorites count", () => {
    expect(screen.getByTestId("favorites-count").textContent).toContain("2 favorites");
  });

  it("can favorite a model", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("model-favorite-btn-2"));
    expect(screen.getByTestId("model-favorited-2").textContent).toBe("true");
    expect(screen.getByTestId("favorites-count").textContent).toContain("3 favorites");
  });

  it("can unfavorite a model", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("model-unfavorite-btn-1"));
    expect(screen.getByTestId("model-favorited-1").textContent).toBe("false");
    expect(screen.getByTestId("favorites-count").textContent).toContain("1 favorites");
  });

  it("removes a model and updates library count", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("model-remove-3"));
    expect(screen.queryByTestId("model-name-3")).toBeNull();
    expect(screen.getByTestId("library-count").textContent).toContain("4 models");
  });

  it("removing favorited model updates favorites count", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("model-remove-1"));
    expect(screen.getByTestId("favorites-count").textContent).toContain("1 favorites");
  });

  it("search filters visible models by name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "vase");
    expect(screen.queryByTestId("model-name-2")).toBeTruthy();
    expect(screen.queryByTestId("model-name-1")).toBeNull();
  });

  it("search does not change library count", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByTestId("search-input"), "vase");
    expect(screen.getByTestId("library-count").textContent).toContain("5 models");
  });

  it("favorites toggle shows only favorites", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("favorites-toggle"));
    expect(screen.queryByTestId("model-name-1")).toBeTruthy();
    expect(screen.queryByTestId("model-name-2")).toBeNull();
  });

  it("adds a new model", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Model name/i), "Phone Case");
    await user.type(screen.getByLabelText(/Category/i), "utility");
    await user.type(screen.getByLabelText(/Source/i), "Printables");
    await user.type(screen.getByLabelText(/File size/i), "2.1");
    await user.click(screen.getByRole("button", { name: /Add Model/i }));
    expect(screen.getByText("Phone Case")).toBeTruthy();
    expect(screen.getByTestId("library-count").textContent).toContain("6 models");
  });

  it("does not add model with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Category/i), "utility");
    await user.type(screen.getByLabelText(/Source/i), "Printables");
    await user.type(screen.getByLabelText(/File size/i), "2.1");
    await user.click(screen.getByRole("button", { name: /Add Model/i }));
    expect(screen.getByTestId("library-count").textContent).toContain("5 models");
  });
});
