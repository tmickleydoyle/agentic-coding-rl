import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Print Settings Manager", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders heading", () => {
    expect(screen.getByRole("heading", { name: /Print Settings/i })).toBeTruthy();
  });

  it("renders seed profile names", () => {
    expect(screen.getByTestId("profile-name-1").textContent).toBe("Draft Quality");
    expect(screen.getByTestId("profile-name-2").textContent).toBe("Standard");
    expect(screen.getByTestId("profile-name-3").textContent).toBe("Fine Detail");
  });

  it("renders layer height", () => {
    expect(screen.getByTestId("profile-layer-1").textContent).toBe("0.3");
    expect(screen.getByTestId("profile-layer-3").textContent).toBe("0.1");
  });

  it("renders infill percentage", () => {
    expect(screen.getByTestId("profile-infill-2").textContent).toBe("20");
    expect(screen.getByTestId("profile-infill-3").textContent).toBe("25");
  });

  it("renders supports boolean", () => {
    expect(screen.getByTestId("profile-supports-1").textContent).toBe("false");
    expect(screen.getByTestId("profile-supports-3").textContent).toBe("true");
  });

  it("renders material", () => {
    expect(screen.getByTestId("profile-material-1").textContent).toBe("PLA");
    expect(screen.getByTestId("profile-material-3").textContent).toBe("PETG");
  });

  it("renders nozzle and bed temps", () => {
    expect(screen.getByTestId("profile-nozzle-2").textContent).toBe("205");
    expect(screen.getByTestId("profile-bed-3").textContent).toBe("75");
  });

  it("shows initial profile count", () => {
    expect(screen.getByTestId("profile-count").textContent).toContain("3 profiles");
  });

  it("can add a new profile", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Profile name/i), "Speed Print");
    await user.type(screen.getByLabelText(/Layer height/i), "0.4");
    await user.type(screen.getByLabelText(/Infill %/i), "10");
    await user.type(screen.getByLabelText(/Material/i), "PLA");
    await user.type(screen.getByLabelText(/Nozzle temp/i), "210");
    await user.type(screen.getByLabelText(/Bed temp/i), "60");
    await user.click(screen.getByRole("button", { name: /Save Profile/i }));
    expect(screen.getByText("Speed Print")).toBeTruthy();
    expect(screen.getByTestId("profile-count").textContent).toContain("4 profiles");
  });

  it("does not add profile with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Layer height/i), "0.2");
    await user.type(screen.getByLabelText(/Infill %/i), "20");
    await user.type(screen.getByLabelText(/Material/i), "PLA");
    await user.type(screen.getByLabelText(/Nozzle temp/i), "200");
    await user.type(screen.getByLabelText(/Bed temp/i), "60");
    await user.click(screen.getByRole("button", { name: /Save Profile/i }));
    expect(screen.getByTestId("profile-count").textContent).toContain("3 profiles");
  });

  it("can delete a profile", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("profile-delete-1"));
    expect(screen.queryByTestId("profile-name-1")).toBeNull();
    expect(screen.getByTestId("profile-count").textContent).toContain("2 profiles");
  });

  it("can duplicate a profile", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("profile-duplicate-2"));
    expect(screen.getByText("Copy of Standard")).toBeTruthy();
    expect(screen.getByTestId("profile-count").textContent).toContain("4 profiles");
  });

  it("entering edit mode shows Save and Cancel buttons", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("profile-edit-1"));
    expect(screen.getByTestId("profile-save-1")).toBeTruthy();
    expect(screen.getByTestId("profile-cancel-1")).toBeTruthy();
  });

  it("can edit and save a profile name", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("profile-edit-2"));
    const nameInput = screen.getByLabelText(/Edit name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Standard");
    await user.click(screen.getByTestId("profile-save-2"));
    expect(screen.getByTestId("profile-name-2").textContent).toBe("Updated Standard");
  });

  it("cancel edit discards changes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getByTestId("profile-edit-2"));
    const nameInput = screen.getByLabelText(/Edit name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, "Discarded Name");
    await user.click(screen.getByTestId("profile-cancel-2"));
    expect(screen.getByTestId("profile-name-2").textContent).toBe("Standard");
  });
});
