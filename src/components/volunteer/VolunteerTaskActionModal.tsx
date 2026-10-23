import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Sparkles, 
  ArrowRight,
  AlertTriangle,
  Play,
  Heart
} from 'lucide-react';
import type { HelpRequest, VolunteerProfile } from '../../types';

interface VolunteerTaskActionModalProps {
  request: HelpRequest | null;
  volunteer: VolunteerProfile;
  isOpen: boolean;
  onClose: () => void;
  onAcceptTask: (requestId: string) => void;
  onStartTask: (requestId: string) => void;
  onCompleteTask: (requestId: string) => void;
}

export const VolunteerTaskActionModal: React.FC<VolunteerTaskActionModalProps> = ({
  request,
  volunteer,
  isOpen,
  onClose,
  onAcceptTask,
  onStartTask,
  onCompleteTask,
}) => {
  if (!isOpen || !request) return null;

  const isAssignedToMe = request.volunteerId === volunteer.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                request.urgency === 'critical'
                  ? 'bg-rose-100 text-rose-800'
                  : request.urgency === 'high'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                Urgency: {request.urgency}
              </span>

              {request.distanceKm !== undefined && (
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  ~{request.distanceKm} km away
                </span>
              )}

              <span className="text-xs text-slate-400">ID: {request.id}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {request.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Details */}
        <div className="mt-5 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Request Details & Situation
            </h4>
            <p className="mt-1 text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
              {request.description}
            </p>
          </div>

          {/* Location & Time info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-semibold">Fuzzed Neighborhood Area:</span>
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

          {/* Skills Match Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Skills Needed vs. Your Profile
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {request.requiredSkills.map((skill, i) => {
                const matches = volunteer.skills.includes(skill);
                return (
                  <span
                    key={i}
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                      matches
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {matches ? '✓ Matches: ' : '• '} {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Requester Contact Info: Revealed if accepted/matched */}
          {isAssignedToMe ? (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block">
                    Requester Direct Contact (Private & Verified)
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{request.requesterName}</h4>
                </div>
                <a
                  href={`tel:${request.requesterPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {request.requesterPhone}</span>
                </a>
              </div>
              <p className="text-[11px] text-teal-800">
                🔒 You have been matched with this requester. Coordinate timing respectfully and confirm arrival details.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Privacy Protocol:</strong> Exact door number and phone contact are revealed immediately once you accept this task.
              </span>
            </div>
          )}

          {/* Safety Guidelines Checklist */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
              NekiNet Neighborhood Volunteer Safety Reminders:
            </span>
            <ul className="text-slate-600 space-y-1 text-[11px]">
              <li>• Always greet neighbors with courtesy and present your NekiNet badge.</li>
              <li>• Never accept financial passwords, OTPs, or confidential banking credentials.</li>
              <li>• If the task involves medical or pharmacy items, confirm the prescription label.</li>
            </ul>
          </div>

        </div>

        {/* Workflow Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Close
          </button>

          {/* If open -> Accept task */}
          {request.status === 'open' && (
            <button
              onClick={() => {
                onAcceptTask(request.id);
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accept Task & Coordinate</span>
            </button>
          )}

          {/* If matched -> Start In Progress */}
          {isAssignedToMe && request.status === 'matched' && (
            <button
              onClick={() => {
                onStartTask(request.id);
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Mark as In Progress</span>
            </button>
          )}

          {/* If in progress -> Complete task */}
          {isAssignedToMe && request.status === 'in_progress' && (
            <button
              onClick={() => {
                onCompleteTask(request.id);
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete Task</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
