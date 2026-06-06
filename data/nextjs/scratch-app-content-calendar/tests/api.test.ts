import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getItems, addItem, publishItem, updateItem } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Content store", () => {
  it("returns 5 seed items", () => { expect(getItems().length).toBe(5); });
  it("filters by status draft", () => { expect(getItems("draft").length).toBe(1); });
  it("filters by status approved", () => { expect(getItems("approved").length).toBe(2); });
  it("adds an item", () => {
    addItem({ title: "New", body: "", channel: "blog", status: "draft", scheduledDate: "2030-04-01" });
    expect(getItems().length).toBe(6);
  });
  it("rejects item without title", () => {
    const r = addItem({ title: "", body: "", channel: "blog", status: "draft", scheduledDate: "2030-04-01" });
    expect("error" in r).toBe(true);
  });
  it("rejects item without date", () => {
    const r = addItem({ title: "X", body: "", channel: "blog", status: "draft", scheduledDate: "" });
    expect("error" in r).toBe(true);
  });
  it("publishes approved item", () => {
    const r = publishItem("c1");
    expect("error" in r).toBe(false);
    if (!("error" in r)) expect(r.status).toBe("published");
  });
  it("cannot publish non-approved item", () => {
    const r = publishItem("c2");
    expect("error" in r).toBe(true);
  });
  it("updateItem changes status", () => {
    const r = updateItem("c2", { status: "review" });
    expect(r?.status).toBe("review");
  });
});
