// Supabase Edge Function: parse-help-request
// Secure server-side Google Gemini API integration for NekiNet
// Runs in Deno environment on Supabase Edge Functions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const VALID_CATEGORIES = [
  'elderly_care',
  'pharmacy_runs',
  'groceries_errands',
  'tech_support',
  'emergency_respite',
  'pet_care',
  'other',
];

const VALID_URGENCIES = ['low', 'medium', 'high', 'critical'];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide a non-empty request description.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Retrieve server-side API Key strictly from Supabase environment secrets
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY is not configured in Supabase Edge Function secrets.',
          needsSetup: true,
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Supported Google Gemini model
    const GEMINI_MODEL = 'gemini-2.5-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const systemPrompt = `You are NekiNet's community assistance triage engine. 
Your role is to analyze natural language help requests from vulnerable neighbors (seniors, mobility-impaired individuals, families in sudden need) and extract structured assistance metadata.

Rules:
1. Category must strictly be one of: "elderly_care", "pharmacy_runs", "groceries_errands", "tech_support", "emergency_respite", "pet_care", "other".
2. Urgency must strictly be one of: "low" (within 2 days), "medium" (within today), "high" (within 1-2 hours), "critical" (immediate safety/weather concern).
3. Generate a concise, dignified task title (max 60 characters).
4. Provide a refined 1-2 sentence task summary that clarifies the specific action required.
5. Identify 2 to 4 necessary volunteer skills (e.g., "Prescription Pickup", "Elderly Companionship", "Heavy Lifting (>10kg)", "Patience", "Smartphone Basics").
6. Provide brief practical safety advice for the volunteer and requester (e.g. "Verify pharmacy receipt", "Wear masks if requested").
7. Never expose or assume exact house/door numbers.
8. Output STRICT JSON conforming to the requested schema.`;

    const requestPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Analyze this neighbor request and output structured JSON:\n\n"${description.trim()}"`,
            },
          ],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600,
        responseMimeType: 'application/json',
      },
    };

    // Call Google Gemini API with timeout control
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      return new Response(
        JSON.stringify({
          error: `Gemini API returned error (${geminiResponse.status}): ${errText}`,
        }),
        { status: geminiResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    const rawContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return new Response(
        JSON.stringify({ error: 'Empty response returned from Gemini API.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and strictly validate the JSON output
    let parsedResult: any;
    try {
      parsedResult = JSON.parse(rawContent);
    } catch (_parseErr) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse Gemini output as JSON.', rawContent }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(parsedResult.category)) {
      parsedResult.category = 'other';
    }

    // Validate urgency
    if (!VALID_URGENCIES.includes(parsedResult.urgency)) {
      parsedResult.urgency = 'medium';
    }

    // Validate title & summary
    if (!parsedResult.title || typeof parsedResult.title !== 'string') {
      parsedResult.title = 'Neighborhood Assistance Request';
    }

    if (!parsedResult.summary || typeof parsedResult.summary !== 'string') {
      parsedResult.summary = description.slice(0, 150);
    }

    // Validate skills
    if (!Array.isArray(parsedResult.requiredSkills) || parsedResult.requiredSkills.length === 0) {
      parsedResult.requiredSkills = ['Community Care', 'Punctuality'];
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          title: parsedResult.title,
          summary: parsedResult.summary,
          category: parsedResult.category,
          urgency: parsedResult.urgency,
          requiredSkills: parsedResult.requiredSkills,
          safetyNotes: parsedResult.safetyNotes || 'Follow standard community safety guidelines.',
          confidence: 'high',
          modelUsed: GEMINI_MODEL,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return new Response(
        JSON.stringify({ error: 'Gemini API call timed out after 12 seconds.' }),
        { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Internal edge function error: ${err.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
