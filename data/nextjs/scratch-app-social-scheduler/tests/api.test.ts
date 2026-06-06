import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getAccounts, addAccount, removeAccount, getPosts, addPost, cancelPost } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Social Scheduler store", () => {
  it("returns 3 seed accounts", () => { expect(getAccounts().length).toBe(3); });
  it("adds account", () => {
    addAccount({ platform: "facebook", handle: "@fb", connected: true });
    expect(getAccounts().length).toBe(4);
  });
  it("cannot remove account in use", () => {
    const r = removeAccount("a1");
    expect(r.error).toBeTruthy();
  });

  it("returns 3 seed posts", () => { expect(getPosts().length).toBe(3); });
  it("filters scheduled posts", () => { expect(getPosts("scheduled").length).toBe(2); });

  it("adds valid post", () => {
    addPost({ body: "Hello world", accountIds: ["a1"], status: "scheduled", scheduledAt: "2030-07-01T10:00" });
    expect(getPosts().length).toBe(4);
  });
  it("rejects post with empty body", () => {
    const r = addPost({ body: "", accountIds: ["a1"], status: "scheduled", scheduledAt: "2030-07-01T10:00" });
    expect("error" in r).toBe(true);
  });
  it("rejects post with no accounts", () => {
    const r = addPost({ body: "Hi", accountIds: [], status: "scheduled", scheduledAt: "2030-07-01T10:00" });
    expect("error" in r).toBe(true);
  });
  it("cancels a scheduled post", () => {
    const r = cancelPost("sp1");
    expect("error" in r).toBe(false);
    if (!("error" in r)) expect(r.status).toBe("cancelled");
  });
  it("cannot cancel posted post", () => {
    const r = cancelPost("sp2");
    expect("error" in r).toBe(true);
  });
});
