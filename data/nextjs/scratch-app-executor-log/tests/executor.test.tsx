import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import App from "../app/page";

describe("Tasks", () => {
  it("shows seed tasks", () => {
    render(<App />);
    expect(screen.getByTestId("task-title-t1").textContent).toBe("File Probate Application");
    expect(screen.getByTestId("task-status-t1").textContent).toBe("Done");
  });

  it("adds a task", () => {
    render(<App />);
    fireEvent.change(screen.getByTestId("task-title-input"), { target: { value: "Contact Utilities" } });
    fireEvent.click(screen.getByTestId("add-task-btn"));
    expect(screen.getByText("Contact Utilities")).toBeTruthy();
  });

  it("deletes a task", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("delete-task-t3"));
    expect(screen.queryByTestId("task-item-t3")).toBeNull();
  });

  it("advances task status", () => {
    render(<App />);
    expect(screen.getByTestId("task-status-t4").textContent).toBe("Todo");
    fireEvent.click(screen.getByTestId("advance-task-t4"));
    expect(screen.getByTestId("task-status-t4").textContent).toBe("InProgress");
  });
});

describe("Contacts", () => {
  it("shows seed contacts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    expect(screen.getByTestId("contact-name-c1").textContent).toBe("James White");
    expect(screen.getByTestId("contact-role-c1").textContent).toBe("Solicitor");
  });

  it("adds a contact", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    fireEvent.change(screen.getByTestId("contact-name-input"), { target: { value: "Tom Black" } });
    fireEvent.change(screen.getByTestId("contact-phone-input"), { target: { value: "07700 900000" } });
    fireEvent.click(screen.getByTestId("add-contact-btn"));
    expect(screen.getByText("Tom Black")).toBeTruthy();
  });

  it("deletes a contact", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-contacts"));
    fireEvent.click(screen.getByTestId("delete-contact-c2"));
    expect(screen.queryByTestId("contact-item-c2")).toBeNull();
  });
});

describe("Progress", () => {
  it("shows correct done percentage", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    // 1 done out of 4 = 25%
    expect(screen.getByTestId("progress-pct").textContent).toBe("25%");
  });

  it("shows task counts", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("count-done").textContent).toContain("1");
    expect(screen.getByTestId("count-inprogress").textContent).toContain("1");
    expect(screen.getByTestId("count-todo").textContent).toContain("2");
  });

  it("shows overdue tasks (t4 is overdue)", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.getByTestId("overdue-item-t4")).toBeTruthy();
  });

  it("does not show done task as overdue", () => {
    render(<App />);
    fireEvent.click(screen.getByTestId("nav-progress"));
    expect(screen.queryByTestId("overdue-item-t1")).toBeNull();
  });
});
