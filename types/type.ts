export interface GroceryItem {
  name: string;
  quantity: number;
  unit: string;
  estCostUsd: number;
  checked?: boolean;
}

export interface MacroProgress {
  calories: { target: number; actual: number; remaining: number; pct: number };
  proteinG: { target: number; actual: number; remaining: number; pct: number };
  carbG: { target: number; actual: number; remaining: number; pct: number };
  fatG: { target: number; actual: number; remaining: number; pct: number };
}

export interface BudgetProgress {
  budgetUsd: number;
  spentUsd: number;
  remainingUsd: number;
  pct: number;
}

export interface WeightProgress {
  startWeightLbs: number | null;
  currentWeightLbs: number | null;
  targetWeightLbs: number | null;
  remainingLbs: number | null;
  pct: number | null; // % of the way from start to target
  history: { weightLbs: number; loggedAt: Date }[];
}
