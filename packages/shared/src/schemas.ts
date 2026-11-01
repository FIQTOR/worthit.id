import { z } from 'zod';

export const expenseEstimatesSchema = z.object({
  housing: z.number().int().min(0, 'Biaya tempat tinggal tidak boleh negatif'),
  food: z.number().int().min(0, 'Biaya makanan tidak boleh negatif'),
  transportation: z.number().int().min(0, 'Biaya transportasi tidak boleh negatif'),
  utilities: z.number().int().min(0, 'Biaya utilitas tidak boleh negatif'),
  lifestyle: z.number().int().min(0, 'Biaya gaya hidup tidak boleh negatif'),
  financialObligations: z.number().int().min(0, 'Biaya kewajiban finansial tidak boleh negatif'),
  other: z.number().int().min(0, 'Biaya lainnya tidak boleh negatif')
});

export const simulationInputSchema = z.object({
  income: z.object({
    netMonthly: z.number().int().min(0, 'Gaji bersih tidak boleh negatif'),
    additionalMonthly: z.number().int().min(0).optional().default(0)
  }),
  cityId: z.string().min(1, 'Kota tujuan harus dipilih'),
  profile: z.enum(['single', 'single_shared', 'couple_no_kids', 'family_with_kids', 'custom']),
  householdSize: z.number().int().min(1).max(20).default(1),
  expenses: expenseEstimatesSchema,
  targetSavingsRate: z.number().min(0).max(99).optional().default(20)
});

export const comparisonInputSchema = z.object({
  income: z.object({
    netMonthly: z.number().int().min(0, 'Gaji bersih tidak boleh negatif'),
    additionalMonthly: z.number().int().min(0).optional().default(0)
  }),
  profile: z.enum(['single', 'single_shared', 'couple_no_kids', 'family_with_kids', 'custom']),
  householdSize: z.number().int().min(1).max(20).default(1),
  cityIds: z.array(z.string().min(1)).min(2, 'Pilih minimal 2 kota').max(3, 'Maksimal 3 kota')
});

export const relocationInputSchema = z.object({
  destinationCityId: z.string().min(1, 'Kota tujuan harus dipilih'),
  travelCost: z.number().int().min(0, 'Biaya perjalanan tidak boleh negatif'),
  movingCost: z.number().int().min(0, 'Biaya pindahan tidak boleh negatif'),
  rentalDeposit: z.number().int().min(0, 'Deposit sewa tidak boleh negatif'),
  firstMonthRent: z.number().int().min(0, 'Sewa bulan pertama tidak boleh negatif'),
  initialEquipment: z.number().int().min(0, 'Biaya perlengkapan awal tidak boleh negatif'),
  emergencyReserveMonths: z.number().int().min(0).max(24).optional().default(3),
  monthlyExpenseEstimate: z.number().int().min(0).optional().default(0),
  manualEmergencyReserve: z.number().int().min(0).optional()
});
