import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  CheckCircle, 
  ShieldCheck, 
  UserCheck, 
  Send, 
  Heart, 
  Bell,
  ArrowRight
} from 'lucide-react';

interface HowItWorksProps {
  onRequestClick: () => void;
  onVolunteerClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onRequestClick,
  onVolunteerClick,
}) => {
  const [activeTab, setActiveTab] = useState<'requester' | 'volunteer'>('requester');

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Simple & Transparent
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How NekiNet Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Intelligent assistance designed with simplicity for seniors, families, and everyday neighbors.
          </p>

          {/* Persona Tab Switcher */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300/60">
            <button
              onClick={() => setActiveTab('requester')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'requester'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Requesters (Need Help)
            </button>
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'volunteer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Volunteers (Offer Help)
            </button>
          </div>
        </div>

        {/* Content for Requesters */}
        {activeTab === 'requester' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-6">
                1
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Explain in Plain Words</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Type or speak your request naturally. Google Gemini AI instantly categorizes urgency, required skills, and generates a structured request for you to review and approve.
              </p>
              <div className="bg-emerald-50/60 rounded-lg p-3 text-xs text-emerald-800 border border-emerald-100 font-mono">
                "Grandma needs prescription eye drops picked up before 5 PM"
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-6">
                2
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">Hyperlocal Alert</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Your request is broadcasted to verified volunteers within a 1 to 5 km radius. Your exact address is never exposed—only an approximate neighborhood circle is shown on the map.
              </p>
              <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-700 border border-slate-200">
                🔒 Privacy First: Exact flat/door number unlocked only after mutual confirmation.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg mb-6">
                3
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-sky-600" />
                <h3 className="text-lg font-bold text-slate-900">Assistance & Feedback</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                A nearby volunteer accepts, coordinates arrival, and fulfills your request. Once completed, share feedback to celebrate their neighborhood kindness.
              </p>
              <div className="bg-sky-50 rounded-lg p-3 text-xs text-sky-800 border border-sky-100">
                ⭐ Leave ratings & heartfelt gratitude to build a trusted community record.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 Volunteer */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-6">
                1
              </div>
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">Create Volunteer Profile</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Select your skills (elder care, errands, tech troubleshooting, driving) and set your preferred assistance radius (e.g. within 2 km of your home).
              </p>
              <div className="bg-teal-50 rounded-lg p-3 text-xs text-teal-800 border border-teal-100">
                🎯 Match only with requests aligned with your availability and skills.
              </div>
            </div>

            {/* Step 2 Volunteer */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-6">
                2
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Review Open Nearby Needs</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Explore an interactive Leaflet neighborhood map showing active requests with urgency levels, required skills, and approximate distances.
              </p>
              <div className="bg-emerald-50 rounded-lg p-3 text-xs text-emerald-800 border border-emerald-100">
                🗺️ Accept requests with a single click whenever you have 30 minutes free.
              </div>
            </div>

            {/* Step 3 Volunteer */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-6">
                3
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Deliver Kindness & Impact</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Help a neighbor in need, complete the task, and build your verified community volunteer portfolio and reputation score.
              </p>
              <div className="bg-purple-50 rounded-lg p-3 text-xs text-purple-800 border border-purple-100">
                🏆 Verified volunteer badges, community impact hours, and neighbor gratitude.
              </div>
            </div>
          </div>
        )}

        {/* Section bottom CTA */}
        <div className="mt-12 text-center">
          {activeTab === 'requester' ? (
            <button
              onClick={onRequestClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm transition"
            >
              <span>Get Started & Post a Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onVolunteerClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 shadow-sm transition"
            >
              <span>Register as a Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
