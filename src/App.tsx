import React, { useState, useEffect } from 'react';
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
import { HyperlocalExploreView } from './components/map/HyperlocalExploreView';
import { VolunteerTaskActionModal } from './components/volunteer/VolunteerTaskActionModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabaseService } from './services/supabaseService';
import type { HelpRequest, VolunteerProfile } from './types';
import { INITIAL_MOCK_REQUESTS, INITIAL_MOCK_VOLUNTEER } from './data/mockData';
import { CheckCircle2, Database, AlertCircle } from 'lucide-react';

function AppContent() {
  const { isConfigured, user } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'requester' | 'volunteer' | 'map'>('landing');
  const [requests, setRequests] = useState<HelpRequest[]>(INITIAL_MOCK_REQUESTS);
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile>(INITIAL_MOCK_VOLUNTEER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultRole, setAuthModalDefaultRole] = useState<'requester' | 'volunteer'>('requester');
  const [mapSelectedTask, setMapSelectedTask] = useState<HelpRequest | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load requests and profile on startup from Supabase (or fallback)
  useEffect(() => {
    async function loadData() {
      const loadedRequests = await supabaseService.getHelpRequests();
      setRequests(loadedRequests);

      const loadedProfile = await supabaseService.getVolunteerProfile(user?.id);
      setVolunteerProfile(loadedProfile);
    }
    loadData();
  }, [user]);

  // Requester Actions
  const handleCreateRequest = async (newReqData: Omit<HelpRequest, 'id' | 'createdAt' | 'distanceKm'>) => {
    const created = await supabaseService.createHelpRequest(newReqData);
    setRequests((prev) => [created, ...prev]);
    showToast(
      isConfigured
        ? '✨ Saved to Supabase PostgreSQL and broadcasted to local radius!'
        : '✨ Broadcasted to local radius (Demo Mode)'
    );
  };

  const handleCancelRequest = async (requestId: string) => {
    await supabaseService.updateRequestStatus(requestId, 'cancelled');
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'cancelled' } : r))
    );
    showToast('Your request has been cancelled.');
  };

  const handleSubmitFeedback = async (requestId: string, rating: number, comment: string) => {
    const target = requests.find((r) => r.id === requestId);
    if (target) {
      await supabaseService.submitFeedback(
        requestId,
        target.requesterId,
        target.volunteerId || volunteerProfile.id,
        rating,
        comment
      );
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'completed',
              feedback: {
                id: `fb-${Date.now()}`,
                rating,
                comment,
                createdAt: 'Just now',
                volunteerGratitude: 'Thank you for your heartfelt words! Glad to assist.',
              },
            }
          : r
      )
    );

    setVolunteerProfile((prev) => ({
      ...prev,
      completedTasksCount: prev.completedTasksCount + 1,
      rating: Number(((prev.rating * prev.completedTasksCount + rating) / (prev.completedTasksCount + 1)).toFixed(1)),
    }));

    showToast('⭐ Feedback saved! Community trust score updated.');
  };

  // Volunteer Actions
  const handleAcceptTask = async (requestId: string) => {
    await supabaseService.updateRequestStatus(requestId, 'matched', volunteerProfile.id);
    setRequests((prev) =>
      prev.map((r) =>
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
    showToast(`🤝 Task accepted! Requester contact details unlocked.`);
  };

  const handleStartTask = async (requestId: string) => {
    await supabaseService.updateRequestStatus(requestId, 'in_progress');
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'in_progress' } : r))
    );
    showToast(`Task #${requestId} is now marked In Progress.`);
  };

  const handleCompleteTask = async (requestId: string) => {
    await supabaseService.updateRequestStatus(requestId, 'completed');
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'completed' } : r))
    );
    setVolunteerProfile((prev) => ({
      ...prev,
      completedTasksCount: prev.completedTasksCount + 1,
    }));
    showToast(`🎉 Excellent work! Task #${requestId} marked as Completed.`);
  };

  const handleUpdateVolunteerProfile = async (updated: VolunteerProfile) => {
    await supabaseService.updateVolunteerProfile(updated);
    setVolunteerProfile(updated);
    showToast('Volunteer profile & skills synchronized.');
  };

  const openAuthWithRole = (role: 'requester' | 'volunteer') => {
    setAuthModalDefaultRole(role);
    setIsAuthModalOpen(true);
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

      {/* Top Banner Notice: Live vs Demo */}
      <div className={`px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 border-b ${
        isConfigured 
          ? 'bg-emerald-950 text-emerald-200 border-emerald-900' 
          : 'bg-slate-900 text-slate-300 border-slate-800'
      }`}>
        <Database className={`w-3.5 h-3.5 ${isConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
        {isConfigured ? (
          <span>
            <strong>Supabase Connected:</strong> PostgreSQL database & Row Level Security active.
          </span>
        ) : (
          <span>
            <strong>Phase 5 Hyperlocal Matching:</strong> Leaflet & OpenStreetMap active with spatial privacy fuzzing (~400m). Running in demo mode.
          </span>
        )}
      </div>

      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onRequestClick={() => setCurrentView('requester')}
        onVolunteerClick={() => setCurrentView('volunteer')}
        onOpenAuthModal={() => openAuthWithRole('requester')}
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

        {currentView === 'map' && (
          <HyperlocalExploreView
            requests={requests}
            volunteerProfile={volunteerProfile}
            onSelectRequest={(req) => setMapSelectedTask(req)}
            onSwitchToRequester={() => setCurrentView('requester')}
            onSwitchToVolunteer={() => setCurrentView('volunteer')}
          />
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

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={authModalDefaultRole}
        onAuthSuccess={() => {
          showToast('Authentication updated.');
        }}
      />

      {/* Task Action Modal triggered from Map click */}
      <VolunteerTaskActionModal
        request={mapSelectedTask}
        volunteer={volunteerProfile}
        isOpen={!!mapSelectedTask}
        onClose={() => setMapSelectedTask(null)}
        onAcceptTask={(id) => {
          handleAcceptTask(id);
          setMapSelectedTask(null);
        }}
        onStartTask={(id) => {
          handleStartTask(id);
          setMapSelectedTask(null);
        }}
        onCompleteTask={(id) => {
          handleCompleteTask(id);
          setMapSelectedTask(null);
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
