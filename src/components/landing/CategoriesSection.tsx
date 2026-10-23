import React from 'react';
import { 
  Heart, 
  Pill, 
  ShoppingBag, 
  Laptop, 
  CloudLightning, 
  Dog, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface CategoriesSectionProps {
  onCategorySelect?: (category: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onCategorySelect }) => {
  const categories = [
    {
      id: 'elderly_care',
      title: 'Elderly Care & Check-ins',
      desc: 'Companionship visits, morning wellness check-ins, reading assistance, and light household accompaniment.',
      icon: Heart,
      badge: 'High Demand',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
    {
      id: 'pharmacy_runs',
      title: 'Urgent Pharmacy & Medicine',
      desc: 'Prescription pickups from local pharmacies, medical supplies, and urgent health-related delivery runs.',
      icon: Pill,
      badge: 'Time-Critical',
      badgeColor: 'bg-amber-100 text-amber-800',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      id: 'groceries_errands',
      title: 'Heavy Groceries & Errands',
      desc: 'Assistance carrying heavy supermarket bags, postal packages, water cans, and multi-floor walkup deliveries.',
      icon: ShoppingBag,
      badge: 'Physical Aid',
      badgeColor: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'tech_support',
      title: 'Tech & Digital Literacy',
      desc: 'Helping seniors use video calls, setup government healthcare portals, configure Wi-Fi, and manage smartphones.',
      icon: Laptop,
      badge: 'Patient Mentors',
      badgeColor: 'bg-purple-100 text-purple-800',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
    },
    {
      id: 'emergency_respite',
      title: 'Weather & Emergency Aid',
      desc: 'Flash storm support, water-logging help, backup power assistance, and urgent neighbor wellness assistance.',
      icon: CloudLightning,
      badge: 'Emergency',
      badgeColor: 'bg-red-100 text-red-800',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50',
    },
    {
      id: 'pet_care',
      title: 'Pet & Animal Welfare',
      desc: 'Dog walking for elderly or sick neighbors, vet visit transport accompaniment, and temporary foster help.',
      icon: Dog,
      badge: 'Community',
      badgeColor: 'bg-teal-100 text-teal-800',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
    },
  ];

  return (
    <section id="categories" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Hyperlocal Support Types
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Neighbors Help Neighbors
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            NekiNet organizes community assistance into focused domains, matching each task with volunteers equipped with the right skills and availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onCategorySelect?.(cat.id)}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-xl ${cat.iconBg} ${cat.iconColor} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                  <span>Explore nearby tasks</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm text-amber-900 leading-normal">
            <strong>Important Safety Notice:</strong> NekiNet is for non-critical neighborly assistance. In the event of immediate danger, acute medical crises, or fires, always dial official emergency telephone services (112 / 911 / 999) without delay.
          </p>
        </div>
      </div>
    </section>
  );
};
