// Open-Meteo Geocoding Service
// https://open-meteo.com/en/docs/geocoding-api

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

export async function searchLocations(query) {
  // Return empty array for empty queries
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      name: query.trim(),
      count: 10,
      language: 'en',
      format: 'json',
    });

    const response = await fetch(`${GEOCODING_API}?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Return empty array if no results
    if (!data.results || data.results.length === 0) {
      return [];
    }

    // Normalize results
    return data.results.map((result) => ({
      id: `${result.latitude},${result.longitude},${result.timezone}`,
      name: result.name,
      country: result.country,
      admin1: result.admin1 || null,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    throw {
      message: 'Failed to search locations',
      originalError: error,
    };
  }
}
