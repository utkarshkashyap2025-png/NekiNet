export type RequestStatus = 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type RequestCategory = 
  | 'elderly_care' 
  | 'pharmacy_runs' 
  | 'groceries_errands' 
  | 'tech_support' 
  | 'emergency_respite' 
  | 'pet_care' 
  | 'other';

export interface RequestFeedback {
  id: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  volunteerGratitude?: string;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  urgency: UrgencyLevel;
  approxLocation: string; // Fuzzed neighborhood, e.g. "Greenwood Sector 14 (~400m zone)"
  lat: number;
  lng: number;
  requesterId: string;
  requesterName: string;
  requesterPhone?: string; // Private; revealed only to matched volunteer
  volunteerId?: string;
  volunteerName?: string;
  volunteerPhone?: string;
  status: RequestStatus;
  createdAt: string;
  requiredSkills: string[];
  distanceKm?: number; // Calculated relative to volunteer
  feedback?: RequestFeedback;
  aiSuggested?: boolean;
}

export interface VolunteerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  approxLocation: string;
  lat: number;
  lng: number;
  radiusKm: number; // Assistance radius: 1, 3, 5, 10 km
  skills: string[];
  isAvailable: boolean;
  completedTasksCount: number;
  rating: number;
  joinedDate: string;
}
