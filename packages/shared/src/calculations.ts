import {
  ExpenseEstimates,
  FinancialStatus,
  FinancialStatusInfo,
  RelocationInput,
  RelocationResult,
  SimulationInput,
  SimulationResult,
  PTKPStatus,
  TaxAndDeductionResult,
  ReverseSalaryInput,
  ReverseSalaryResult,
  JobOfferComparisonInput,
  JobOfferComparisonResult
} from './types.js';

export const EXPENSE_CATEGORY_LABELS: Record<keyof ExpenseEstimates, string> = {
  housing: 'Tempat Tinggal',
  food: 'Makanan & Minuman',
  transportation: 'Transportasi',
  utilities: 'Utilitas & Komunikasi',
  lifestyle: 'Gaya Hidup & Hiburan',
  financialObligations: 'Kewajiban & Cicilan',
  other: 'Lain-lain'
};

export const STATUS_DEFINITIONS: Record<FinancialStatus, FinancialStatusInfo> = {
  deficit: {
    status: 'deficit',
    label: 'Defisit',
    description: 'Pengeluaran bulanan melebihi pemasukan bersih. Diperlukan penyesuaian anggaran.',
    badgeColor: 'danger'
  },
  very_tight: {
    status: 'very_tight',
    label: 'Sangat Terbatas',
    description: 'Tingkat tabungan di bawah 10%. Rentan saat terjadi pengeluaran darurat tak terduga.',
    badgeColor: 'warning'
  },
  tight: {
    status: 'tight',
    label: 'Cukup Ketat',
    description: 'Tingkat tabungan antara 10% - 19%. Cukup aman namun ruang investasi terbatas.',
    badgeColor: 'info'
  },
  healthy: {
    status: 'healthy',
    label: 'Cukup Sehat',
    description: 'Tingkat tabungan antara 20% - 29%. Standar keuangan sehat dengan porsi tabungan teratur.',
    badgeColor: 'success'
  },
  high_savings: {
    status: 'high_savings',
    label: 'Ruang Menabung Besar',
    description: 'Tingkat tabungan 30% atau lebih. Keleluasaan finansial tinggi untuk tujuan jangka panjang.',
    badgeColor: 'accent'
  }
};

export function calculateTotalExpenses(expenses: ExpenseEstimates): number {
  return (
    Math.round(expenses.housing || 0) +
    Math.round(expenses.food || 0) +
    Math.round(expenses.transportation || 0) +
    Math.round(expenses.utilities || 0) +
    Math.round(expenses.lifestyle || 0) +
    Math.round(expenses.financialObligations || 0) +
    Math.round(expenses.other || 0)
  );
}

export function determineFinancialStatus(
  remainingIncome: number,
  savingsRate: number
): FinancialStatusInfo {
  if (remainingIncome < 0) {
    return STATUS_DEFINITIONS.deficit;
  }
  if (savingsRate < 10) {
    return STATUS_DEFINITIONS.very_tight;
  }
  if (savingsRate < 20) {
    return STATUS_DEFINITIONS.tight;
  }
  if (savingsRate < 30) {
    return STATUS_DEFINITIONS.healthy;
  }
  return STATUS_DEFINITIONS.high_savings;
}

export function calculateMinimumSalary(
  totalExpenses: number,
  targetSavingsRate: number = 20
): number | null {
  if (targetSavingsRate >= 100 || targetSavingsRate < 0) {
    return null;
  }
  const rateRatio = targetSavingsRate / 100;
  if (rateRatio >= 1) return null;
  return Math.ceil(totalExpenses / (1 - rateRatio));
}

