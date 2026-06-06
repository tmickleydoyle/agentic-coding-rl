import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/expenses/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Expenses API", () => {
  it("GET returns seed expenses", async () => {
    const res = await GET(new Request("http://localhost/api/expenses"));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it("POST creates a new expense", async () => {
    const res = await POST(
      new Request("http://localhost/api/expenses", {
        method: "POST",
        body: JSON.stringify({ name: "New", category: "Engineering", amount: 1000 }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("New");
  });

  it("POST rejects invalid amount", async () => {
    const res = await POST(
      new Request("http://localhost/api/expenses", {
        method: "POST",
        body: JSON.stringify({ name: "Bad", category: "Engineering", amount: -1 }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("DELETE removes an expense", async () => {
    const res = await DELETE(
      new Request("http://localhost/api/expenses?id=1", { method: "DELETE" })
    );
    expect(res.status).toBe(200);
    const listRes = await GET(new Request("http://localhost/api/expenses"));
    const data = await listRes.json();
    expect(data.length).toBe(3);
  });
});
