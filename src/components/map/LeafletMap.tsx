import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { HelpRequest } from '../../types';
import { getFuzzedCoordinates, formatDistance } from '../../lib/geoUtils';
import { AlertCircle } from 'lucide-react';

interface LeafletMapProps {
  userLocation: { lat: number; lng: number; label: string };
  radiusKm: number;
  requests: HelpRequest[];
  selectedRequestId: string | null;
  onSelectRequest: (request: HelpRequest) => void;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  userLocation,
  radiusKm,
  requests,
  selectedRequestId,
  onSelectRequest,
  className = 'h-full w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());
  
  const [tileError, setTileError] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    });

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    tileLayer.on('tileerror', () => {
      setTileError(true);
    });

    tileLayer.on('load', () => {
      setTileError(false);
    });

    tileLayer.addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Handle container resizing
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [userLocation.lat, userLocation.lng]);

  // Update User Location Marker & Radius Coverage Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old user marker & circle
    if (userMarkerRef.current) userMarkerRef.current.remove();
    if (userCircleRef.current) userCircleRef.current.remove();

    // User Location Pin Icon (Modern SVG Pulsing Badge)
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-teal-500/20 border-2 border-teal-500 animate-ping absolute"></div>
          <div class="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs font-bold">
            📍
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindPopup(`
        <div class="p-1 text-xs">
          <strong class="text-teal-900 block font-bold">Your Reference Neighborhood</strong>
          <span class="text-slate-600 block mt-0.5">${userLocation.label}</span>
          <span class="text-[10px] text-teal-700 font-semibold mt-1 block">Active Radius: ${radiusKm} km</span>
        </div>
      `)
      .addTo(map);

    // Coverage Radius Circle (Semi-transparent dashed circle)
    const userCircle = L.circle([userLocation.lat, userLocation.lng], {
      radius: radiusKm * 1000,
      color: '#0d9488',
      fillColor: '#14b8a6',
      fillOpacity: 0.06,
      weight: 1.5,
      dashArray: '6, 8',
    }).addTo(map);

    userMarkerRef.current = userMarker;
    userCircleRef.current = userCircle;
  }, [userLocation, radiusKm]);

  // Render Open Request Fuzzed Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markerMapRef.current.clear();

    requests.forEach((req) => {
      // Coordinate Fuzzing (~400m jitter) for Spatial Privacy
      const fuzzed = getFuzzedCoordinates(req.lat, req.lng, req.id, 400);

      // Color coding by urgency
      let pinColor = '#10b981'; // green / low
      let badgeClass = 'bg-emerald-100 text-emerald-800';
      if (req.urgency === 'critical') {
        pinColor = '#e11d48'; // red
        badgeClass = 'bg-rose-100 text-rose-800';
      } else if (req.urgency === 'high') {
        pinColor = '#f97316'; // orange
        badgeClass = 'bg-orange-100 text-orange-800';
      } else if (req.urgency === 'medium') {
        pinColor = '#f59e0b'; // amber
        badgeClass = 'bg-amber-100 text-amber-800';
      }

      // Fuzzed zone circle indicator
      const zoneCircle = L.circle([fuzzed.lat, fuzzed.lng], {
        radius: 350,
        color: pinColor,
        fillColor: pinColor,
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 6',
      });
      markersGroup.addLayer(zoneCircle);

      // Custom marker icon
      const requestIcon = L.divIcon({
        className: 'custom-request-marker',
        html: `
          <div class="relative flex items-center justify-center transform hover:scale-110 transition cursor-pointer">
            <div class="w-8 h-8 rounded-xl shadow-lg border-2 border-white flex items-center justify-center text-white text-xs font-black" style="background-color: ${pinColor}">
              🤝
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([fuzzed.lat, fuzzed.lng], { icon: requestIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 min-w-[210px] space-y-1.5 font-sans';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-1">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badgeClass}">
            ${req.urgency}
          </span>
          <span class="text-[10px] font-semibold text-slate-500">
            ${formatDistance(req.distanceKm)}
          </span>
        </div>
        <h4 class="text-xs font-bold text-slate-900 leading-snug">${req.title}</h4>
        <p class="text-[11px] text-slate-600 line-clamp-2">${req.description}</p>
        <div class="pt-1 text-[10px] text-emerald-800 flex items-center gap-1">
          <span>📍 Area:</span>
          <span class="font-medium">${req.approxLocation}</span>
        </div>
        <div class="text-[9px] text-slate-400 italic">🔒 Coordinates fuzzed for neighbor privacy</div>
      `;

      const viewBtn = document.createElement('button');
      viewBtn.className = 'w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer text-center';
      viewBtn.innerText = 'View Request Details';
      viewBtn.onclick = () => {
        onSelectRequest(req);
      };
      popupContent.appendChild(viewBtn);

      marker.bindPopup(popupContent);
      markersGroup.addLayer(marker);
      markerMapRef.current.set(req.id, marker);
    });
  }, [requests, onSelectRequest]);

  // Center on selected request if clicked from list
  useEffect(() => {
    if (!selectedRequestId || !mapInstanceRef.current) return;
    const targetMarker = markerMapRef.current.get(selectedRequestId);
    if (targetMarker) {
      const latLng = targetMarker.getLatLng();
      mapInstanceRef.current.flyTo(latLng, 15, { duration: 1.2 });
      targetMarker.openPopup();
    }
  }, [selectedRequestId]);

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full rounded-2xl overflow-hidden z-10" />

      {/* Map Tile Error Warning Overlay */}
      {tileError && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-amber-50/95 border border-amber-300 p-2.5 rounded-xl text-xs text-amber-900 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Map tile server is slow or experiencing delays. All nearby request markers remain active.</span>
          </div>
          <button
            onClick={() => setTileError(false)}
            className="text-amber-800 font-bold ml-2 underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Privacy Watermark Badge */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/90 text-[11px] text-slate-600 shadow-sm pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Spatial Privacy: Markers display ~400m approximate zones</span>
      </div>
    </div>
  );
};
