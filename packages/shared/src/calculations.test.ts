import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSimulation,
  calculateMinimumSalary,
  formatRupiah,
  calculateTaxAndDeductions,
  calculateReverseSalary,
  calculateJobOfferComparison,
  calculateEmergencyRunway,
  adjustExpensesByLifestyle
} from './calculations.js';

test('Test 1: Normal income and expenses', () => {
  const result = calculateSimulation({
    income: { netMonthly: 5000000, additionalMonthly: 0 },
    cityId: 'surabaya',
    profile: 'single',
    householdSize: 1,
    expenses: {
      housing: 1300000,
      food: 1200000,
      transportation: 400000,
      utilities: 250000,
      lifestyle: 350000,
      financialObligations: 200000,
      other: 100000
    },
    targetSavingsRate: 20
  });

  assert.equal(result.totalExpenses, 3800000);
  assert.equal(result.remainingIncome, 1200000);
  assert.equal(result.savingsRate, 24);
  assert.equal(result.annualSavings, 14400000);
  assert.equal(result.status, 'healthy');
});

test('Test 2: Deficit scenario', () => {
  const result = calculateSimulation({
    income: { netMonthly: 4000000, additionalMonthly: 0 },
    cityId: 'jakarta',
    profile: 'single',
    householdSize: 1,
    expenses: {
      housing: 2000000,
      food: 1500000,
      transportation: 500000,
      utilities: 300000,
      lifestyle: 200000,
      financialObligations: 0,
      other: 0
    }
  });

  assert.equal(result.totalExpenses, 4500000);
  assert.equal(result.remainingIncome, -500000);
  assert.equal(result.status, 'deficit');
  assert.equal(result.statusInfo.label, 'Defisit');
});

test('Test 3: Minimum net salary target 20%', () => {
  const minSalary = calculateMinimumSalary(4000000, 20);
  assert.equal(minSalary, 5000000);
});

test('Test 4: Zero income prevents division by zero', () => {
  const result = calculateSimulation({
    income: { netMonthly: 0 },
    cityId: 'bandung',
    profile: 'single',
    householdSize: 1,
    expenses: {
      housing: 1000000,
      food: 1000000,
      transportation: 200000,
      utilities: 150000,
      lifestyle: 100000,
      financialObligations: 0,
      other: 0
    }
  });

  assert.equal(result.savingsRate, 0);
  assert.equal(result.remainingIncome, -2450000);
  assert.equal(result.status, 'deficit');
});

test('Test 5: Format Rupiah helper', () => {
  assert.equal(formatRupiah(5000000), 'Rp5.000.000');
  assert.equal(formatRupiah(-500000), '-Rp500.000');
  assert.equal(formatRupiah(null), 'Data tidak tersedia');
});

test('Test 6: Tax & BPJS calculation under PTKP limit', () => {
  const calc = calculateTaxAndDeductions(5000000, 'TK/0');
  assert.equal(calc.pph21Monthly, 0);
  assert.equal(calc.totalBpjsEmployee, 200000);
  assert.equal(calc.takeHomePay, 4800000);
});

test('Test 7: Reverse Salary Calculator computes target gross accurately', () => {
  const reverse = calculateReverseSalary(
    {
      targetSavingsMonthly: 2000000,
      cityId: 'jakarta',
      profile: 'single',
      householdSize: 1,
      expenses: {
        housing: 2000000,
        food: 1500000,
        transportation: 500000,
        utilities: 300000,
        lifestyle: 400000,
        financialObligations: 0,
        other: 0
      },
      includeTaxDeduction: true,
      ptkpStatus: 'TK/0'
    },
    5067381
  );

  assert.equal(reverse.totalExpenses, 4700000);
  assert.equal(reverse.requiredNetSalary, 6700000);
  assert.ok(reverse.requiredGrossSalary > reverse.requiredNetSalary);
  assert.ok(reverse.estimatedTaxAndDeductions !== null);
  assert.equal(reverse.umkRatio, 1.3);
});

test('Test 8: Job Offer Comparison detects Phantom Raise', () => {
  const offer = calculateJobOfferComparison({
    currentCityId: 'yogyakarta',
    currentNetSalary: 6000000,
    currentExpenses: {
      housing: 1000000,
      food: 1000000,
      transportation: 300000,
      utilities: 200000,
      lifestyle: 300000,
      financialObligations: 0,
      other: 0
    },
    offerCityId: 'jakarta',
    offerNetSalary: 8500000,
    offerExpenses: {
      housing: 3000000,
      food: 2000000,
      transportation: 600000,
      utilities: 400000,
      lifestyle: 600000,
      financialObligations: 0,
      other: 0
    }
  });

  assert.equal(offer.salaryIncreaseAmount, 2500000);
  assert.equal(offer.disposableIncomeDifference, -1300000);
  assert.equal(offer.isWorthIt, false);
  assert.ok(offer.recommendationHeadline.includes('Kurang Menguntungkan'));
});

test('Test 9: Emergency Runway Calculator accurately computes runway months', () => {
  const runway = calculateEmergencyRunway({
    savingsBalance: 30000000,
    cityId: 'surabaya',
    monthlyExpenses: 5000000,
    expectedMonthlyIncome: 0
  });

  assert.equal(runway.netBurnRate, 5000000);
  assert.equal(runway.runwayMonths, 6);
  assert.equal(runway.safetyTier, 'safe');
});

test('Test 10: Adjust Expenses by Lifestyle tier adjusts ratios properly', () => {
  const base = {
    housing: 1000000,
    food: 1000000,
    transportation: 300000,
    utilities: 200000,
    lifestyle: 300000,
    financialObligations: 500000,
    other: 100000
  };

  const frugal = adjustExpensesByLifestyle(base, 'frugal');
  assert.ok(frugal.housing < base.housing);
  assert.ok(frugal.lifestyle < base.lifestyle);
  assert.equal(frugal.financialObligations, base.financialObligations);

  const comfortable = adjustExpensesByLifestyle(base, 'comfortable');
  assert.ok(comfortable.housing > base.housing);
  assert.ok(comfortable.food > base.food);
});
