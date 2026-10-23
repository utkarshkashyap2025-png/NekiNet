import React from 'react';
import { CheckCircle2, Clock, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';

export const ImpactStats: React.FC = () => {
  const stats = [
    {
      id: 1,
      value: "2,400+",
      label: "Requests Fulfilled",
      detail: "100% free community assistance",
      icon: HeartHandshake,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: 2,
      value: "8.2 min",
      label: "Average Match Time",
      detail: "From broadcast to volunteer accept",
      icon: Clock,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      id: 3,
      value: "48+",
      label: "Active Neighborhoods",
      detail: "Hyperlocal circles under 3 km",
      icon: MapPin,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      id: 4,
      value: "99.4%",
      label: "Trust & Safety Score",
      detail: "Verified volunteer identities",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="flex flex-col items-center sm:items-start p-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} mb-3`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-800 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 mt-1 text-center sm:text-left">
                  {stat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
