import { useState, useEffect } from 'react';
import { DEFAULT_MAP_CENTER } from '../lib/geoUtils';

export interface LocationState {
  lat: number;
  lng: number;
  label: string;
  isCustomOrBrowser: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unsupported';
  isRequesting: boolean;
  error: string | null;
}

export const POPULAR_NEIGHBORHOOD_AREAS = [
  { lat: 28.4595, lng: 77.0266, label: 'Greenwood Sector 14, Urban District' },
  { lat: 28.4670, lng: 77.0210, label: 'Silver Heights Towers, Sector 15' },
  { lat: 28.4520, lng: 77.0310, label: 'Rosewood Enclave, Block A' },
  { lat: 28.4480, lng: 77.0190, label: 'Civil Lines, Pocket 2' },
  { lat: 28.4550, lng: 77.0350, label: 'Shanti Niketan, Sector 12' },
];

export function useUserLocation() {
  const [location, setLocation] = useState<LocationState>({
    lat: DEFAULT_MAP_CENTER.lat,
    lng: DEFAULT_MAP_CENTER.lng,
    label: DEFAULT_MAP_CENTER.label,
    isCustomOrBrowser: false,
    permissionStatus: 'prompt',
    isRequesting: false,
    error: null,
  });

  // Query browser permissions if supported
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (result.state === 'granted') {
            setLocation((prev) => ({ ...prev, permissionStatus: 'granted' }));
          } else if (result.state === 'denied') {
            setLocation((prev) => ({ ...prev, permissionStatus: 'denied' }));
          }
        })
        .catch(() => {
          // Permissions API query not supported in all contexts
        });
    }
  }, []);

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        permissionStatus: 'unsupported',
        error: 'Geolocation is not supported by your browser. Using manual neighborhood selection.',
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, isRequesting: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Your Current Neighborhood (Live GPS)',
          isCustomOrBrowser: true,
          permissionStatus: 'granted',
          isRequesting: false,
          error: null,
        });
      },
      (err) => {
        let msg = 'Location access was not granted.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can select your neighborhood manually from the dropdown.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Please select your neighborhood manually.';
        }
        setLocation((prev) => ({
          ...prev,
          permissionStatus: 'denied',
          isRequesting: false,
          error: msg,
        }));
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const setManualLocation = (lat: number, lng: number, label: string) => {
    setLocation({
      lat,
      lng,
      label,
      isCustomOrBrowser: true,
      permissionStatus: location.permissionStatus,
      isRequesting: false,
      error: null,
    });
  };

  return {
    location,
    requestBrowserLocation,
    setManualLocation,
  };
}
