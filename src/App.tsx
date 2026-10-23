import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { ImpactStats } from './components/landing/ImpactStats';
import { HowItWorks } from './components/landing/HowItWorks';
import { CategoriesSection } from './components/landing/CategoriesSection';
import { PrivacyBanner } from './components/landing/PrivacyBanner';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { Footer } from './components/layout/Footer';
import { RequesterDashboard } from './components/requester/RequesterDashboard';
import { VolunteerDashboard } from './components/volunteer/VolunteerDashboard';
import { INITIAL_MOCK_REQUESTS, INITIAL_MOCK_VOLUNTEER } from './data/mockData';
import type { HelpRequest, VolunteerProfile } from './types';
import { Info, Sparkles, CheckCircle2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'requester' | 'volunteer'>('landing');
  const [requests, setRequests] = useState<HelpRequest[]>(INITIAL_MOCK_REQUESTS);
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile>(INITIAL_MOCK_VOLUNTEER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Requester Actions
  const handleCreateRequest = (newReqData: Omit<HelpRequest, 'id' | 'createdAt' | 'distanceKm'>) => {
    const newRequest: HelpRequest = {
      ...newReqData,
      id: `req-${Date.now().toString().slice(-4)}`,
      createdAt: 'Just now',
      distanceKm: 0.5, // Relative mock distance for demonstration
    };

    setRequests([newRequest, ...requests]);
    showToast('✨ Your help request has been broadcasted to nearby neighbors!');
  };

  const handleCancelRequest = (requestId: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId ? { ...r, status: 'cancelled' } : r
      )
    );
    showToast('Your request has been cancelled.');
  };

  const handleSubmitFeedback = (requestId: string, rating: number, comment: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'completed',
              feedback: {
                id: `fb-${Date.now()}`,
                rating,
                comment,
                createdAt: 'Just now',
                volunteerGratitude: 'Thank you for your warm words! Glad to assist.',
              },
            }
          : r
      )
    );

    // Update volunteer stats
    setVolunteerProfile((prev) => ({
      ...prev,
      completedTasksCount: prev.completedTasksCount + 1,
      rating: Number(((prev.rating * prev.completedTasksCount + rating) / (prev.completedTasksCount + 1)).toFixed(1)),
    }));

    showToast('⭐ Thank you for rating and reviewing your volunteer!');
  };

  // Volunteer Actions
  const handleAcceptTask = (requestId: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'matched',
              volunteerId: volunteerProfile.id,
              volunteerName: volunteerProfile.name,
              volunteerPhone: volunteerProfile.phone,
            }
          : r
      )
    );
    showToast(`🤝 You accepted task #${requestId}. Contact details now unlocked.`);
  };

  const handleStartTask = (requestId: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId ? { ...r, status: 'in_progress' } : r
      )
    );
    showToast(`Task #${requestId} is now marked In Progress.`);
  };

  const handleCompleteTask = (requestId: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId ? { ...r, status: 'completed' } : r
      )
    );
    setVolunteerProfile((prev) => ({
      ...prev,
      completedTasksCount: prev.completedTasksCount + 1,
    }));
    showToast(`🎉 Excellent work! Task #${requestId} marked as Completed.`);
  };

  const handleUpdateVolunteerProfile = (updated: VolunteerProfile) => {
    setVolunteerProfile(updated);
    showToast('Volunteer profile settings updated successfully.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          <strong>NekiNet Phase 2 Active:</strong> Requester & Volunteer Dashboards with simulated AI parsing placeholder & local workflow state.
        </span>
      </div>

      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onRequestClick={() => setCurrentView('requester')}
        onVolunteerClick={() => setCurrentView('volunteer')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <>
            <HeroSection
              onRequestClick={() => setCurrentView('requester')}
              onVolunteerClick={() => setCurrentView('volunteer')}
            />

            <ImpactStats />

            <HowItWorks
              onRequestClick={() => setCurrentView('requester')}
              onVolunteerClick={() => setCurrentView('volunteer')}
            />

            <CategoriesSection
              onCategorySelect={() => {
                setCurrentView('requester');
              }}
            />

            <PrivacyBanner />

            <TestimonialsSection />
          </>
        )}

        {currentView === 'requester' && (
          <RequesterDashboard
            requests={requests}
            onCreateRequest={handleCreateRequest}
            onCancelRequest={handleCancelRequest}
            onSubmitFeedback={handleSubmitFeedback}
            onSwitchToVolunteer={() => setCurrentView('volunteer')}
          />
        )}

        {currentView === 'volunteer' && (
          <VolunteerDashboard
            profile={volunteerProfile}
            requests={requests}
            onUpdateProfile={handleUpdateVolunteerProfile}
            onAcceptTask={handleAcceptTask}
            onStartTask={handleStartTask}
            onCompleteTask={handleCompleteTask}
            onSwitchToRequester={() => setCurrentView('requester')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
