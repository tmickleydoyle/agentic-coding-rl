export interface Exchange {
  id: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
  amountFrom: number;
  amountTo: number;
  location: string;
  fee: number;
}
