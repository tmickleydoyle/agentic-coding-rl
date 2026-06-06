import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/transactions/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Transactions API", () => {
  it("GET returns seed transactions", async () => {
    const res = await GET(new Request("http://localhost/api/transactions"));
    const data = await res.json();
    expect(data.length).toBe(5);
  });

  it("POST creates transaction", async () => {
    const res = await POST(
      new Request("http://localhost/api/transactions", {
        method: "POST",
        body: JSON.stringify({ description: "Bonus", amount: 5000, type: "Expense", category: "Payroll", date: "2024-02" }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.description).toBe("Bonus");
  });

  it("POST rejects zero amount", async () => {
    const res = await POST(
      new Request("http://localhost/api/transactions", {
        method: "POST",
        body: JSON.stringify({ description: "Bad", amount: 0, type: "Expense", category: "Payroll", date: "2024-02" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("DELETE removes transaction", async () => {
    await DELETE(new Request("http://localhost/api/transactions?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/transactions"));
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});
