# NekiNet Gemini AI Edge Function Setup (Phase 4)

This directory contains the secure serverless edge function `parse-help-request` connecting NekiNet to the **Google Gemini API** (`gemini-2.5-flash`).

---

## Architecture & Security Principles

```
+-------------------------------------------------------------+
|                     Browser / Client                        |
| - Requester enters description in natural language          |
| - Zero API keys stored on client (never exposed to browser) |
| - Full review & editing authority prior to submission       |
+------------------------------+------------------------------+
                               |
                               | (Calls Supabase Edge Function)
                               v
+-------------------------------------------------------------+
|         Supabase Edge Function (Deno Runtime)               |
| - Retrieves GEMINI_API_KEY from secure server secrets       |
| - Enforces timeout (12s) and rate-limit guardrails          |
| - Strictly validates JSON Schema output                     |
+------------------------------+------------------------------+
                               |
                               | (HTTPS REST v1beta)
                               v
+-------------------------------------------------------------+
|                   Google Gemini API                         |
| - Model: gemini-2.5-flash                                   |
| - Extracts Category, Urgency, Clean Title & Volunteer Skills|
+-------------------------------------------------------------+
```

---

## Step 1: Obtain a Free Google Gemini API Key

1. Go to [https://aistudio.google.com/](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **"Get API key"** &rarr; **"Create API key in new project"**.
4. Copy your API key (starts with `AIzaSy...`).

---

## Step 2: Set the Secret in Your Supabase Project

Using the Supabase CLI or the Supabase Web Dashboard:

### Option A: Using the Supabase Dashboard (Recommended for Beginners)
1. Go to your project in [https://supabase.com](https://supabase.com).
2. Go to **Project Settings** &rarr; **Edge Functions** &rarr; **Secrets**.
3. Click **"Add new secret"**:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: paste your Google Gemini API key.
4. Click **"Save"**.

### Option B: Using the Supabase CLI
```bash
supabase login
supabase link --project-ref your-project-ref
supabase secrets set GEMINI_API_KEY="your-api-key-here"
```

---

## Step 3: Deploy the Edge Function

Deploy the function using the Supabase CLI from the project root:

```bash
supabase functions deploy parse-help-request --no-verify-jwt
```

---

## Step 4: Verification & Safe Fallback

- When `GEMINI_API_KEY` and the Edge Function are active: NekiNet displays `🟢 Live Gemini 2.5 Flash`.
- When credentials are not yet configured: NekiNet provides an intelligent **`🟡 Demo Heuristic Fallback`**, ensuring you can test the full review and confirmation workflow without breaking or crashing the application.
