import React from 'react';
import { HeartHandshake, Heart, Mail, ShieldAlert, Globe, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Neki<span className="text-emerald-500">Net</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-powered hyperlocal volunteer assistance connecting everyday people with caring neighbors for immediate, verified support.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition" aria-label="GitHub">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition" aria-label="Social">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="mailto:support@nekinet.org" className="p-2 rounded-lg bg-slate-900 hover:text-white hover:bg-slate-800 transition" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-emerald-400 transition">Assistance Categories</a>
              </li>
              <li>
                <a href="#safety" className="hover:text-emerald-400 transition">Spatial Privacy Engine</a>
              </li>
              <li>
                <span className="text-slate-600">Community Impact Hub</span>
              </li>
            </ul>
          </div>

          {/* Volunteer */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Get Involved
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300">Become a Neighbor Volunteer</span>
              </li>
              <li>
                <span className="text-slate-300">Register Resident Group</span>
              </li>
              <li>
                <span className="text-slate-300">Skill Guidelines</span>
              </li>
              <li>
                <span className="text-slate-300">Code of Conduct</span>
              </li>
            </ul>
          </div>

          {/* Security & Emergency Notice */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Safety & Terms
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400 hover:text-slate-300 cursor-pointer">Zero Address Sharing Policy</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-300 cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-300 cursor-pointer">Privacy Notice</span>
              </li>
              <li className="pt-2 text-xs text-amber-400/90 flex items-start gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Call emergency lines (112/911) for active medical emergencies.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NekiNet Platform. Open community assistance.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for humanity</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>& AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
