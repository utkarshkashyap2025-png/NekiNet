import { describe, it, expect } from 'vitest';
import { calculateHaversineDistance, getFuzzedCoordinates, formatDistance } from '../lib/geoUtils';

describe('Geo Utilities & Spatial Privacy', () => {
  it('correctly calculates haversine distance between two points', () => {
    // Delhi to Gurgaon approx 28 km
    const distance = calculateHaversineDistance(28.6139, 77.2090, 28.4595, 77.0266);
    expect(distance).toBeGreaterThan(20);
    expect(distance).toBeLessThan(35);

    // Same point should be 0 distance
    const zeroDist = calculateHaversineDistance(28.4595, 77.0266, 28.4595, 77.0266);
    expect(zeroDist).toBe(0);
  });

  it('guarantees spatial privacy by applying non-zero coordinate jitter (300-600m)', () => {
    const originalLat = 28.4595;
    const originalLng = 77.0266;

    const fuzzed = getFuzzedCoordinates(originalLat, originalLng, 'req-sample-123', 400);

    // Coordinates MUST NOT match exact house coordinates
    expect(fuzzed.lat).not.toBe(originalLat);
    expect(fuzzed.lng).not.toBe(originalLng);

    // Verify distance offset is within safety envelope (~0.1km to 0.7km)
    const offsetKm = calculateHaversineDistance(originalLat, originalLng, fuzzed.lat, fuzzed.lng);
    expect(offsetKm).toBeGreaterThan(0.1);
    expect(offsetKm).toBeLessThan(0.8);
  });

  it('formats distance strings properly for requesters and volunteers', () => {
    expect(formatDistance(0.4)).toBe('400 m away');
    expect(formatDistance(1.8)).toBe('1.8 km away');
    expect(formatDistance(undefined)).toBe('Nearby');
  });
});
