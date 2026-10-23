import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, MapPin, Sparkles, Menu, X, ArrowRight, UserPlus, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onRequestClick?: () => void;
  onVolunteerClick?: () => void;
  onExploreMapClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRequestClick,
  onVolunteerClick,
  onExploreMapClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
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
                  AI Hyperlocal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block -mt-0.5">
                Neighborhood Kindness & Volunteer Aid
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
              How It Works
            </a>
            <a href="#categories" className="hover:text-emerald-600 transition-colors">
              Assistance Areas
            </a>
            <a href="#safety" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Privacy & Trust
            </a>
            <button
              onClick={onExploreMapClick || (() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              })}
              className="hover:text-emerald-600 transition-colors flex items-center gap-1"
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              Coverage
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onVolunteerClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              Volunteer Portal
            </button>
            <button
              onClick={onRequestClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all active:scale-[0.98]"
            >
              <span>Request Help</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Assistance Areas
            </a>
            <a
              href="#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Privacy & Trust
            </a>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestClick?.();
              }}
              className="w-full py-2.5 px-4 rounded-lg text-center font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
            >
              Request Assistance
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onVolunteerClick?.();
              }}
              className="w-full py-2.5 px-4 rounded-lg text-center font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
            >
              Join as Volunteer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
