import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Filter, 
  Search, 
  Sliders, 
  Crosshair, 
  ShieldCheck, 
  AlertCircle, 
  HeartHandshake, 
  Clock, 
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Layers,
  Map as MapIcon,
  List as ListIcon
} from 'lucide-react';
import type { HelpRequest, VolunteerProfile, RequestCategory } from '../../types';
import { LeafletMap } from './LeafletMap';
import { useUserLocation, POPULAR_NEIGHBORHOOD_AREAS } from '../../hooks/useUserLocation';
import { calculateHaversineDistance, formatDistance } from '../../lib/geoUtils';

interface HyperlocalExploreViewProps {
  requests: HelpRequest[];
  volunteerProfile: VolunteerProfile;
  onSelectRequest: (request: HelpRequest) => void;
  onSwitchToRequester: () => void;
  onSwitchToVolunteer: () => void;
}

export const HyperlocalExploreView: React.FC<HyperlocalExploreViewProps> = ({
  requests,
  volunteerProfile,
  onSelectRequest,
  onSwitchToRequester,
  onSwitchToVolunteer,
}) => {
  const { location, requestBrowserLocation, setManualLocation } = useUserLocation();

  // Filters
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [skillsOnlyMatch, setSkillsOnlyMatch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // Mobile tab state: 'map' or 'list'
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('map');

  // Compute live distances relative to user's selected location and apply filters
  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => req.status === 'open')
      .map((req) => {
        const liveDistance = calculateHaversineDistance(
          location.lat,
          location.lng,
          req.lat,
          req.lng
        );
        return {
          ...req,
          distanceKm: liveDistance,
        };
      })
      .filter((req) => {
        // Radius filter
        if (selectedRadiusKm !== 0 && req.distanceKm > selectedRadiusKm) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && req.category !== selectedCategory) {
          return false;
        }

        // Skills match filter
        if (skillsOnlyMatch) {
          const hasMatchingSkill = req.requiredSkills.some((s) =>
            volunteerProfile.skills.includes(s)
          );
          if (!hasMatchingSkill) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            req.title.toLowerCase().includes(q) ||
            req.description.toLowerCase().includes(q) ||
            req.approxLocation.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [requests, location, selectedRadiusKm, selectedCategory, skillsOnlyMatch, searchQuery, volunteerProfile.skills]);

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  return (
    <div className="py-6 bg-slate-50 min-h-[calc(100vh-80px)] flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        
        {/* Top Header & Location Selector Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm mb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-md">
                  Hyperlocal Matching Map
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  OpenStreetMap + Leaflet
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  🔒 Fuzzed ~400m Zones
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                Explore Active Neighborhood Needs
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                View real-time assistance alerts within your configured distance radius.
              </p>
            </div>

            {/* Location selector / GPS button */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={requestBrowserLocation}
                disabled={location.isRequesting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
                title="Use current GPS location"
              >
                <Crosshair className={`w-3.5 h-3.5 text-teal-600 ${location.isRequesting ? 'animate-spin' : ''}`} />
                <span>{location.isRequesting ? 'Locating...' : 'Use My GPS'}</span>
              </button>

              <select
                value={`${location.lat},${location.lng}`}
                onChange={(e) => {
                  const [latStr, lngStr] = e.target.value.split(',');
                  const match = POPULAR_NEIGHBORHOOD_AREAS.find(
                    (p) => p.lat === parseFloat(latStr) && p.lng === parseFloat(lngStr)
                  );
                  if (match) {
                    setManualLocation(match.lat, match.lng, match.label);
                  }
                }}
                className="text-xs p-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700 max-w-[220px] truncate"
              >
                {POPULAR_NEIGHBORHOOD_AREAS.map((area, idx) => (
                  <option key={idx} value={`${area.lat},${area.lng}`}>
                    📍 {area.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Location permission explanation / fallback message */}
          {location.error && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{location.error}</span>
              </span>
            </div>
          )}

          {/* Filter Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Radius Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="font-bold text-slate-500 uppercase text-[10px] mr-1">Radius:</span>
              {[1, 3, 5, 10, 0].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRadiusKm(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition text-xs ${
                    selectedRadiusKm === r
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r === 0 ? 'All' : `${r} km`}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="pharmacy_runs">💊 Pharmacy & Medicine</option>
                <option value="elderly_care">👵 Elderly Care</option>
                <option value="groceries_errands">🛒 Groceries & Errands</option>
                <option value="tech_support">💻 Tech Assistance</option>
                <option value="emergency_respite">⚡ Emergency Respite</option>
                <option value="pet_care">🐕 Pet Care</option>
              </select>

              {/* Skills match toggle */}
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={skillsOnlyMatch}
                  onChange={(e) => setSkillsOnlyMatch(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                />
                <span className="text-slate-700 font-semibold text-xs">
                  My Skills Only
                </span>
              </label>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search radius..."
                className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>

          </div>
        </div>

        {/* Mobile View Toggle Switch (Map vs List) */}
        <div className="flex sm:hidden mb-4 p-1 rounded-xl bg-slate-200 border border-slate-300">
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>
          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" />
            <span>Requests List ({filteredRequests.length})</span>
          </button>
        </div>

        {/* Responsive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[560px]">
          
          {/* Left Column (Desktop) / Mobile Tab: Leaflet Map Container */}
          <div className={`lg:col-span-7 h-[500px] lg:h-auto min-h-[460px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative ${
            mobileTab === 'list' ? 'hidden sm:block' : 'block'
          }`}>
            <LeafletMap
              userLocation={{
                lat: location.lat,
                lng: location.lng,
                label: location.label,
              }}
              radiusKm={selectedRadiusKm || 10}
              requests={filteredRequests}
              selectedRequestId={selectedRequestId}
              onSelectRequest={onSelectRequest}
              className="h-full w-full"
            />
          </div>

          {/* Right Column (Desktop) / Mobile Tab: Requests List Feed */}
          <div className={`lg:col-span-5 flex flex-col space-y-3 overflow-y-auto max-h-[640px] pr-1 ${
            mobileTab === 'map' ? 'hidden sm:flex' : 'flex'
          }`}>
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Matching Open Requests ({filteredRequests.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Sorted by proximity
              </span>
            </div>

            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => {
                const isSelected = req.id === selectedRequestId;
                const skillMatches = req.requiredSkills.filter((s) =>
                  volunteerProfile.skills.includes(s)
                );

                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedRequestId(req.id);
                      if (mobileTab === 'list') {
                        // Switch to map or view
                      }
                    }}
                    className={`p-4 rounded-xl border transition cursor-pointer bg-white ${
                      isSelected
                        ? 'border-teal-500 ring-2 ring-teal-100 shadow-md'
                        : 'border-slate-200 hover:border-teal-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        <MapPin className="w-3 h-3 text-teal-600" />
                        {formatDistance(req.distanceKm)}
                      </span>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        req.urgency === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : req.urgency === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {req.urgency}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {req.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {req.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {req.requiredSkills.map((skill, i) => {
                        const matches = volunteerProfile.skills.includes(skill);
                        return (
                          <span
                            key={i}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                              matches
                                ? 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {matches ? '✓ ' : '• '} {skill}
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[170px] text-slate-500">
                        Area: {req.approxLocation}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRequest(req);
                        }}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                      >
                        <span>View / Accept</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No requests in this radius</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try expanding the assistance radius or clearing active category filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedRadiusKm(10);
                    setSelectedCategory('all');
                    setSkillsOnlyMatch(false);
                    setSearchQuery('');
                  }}
                  className="mt-3 text-xs font-semibold text-teal-700 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