export function calculateSimulation(input: SimulationInput): SimulationResult {
  const totalIncome =
    Math.round(input.income.netMonthly || 0) +
    Math.round(input.income.additionalMonthly || 0);

  const totalExpenses = calculateTotalExpenses(input.expenses);
  const remainingIncome = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? Math.round(((remainingIncome / totalIncome) * 100) * 10) / 10
      : 0;

  const annualSavings = remainingIncome * 12;

  const statusInfo = determineFinancialStatus(remainingIncome, savingsRate);
  const targetSavingsRate = input.targetSavingsRate ?? 20;
  const targetMinimumSalary = calculateMinimumSalary(totalExpenses, targetSavingsRate);

  const expenseBreakdown = (
    Object.keys(EXPENSE_CATEGORY_LABELS) as (keyof ExpenseEstimates)[]
  ).map((cat) => {
    const amount = Math.round(input.expenses[cat] || 0);
    const percentage =
      totalExpenses > 0 ? Math.round((amount / totalExpenses) * 1000) / 10 : 0;
    return {
      category: cat,
      label: EXPENSE_CATEGORY_LABELS[cat],
      amount,
      percentage
    };
  });

  return {
    totalIncome,
    totalExpenses,
    remainingIncome,
    savingsRate,
    annualSavings,
    status: statusInfo.status,
    statusInfo,
    targetMinimumSalary,
    expenseBreakdown
  };
}

export function calculateRelocation(input: RelocationInput): RelocationResult {
  const travelCost = Math.round(input.travelCost || 0);
  const movingCost = Math.round(input.movingCost || 0);
  const rentalDeposit = Math.round(input.rentalDeposit || 0);
  const firstMonthRent = Math.round(input.firstMonthRent || 0);
  const initialEquipment = Math.round(input.initialEquipment || 0);

  const monthlyExpense = Math.round(input.monthlyExpenseEstimate || 0);
  const reserveMonths = input.emergencyReserveMonths ?? 3;

  const suggestedReserve = monthlyExpense * reserveMonths;
  const emergencyReserve =
    input.manualEmergencyReserve !== undefined
      ? Math.round(input.manualEmergencyReserve)
      : suggestedReserve;

  const firstMonthTotalExpenditure =
    firstMonthRent + travelCost + movingCost + initialEquipment;

  const totalRelocationCapital =
    travelCost +
    movingCost +
    rentalDeposit +
    firstMonthRent +
    initialEquipment +
    emergencyReserve;

  const runwayMonths =
    monthlyExpense > 0
      ? Math.round((emergencyReserve / monthlyExpense) * 10) / 10
      : reserveMonths;

  return {
    travelCost,
    movingCost,
    rentalDeposit,
    firstMonthRent,
    initialEquipment,
    emergencyReserve,
    totalRelocationCapital,
    firstMonthTotalExpenditure,
    suggestedReserve,
    runwayMonths
  };
}

export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Data tidak tersedia';
  }
  const isNegative = amount < 0;
  const absolute = Math.abs(amount);
  const formatted = absolute.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return isNegative ? `-Rp${formatted}` : `Rp${formatted}`;
}

export function getPtkpCategory(status: PTKPStatus): 'A' | 'B' | 'C' {
  switch (status) {
    case 'TK/0':
    case 'TK/1':
    case 'K/0':
      return 'A';
    case 'TK/2':
    case 'TK/3':
    case 'K/1':
    case 'K/2':
      return 'B';
    case 'K/3':
      return 'C';
    default:
      return 'A';
  }
}

export function getPph21TerMonthlyRate(grossSalary: number, category: 'A' | 'B' | 'C'): number {
  if (category === 'A') {
    if (grossSalary <= 5400000) return 0;
    if (grossSalary <= 5650000) return 0.0025;
    if (grossSalary <= 5950000) return 0.005;
    if (grossSalary <= 6300000) return 0.0075;
    if (grossSalary <= 6750000) return 0.01;
    if (grossSalary <= 7500000) return 0.0125;
    if (grossSalary <= 8550000) return 0.015;
    if (grossSalary <= 9650000) return 0.0175;
    if (grossSalary <= 10050000) return 0.02;
    if (grossSalary <= 10350000) return 0.0225;
    if (grossSalary <= 10700000) return 0.025;
    if (grossSalary <= 12500000) return 0.03;
    if (grossSalary <= 15000000) return 0.04;
    if (grossSalary <= 18000000) return 0.06;
    if (grossSalary <= 22000000) return 0.09;
    if (grossSalary <= 27000000) return 0.12;
    if (grossSalary <= 35000000) return 0.15;
    if (grossSalary <= 50000000) return 0.19;
    return 0.25;
  } else if (category === 'B') {
    if (grossSalary <= 6200000) return 0;
    if (grossSalary <= 6500000) return 0.0025;
    if (grossSalary <= 6850000) return 0.005;
    if (grossSalary <= 7300000) return 0.0075;
    if (grossSalary <= 9200000) return 0.01;
    if (grossSalary <= 10750000) return 0.015;
    if (grossSalary <= 12500000) return 0.025;
    if (grossSalary <= 15000000) return 0.04;
    if (grossSalary <= 18500000) return 0.06;
    if (grossSalary <= 23000000) return 0.09;
    if (grossSalary <= 28000000) return 0.12;
    if (grossSalary <= 36000000) return 0.15;
    if (grossSalary <= 52000000) return 0.19;
    return 0.25;
  } else {
    if (grossSalary <= 6600000) return 0;
    if (grossSalary <= 6950000) return 0.0025;
    if (grossSalary <= 7350000) return 0.005;
    if (grossSalary <= 7800000) return 0.0075;
    if (grossSalary <= 8850000) return 0.01;
    if (grossSalary <= 9800000) return 0.0125;
    if (grossSalary <= 10950000) return 0.015;
    if (grossSalary <= 12500000) return 0.02;
    if (grossSalary <= 15000000) return 0.035;
    if (grossSalary <= 19000000) return 0.06;
    if (grossSalary <= 24000000) return 0.09;
    if (grossSalary <= 30000000) return 0.12;
    if (grossSalary <= 38000000) return 0.15;
    if (grossSalary <= 55000000) return 0.19;
    return 0.25;
  }
}

