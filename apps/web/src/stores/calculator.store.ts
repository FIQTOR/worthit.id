import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExpenseEstimates, LivingProfileType } from '@worthit/shared';

interface CalculatorState {
  income: {
    netMonthly: number;
    additionalMonthly: number;
  };
  cityId: string;
  profile: LivingProfileType;
  householdSize: number;
  expenses: ExpenseEstimates;
  targetSavingsRate: number;
  setIncome: (income: { netMonthly: number; additionalMonthly?: number }) => void;
  setCityId: (cityId: string) => void;
  setProfile: (profile: LivingProfileType) => void;
  setHouseholdSize: (size: number) => void;
  setExpenses: (expenses: Partial<ExpenseEstimates>) => void;
  setTargetSavingsRate: (rate: number) => void;
  reset: () => void;
}

const initialState = {
  income: {
    netMonthly: 5000000,
    additionalMonthly: 0
  },
  cityId: 'jakarta',
  profile: 'single' as LivingProfileType,
  householdSize: 1,
  expenses: {
    housing: 0,
    food: 0,
    transportation: 0,
    utilities: 0,
    lifestyle: 0,
    financialObligations: 0,
    other: 0
  },
  targetSavingsRate: 20
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set) => ({
      ...initialState,
      setIncome: (income) =>
        set((state) => ({
          income: { ...state.income, ...income }
        })),
      setCityId: (cityId) => set({ cityId }),
      setProfile: (profile) => set({ profile }),
      setHouseholdSize: (householdSize) => set({ householdSize }),
      setExpenses: (expenses) =>
        set((state) => ({
          expenses: { ...state.expenses, ...expenses }
        })),
      setTargetSavingsRate: (targetSavingsRate) => set({ targetSavingsRate }),
      reset: () => set(initialState)
    }),
    {
      name: 'worthit-calculator-storage'
    }
  )
);
