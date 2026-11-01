import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  City,
  CityExpenseReference,
  DataSourceMeta,
  RentalPriceRecord
} from '@worthit/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleDatasetDirs = [
  path.resolve(__dirname, '../../../datasets'),
  path.resolve(__dirname, '../../datasets'),
  path.resolve(process.cwd(), 'datasets'),
  path.resolve(process.cwd(), '../datasets'),
  path.resolve(process.cwd(), '../../datasets')
];

function findDatasetDir(): string {
  for (const dir of possibleDatasetDirs) {
    if (fs.existsSync(dir) && fs.existsSync(path.join(dir, 'cities.json'))) {
      return dir;
    }
  }
  return path.resolve(__dirname, '../../../datasets');
}

const datasetDir = findDatasetDir();

function readJsonFile<T>(filename: string): T {
  const filePath = path.join(datasetDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Dataset file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export const citiesData: City[] = readJsonFile<City[]>('cities.json');
export const rentalPricesData: RentalPriceRecord[] = readJsonFile<RentalPriceRecord[]>('rental-prices.json');
export const expenditureBenchmarksData: CityExpenseReference[] = readJsonFile<CityExpenseReference[]>('expenditure-benchmarks.json');
export const sourcesData: DataSourceMeta[] = readJsonFile<DataSourceMeta[]>('sources.json');

export const datasetService = {
  getCities(query?: string) {
    if (!query) return citiesData;
    const lower = query.toLowerCase();
    return citiesData.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.province.toLowerCase().includes(lower) ||
        c.id.toLowerCase().includes(lower)
    );
  },

  getCityById(id: string): City | undefined {
    return citiesData.find((c) => c.id.toLowerCase() === id.toLowerCase());
  },

  getCityBenchmarks(id: string) {
    const city = this.getCityById(id);
    if (!city) return null;
    const relevantSources = sourcesData.filter((s) =>
      ['bps-konsumsi-2025', 'bps-ihk-150', 'kemnaker-jdih-umk'].includes(s.id)
    );
    const rentals = rentalPricesData.filter(
      (r) => r.cityId.toLowerCase() === id.toLowerCase()
    );
    return {
      cityId: city.id,
      cityName: city.name,
      benchmarks: city.benchmarks,
      inflation: city.inflation,
      rentals,
      sources: relevantSources
    };
  },

  getCityExpenses(id: string, profile = 'single', householdSize = 1) {
    const city = this.getCityById(id);
    if (!city) return null;

    const ref = expenditureBenchmarksData.find(
      (e) =>
        e.cityId.toLowerCase() === id.toLowerCase() &&
        e.profile === profile &&
        e.householdSize === householdSize
    ) || expenditureBenchmarksData.find(
      (e) => e.cityId.toLowerCase() === id.toLowerCase()
    );

    const rentals = rentalPricesData.filter(
      (r) => r.cityId.toLowerCase() === id.toLowerCase()
    );

    return {
      city,
      reference: ref || null,
      rentals
    };
  },

  getCitySources(id: string) {
    const city = this.getCityById(id);
    if (!city) return null;
    return {
      cityId: city.id,
      cityName: city.name,
      sources: sourcesData
    };
  },

  getOverview() {
    return {
      totalCities: citiesData.length,
      completeCitiesCount: citiesData.filter((c) => c.dataQuality === 'complete').length,
      lastUpdated: '2026-04-15',
      sourcesCount: sourcesData.length
    };
  }
};
