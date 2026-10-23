import React from 'react';
import { ShieldCheck, EyeOff, Lock, UserCheck, CheckCircle2 } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  return (
    <section id="safety" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-teal-950/40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-emerald-700/50">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Privacy & Hyperlocal Safety Architecture
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Your exact address stays private. <br />
              <span className="text-emerald-400">Always.</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              We engineered NekiNet with privacy by design. When you request assistance, our geocoding engine applies coordinate fuzzing (~300m–500m radius). Volunteers only see approximate neighborhood zones until a request is mutually accepted and verified.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">No Public House Numbers</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Maps display approximate zone circles, never precise house or apartment coordinates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <Lock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Row Level Security (RLS)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Supabase PostgreSQL policies ensure strictly authorized access to requester contact info.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <UserCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Community Vetting</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Volunteers undergo email and phone verification before receiving dispatch privileges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Mutual Feedback</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Two-way ratings ensure accountability, respect, and peace of mind across neighborhoods.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphical diagram mock */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-2xl relative">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Spatial Privacy Visualizer</span>
                <span className="text-emerald-400 text-[10px] font-mono">ENCRYPTED</span>
              </div>

              <div className="relative h-60 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700/60 flex items-center justify-center">
                {/* Grid lines simulating map */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415515_1px,transparent_1px),linear-gradient(to_bottom,#33415515_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Fuzzed Zone circle */}
                <div className="relative flex items-center justify-center">
                  <div className="w-44 h-44 rounded-full bg-emerald-500/10 border-2 border-dashed border-emerald-500/40 animate-pulse flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/15 border border-emerald-400/50 flex items-center justify-center">
                      <div className="p-2.5 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-500/40">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Privacy tag pill */}
                  <div className="absolute -bottom-5 bg-slate-800 border border-slate-600 text-[11px] text-emerald-300 px-3 py-1 rounded-full shadow-md">
                    Approx. ~450m Fuzzed Zone
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center mt-6">
                Volunteers can view the radius circle to evaluate distance without ever compromising requester residential privacy.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
