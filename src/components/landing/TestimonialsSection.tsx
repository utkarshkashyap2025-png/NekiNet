import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote: "When my mother's walker broke on a stormy Tuesday, a volunteer living two streets down was at our door within 15 minutes with a temporary spare. NekiNet gave our family incredible peace of mind.",
      author: "Pooja Sharma",
      role: "Daughter & Caregiver",
      neighborhood: "Sector 14, Urban Estate",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      id: 2,
      quote: "As a college student, I have free time on weekend mornings. Through NekiNet, I help elderly neighbors carry their fresh produce and teach them digital banking. It's the most fulfilling part of my week.",
      author: "Aditya Verma",
      role: "Verified Volunteer (18 tasks)",
      neighborhood: "Green Valley Colony",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      rating: 5,
    },
    {
      id: 3,
      quote: "I am visually impaired and needed help reading printed bank notices and sorting mail. A volunteer named Sunita came by with patience and kindness. The AI request process made it effortless for me to ask.",
      author: "Dr. K. R. Nambiar",
      role: "Retired Professor",
      neighborhood: "Mall Avenue District",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            Real Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by Neighbors & Volunteers
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Real impact happens when communities look out for each other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-emerald-100 mb-2 -mt-2" />

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.author}</h4>
                  <p className="text-xs text-emerald-600 font-medium">{item.role}</p>
                  <p className="text-[11px] text-slate-400">{item.neighborhood}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
