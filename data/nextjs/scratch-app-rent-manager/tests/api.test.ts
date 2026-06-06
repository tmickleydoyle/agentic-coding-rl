import { describe, it, expect, beforeEach } from "vitest";
import { getTenants, addTenant, removeTenant, getPayments, addPayment, __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("store - tenants", () => {
  it("returns initial tenants", () => {
    const tenants = getTenants();
    expect(tenants.length).toBe(2);
  });

  it("adds a tenant", () => {
    addTenant({ name: "Carol", unit: "103", monthlyRent: 1000, leaseStart: "2024-01-01", leaseEnd: "2024-12-31", status: "active" });
    expect(getTenants().length).toBe(3);
  });

  it("removes a tenant", () => {
    removeTenant("t1");
    expect(getTenants().length).toBe(1);
  });

  it("returns false for unknown tenant removal", () => {
    expect(removeTenant("xxx")).toBe(false);
  });
});

describe("store - payments", () => {
  it("returns initial payments", () => {
    expect(getPayments().length).toBe(2);
  });

  it("adds a payment", () => {
    addPayment({ tenantId: "t1", amount: 1200, date: "2024-07-01", month: "2024-07", status: "paid" });
    expect(getPayments().length).toBe(3);
  });

  it("payment has correct fields", () => {
    const p = addPayment({ tenantId: "t1", amount: 900, date: "2024-07-01", month: "2024-07", status: "pending" });
    expect(p.tenantId).toBe("t1");
    expect(p.amount).toBe(900);
    expect(p.status).toBe("pending");
  });
});
