import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { RequestCategory, UrgencyLevel } from '../types';

export interface GeminiParseResult {
  title: string;
  summary: string;
  category: RequestCategory;
  urgency: UrgencyLevel;
  requiredSkills: string[];
  safetyNotes?: string;
  source: 'live_gemini_edge' | 'local_heuristic_demo';
  modelUsed?: string;
}

const VALID_CATEGORIES: RequestCategory[] = [
  'elderly_care',
  'pharmacy_runs',
  'groceries_errands',
  'tech_support',
  'emergency_respite',
  'pet_care',
  'other',
];

const VALID_URGENCIES: UrgencyLevel[] = ['low', 'medium', 'high', 'critical'];

/**
 * Intelligent local fallback heuristic for development and testing
 * when the serverless Edge Function is not yet deployed or API key is pending.
 */
function localHeuristicFallback(description: string): GeminiParseResult {
  const lower = description.toLowerCase();

  let category: RequestCategory = 'other';
  let urgency: UrgencyLevel = 'medium';
  let title = 'Neighborhood Community Support';
  let requiredSkills = ['Community Care', 'Punctuality'];
  let safetyNotes = 'Follow standard neighborhood safety protocols.';

  if (
    lower.includes('medicine') ||
    lower.includes('pharmacy') ||
    lower.includes('inhaler') ||
    lower.includes('pill') ||
    lower.includes('prescription') ||
    lower.includes('chemist') ||
    lower.includes('drug')
  ) {
    category = 'pharmacy_runs';
    urgency = 'high';
    title = 'Urgent Prescription / Pharmacy Errand';
    requiredSkills = ['Prescription Pickup', 'Urgent Availability', 'Punctuality'];
    safetyNotes = 'Confirm pharmacy packaging matches prescription note.';
  } else if (
    lower.includes('heavy') ||
    lower.includes('grocery') ||
    lower.includes('groceries') ||
    lower.includes('lift') ||
    lower.includes('water') ||
    lower.includes('bag') ||
    lower.includes('elevator') ||
    lower.includes('stairs')
  ) {
    category = 'groceries_errands';
    urgency = 'medium';
    title = 'Heavy Grocery & Essential Supplies Delivery';
    requiredSkills = ['Heavy Lifting (>10kg)', 'Stair Climbing', 'Errand Running'];
    safetyNotes = 'Ensure proper lifting technique and sanitize delivery bags.';
  } else if (
    lower.includes('elderly') ||
    lower.includes('grandma') ||
    lower.includes('grandfather') ||
    lower.includes('senior') ||
    lower.includes('alone') ||
    lower.includes('check-in') ||
    lower.includes('companion') ||
    lower.includes('read')
  ) {
    category = 'elderly_care';
    urgency = 'low';
    title = 'Elderly Companionship & Wellness Check-in';
    requiredSkills = ['Elderly Companionship', 'Patient Communication', 'Respectful Listening'];
    safetyNotes = 'Introduce yourself at the door with your NekiNet badge.';
  } else if (
    lower.includes('phone') ||
    lower.includes('tablet') ||
    lower.includes('computer') ||
    lower.includes('tech') ||
    lower.includes('wifi') ||
    lower.includes('whatsapp') ||
    lower.includes('app')
  ) {
    category = 'tech_support';
    urgency = 'low';
    title = 'Digital Device Guidance & Smartphone Onboarding';
    requiredSkills = ['Smartphone & Tech Support', 'Digital Literacy Mentoring', 'Patience'];
    safetyNotes = 'Never ask for or write down banking PINs or OTP passwords.';
  } else if (
    lower.includes('storm') ||
    lower.includes('flood') ||
    lower.includes('power') ||
    lower.includes('water-logging') ||
    lower.includes('emergency') ||
    lower.includes('urgent')
  ) {
    category = 'emergency_respite';
    urgency = 'critical';
    title = 'Emergency Neighborhood Respite & Assistance';
    requiredSkills = ['Emergency Respite', 'First Aid Basics', 'Physical Aid'];
    safetyNotes = 'Prioritize physical safety and verify access conditions.';
  } else if (
    lower.includes('dog') ||
    lower.includes('cat') ||
    lower.includes('pet') ||
    lower.includes('vet') ||
    lower.includes('puppy')
  ) {
    category = 'pet_care';
    urgency = 'medium';
    title = 'Neighborhood Pet Walking / Veterinary Support';
    requiredSkills = ['Pet Care & Dog Walking', 'Gentle Handling'];
    safetyNotes = 'Verify pet leash and temperament with owner before handling.';
  }

  // Create clean summary
  const summary = description.length > 140 
    ? description.slice(0, 140) + '...'
    : description;

  return {
    title,
    summary,
    category,
    urgency,
    requiredSkills,
    safetyNotes,
    source: 'local_heuristic_demo',
    modelUsed: 'Heuristic Rule-Engine (Demo Fallback)',
  };
}

export const geminiService = {
  /**
   * Calls the secure Supabase Edge Function to parse request with Google Gemini.
   * If the Edge Function is not yet deployed or credentials are not configured,
   * falls back gracefully to local heuristic simulation.
   */
  async parseHelpRequest(description: string): Promise<GeminiParseResult> {
    if (!description || description.trim().length === 0) {
      throw new Error('Please enter a description for your request.');
    }

    // If Supabase is not configured, use local heuristic fallback immediately
    if (!isSupabaseConfigured) {
      // Simulate brief network delay for authentic UI feel
      await new Promise((resolve) => setTimeout(resolve, 600));
      return localHeuristicFallback(description);
    }

    try {
      // Invoke the secure Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('parse-help-request', {
        body: { description },
      });

      if (error || !data?.success) {
        console.warn('Edge Function returned error, using fallback:', error?.message || data?.error);
        return localHeuristicFallback(description);
      }

      const aiData = data.data;

      // Validate schema
      const category: RequestCategory = VALID_CATEGORIES.includes(aiData.category)
        ? aiData.category
        : 'other';

      const urgency: UrgencyLevel = VALID_URGENCIES.includes(aiData.urgency)
        ? aiData.urgency
        : 'medium';

      const requiredSkills: string[] = Array.isArray(aiData.requiredSkills) && aiData.requiredSkills.length > 0
        ? aiData.requiredSkills
        : ['Community Care', 'Punctuality'];

      return {
        title: aiData.title || 'Neighborhood Assistance Request',
        summary: aiData.summary || description.slice(0, 150),
        category,
        urgency,
        requiredSkills,
        safetyNotes: aiData.safetyNotes || 'Follow standard community safety guidelines.',
        source: 'live_gemini_edge',
        modelUsed: aiData.modelUsed || 'gemini-2.5-flash',
      };
    } catch (err: any) {
      console.warn('Unexpected error communicating with Edge Function:', err);
      return localHeuristicFallback(description);
    }
  },
};
