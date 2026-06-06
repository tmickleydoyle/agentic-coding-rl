import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PUT, DELETE } from "../app/api/items/route";
import { __reset } from "../lib/store";

beforeEach(() => __reset());

describe("Decision Log API", () => {
  it("GET returns empty list", async () => {
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.decisions).toEqual([]);
  });

  it("POST creates decision", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Choose tech stack", context: "Building new product", options: "React or Vue", outcome: "", status: "pending", tags: ["tech"], decisionDate: "" }),
    }));
    expect(res.status).toBe(201);
    const d = await res.json();
    expect(d.decision.title).toBe("Choose tech stack");
    expect(d.decision.status).toBe("pending");
  });

  it("POST rejects missing title", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "x" }),
    }));
    expect(res.status).toBe(400);
  });

  it("PUT updates status", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "D1", context: "", options: "", outcome: "", status: "pending", tags: [], decisionDate: "" }),
    }));
    const res = await PUT(new Request("http://localhost/api/items?id=1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "decided", outcome: "Chose React" }),
    }));
    const d = await res.json();
    expect(d.decision.status).toBe("decided");
    expect(d.decision.outcome).toBe("Chose React");
  });

  it("GET stats returns counts", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "D1", context: "", options: "", outcome: "", status: "pending", tags: [], decisionDate: "" }),
    }));
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "D2", context: "", options: "", outcome: "", status: "decided", tags: [], decisionDate: "" }),
    }));
    const res = await GET(new Request("http://localhost/api/items?stats=1"));
    const d = await res.json();
    expect(d.stats.pending).toBe(1);
    expect(d.stats.decided).toBe(1);
  });
});
