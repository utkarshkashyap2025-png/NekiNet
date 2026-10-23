import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  UserCheck, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Star,
  Heart
} from 'lucide-react';
import type { HelpRequest, RequestStatus } from '../../types';

interface RequestDetailsModalProps {
  request: HelpRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelRequest: (requestId: string) => void;
  onOpenFeedback: (request: HelpRequest) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onCancelRequest,
  onOpenFeedback,
}) => {
  if (!isOpen || !request) return null;

  const steps: { key: RequestStatus; label: string; desc: string }[] = [
    { key: 'open', label: 'Broadcasted', desc: 'Waiting for nearby volunteers' },
    { key: 'matched', label: 'Matched', desc: 'Volunteer assigned & notified' },
    { key: 'in_progress', label: 'In Progress', desc: 'Volunteer carrying out task' },
    { key: 'completed', label: 'Completed', desc: 'Assistance verified & fulfilled' },
  ];

  const getStepIndex = (status: RequestStatus) => {
    switch (status) {
      case 'open': return 0;
      case 'matched': return 1;
      case 'in_progress': return 2;
      case 'completed': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(request.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                request.urgency === 'critical'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : request.urgency === 'high'
                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                Urgency: {request.urgency}
              </span>
              <span className="text-xs text-slate-400">ID: {request.id}</span>
              {request.aiSuggested && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI Structured
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {request.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Tracker Stepper */}
        {request.status !== 'cancelled' ? (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
              Live Fulfillment Status
            </h3>
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span className={`text-xs font-bold mt-2 ${isCurrent ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5 leading-tight">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>This request was cancelled by the requester.</span>
          </div>
        )}

        {/* Request Details */}
        <div className="mt-5 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Task Description
            </h4>
            <p className="mt-1 text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
              {request.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold">Location Area:</span>
              <span className="text-slate-800 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {request.approxLocation}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold">Posted:</span>
              <span className="text-slate-800 font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {request.createdAt}
              </span>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Required Volunteer Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {request.requiredSkills.map((skill, i) => (
                <span key={i} className="text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Matched Volunteer Card (if assigned) */}
          {request.volunteerName && (
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                    {request.volunteerName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                      Assigned Volunteer
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {request.volunteerName}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-teal-600" />
                      {request.volunteerPhone || '+91 98765 43210'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-teal-800 border border-teal-200 shadow-2xs">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    Verified Neighbor
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Card (if already completed & feedback left) */}
          {request.feedback && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  Your Feedback & Rating
                </span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(request.feedback.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700 italic">
                "{request.feedback.comment}"
              </p>
              {request.feedback.volunteerGratitude && (
                <div className="mt-2 pt-2 border-t border-amber-200/60 text-[11px] text-teal-800">
                  <strong>Volunteer Note:</strong> {request.feedback.volunteerGratitude}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            {request.status !== 'completed' && request.status !== 'cancelled' && (
              <button
                onClick={() => onCancelRequest(request.id)}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold transition"
              >
                Cancel This Request
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Close
            </button>

            {request.status !== 'completed' && request.status !== 'cancelled' && (
              <button
                onClick={() => onOpenFeedback(request)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed & Review</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
