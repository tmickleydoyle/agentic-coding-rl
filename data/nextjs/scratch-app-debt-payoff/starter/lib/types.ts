export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export interface Payment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
}

export type Route = "overview" | "debts" | "payments" | "strategy";

export interface AppState {
  route: Route;
  debts: Debt[];
  payments: Payment[];
}
