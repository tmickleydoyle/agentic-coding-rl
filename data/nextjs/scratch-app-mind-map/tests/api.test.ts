import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/items/route";
import { __reset } from "../lib/store";

beforeEach(() => __reset());

describe("Mind Map API", () => {
  it("GET returns empty list", async () => {
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.nodes).toEqual([]);
  });

  it("POST creates a root node", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Root", parentId: null, color: "blue" }),
    }));
    expect(res.status).toBe(201);
    const d = await res.json();
    expect(d.node.label).toBe("Root");
    expect(d.node.parentId).toBeNull();
  });

  it("POST rejects missing label", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color: "red" }),
    }));
    expect(res.status).toBe(400);
  });

  it("DELETE removes node", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Del", parentId: null, color: "green" }),
    }));
    await DELETE(new Request("http://localhost/api/items?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.nodes).toHaveLength(0);
  });

  it("GET with color filters nodes", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Red Node", parentId: null, color: "red" }),
    }));
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Blue Node", parentId: null, color: "blue" }),
    }));
    const res = await GET(new Request("http://localhost/api/items?color=red"));
    const d = await res.json();
    expect(d.nodes).toHaveLength(1);
    expect(d.nodes[0].label).toBe("Red Node");
  });
});
