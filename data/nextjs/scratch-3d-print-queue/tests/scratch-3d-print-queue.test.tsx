import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("3D Print Queue", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the heading", () => {
    expect(screen.getByRole("heading", { name: /3D Print Queue/i })).toBeTruthy();
  });

  it("renders seed jobs by name", () => {
    expect(screen.getByTestId("job-name-1").textContent).toBe("Benchy Boat");
    expect(screen.getByTestId("job-name-2").textContent).toBe("Phone Stand");
    expect(screen.getByTestId("job-name-3").textContent).toBe("Cable Clip x10");
  });

  it("renders seed job materials", () => {
    expect(screen.getByTestId("job-material-1").textContent).toBe("PLA");
    expect(screen.getByTestId("job-material-2").textContent).toBe("PETG");
  });

  it("renders seed job durations", () => {
    expect(screen.getByTestId("job-duration-1").textContent).toBe("45");
    expect(screen.getByTestId("job-duration-3").textContent).toBe("30");
  });

  it("renders initial status as waiting", () => {
    expect(screen.getByTestId("job-status-1").textContent).toBe("waiting");
    expect(screen.getByTestId("job-status-2").textContent).toBe("waiting");
  });

  it("shows initial summary", () => {
    expect(screen.getByTestId("queue-summary").textContent).toContain("3 waiting");
    expect(screen.getByTestId("queue-summary").textContent).toContain("0 printing");
    expect(screen.getByTestId("queue-summary").textContent).toContain("0 done");
  });

  it("can add a new job", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Job name/i), "Vase");
    await user.type(screen.getByLabelText(/Material/i), "ABS");
    await user.type(screen.getByLabelText(/Duration/i), "60");
    await user.click(screen.getByRole("button", { name: /Add Job/i }));
    expect(screen.getByText("Vase")).toBeTruthy();
  });

  it("clears form after adding a job", async () => {
    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(/Job name/i) as HTMLInputElement;
    await user.type(nameInput, "Vase");
    await user.type(screen.getByLabelText(/Material/i), "ABS");
    await user.type(screen.getByLabelText(/Duration/i), "60");
    await user.click(screen.getByRole("button", { name: /Add Job/i }));
    expect(nameInput.value).toBe("");
  });

  it("does not add job with empty name", async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Material/i), "ABS");
    await user.type(screen.getByLabelText(/Duration/i), "60");
    await user.click(screen.getByRole("button", { name: /Add Job/i }));
    const items = screen.getAllByTestId(/^job-name-/);
    expect(items.length).toBe(3);
  });

  it("clicking Start changes status to printing", async () => {
    const user = userEvent.setup();
    const startButtons = screen.getAllByRole("button", { name: /Start/i });
    await user.click(startButtons[0]);
    expect(screen.getByTestId("job-status-1").textContent).toBe("printing");
  });

  it("clicking Done changes status to done", async () => {
    const user = userEvent.setup();
    const startButtons = screen.getAllByRole("button", { name: /Start/i });
    await user.click(startButtons[0]);
    await user.click(screen.getByRole("button", { name: /Done/i }));
    expect(screen.getByTestId("job-status-1").textContent).toBe("done");
  });

  it("summary updates after status changes", async () => {
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: /Start/i })[0]);
    const summary = screen.getByTestId("queue-summary").textContent ?? "";
    expect(summary).toContain("1 printing");
    expect(summary).toContain("2 waiting");
  });

  it("removes a job", async () => {
    const user = userEvent.setup();
    const removeButtons = screen.getAllByRole("button", { name: /Remove/i });
    await user.click(removeButtons[0]);
    expect(screen.queryByTestId("job-name-1")).toBeNull();
  });

  it("summary updates after removing all jobs", async () => {
    const user = userEvent.setup();
    let removeButtons = screen.getAllByRole("button", { name: /Remove/i });
    for (let i = 0; i < 3; i++) {
      removeButtons = screen.getAllByRole("button", { name: /Remove/i });
      await user.click(removeButtons[0]);
    }
    const summary = screen.getByTestId("queue-summary").textContent ?? "";
    expect(summary).toContain("0 waiting");
    expect(summary).toContain("0 done");
  });

  it("Move Down button moves job down", async () => {
    const user = userEvent.setup();
    // Find Move Down for first item (job-1) and click it
    const moveDownButtons = screen.getAllByRole("button", { name: /Move Down/i });
    await user.click(moveDownButtons[0]);
    // job-1 should now be in second position; job-2 in first
    const items = screen.getAllByTestId(/^job-name-/);
    expect(items[0].textContent).toBe("Phone Stand");
    expect(items[1].textContent).toBe("Benchy Boat");
  });

  it("first job has no Move Up button initially", () => {
    const moveUpButtons = screen.queryAllByRole("button", { name: /Move Up/i });
    // There should be 2 Move Up buttons (for jobs 2 and 3), not 3
    expect(moveUpButtons.length).toBe(2);
  });
});
