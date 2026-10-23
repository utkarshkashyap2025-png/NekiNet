import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  HeartHandshake, 
  Send, 
  Info,
  Wand2,
  Loader2,
  CheckCircle2,
  Bot
} from 'lucide-react';
import type { HelpRequest, RequestCategory, UrgencyLevel } from '../../types';
import { geminiService, type GeminiParseResult } from '../../services/geminiService';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: Omit<HelpRequest, 'id' | 'createdAt' | 'distanceKm'>) => void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [useAiAssist, setUseAiAssist] = useState(true);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<GeminiParseResult | null>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RequestCategory>('elderly_care');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [approxLocation, setApproxLocation] = useState('Greenwood Sector 14 (~400m fuzzed zone)');
  const [requesterName, setRequesterName] = useState('Meera Deshmukh');
  const [requesterPhone, setRequesterPhone] = useState('+91 98111 22334');
  const [skillsString, setSkillsString] = useState('Elderly Companionship, Patience');
  const [safetyNotes, setSafetyNotes] = useState('');
  const [aiNoticeDismissed, setAiNoticeDismissed] = useState(false);

  if (!isOpen) return null;

  // Invokes Google Gemini via Supabase Edge Function (or safe heuristic fallback)
  const handleAnalyzeWithGemini = async () => {
    if (!description.trim()) {
      setAiError('Please enter a short description of what you need help with first.');
      return;
    }

    setAiError(null);
    setIsAiProcessing(true);

    try {
      const result = await geminiService.parseHelpRequest(description.trim());
      setAiSuggestion(result);
    } catch (err: any) {
      setAiError(err.message || 'Failed to analyze request with Gemini. You can fill fields manually.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // User confirms and applies AI suggestions to the form
  const handleApplyAiSuggestions = () => {
    if (!aiSuggestion) return;
    setTitle(aiSuggestion.title);
    setCategory(aiSuggestion.category);
    setUrgency(aiSuggestion.urgency);
    setSkillsString(aiSuggestion.requiredSkills.join(', '));
    if (aiSuggestion.safetyNotes) setSafetyNotes(aiSuggestion.safetyNotes);
    setAiSuggestion(null); // Close review card
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out the title and description.');
      return;
    }

    const skills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      urgency,
      approxLocation,
      lat: 28.4615,
      lng: 77.0275,
      requesterId: 'user-req-curr',
      requesterName: requesterName.trim() || 'Community Member',
      requesterPhone: requesterPhone.trim() || '+91 99999 00000',
      status: 'open',
      requiredSkills: skills.length ? skills : ['General Kindness'],
      aiSuggested: useAiAssist,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Post a Help Request</h2>
              <p className="text-xs text-slate-500">
                Connect with verified neighborhood volunteers nearby
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Assistance Toggle Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-950">AI Smart Assist</span>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-emerald-200/70 text-emerald-900">
                  Google Gemini Engine
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/80">
                Analyzes plain natural language to suggest category, urgency, and volunteer skills.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={useAiAssist}
              onChange={(e) => setUseAiAssist(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>

        {/* Privacy reminder */}
        {!aiNoticeDismissed && (
          <div className="mt-3 p-2.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                <strong>Privacy Guaranteed:</strong> AI never receives or makes decisions on residential door numbers. Locations remain fuzzed (~400m radius).
              </span>
            </span>
            <button
              onClick={() => setAiNoticeDismissed(true)}
              className="text-slate-400 hover:text-slate-600 ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* AI Error Banner */}
        {aiError && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{aiError}</span>
            </div>
            <button
              onClick={() => setAiError(null)}
              className="text-amber-700 hover:text-amber-900 font-bold ml-2 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Description input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Describe the situation or what is needed *
              </label>
              {useAiAssist && (
                <button
                  type="button"
                  onClick={handleAnalyzeWithGemini}
                  disabled={isAiProcessing || !description.trim()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 disabled:opacity-40 transition"
                >
                  {isAiProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Gemini Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Analyze with Gemini</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. My 82-year-old grandfather in Greenwood block B needs his blood pressure medicine picked up from Apollo Pharmacy by 4 PM today."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            {useAiAssist && (
              <p className="text-[10px] text-slate-400 mt-0.5">
                💡 Type natural sentences. Gemini will suggest category, urgency, title, and required skills for your review.
              </p>
            )}
          </div>

          {/* AI Suggestions Review & Confirmation Box */}
          {aiSuggestion && (
            <div className="p-4 rounded-xl bg-gradient-to-tr from-emerald-50/90 via-teal-50/80 to-sky-50/70 border-2 border-emerald-300 shadow-sm space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200/70">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Gemini AI Suggestions Review
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  aiSuggestion.source === 'live_gemini_edge'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {aiSuggestion.source === 'live_gemini_edge' ? '🟢 Live Gemini 2.5 Flash' : '🟡 Heuristic Fallback (Demo)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Suggested Title:</span>
                  <span className="font-bold text-slate-900">{aiSuggestion.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Category:</span>
                    <span className="font-semibold text-slate-800 capitalize">{aiSuggestion.category.replace('_', ' ')}</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Urgency:</span>
                    <span className="font-semibold text-rose-700 uppercase">{aiSuggestion.urgency}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Inferred Volunteer Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {aiSuggestion.requiredSkills.map((s, i) => (
                    <span key={i} className="text-[11px] font-medium bg-white text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {aiSuggestion.safetyNotes && (
                <div className="text-[11px] text-emerald-900/90 bg-emerald-100/50 p-2 rounded-lg border border-emerald-200/60">
                  <strong>Safety Note:</strong> {aiSuggestion.safetyNotes}
                </div>
              )}

              {/* Review Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white/80 transition"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleApplyAiSuggestions}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Apply to Form</span>
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Task Title / Summary *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Urgent Asthma Inhaler Pickup from Apollo Pharmacy"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Category & Urgency Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RequestCategory)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="elderly_care">Elderly Care & Check-ins</option>
                <option value="pharmacy_runs">Urgent Pharmacy & Medicine</option>
                <option value="groceries_errands">Heavy Groceries & Errands</option>
                <option value="tech_support">Tech & Digital Literacy Aid</option>
                <option value="emergency_respite">Emergency Weather & Respite</option>
                <option value="pet_care">Pet Care & Animal Welfare</option>
                <option value="other">Other Community Need</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="low">Low (Within 24-48 hours)</option>
                <option value="medium">Medium (Within today / 6 hours)</option>
                <option value="high">High (Within 1-2 hours)</option>
                <option value="critical">Critical (Immediate neighborhood response)</option>
              </select>
            </div>
          </div>

          {/* Approximate Neighborhood Location */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Approximate Neighborhood / Area (Fuzzed for Privacy)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={approxLocation}
                onChange={(e) => setApproxLocation(e.target.value)}
                placeholder="e.g. Greenwood Sector 14 (~400m fuzzed zone)"
                className="w-full text-xs sm:text-sm p-2.5 pl-8 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Required Skills Chips */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Required Volunteer Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              placeholder="e.g. Prescription Pickup, Punctuality, Elderly Care"
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {safetyNotes && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <strong>Safety Guidance:</strong> {safetyNotes}
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Your Contact Name
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phone Number (Private until matched)
              </label>
              <input
                type="text"
                required
                value={requesterPhone}
                onChange={(e) => setRequesterPhone(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Request to Neighbors</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
