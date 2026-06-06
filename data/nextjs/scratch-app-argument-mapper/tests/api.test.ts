import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/items/route";
import { __reset } from "../lib/store";

beforeEach(() => __reset());

describe("Argument Mapper API", () => {
  it("GET returns empty list", async () => {
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.arguments).toEqual([]);
  });

  it("POST creates claim", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Climate change is real", type: "claim", parentId: null, topic: "climate" }),
    }));
    expect(res.status).toBe(201);
    const d = await res.json();
    expect(d.argument.text).toBe("Climate change is real");
    expect(d.argument.type).toBe("claim");
  });

  it("POST rejects missing text", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "claim" }),
    }));
    expect(res.status).toBe(400);
  });

  it("GET filters by type", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Main claim", type: "claim", parentId: null, topic: "" }),
    }));
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Evidence A", type: "evidence", parentId: null, topic: "" }),
    }));
    const res = await GET(new Request("http://localhost/api/items?type=evidence"));
    const d = await res.json();
    expect(d.arguments).toHaveLength(1);
    expect(d.arguments[0].type).toBe("evidence");
  });

  it("DELETE removes argument", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Del", type: "claim", parentId: null, topic: "" }),
    }));
    await DELETE(new Request("http://localhost/api/items?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.arguments).toHaveLength(0);
  });
});
