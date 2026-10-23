import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X, 
  ArrowRight, 
  UserPlus, 
  Home,
  UserCheck,
  User,
  LogOut,
  MapPin,
  Map
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: 'landing' | 'requester' | 'volunteer' | 'map';
  onNavigate: (view: 'landing' | 'requester' | 'volunteer' | 'map') => void;
  onRequestClick?: () => void;
  onVolunteerClick?: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onRequestClick,
  onVolunteerClick,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isConfigured, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo (clickable to return home) */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-100">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 bg-clip-text text-transparent">
                  Neki<span className="text-emerald-600">Net</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                  Hyperlocal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block -mt-0.5">
                Neighborhood Kindness & Volunteer Aid
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('landing')}
              className={`hover:text-emerald-600 transition-colors flex items-center gap-1 ${
                currentView === 'landing' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className={`hover:text-teal-600 transition-colors flex items-center gap-1 ${
                currentView === 'map' ? 'text-teal-700 font-bold' : ''
              }`}
            >
              <Map className="w-4 h-4 text-teal-600" />
              <span>Nearby Map</span>
            </button>

            <button
              onClick={() => onNavigate('requester')}
              className={`hover:text-emerald-600 transition-colors flex items-center gap-1 ${
                currentView === 'requester' ? 'text-emerald-700 font-bold' : ''
              }`}
            >
              <span>Requester Portal</span>
            </button>

            <button
              onClick={() => onNavigate('volunteer')}
              className={`hover:text-teal-600 transition-colors flex items-center gap-1 ${
                currentView === 'volunteer' ? 'text-teal-700 font-bold' : ''
              }`}
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>Volunteer Portal</span>
            </button>

            {currentView === 'landing' && (
              <>
                <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
                  How It Works
                </a>
                <a href="#safety" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Privacy & Safety
                </a>
              </>
            )}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Supabase connection status pill */}
            <button
              onClick={onOpenAuthModal}
              title={isConfigured ? 'Live Supabase Connected' : 'Click to configure Supabase or use Demo Mode'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{isConfigured ? 'Supabase Live' : 'Demo Mode'}</span>
            </button>

            {/* Auth / Account button */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>
            )}

            {currentView !== 'requester' && (
              <button
                onClick={onRequestClick || (() => onNavigate('requester'))}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all active:scale-[0.98]"
              >
                <span>Request Help</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-base font-medium text-slate-700">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('landing');
              }}
              className="px-3 py-2 text-left rounded-md hover:bg-slate-50 flex items-center gap-2"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Home Landing</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('map');
              }}
              className="px-3 py-2 text-left rounded-md hover:bg-slate-50 flex items-center gap-2 text-teal-800 font-semibold"
            >
              <Map className="w-4 h-4 text-teal-600" />
              <span>Nearby Volunteer Map</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('requester');
              }}
              className="px-3 py-2 text-left rounded-md hover:bg-slate-50 flex items-center gap-2"
            >
              <span>Requester Dashboard</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('volunteer');
              }}
              className="px-3 py-2 text-left rounded-md hover:bg-slate-50 flex items-center gap-2 text-teal-800"
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>Volunteer Dashboard</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-center font-medium text-slate-700 bg-slate-100 border border-slate-300"
            >
              {user ? `Signed in as ${user.email}` : 'Sign In / Account'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onRequestClick) onRequestClick();
                else onNavigate('requester');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-center font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
            >
              Request Assistance
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
