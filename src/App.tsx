import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ImpactStats } from './components/landing/ImpactStats';
import { HowItWorks } from './components/landing/HowItWorks';
import { CategoriesSection } from './components/landing/CategoriesSection';
import { PrivacyBanner } from './components/landing/PrivacyBanner';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { Footer } from './components/layout/Footer';
import { X, Sparkles, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export function App() {
  const [activeModal, setActiveModal] = useState<'request' | 'volunteer' | null>(null);

  const handleRequestClick = () => {
    setActiveModal('request');
  };

  const handleVolunteerClick = () => {
    setActiveModal('volunteer');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-emerald-100 px-4 py-2 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>NekiNet Phase 1 Active: Foundation, Tailwind & Design System initialized.</span>
      </div>

      {/* Navigation */}
      <Navbar
        onRequestClick={handleRequestClick}
        onVolunteerClick={handleVolunteerClick}
        onExploreMapClick={() => {
          document.getElementById('safety')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection
          onRequestClick={handleRequestClick}
          onVolunteerClick={handleVolunteerClick}
        />

        <ImpactStats />

        <HowItWorks
          onRequestClick={handleRequestClick}
          onVolunteerClick={handleVolunteerClick}
        />

        <CategoriesSection
          onCategorySelect={(cat) => {
            handleRequestClick();
          }}
        />

        <PrivacyBanner />

        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Phase 2 Teaser Modal: Request Assistance Flow */}
      {activeModal === 'request' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Request Assistance</h3>
                <p className="text-xs text-slate-500">AI-Assisted Request Creation (Phase 2 Preview)</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200/80">
                <p className="text-xs font-semibold text-emerald-900 mb-1">
                  Ready for Phase 2 Implementation:
                </p>
                <ul className="text-xs text-emerald-800 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Interactive Natural Language input box with Gemini AI parsing.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Review & Edit category, urgency level, and required volunteer skills.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Approximate geocoded location picker without revealing exact door address.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Live request status tracking dashboard.
                  </li>
                </ul>
              </div>

              <p className="text-xs text-slate-500">
                Phase 1 has established the responsive foundation. Confirm to proceed to Phase 2 to build the complete interactive Requester & Volunteer Dashboards!
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2 Teaser Modal: Volunteer Portal Flow */}
      {activeModal === 'volunteer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Volunteer Portal</h3>
                <p className="text-xs text-slate-500">Local Opportunities & Skills (Phase 2 Preview)</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200/80">
                <p className="text-xs font-semibold text-teal-900 mb-1">
                  Ready for Phase 2 Implementation:
                </p>
                <ul className="text-xs text-teal-800 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    Configure assistance radius (1km, 3km, 5km) and active days/hours.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    Select verified skills (Elder Companionship, Errands, Driving, Tech).
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    Live open requests feed with urgency badges and distance indicators.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    One-click task claim and secure coordinator chat drawer.
                  </li>
                </ul>
              </div>

              <p className="text-xs text-slate-500">
                Phase 1 is now ready for your review and confirmation!
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
