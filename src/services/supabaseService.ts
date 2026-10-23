import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { HelpRequest, VolunteerProfile, RequestFeedback } from '../types';
import { INITIAL_MOCK_REQUESTS, INITIAL_MOCK_VOLUNTEER } from '../data/mockData';

/**
 * Service Layer for NekiNet Database Operations.
 * Automatically uses real Supabase queries when credentials exist,
 * and falls back safely to in-memory mock data when not configured.
 */

// In-memory fallback cache when running in demo/unconfigured mode
let localRequestsCache: HelpRequest[] = [...INITIAL_MOCK_REQUESTS];
let localVolunteerCache: VolunteerProfile = { ...INITIAL_MOCK_VOLUNTEER };

export const supabaseService = {
  /**
   * Fetches help requests from Supabase help_requests table
   */
  async getHelpRequests(): Promise<HelpRequest[]> {
    if (!isSupabaseConfigured) {
      return localRequestsCache;
    }

    try {
      const { data, error } = await supabase
        .from('help_requests')
        .select(`
          id,
          title,
          description,
          category,
          urgency,
          approx_location,
          lat,
          lng,
          status,
          required_skills,
          ai_suggested,
          created_at,
          requester_id,
          volunteer_id,
          requester:profiles!requester_id(full_name, phone),
          volunteer:profiles!volunteer_id(full_name, phone),
          request_feedback(id, rating, comment, created_at, volunteer_gratitude)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch failed, falling back to cached data:', error.message);
        return localRequestsCache;
      }

      if (!data || data.length === 0) {
        return localRequestsCache;
      }

      // Map database snake_case to frontend HelpRequest model
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        urgency: item.urgency,
        approxLocation: item.approx_location,
        lat: item.lat,
        lng: item.lng,
        requesterId: item.requester_id,
        requesterName: item.requester?.full_name || 'Community Member',
        requesterPhone: item.requester?.phone,
        volunteerId: item.volunteer_id,
        volunteerName: item.volunteer?.full_name,
        volunteerPhone: item.volunteer?.phone,
        status: item.status,
        createdAt: new Date(item.created_at).toLocaleDateString(),
        requiredSkills: item.required_skills || [],
        distanceKm: 1.2,
        aiSuggested: item.ai_suggested,
        feedback: item.request_feedback?.[0]
          ? {
              id: item.request_feedback[0].id,
              rating: item.request_feedback[0].rating,
              comment: item.request_feedback[0].comment,
              createdAt: new Date(item.request_feedback[0].created_at).toLocaleDateString(),
              volunteerGratitude: item.request_feedback[0].volunteer_gratitude,
            }
          : undefined,
      }));
    } catch (err) {
      console.error('Unexpected error fetching requests from Supabase:', err);
      return localRequestsCache;
    }
  },

  /**
   * Creates a new help request in Supabase
   */
  async createHelpRequest(
    request: Omit<HelpRequest, 'id' | 'createdAt' | 'distanceKm'>
  ): Promise<HelpRequest> {
    const newLocalItem: HelpRequest = {
      ...request,
      id: `req-${Date.now().toString().slice(-4)}`,
      createdAt: 'Just now',
      distanceKm: 0.5,
    };

    if (!isSupabaseConfigured) {
      localRequestsCache = [newLocalItem, ...localRequestsCache];
      return newLocalItem;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      const requesterId = user?.user?.id || request.requesterId;

      const { data, error } = await supabase
        .from('help_requests')
        .insert({
          title: request.title,
          description: request.description,
          category: request.category,
          urgency: request.urgency,
          approx_location: request.approxLocation,
          lat: request.lat,
          lng: request.lng,
          requester_id: requesterId,
          required_skills: request.requiredSkills,
          ai_suggested: request.aiSuggested || false,
          status: 'open',
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert failed, using local fallback:', error.message);
        localRequestsCache = [newLocalItem, ...localRequestsCache];
        return newLocalItem;
      }

      return {
        ...newLocalItem,
        id: data.id,
      };
    } catch (err) {
      console.error('Unexpected error inserting into Supabase:', err);
      localRequestsCache = [newLocalItem, ...localRequestsCache];
      return newLocalItem;
    }
  },

  /**
   * Updates request status (e.g. matched, in_progress, completed, cancelled)
   */
  async updateRequestStatus(
    requestId: string,
    status: HelpRequest['status'],
    volunteerId?: string
  ): Promise<boolean> {
    localRequestsCache = localRequestsCache.map((r) =>
      r.id === requestId ? { ...r, status, volunteerId: volunteerId || r.volunteerId } : r
    );

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (volunteerId) updates.volunteer_id = volunteerId;

      const { error } = await supabase
        .from('help_requests')
        .update(updates)
        .eq('id', requestId);

      if (error) {
        console.warn('Supabase update status failed:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to update request status in Supabase:', err);
      return false;
    }
  },

  /**
   * Submits feedback and rating for a completed request
   */
  async submitFeedback(
    requestId: string,
    requesterId: string,
    volunteerId: string,
    rating: number,
    comment: string
  ): Promise<boolean> {
    const feedback: RequestFeedback = {
      id: `fb-${Date.now()}`,
      rating,
      comment,
      createdAt: 'Just now',
    };

    localRequestsCache = localRequestsCache.map((r) =>
      r.id === requestId ? { ...r, status: 'completed', feedback } : r
    );

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const { error } = await supabase.from('request_feedback').insert({
        request_id: requestId,
        requester_id: requesterId,
        volunteer_id: volunteerId,
        rating,
        comment,
      });

      if (error) {
        console.warn('Supabase feedback insert error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to submit feedback to Supabase:', err);
      return false;
    }
  },

  /**
   * Fetches volunteer profile
   */
  async getVolunteerProfile(profileId?: string): Promise<VolunteerProfile> {
    if (!isSupabaseConfigured || !profileId) {
      return localVolunteerCache;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone,
          bio,
          approx_location,
          lat,
          lng,
          radius_km,
          is_available,
          completed_tasks_count,
          rating,
          created_at,
          volunteer_skills(skill_name)
        `)
        .eq('id', profileId)
        .single();

      if (error || !data) {
        return localVolunteerCache;
      }

      const skills = (data.volunteer_skills || []).map((s: any) => s.skill_name);

      return {
        id: data.id,
        name: data.full_name,
        email: 'user@nekinet.org',
        phone: data.phone || '+91 98765 43210',
        bio: data.bio || '',
        approxLocation: data.approx_location,
        lat: data.lat || 28.4595,
        lng: data.lng || 77.0266,
        radiusKm: data.radius_km || 5,
        skills: skills.length ? skills : localVolunteerCache.skills,
        isAvailable: data.is_available,
        completedTasksCount: data.completed_tasks_count || 0,
        rating: data.rating || 5.0,
        joinedDate: new Date(data.created_at).toLocaleDateString(),
      };
    } catch (err) {
      return localVolunteerCache;
    }
  },

  /**
   * Updates volunteer profile and skills in Supabase
   */
  async updateVolunteerProfile(profile: VolunteerProfile): Promise<boolean> {
    localVolunteerCache = { ...profile };

    if (!isSupabaseConfigured) {
      return true;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.name,
          bio: profile.bio,
          radius_km: profile.radiusKm,
          is_available: profile.isAvailable,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) {
        console.warn('Profile update error:', error.message);
        return false;
      }

      // Sync skills
      await supabase.from('volunteer_skills').delete().eq('profile_id', profile.id);
      if (profile.skills.length > 0) {
        const skillsRows = profile.skills.map((s) => ({
          profile_id: profile.id,
          skill_name: s,
        }));
        await supabase.from('volunteer_skills').insert(skillsRows);
      }

      return true;
    } catch (err) {
      console.error('Failed to update volunteer profile:', err);
      return false;
    }
  },
};
