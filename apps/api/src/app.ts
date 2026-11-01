import express, { Request, Response } from 'express';
import corsMiddleware from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  calculateSimulation,
  calculateRelocation,
  simulationInputSchema,
  comparisonInputSchema,
  relocationInputSchema,
  ExpenseEstimates,
  CityComparisonItem
} from '@worthit/shared';
import { datasetService } from './services/dataset.service.js';

export const app = express();

app.use(helmet());
app.use(corsMiddleware({ origin: '*' }));
app.use(express.json({ limit: '100kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Terlalu banyak permintaan, coba lagi nanti.' }
});
app.use('/api/', limiter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'worthit-indonesia-api'
  });
});

// Cities listing
app.get('/api/v1/cities', (req: Request, res: Response) => {
  const query = typeof req.query.q === 'string' ? req.query.q : undefined;
  const cities = datasetService.getCities(query);
  res.json({ success: true, count: cities.length, data: cities });
});

// Overview statistics
app.get('/api/v1/statistics/overview', (req: Request, res: Response) => {
  const overview = datasetService.getOverview();
  res.json({ success: true, data: overview });
});

// Single city
app.get('/api/v1/cities/:slug', (req: Request, res: Response) => {
  const city = datasetService.getCityById(req.params.slug);
  if (!city) {
    res.status(404).json({ success: false, error: 'Kota tidak ditemukan' });
    return;
  }
  res.json({ success: true, data: city });
});

// City benchmarks
app.get('/api/v1/cities/:slug/benchmarks', (req: Request, res: Response) => {
  const data = datasetService.getCityBenchmarks(req.params.slug);
  if (!data) {
    res.status(404).json({ success: false, error: 'Kota tidak ditemukan' });
    return;
  }
  res.json({ success: true, data });
});

// City expenses reference
app.get('/api/v1/cities/:slug/expenses', (req: Request, res: Response) => {
  const profile = typeof req.query.profile === 'string' ? req.query.profile : 'single';
  const householdSize = typeof req.query.householdSize === 'string' ? parseInt(req.query.householdSize, 10) : 1;
  const data = datasetService.getCityExpenses(req.params.slug, profile, householdSize);
  if (!data) {
    res.status(404).json({ success: false, error: 'Kota tidak ditemukan' });
    return;
  }
  res.json({ success: true, data });
});

// City sources
app.get('/api/v1/cities/:slug/sources', (req: Request, res: Response) => {
  const data = datasetService.getCitySources(req.params.slug);
  if (!data) {
    res.status(404).json({ success: false, error: 'Kota tidak ditemukan' });
    return;
  }
  res.json({ success: true, data });
});

// POST /calculator/simulate
app.post('/api/v1/calculator/simulate', (req: Request, res: Response) => {
  const parseResult = simulationInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      error: 'Validasi input gagal',
      details: parseResult.error.format()
    });
    return;
  }

  const validatedInput = parseResult.data;
  const simulation = calculateSimulation(validatedInput);

  res.json({
    success: true,
    data: simulation
  });
});

// POST /calculator/compare
app.post('/api/v1/calculator/compare', (req: Request, res: Response) => {
  const parseResult = comparisonInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      error: 'Validasi input gagal',
      details: parseResult.error.format()
    });
    return;
  }

  const { income, profile, householdSize, cityIds } = parseResult.data;
  const comparisonItems: CityComparisonItem[] = [];

  for (const cityId of cityIds) {
    const city = datasetService.getCityById(cityId);
    if (!city) continue;

    const ref = datasetService.getCityExpenses(cityId, profile, householdSize);
    const expenses: ExpenseEstimates = ref?.reference?.estimates || {
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
      isComplete: ref?.reference?.isComplete ?? false,
      missingCategories: ref?.reference?.missingFields || []
    });
  }

  if (comparisonItems.length === 0) {
    res.status(404).json({ success: false, error: 'Kota pilihan tidak valid' });
    return;
  }

  let mostAffordableCityId: string | null = null;
  let minExpenses = Infinity;
  for (const item of comparisonItems) {
    if (item.simulation.totalExpenses < minExpenses) {
      minExpenses = item.simulation.totalExpenses;
      mostAffordableCityId = item.city.id;
    }
  }

  res.json({
    success: true,
    data: {
      income: income.netMonthly + (income.additionalMonthly || 0),
      profile,
      householdSize,
      cities: comparisonItems,
      mostAffordableCityId
    }
  });
});

// POST /calculator/relocation
app.post('/api/v1/calculator/relocation', (req: Request, res: Response) => {
  const parseResult = relocationInputSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      error: 'Validasi input gagal',
      details: parseResult.error.format()
    });
    return;
  }

  const validatedInput = parseResult.data;
  const result = calculateRelocation(validatedInput);

  res.json({
    success: true,
    data: result
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled API error:', err);
  res.status(500).json({
    success: false,
    error: 'Terjadi kesalahan internal server'
  });
});