export function calculateTaxAndDeductions(
  grossSalary: number,
  ptkpStatus: PTKPStatus = 'TK/0'
): TaxAndDeductionResult {
  const gross = Math.max(0, Math.round(grossSalary));
  const bpjsKesehatanCap = 12000000;
  const bpjsKesBase = Math.min(gross, bpjsKesehatanCap);
  const bpjsKesehatan = Math.round(bpjsKesBase * 0.01);

  const bpjsKetenagakerjaanJht = Math.round(gross * 0.02);

  const jpCap = 10547400;
  const jpBase = Math.min(gross, jpCap);
  const bpjsKetenagakerjaanJp = Math.round(jpBase * 0.01);

  const totalBpjsEmployee = bpjsKesehatan + bpjsKetenagakerjaanJht + bpjsKetenagakerjaanJp;

  const ptkpCategory = getPtkpCategory(ptkpStatus);
  const pph21EffectiveRate = getPph21TerMonthlyRate(gross, ptkpCategory);
  const pph21Monthly = Math.round(gross * pph21EffectiveRate);

  const totalDeductions = totalBpjsEmployee + pph21Monthly;
  const takeHomePay = gross - totalDeductions;

  return {
    grossSalary: gross,
    bpjsKesehatan,
    bpjsKetenagakerjaanJht,
    bpjsKetenagakerjaanJp,
    totalBpjsEmployee,
    pph21Monthly,
    pph21EffectiveRate,
    totalDeductions,
    takeHomePay,
    ptkpCategory
  };
}

