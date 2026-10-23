import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  AlertCircle, 
  ArrowRight,
  Heart,
  Pill,
  ShoppingBag,
  Laptop,
  CloudLightning,
  Dog,
  HelpCircle,
  Eye
} from 'lucide-react';
import type { HelpRequest, RequestCategory, RequestStatus } from '../../types';
import { CreateRequestModal } from './CreateRequestModal';
import { RequestDetailsModal } from './RequestDetailsModal';
import { FeedbackModal } from './FeedbackModal';

interface RequesterDashboardProps {
  requests: HelpRequest[];
  onCreateRequest: (newReq: Omit<HelpRequest, 'id' | 'createdAt' | 'distanceKm'>) => void;
  onCancelRequest: (requestId: string) => void;
  onSubmitFeedback: (requestId: string, rating: number, comment: string) => void;
  onSwitchToVolunteer: () => void;
}

export const RequesterDashboard: React.FC<RequesterDashboardProps> = ({
  requests,
  onCreateRequest,
  onCancelRequest,
  onSubmitFeedback,
  onSwitchToVolunteer,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [feedbackRequest, setFeedbackRequest] = useState<HelpRequest | null>(null);

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = 
      filterStatus === 'all' 
        ? true 
        : filterStatus === 'active'
        ? req.status === 'open' || req.status === 'matched' || req.status === 'in_progress'
        : req.status === filterStatus;
    
    const matchesSearch = 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

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

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Broadcasted (Open)</span>;
      case 'matched':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Volunteer Matched</span>;
      case 'in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">In Progress</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Completed ✓</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner with Role & Mock Info */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                Requester Dashboard
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                [Mock / Local State - Phase 2]
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Community Assistance Portal
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Broadcast tasks to nearby verified volunteers and track help in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition active:scale-[0.98] text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Request</span>
            </button>
            <button
              onClick={onSwitchToVolunteer}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition text-sm"
            >
              <span>Switch to Volunteer View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Requests</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{requests.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-blue-600 uppercase">Open & Broadcasted</span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">
              {requests.filter(r => r.status === 'open').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-amber-600 uppercase">In Progress / Matched</span>
            <div className="text-2xl font-extrabold text-amber-700 mt-1">
              {requests.filter(r => r.status === 'matched' || r.status === 'in_progress').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-emerald-600 uppercase">Completed</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {requests.filter(r => r.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'active', label: 'Active (Open / In Progress)' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                  filterStatus === tab.key
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your requests..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Request Cards Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => {
              const CategoryIcon = getCategoryIcon(request.category);
              return (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Urgency & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          request.urgency === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : request.urgency === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {request.urgency}
                        </span>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {request.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {request.description}
                    </p>

                    {/* Required Skills tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {request.requiredSkills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                      {request.requiredSkills.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{request.requiredSkills.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{request.approxLocation}</span>
                    </span>

                    <span className="flex items-center gap-1 text-emerald-700 font-semibold group-hover:underline">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No requests found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no assistance requests matching your current filter. Create a new request to get started!
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Request</span>
            </button>
          </div>
        )}

      </div>

      {/* Create Request Modal */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={onCreateRequest}
      />

      {/* Details & Status Tracker Modal */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onCancelRequest={(id) => {
          onCancelRequest(id);
          setSelectedRequest(null);
        }}
        onOpenFeedback={(req) => {
          setSelectedRequest(null);
          setFeedbackRequest(req);
        }}
      />

      {/* Feedback & Review Modal */}
      <FeedbackModal
        request={feedbackRequest}
        isOpen={!!feedbackRequest}
        onClose={() => setFeedbackRequest(null)}
        onSubmitFeedback={(id, rating, comment) => {
          onSubmitFeedback(id, rating, comment);
          setFeedbackRequest(null);
        }}
      />

    </div>
  );
};
