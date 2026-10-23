/**
 * Geo-spatial utilities for NekiNet Hyperlocal Matching & Spatial Privacy
 */

// Default center coordinates (e.g. Greenwood Sector reference district)
export const DEFAULT_MAP_CENTER = {
  lat: 28.4595,
  lng: 77.0266,
  label: 'Greenwood Sector 14, Urban District',
};

/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(1));
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Applies deterministic / pseudo-random spatial coordinate fuzzing (~300m - 500m)
 * to guarantee that exact door or house coordinates are NEVER displayed on public maps.
 */
export function getFuzzedCoordinates(
  lat: number,
  lng: number,
  seedKey: string = 'nekinet-zone',
  jitterMeters: number = 400
): { lat: number; lng: number } {
  // Use string hash for stable coordinate rendering across renders
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) {
    hash = (hash << 5) - hash + seedKey.charCodeAt(i);
    hash |= 0;
  }

  // Convert meters to approximate degree offsets
  // 1 deg latitude ~ 111.32 km -> 100m ~ 0.0009 degrees
  const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
  const distanceDeg = (jitterMeters / 111320) * (0.7 + ((Math.abs(hash) % 60) / 100));

  const fuzzedLat = lat + Math.sin(angle) * distanceDeg;
  const fuzzedLng = lng + (Math.cos(angle) * distanceDeg) / Math.cos(toRad(lat));

  return {
    lat: Number(fuzzedLat.toFixed(5)),
    lng: Number(fuzzedLng.toFixed(5)),
  };
}

export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm)) return 'Nearby';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm} km away`;
}