export function estimateGrossFromNet(
  targetNetSalary: number,
  ptkpStatus: PTKPStatus = 'TK/0'
): number {
  if (targetNetSalary <= 0) return 0;
  let low = targetNetSalary;
  let high = targetNetSalary * 1.5;
  for (let i = 0; i < 20; i++) {
    const mid = Math.round((low + high) / 2);
    const calc = calculateTaxAndDeductions(mid, ptkpStatus);
    if (Math.abs(calc.takeHomePay - targetNetSalary) < 1000) {
      return mid;
    }
    if (calc.takeHomePay < targetNetSalary) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return Math.round((low + high) / 2);
}

export function calculateReverseSalary(
  input: ReverseSalaryInput,
  cityUmk: number | null = null
): ReverseSalaryResult {
  const totalExpenses = calculateTotalExpenses(input.expenses);
  const targetSavings = Math.max(0, Math.round(input.targetSavingsMonthly || 0));
  const requiredNetSalary = totalExpenses + targetSavings;

  let requiredGrossSalary = requiredNetSalary;
  let estimatedTaxAndDeductions: TaxAndDeductionResult | null = null;

  if (input.includeTaxDeduction) {
    requiredGrossSalary = estimateGrossFromNet(requiredNetSalary, input.ptkpStatus || 'TK/0');
    estimatedTaxAndDeductions = calculateTaxAndDeductions(
      requiredGrossSalary,
      input.ptkpStatus || 'TK/0'
    );
  }

  const umkRatio =
    cityUmk && cityUmk > 0
      ? Math.round((requiredNetSalary / cityUmk) * 10) / 10
      : null;

  return {
    targetSavingsMonthly: targetSavings,
    totalExpenses,
    requiredNetSalary,
    requiredGrossSalary,
    estimatedTaxAndDeductions,
    umkRatio,
    cityUmk
  };
}

export function calculateJobOfferComparison(
  input: JobOfferComparisonInput
): JobOfferComparisonResult {
  const currentTotalExpenses = calculateTotalExpenses(input.currentExpenses);
  const offerTotalExpenses = calculateTotalExpenses(input.offerExpenses);

  const currentDisposableIncome = input.currentNetSalary - currentTotalExpenses;
  const offerDisposableIncome = input.offerNetSalary - offerTotalExpenses;
  const disposableIncomeDifference = offerDisposableIncome - currentDisposableIncome;

  const salaryIncreaseAmount = input.offerNetSalary - input.currentNetSalary;
  const salaryIncreasePercentage =
    input.currentNetSalary > 0
      ? Math.round((salaryIncreaseAmount / input.currentNetSalary) * 1000) / 10
      : 0;

  const expenseDifferenceAmount = offerTotalExpenses - currentTotalExpenses;
  const expenseDifferencePercentage =
    currentTotalExpenses > 0
      ? Math.round((expenseDifferenceAmount / currentTotalExpenses) * 1000) / 10
      : 0;

  const currentSavingsRate =
    input.currentNetSalary > 0
      ? Math.round((currentDisposableIncome / input.currentNetSalary) * 1000) / 10
      : 0;

  const offerSavingsRate =
    input.offerNetSalary > 0
      ? Math.round((offerDisposableIncome / input.offerNetSalary) * 1000) / 10
      : 0;

  const savingsRateDifference = Math.round((offerSavingsRate - currentSavingsRate) * 10) / 10;

  const isWorthIt = disposableIncomeDifference > 0;

  let recommendationHeadline = '';
  let recommendationDetail = '';

  if (disposableIncomeDifference > 1500000) {
    recommendationHeadline = 'Sangat Layak Diterima (Strong Yes)';
    recommendationDetail = `Tawaran ini meningkatkan sisa uang tabungan bersih Anda sebesar ${formatRupiah(disposableIncomeDifference)}/bulan setelah seluruh biaya hidup kota tujuan terpenuhi.`;
  } else if (disposableIncomeDifference > 0) {
    recommendationHeadline = 'Layak Diterima dengan Catatan';
    recommendationDetail = `Ada kenaikan tabungan bersih tipis sebesar ${formatRupiah(disposableIncomeDifference)}/bulan. Pertimbangkan biaya relokasi awal dan kualitas hidup sebelum memutuskan.`;
  } else if (salaryIncreaseAmount > 0 && disposableIncomeDifference <= 0) {
    recommendationHeadline = 'Secara Finansial Kurang Menguntungkan (Phantom Raise)';
    recommendationDetail = `Meskipun nominal gaji naik ${formatRupiah(salaryIncreaseAmount)} (${salaryIncreasePercentage}%), lonjakan biaya hidup di kota baru memangkas kapasitas tabungan Anda sebesar ${formatRupiah(Math.abs(disposableIncomeDifference))}/bulan.`;
  } else {
    recommendationHeadline = 'Tidak Direkomendasikan';
    recommendationDetail = `Tawaran ini menurunkan kapasitas menabung Anda sebesar ${formatRupiah(Math.abs(disposableIncomeDifference))}/bulan dibandingkan kondisi saat ini.`;
  }

  return {
    currentCityId: input.currentCityId,
    offerCityId: input.offerCityId,
    currentNetSalary: input.currentNetSalary,
    offerNetSalary: input.offerNetSalary,
    salaryIncreaseAmount,
    salaryIncreasePercentage,
    currentTotalExpenses,
    offerTotalExpenses,
    expenseDifferenceAmount,
    expenseDifferencePercentage,
    currentDisposableIncome,
    offerDisposableIncome,
    disposableIncomeDifference,
    currentSavingsRate,
    offerSavingsRate,
    savingsRateDifference,
    isWorthIt,
    recommendationHeadline,
    recommendationDetail
  };
}

