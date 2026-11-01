const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      success: false,
      error: 'Network error'
    }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const apiService = {
  getCities: (query?: string) =>
    fetchApi<any>(`/cities${query ? `?q=${encodeURIComponent(query)}` : ''}`),

  getCityById: (id: string) => fetchApi<any>(`/cities/${id}`),

  getCityBenchmarks: (id: string) => fetchApi<any>(`/cities/${id}/benchmarks`),

  getCityExpenses: (id: string, profile?: string, householdSize?: number) => {
    const params = new URLSearchParams();
    if (profile) params.append('profile', profile);
    if (householdSize) params.append('householdSize', householdSize.toString());
    return fetchApi<any>(`/cities/${id}/expenses?${params.toString()}`);
  },

  getCitySources: (id: string) => fetchApi<any>(`/cities/${id}/sources`),

  simulate: (data: any) =>
    fetchApi<any>('/calculator/simulate', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  compare: (data: any) =>
    fetchApi<any>('/calculator/compare', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  calculateRelocation: (data: any) =>
    fetchApi<any>('/calculator/relocation', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getOverview: () => fetchApi<any>('/statistics/overview')
};
