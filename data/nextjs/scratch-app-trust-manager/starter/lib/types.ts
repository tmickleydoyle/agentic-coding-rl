export interface Trust {
  id: string;
  name: string;
  trustee: string;
  principal: number;
}

export interface Distribution {
  id: string;
  trustName: string;
  beneficiary: string;
  amount: number;
  date: string;
}
