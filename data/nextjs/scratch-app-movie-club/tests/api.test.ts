import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PATCH, DELETE } from "../app/api/movies/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Movies API", () => {
  it("GET returns movies", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("POST adds a movie", async () => {
    const req = new Request("http://localhost/api/movies", {
      method: "POST",
      body: JSON.stringify({ title: "Test Film", director: "Dir", genre: "Drama", year: 2023, runtime: 100 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Test Film");
    expect(data.status).toBe("want-to-watch");
  });

  it("PATCH updates movie status", async () => {
    const req = new Request("http://localhost/api/movies", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", status: "watching" }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.status).toBe("watching");
  });

  it("PATCH updates rating and review", async () => {
    const req = new Request("http://localhost/api/movies", {
      method: "PATCH",
      body: JSON.stringify({ id: "1", rating: 4, review: "Great!" }),
    });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.rating).toBe(4);
    expect(data.review).toBe("Great!");
  });

  it("DELETE removes a movie", async () => {
    const req = new Request("http://localhost/api/movies", {
      method: "DELETE",
      body: JSON.stringify({ id: "1" }),
    });
    await DELETE(req);
    const listRes = await GET();
    const list = await listRes.json();
    expect(list.find((m: { id: string }) => m.id === "1")).toBeUndefined();
  });
});
