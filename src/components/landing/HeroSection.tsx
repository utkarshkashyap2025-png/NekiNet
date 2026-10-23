import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Heart, 
  Send,
  Loader2
} from 'lucide-react';

interface HeroSectionProps {
  onRequestClick: () => void;
  onVolunteerClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRequestClick,
  onVolunteerClick,
}) => {
  // Interactive sample simulator for AI understanding
  const samplePrompts = [
    "My 82-year-old grandfather in Greenwood block B needs his blood pressure medicine picked up from Apollo Pharmacy by 4 PM today.",
    "Looking for a patient volunteer to help set up a smartphone and explain WhatsApp for a senior citizen living alone.",
    "Need urgent help carrying 2 heavy bags of groceries to 3rd floor apartment (elevator under repair)."
  ];

  const [promptText, setPromptText] = useState(samplePrompts[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [parsedResult, setParsedResult] = useState<{
    category: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
    skills: string[];
    approxLocation: string;
    estimatedRadius: string;
  }>({
    category: "Urgent Pharmacy & Medicine",
    urgency: "high",
    summary: "Pick up prescription blood pressure medication from pharmacy and deliver to senior resident by 4 PM.",
    skills: ["Prescription Pickup", "Elderly Care Sensitivity", "Punctuality"],
    approxLocation: "Greenwood Sector (Approx. 400m radius fuzzed)",
    estimatedRadius: "2.5 km matching circle"
  });

  const handleSimulate = (text: string) => {
    setIsSimulating(true);
    setPromptText(text);

    setTimeout(() => {
      if (text.includes("smartphone") || text.includes("WhatsApp")) {
        setParsedResult({
          category: "Tech & Digital Literacy Aid",
          urgency: "medium",
          summary: "In-person smartphone onboarding and basic messaging app guidance for independent senior.",
          skills: ["Patient Instruction", "Smartphone Basics", "Elder Communication"],
          approxLocation: "Greenwood Sector (Approx. 400m radius fuzzed)",
          estimatedRadius: "3.0 km matching circle"
        });
      } else if (text.includes("groceries") || text.includes("elevator") || text.includes("heavy")) {
        setParsedResult({
          category: "Physical & Mobility Errand",
          urgency: "high",
          summary: "Carry 2 heavy grocery bags up to 3rd floor walkup apartment due to elevator breakdown.",
          skills: ["Moderate Lifting (>10kg)", "Mobility Support", "Immediate Availability"],
          approxLocation: "Greenwood Sector (Approx. 400m radius fuzzed)",
          estimatedRadius: "1.5 km matching circle"
        });
      } else {
        setParsedResult({
          category: "Urgent Pharmacy & Medicine",
          urgency: "high",
          summary: "Pick up prescription blood pressure medication from pharmacy and deliver to senior resident by 4 PM.",
          skills: ["Prescription Pickup", "Elderly Care Sensitivity", "Punctuality"],
          approxLocation: "Greenwood Sector (Approx. 400m radius fuzzed)",
          estimatedRadius: "2.5 km matching circle"
        });
      }
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-16 sm:pb-24 lg:pt-12 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50">
      {/* Background ambient blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 -z-10 pointer-events-none opacity-40 blur-3xl">
        <div className="w-full h-full bg-gradient-to-tr from-emerald-200 via-teal-100 to-sky-200" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hyperlocal Community Assistance Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Help is not miles away. <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                It's right next door.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              <strong>NekiNet</strong> bridges vulnerable neighbors and verified local volunteers. 
              Powered by Google Gemini AI to transform simple everyday requests into structured, 
              privacy-protected volunteer alerts matched within minutes.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onRequestClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <span>Request Urgent Help</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onVolunteerClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <Heart className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                <span>Join as a Volunteer</span>
              </button>
            </div>

            {/* Micro Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Address Leaks</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>~8 Min Matching</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Free & Verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive AI Request Preview Simulator */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-6 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">AI Request Understanding Preview</h3>
                    <p className="text-[11px] text-slate-500">Try common natural-language requests</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Gemini API
                </span>
              </div>

              {/* Sample Quick Selector */}
              <div className="mt-4 space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select a sample situation or type below:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSimulate(samplePrompts[0])}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 transition"
                  >
                    💊 Pharmacy Run
                  </button>
                  <button
                    onClick={() => handleSimulate(samplePrompts[1])}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 transition"
                  >
                    📱 Tech Help for Senior
                  </button>
                  <button
                    onClick={() => handleSimulate(samplePrompts[2])}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 transition"
                  >
                    🛒 Heavy Grocery Delivery
                  </button>
                </div>

                <div className="relative mt-2">
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    rows={3}
                    className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50/70"
                    placeholder="Describe what help is needed in plain language..."
                  />
                  <button
                    onClick={() => handleSimulate(promptText)}
                    disabled={isSimulating}
                    className="absolute right-2 bottom-3 p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition"
                    title="Parse with AI"
                  >
                    {isSimulating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Parsed Structured Output Preview */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wide text-[10px]">
                    Structured Volunteer Broadcast
                  </span>
                  <span className="inline-flex items-center text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Validated by NekiNet Engine
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {parsedResult.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      parsedResult.urgency === 'high' 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      Urgency: {parsedResult.urgency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-snug">
                    {parsedResult.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {parsedResult.skills.map((skill, i) => (
                      <span key={i} className="text-[10px] font-medium bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      {parsedResult.approxLocation}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {parsedResult.estimatedRadius}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Next Step Action */}
              <div className="mt-4 pt-1">
                <button
                  onClick={onRequestClick}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <span>Post a Real Request Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
