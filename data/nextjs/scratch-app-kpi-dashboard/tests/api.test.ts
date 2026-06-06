import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/metrics/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Metrics API", () => {
  it("GET returns seed metrics", async () => {
    const res = await GET(new Request("http://localhost/api/metrics"));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it("POST creates metric", async () => {
    const res = await POST(
      new Request("http://localhost/api/metrics", {
        method: "POST",
        body: JSON.stringify({ name: "CAC", category: "Growth", unit: "currency", currentValue: 200, targetValue: 150 }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("CAC");
  });

  it("POST rejects missing fields", async () => {
    const res = await POST(
      new Request("http://localhost/api/metrics", {
        method: "POST",
        body: JSON.stringify({ name: "Bad" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("DELETE removes metric", async () => {
    await DELETE(new Request("http://localhost/api/metrics?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/metrics"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});
