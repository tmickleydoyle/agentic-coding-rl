import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Client Tracker", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("renders the page heading", () => {
    expect(screen.getByTestId("page-heading")).toHaveTextContent("Client Tracker");
  });

  it("shows all 4 seed clients by default", () => {
    expect(screen.getByTestId("client-count")).toHaveTextContent("4 clients");
  });

  it("renders seed client names", () => {
    expect(screen.getByTestId("client-name-1")).toHaveTextContent("Acme Corp");
    expect(screen.getByTestId("client-name-2")).toHaveTextContent("Beta Studio");
    expect(screen.getByTestId("client-name-3")).toHaveTextContent("Gamma LLC");
    expect(screen.getByTestId("client-name-4")).toHaveTextContent("Delta Partners");
  });

  it("filter Active shows only active clients", async () => {
    await userEvent.click(screen.getByTestId("filter-active"));
    expect(screen.getByTestId("client-count")).toHaveTextContent("2 clients");
    expect(screen.getByTestId("client-name-1")).toBeInTheDocument();
    expect(screen.getByTestId("client-name-2")).toBeInTheDocument();
    expect(screen.queryByTestId("client-name-3")).not.toBeInTheDocument();
  });

  it("filter Inactive shows only inactive clients", async () => {
    await userEvent.click(screen.getByTestId("filter-inactive"));
    expect(screen.getByTestId("client-count")).toHaveTextContent("1 client");
    expect(screen.getByTestId("client-name-3")).toBeInTheDocument();
  });

  it("filter Prospect shows only prospect clients", async () => {
    await userEvent.click(screen.getByTestId("filter-prospect"));
    expect(screen.getByTestId("client-count")).toHaveTextContent("1 client");
    expect(screen.getByTestId("client-name-4")).toBeInTheDocument();
  });

  it("All filter restores full list", async () => {
    await userEvent.click(screen.getByTestId("filter-active"));
    await userEvent.click(screen.getByTestId("filter-All"));
    expect(screen.getByTestId("client-count")).toHaveTextContent("4 clients");
  });

  it("clicking Add Client shows the form", async () => {
    expect(screen.queryByTestId("client-form")).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("add-client-btn"));
    expect(screen.getByTestId("client-form")).toBeInTheDocument();
  });

  it("Cancel hides the form", async () => {
    await userEvent.click(screen.getByTestId("add-client-btn"));
    await userEvent.click(screen.getByTestId("form-cancel"));
    expect(screen.queryByTestId("client-form")).not.toBeInTheDocument();
  });

  it("adds a new client when form is saved", async () => {
    await userEvent.click(screen.getByTestId("add-client-btn"));
    await userEvent.type(screen.getByTestId("form-name"), "New Client");
    await userEvent.type(screen.getByTestId("form-email"), "new@client.com");
    await userEvent.click(screen.getByTestId("form-save"));
    expect(screen.getByTestId("client-count")).toHaveTextContent("5 clients");
    expect(screen.getByText("New Client")).toBeInTheDocument();
  });

  it("does not add client if name is empty", async () => {
    await userEvent.click(screen.getByTestId("add-client-btn"));
    await userEvent.type(screen.getByTestId("form-email"), "no@name.com");
    await userEvent.click(screen.getByTestId("form-save"));
    expect(screen.getByTestId("client-count")).toHaveTextContent("4 clients");
  });

  it("deletes a client", async () => {
    await userEvent.click(screen.getByTestId("delete-btn-1"));
    expect(screen.getByTestId("client-count")).toHaveTextContent("3 clients");
    expect(screen.queryByTestId("client-name-1")).not.toBeInTheDocument();
  });

  it("edit populates the form with existing data", async () => {
    await userEvent.click(screen.getByTestId("edit-btn-1"));
    expect(screen.getByTestId("form-name")).toHaveValue("Acme Corp");
    expect(screen.getByTestId("form-email")).toHaveValue("contact@acme.com");
  });

  it("editing a client updates the record", async () => {
    await userEvent.click(screen.getByTestId("edit-btn-1"));
    const nameInput = screen.getByTestId("form-name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Acme Updated");
    await userEvent.click(screen.getByTestId("form-save"));
    expect(screen.getByTestId("client-name-1")).toHaveTextContent("Acme Updated");
  });

  it("shows empty state when all clients deleted", async () => {
    await userEvent.click(screen.getByTestId("filter-prospect"));
    await userEvent.click(screen.getByTestId("delete-btn-4"));
    expect(screen.getByTestId("empty-state")).toHaveTextContent("No clients found.");
  });
});
