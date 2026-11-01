import { z } from 'zod';

export type FinancialStatus = 'deficit' | 'very_tight' | 'tight' | 'healthy' | 'high_savings';

export interface FinancialStatusInfo {
  status: FinancialStatus;
  label: string;
  description: string;
  badgeColor: 'danger' | 'warning' | 'info' | 'success' | 'accent';
}

export type LivingProfileType =
  | 'single'
  | 'single_shared'
  | 'couple_no_kids'
  | 'family_with_kids'
  | 'custom';

export type HousingType =
  | 'kost_standard'
  | 'kost_ac'
  | 'apartment_studio'
  | 'apartment_2br'
  | 'house_rent';

export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

export interface CityBenchmarks {
  referenceYear: number | null;
  bpsMonthlyPerCapita: number | null;
  foodExpenditure: number | null;
  nonFoodExpenditure: number | null;
  umk: number | null;
}

export interface InflationData {
  indexBase: number;
  referencePeriod: string | null;
  value: number | null;
}

export type DataQuality = 'complete' | 'partial' | 'incomplete';

export interface City {
  id: string;
  name: string;
  province: string;
  administrativeLevel: 'city' | 'regency' | 'special_capital_region';
  currency: 'IDR';
  coordinates: Coordinates;
  benchmarks: CityBenchmarks;
  inflation: InflationData;
  dataQuality: DataQuality;
  lastUpdated: string | null;
  description?: string;
}

export interface RentalPriceRecord {
  cityId: string;
  housingType: HousingType;
  area: string | null;
  monthlyPriceMin: number | null;
  monthlyPriceMax: number | null;
  monthlyPriceMedian: number | null;
  observationCount: number | null;
  referenceDate: string | null;
  sourceType: 'manual_research' | 'official' | 'survey';
  sourceUrl: string | null;
  verifiedAt: string | null;
}

export interface ExpenseEstimates {
  housing: number;
  food: number;
  transportation: number;
  utilities: number;
  lifestyle: number;
  financialObligations: number;
  other: number;
}

export interface CityExpenseReference {
  cityId: string;
  profile: LivingProfileType;
  householdSize: number;
  estimates: ExpenseEstimates;
  isComplete: boolean;
  missingFields: (keyof ExpenseEstimates)[];
  notes?: string;
}

export interface DataSourceMeta {
  id: string;
  publisher: string;
  title: string;
  url: string;
  referencePeriod: string;
  publishedAt: string | null;
  retrievedAt: string | null;
  dataType: 'official' | 'curated_market' | 'user_input';
  notes: string;
}

export interface SimulationInput {
  income: {
    netMonthly: number;
    additionalMonthly?: number;
  };
  cityId: string;
  profile: LivingProfileType;
  householdSize: number;
  expenses: ExpenseEstimates;
  targetSavingsRate?: number;
}

export interface SimulationResult {
  totalIncome: number;
  totalExpenses: number;
  remainingIncome: number;
  savingsRate: number;
  annualSavings: number;
  status: FinancialStatus;
  statusInfo: FinancialStatusInfo;
  targetMinimumSalary: number | null;
  expenseBreakdown: {
    category: keyof ExpenseEstimates;
    label: string;
    amount: number;
    percentage: number;
  }[];
}

export interface ComparisonInput {
  income: {
    netMonthly: number;
    additionalMonthly?: number;
  };
  profile: LivingProfileType;
  householdSize: number;
  cityIds: string[];
  customExpenses?: Record<string, Partial<ExpenseEstimates>>;
}

export interface CityComparisonItem {
  city: City;
  expenses: ExpenseEstimates;
  simulation: SimulationResult;
  isComplete: boolean;
  missingCategories: string[];
}

export interface ComparisonResult {
  income: number;
  profile: LivingProfileType;
  householdSize: number;
  cities: CityComparisonItem[];
  mostAffordableCityId: string | null;
  differences: {
    category: keyof ExpenseEstimates | 'total';
    label: string;
    cityAmounts: Record<string, number>;
  }[];
}

export interface RelocationInput {
  destinationCityId: string;
  travelCost: number;
  movingCost: number;
  rentalDeposit: number;
  firstMonthRent: number;
  initialEquipment: number;
  emergencyReserveMonths?: number;
  monthlyExpenseEstimate?: number;
  manualEmergencyReserve?: number;
}

export interface RelocationResult {
  travelCost: number;
  movingCost: number;
  rentalDeposit: number;
  firstMonthRent: number;
  initialEquipment: number;
  emergencyReserve: number;
  totalRelocationCapital: number;
  firstMonthTotalExpenditure: number;
  suggestedReserve: number;
  runwayMonths: number;
}

export type PTKPStatus = 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3' | 'K/0' | 'K/1' | 'K/2' | 'K/3';

export type CommuteMode =
  | 'motorcycle'
  | 'public_transit'
  | 'ride_hailing'
  | 'car'
  | 'walk_bicycle';

export interface TaxAndDeductionResult {
  grossSalary: number;
  bpjsKesehatan: number;
  bpjsKetenagakerjaanJht: number;
  bpjsKetenagakerjaanJp: number;
  totalBpjsEmployee: number;
  pph21Monthly: number;
  pph21EffectiveRate: number;
  totalDeductions: number;
  takeHomePay: number;
  ptkpCategory: 'A' | 'B' | 'C';
}

export interface ReverseSalaryInput {
  targetSavingsMonthly: number;
  cityId: string;
  profile: LivingProfileType;
  householdSize: number;
  expenses: ExpenseEstimates;
  includeTaxDeduction?: boolean;
  ptkpStatus?: PTKPStatus;
}

export interface ReverseSalaryResult {
  targetSavingsMonthly: number;
  totalExpenses: number;
  requiredNetSalary: number;
  requiredGrossSalary: number;
  estimatedTaxAndDeductions: TaxAndDeductionResult | null;
  umkRatio: number | null;
  cityUmk: number | null;
}

export interface JobOfferComparisonInput {
  currentCityId: string;
  currentNetSalary: number;
  currentExpenses: ExpenseEstimates;
  offerCityId: string;
  offerNetSalary: number;
  offerExpenses: ExpenseEstimates;
}

export interface JobOfferComparisonResult {
  currentCityId: string;
  offerCityId: string;
  currentNetSalary: number;
  offerNetSalary: number;
  salaryIncreaseAmount: number;
  salaryIncreasePercentage: number;
  currentTotalExpenses: number;
  offerTotalExpenses: number;
  expenseDifferenceAmount: number;
  expenseDifferencePercentage: number;
  currentDisposableIncome: number;
  offerDisposableIncome: number;
  disposableIncomeDifference: number;
  currentSavingsRate: number;
  offerSavingsRate: number;
  savingsRateDifference: number;
  isWorthIt: boolean;
  recommendationHeadline: string;
  recommendationDetail: string;
}

