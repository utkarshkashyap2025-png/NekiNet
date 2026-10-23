import React, { useState } from 'react';
import { 
  UserCheck, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  HeartHandshake, 
  AlertCircle,
  Phone,
  HelpCircle,
  Pill,
  Heart,
  ShoppingBag,
  Laptop,
  CloudLightning,
  Dog,
  Eye,
  Check
} from 'lucide-react';
import type { HelpRequest, VolunteerProfile, RequestCategory } from '../../types';
import { VolunteerProfileModal } from './VolunteerProfileModal';
import { VolunteerTaskActionModal } from './VolunteerTaskActionModal';

interface VolunteerDashboardProps {
  profile: VolunteerProfile;
  requests: HelpRequest[];
  onUpdateProfile: (updated: VolunteerProfile) => void;
  onAcceptTask: (requestId: string) => void;
  onStartTask: (requestId: string) => void;
  onCompleteTask: (requestId: string) => void;
  onSwitchToRequester: () => void;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({
  profile,
  requests,
  onUpdateProfile,
  onAcceptTask,
  onStartTask,
  onCompleteTask,
  onSwitchToRequester,
}) => {
  const [activeTab, setActiveTab] = useState<'nearby' | 'my_tasks'>('nearby');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<HelpRequest | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Nearby open requests (filtered by radius and search)
  const nearbyOpenRequests = requests.filter((req) => {
    if (req.status !== 'open') return false;
    
    // Distance filter against volunteer radius
    if (req.distanceKm !== undefined && req.distanceKm > profile.radiusKm) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && req.category !== categoryFilter) {
      return false;
    }

    // Search query
    const query = searchQuery.toLowerCase();
    return (
      req.title.toLowerCase().includes(query) ||
      req.description.toLowerCase().includes(query) ||
      req.approxLocation.toLowerCase().includes(query)
    );
  });

  // My Tasks (assigned to this volunteer)
  const myTasks = requests.filter((req) => req.volunteerId === profile.id);

  const getCategoryIcon = (category: RequestCategory) => {
    switch (category) {
      case 'elderly_care': return Heart;
      case 'pharmacy_runs': return Pill;
      case 'groceries_errands': return ShoppingBag;
      case 'tech_support': return Laptop;
      case 'emergency_respite': return CloudLightning;
      case 'pet_care': return Dog;
      default: return HelpCircle;
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Volunteer Profile Summary Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Avatar & Bio */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-teal-500/20 shrink-0">
                {profile.name.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
                    <UserCheck className="w-3.5 h-3.5" />
                    Verified Volunteer
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    [Mock / Local State - Phase 2]
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                  {profile.bio}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {profile.approxLocation} (Radius: {profile.radiusKm} km)
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {profile.rating} / 5.0 Rating
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {profile.completedTasksCount} Tasks Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Availability Toggle & Edit Profile */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">
                  Status: {profile.isAvailable ? '🟢 Available for Requests' : '⚪ Away'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.isAvailable}
                    onChange={(e) => onUpdateProfile({ ...profile, isAvailable: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Skills & Radius</span>
                </button>
                <button
                  onClick={onSwitchToRequester}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                >
                  <span>Need Help Instead?</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Volunteer Skills Tags */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Your Active Skills ({profile.skills.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1"
                >
                  <Check className="w-3 h-3 text-teal-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1 rounded-xl bg-slate-200 border border-slate-300/80">
            <button
              onClick={() => setActiveTab('nearby')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'nearby'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nearby Open Requests ({nearbyOpenRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('my_tasks')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'my_tasks'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Accepted Tasks ({myTasks.length})
            </button>
          </div>

          {/* Search bar for open requests */}
          {activeTab === 'nearby' && (
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nearby requests..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
          )}
        </div>

        {/* TAB 1: Nearby Open Requests Feed */}
        {activeTab === 'nearby' && (
          <div>
            {!profile.isAvailable && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>
                  <strong>Note:</strong> You are currently marked as "Away". Toggle your status to "Available" above to accept new neighborhood requests.
                </span>
                <button
                  onClick={() => onUpdateProfile({ ...profile, isAvailable: true })}
                  className="font-bold underline text-amber-950 ml-2"
                >
                  Mark Available
                </button>
              </div>
            )}

            {nearbyOpenRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyOpenRequests.map((request) => {
                  const CategoryIcon = getCategoryIcon(request.category);
                  const skillMatches = request.requiredSkills.filter(s => profile.skills.includes(s));
                  return (
                    <div
                      key={request.id}
                      onClick={() => setSelectedTask(request)}
                      className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Distance & Urgency */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-teal-600" />
                            ~{request.distanceKm} km away
                          </span>

                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            request.urgency === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : request.urgency === 'high'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {request.urgency}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-700 transition">
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                            {request.title}
                          </h3>
                        </div>

                        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {request.description}
                        </p>

                        {/* Skills Matching feedback */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Skills Match: {skillMatches.length} of {request.requiredSkills.length}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {request.requiredSkills.map((skill, i) => {
                              const matches = profile.skills.includes(skill);
                              return (
                                <span
                                  key={i}
                                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                                    matches
                                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {matches ? '✓ ' : '• '} {skill}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium truncate max-w-[170px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{request.createdAt}</span>
                        </span>

                        <span className="flex items-center gap-1 text-teal-700 font-bold group-hover:underline">
                          <span>Review & Accept</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No open requests within your radius</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try expanding your assistance radius from {profile.radiusKm} km to 10 km in your profile settings.
                </p>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Adjust Radius</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: My Accepted Tasks */}
        {activeTab === 'my_tasks' && (
          <div>
            {myTasks.length > 0 ? (
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          task.status === 'matched'
                            ? 'bg-amber-100 text-amber-800'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Status: {task.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">ID: {task.id}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-1">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                          Requester: {task.requesterName} ({task.requesterPhone})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {task.approxLocation}
                        </span>
                      </div>

                      {/* Display feedback if received */}
                      {task.feedback && (
                        <div className="mt-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-slate-700">
                          <div className="flex items-center gap-1 text-amber-500 font-bold mb-0.5">
                            {[...Array(task.feedback.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                            <span className="text-amber-800 ml-1">Neighbor Rating</span>
                          </div>
                          <p className="italic">"{task.feedback.comment}"</p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                      >
                        View Details
                      </button>

                      {task.status === 'matched' && (
                        <button
                          onClick={() => onStartTask(task.id)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
                        >
                          Start Task
                        </button>
                      )}

                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => onCompleteTask(task.id)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition"
                        >
                          Mark Completed
                        </button>
                      )}

                      {task.status === 'completed' && (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Completed ✓
                        </span>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No active tasks accepted yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse the "Nearby Open Requests" tab to find neighbors in your area needing a helping hand!
                </p>
                <button
                  onClick={() => setActiveTab('nearby')}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700"
                >
                  <span>Browse Nearby Needs</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Volunteer Profile Setup Modal */}
      <VolunteerProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={onUpdateProfile}
      />

      {/* Volunteer Task Review & Workflow Modal */}
      <VolunteerTaskActionModal
        request={selectedTask}
        volunteer={profile}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onAcceptTask={(id) => {
          onAcceptTask(id);
          setSelectedTask(null);
        }}
        onStartTask={(id) => {
          onStartTask(id);
          setSelectedTask(null);
        }}
        onCompleteTask={(id) => {
          onCompleteTask(id);
          setSelectedTask(null);
        }}
      />

    </div>
  );
};
