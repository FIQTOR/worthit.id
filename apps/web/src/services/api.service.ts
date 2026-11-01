import {
  City,
  CityExpenseReference,
  DataSourceMeta,
  RentalPriceRecord,
  SimulationInput,
  ComparisonInput,
  RelocationInput,
  CityComparisonItem,
  calculateSimulation,
  calculateRelocation,
  ExpenseEstimates
} from '@worthit/shared';

import citiesJson from '../../../../datasets/cities.json';
import rentalPricesJson from '../../../../datasets/rental-prices.json';
import expenditureBenchmarksJson from '../../../../datasets/expenditure-benchmarks.json';
import sourcesJson from '../../../../datasets/sources.json';

const citiesData: City[] = citiesJson as City[];
const rentalPricesData: RentalPriceRecord[] = rentalPricesJson as RentalPriceRecord[];
const expenditureBenchmarksData: CityExpenseReference[] = expenditureBenchmarksJson as CityExpenseReference[];
const sourcesData: DataSourceMeta[] = sourcesJson as DataSourceMeta[];

export const apiService = {
  async getCities(query?: string): Promise<{ success: boolean; count: number; data: City[] }> {
    if (!query) {
      return { success: true, count: citiesData.length, data: citiesData };
    }
    const lower = query.toLowerCase();
    const filtered = citiesData.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.province.toLowerCase().includes(lower) ||
        c.id.toLowerCase().includes(lower)
    );
    return { success: true, count: filtered.length, data: filtered };
  },

  async getCityById(id: string): Promise<{ success: boolean; data?: City; error?: string }> {
    const city = citiesData.find((c) => c.id.toLowerCase() === id.toLowerCase());
    if (!city) {
      return { success: false, error: 'Kota tidak ditemukan' };
    }
    return { success: true, data: city };
  },

  async getCityBenchmarks(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const city = citiesData.find((c) => c.id.toLowerCase() === id.toLowerCase());
    if (!city) {
      return { success: false, error: 'Kota tidak ditemukan' };
    }
    const relevantSources = sourcesData.filter((s) =>
      ['bps-konsumsi-2025', 'bps-ihk-150', 'kemnaker-jdih-umk'].includes(s.id)
    );
    const rentals = rentalPricesData.filter(
      (r) => r.cityId.toLowerCase() === id.toLowerCase()
    );
    return {
      success: true,
      data: {
        cityId: city.id,
        cityName: city.name,
        benchmarks: city.benchmarks,
        inflation: city.inflation,
        rentals,
        sources: relevantSources
      }
    };
  },

  async getCityExpenses(
    id: string,
    profile = 'single',
    householdSize = 1
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const city = citiesData.find((c) => c.id.toLowerCase() === id.toLowerCase());
    if (!city) {
      return { success: false, error: 'Kota tidak ditemukan' };
    }

    const ref =
      expenditureBenchmarksData.find(
        (e) =>
          e.cityId.toLowerCase() === id.toLowerCase() &&
          e.profile === profile &&
          e.householdSize === householdSize
      ) ||
      expenditureBenchmarksData.find(
        (e) => e.cityId.toLowerCase() === id.toLowerCase()
      );

    const rentals = rentalPricesData.filter(
      (r) => r.cityId.toLowerCase() === id.toLowerCase()
    );

    return {
      success: true,
      data: {
        city,
        reference: ref || null,
        rentals
      }
    };
  },

  async getCitySources(_id?: string): Promise<{ success: boolean; data?: any }> {
    const relevantSources = sourcesData.filter((s) =>
      ['bps-konsumsi-2025', 'bps-ihk-150', 'kemnaker-jdih-umk'].includes(s.id)
    );
    return { success: true, data: relevantSources };
  },

  async simulate(data: SimulationInput): Promise<{ success: boolean; data: any }> {
    const result = calculateSimulation(data);
    return { success: true, data: result };
  },

  async compare(data: ComparisonInput): Promise<{ success: boolean; data?: any; error?: string }> {
    const { income, profile, householdSize, cityIds } = data;
    const comparisonItems: CityComparisonItem[] = [];

    for (const cityId of cityIds) {
      const city = citiesData.find((c) => c.id.toLowerCase() === cityId.toLowerCase());
      if (!city) continue;

      const ref =
        expenditureBenchmarksData.find(
          (e) =>
            e.cityId.toLowerCase() === cityId.toLowerCase() &&
            e.profile === profile &&
            e.householdSize === householdSize
        ) ||
        expenditureBenchmarksData.find(
          (e) => e.cityId.toLowerCase() === cityId.toLowerCase()
        );

      const expenses: ExpenseEstimates = ref?.estimates || {
        housing: 0,
        food: 0,
        transportation: 0,
        utilities: 0,
        lifestyle: 0,
        financialObligations: 0,
        other: 0
      };

      const simulation = calculateSimulation({
        income,
        cityId,
        profile,
        householdSize,
        expenses
      });

      comparisonItems.push({
        city,
        expenses,
        simulation,
        isComplete: ref?.isComplete ?? false,
        missingCategories: ref?.missingFields || []
      });
    }

    if (comparisonItems.length === 0) {
      return { success: false, error: 'Kota pilihan tidak valid' };
    }

    let mostAffordableCityId: string | null = null;
    let minExpenses = Infinity;
    for (const item of comparisonItems) {
      if (item.simulation.totalExpenses < minExpenses) {
        minExpenses = item.simulation.totalExpenses;
        mostAffordableCityId = item.city.id;
      }
    }

    return {
      success: true,
      data: {
        income: income.netMonthly + (income.additionalMonthly || 0),
        profile,
        householdSize,
        cities: comparisonItems,
        mostAffordableCityId
      }
    };
  },

  async calculateRelocation(data: RelocationInput): Promise<{ success: boolean; data: any }> {
    const result = calculateRelocation(data);
    return { success: true, data: result };
  },

  async getOverview(): Promise<{ success: boolean; data: any }> {
    return {
      success: true,
      data: {
        totalCities: citiesData.length,
        averageUmk: Math.round(
          citiesData.reduce((acc, c) => acc + (c.benchmarks.umk || 0), 0) /
            citiesData.filter((c) => c.benchmarks.umk).length
        )
      }
    };
  }
};
