export type TenantStatus = "active" | "inactive";
export type PaymentStatus = "paid" | "overdue" | "pending";

export interface Tenant {
  id: string;
  name: string;
  unit: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  status: TenantStatus;
}

export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  date: string;
  month: string;
  status: PaymentStatus;
}

export interface AppState {
  route: string;
  tenants: Tenant[];
  payments: Payment[];
}
