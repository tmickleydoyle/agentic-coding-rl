import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Resume Builder", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the app title", () => {
    expect(screen.getByText("Resume Builder")).toBeTruthy();
  });

  it("renders seed experience cards", () => {
    expect(screen.getByTestId("exp-card-1")).toBeTruthy();
    expect(screen.getByTestId("exp-card-2")).toBeTruthy();
  });

  it("renders seed education card", () => {
    expect(screen.getByTestId("edu-card-1")).toBeTruthy();
  });

  it("renders seed skill tags", () => {
    expect(screen.getByTestId("skill-tag-React")).toBeTruthy();
    expect(screen.getByTestId("skill-tag-TypeScript")).toBeTruthy();
  });

  it("shows preview with initial saved name", () => {
    expect(screen.getByTestId("preview-name").textContent).toBe("Jane Smith");
  });

  it("saves updated personal info to preview", async () => {
    const nameInput = screen.getByTestId("input-name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "John Doe");
    fireEvent.click(screen.getByTestId("save-info"));
    expect(screen.getByTestId("preview-name").textContent).toBe("John Doe");
  });

  it("adds a new experience entry", async () => {
    await userEvent.type(screen.getByTestId("input-exp-company"), "NewCorp");
    await userEvent.type(screen.getByTestId("input-exp-title"), "Manager");
    fireEvent.click(screen.getByTestId("add-exp-btn"));
    expect(screen.getByTestId("exp-card-3")).toBeTruthy();
    expect(screen.getByText("NewCorp")).toBeTruthy();
  });

  it("does not add experience with empty company", async () => {
    await userEvent.type(screen.getByTestId("input-exp-title"), "Manager");
    fireEvent.click(screen.getByTestId("add-exp-btn"));
    expect(screen.queryByTestId("exp-card-3")).toBeNull();
  });

  it("deletes an experience entry", async () => {
    fireEvent.click(screen.getByTestId("delete-exp-1"));
    expect(screen.queryByTestId("exp-card-1")).toBeNull();
  });

  it("adds a new education entry", async () => {
    await userEvent.type(screen.getByTestId("input-edu-institution"), "MIT");
    await userEvent.type(screen.getByTestId("input-edu-degree"), "M.S.");
    fireEvent.click(screen.getByTestId("add-edu-btn"));
    expect(screen.getByTestId("edu-card-2")).toBeTruthy();
    expect(screen.getByText("MIT")).toBeTruthy();
  });

  it("does not add education with empty degree", async () => {
    await userEvent.type(screen.getByTestId("input-edu-institution"), "MIT");
    fireEvent.click(screen.getByTestId("add-edu-btn"));
    expect(screen.queryByTestId("edu-card-2")).toBeNull();
  });

  it("deletes an education entry", async () => {
    fireEvent.click(screen.getByTestId("delete-edu-1"));
    expect(screen.queryByTestId("edu-card-1")).toBeNull();
  });

  it("adds a new skill tag", async () => {
    await userEvent.type(screen.getByTestId("input-skill"), "GraphQL");
    fireEvent.click(screen.getByTestId("add-skill-btn"));
    expect(screen.getByTestId("skill-tag-GraphQL")).toBeTruthy();
  });

  it("removes a skill tag", async () => {
    fireEvent.click(screen.getByTestId("remove-skill-React"));
    expect(screen.queryByTestId("skill-tag-React")).toBeNull();
  });

  it("preview-exp-count updates after adding experience", async () => {
    const initialCount = parseInt(screen.getByTestId("preview-exp-count").textContent ?? "0");
    await userEvent.type(screen.getByTestId("input-exp-company"), "NewCo");
    await userEvent.type(screen.getByTestId("input-exp-title"), "Dev");
    fireEvent.click(screen.getByTestId("add-exp-btn"));
    const newCount = parseInt(screen.getByTestId("preview-exp-count").textContent ?? "0");
    expect(newCount).toBe(initialCount + 1);
  });
});
