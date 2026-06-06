import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getPosts, addPost, deletePost, promoteIdea } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Posts store", () => {
  it("returns all posts including ideas", () => {
    expect(getPosts().length).toBe(5);
  });

  it("filters by status", () => {
    expect(getPosts("draft").length).toBe(1);
    expect(getPosts("idea").length).toBe(2);
    expect(getPosts("scheduled").length).toBe(1);
    expect(getPosts("published").length).toBe(1);
  });

  it("adds a post", () => {
    addPost({ title: "New Post", status: "draft", category: "", scheduledDate: "", notes: "" });
    expect(getPosts("draft").length).toBe(2);
  });

  it("cannot delete published post", () => {
    const result = deletePost("p3");
    expect(result.error).toBeTruthy();
  });

  it("can delete draft post", () => {
    const result = deletePost("p1");
    expect(result.error).toBeUndefined();
    expect(getPosts("draft").length).toBe(0);
  });

  it("promotes idea to draft", () => {
    const result = promoteIdea("i1");
    expect("error" in result).toBe(false);
    if (!("error" in result)) expect(result.status).toBe("draft");
  });

  it("promote returns error for non-idea", () => {
    const result = promoteIdea("p1");
    expect("error" in result).toBe(true);
  });

  it("getPosts returns copies", () => {
    const a = getPosts();
    const b = getPosts();
    expect(a).not.toBe(b);
  });
});
