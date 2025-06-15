
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  currency: 'INR' | 'USD';
  createdAt: Date;
  contributions: Contribution[];
}

export interface Contribution {
  id: string;
  amount: number;
  date: Date;
  goalId: string;
}
