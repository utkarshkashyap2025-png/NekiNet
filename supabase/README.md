# NekiNet Supabase Backend Setup Guide (Phase 3)

This guide walks you step-by-step through setting up your free Supabase PostgreSQL database, Authentication, and Row Level Security (RLS) policies for **NekiNet**.

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **"New Project"**.
3. Fill in the details:
   - **Name**: `NekiNet-Production` (or any name you prefer)
   - **Database Password**: Choose a strong password and save it in your password manager.
   - **Region**: Select the region closest to your users (e.g., *South Asia (Mumbai)*, *Central EU (Frankfurt)*, etc.).
4. Click **"Create new project"** and wait ~2 minutes for the database to provision.

---

## Step 2: Copy API Keys to Your Local `.env.local`

1. In your Supabase Dashboard, go to **Project Settings** (gear icon on the left sidebar) &rarr; **API**.
2. Find the **Project API keys** and **Project URL**:
   - **Project URL**: e.g., `https://xyzcompany.supabase.co`
   - **Project API Key (`anon` / `public`)**: A long string starting with `eyJhbG...`
3. In your local project root (`c:\Users\ASUS\Desktop\NekiNet`), create a file named `.env.local` (or copy from `.env.example`):

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Security Rule**: Never share your `anon` key in public repositories, and **NEVER** expose your `service_role` key to the frontend! Only use the `anon` key in `VITE_SUPABASE_ANON_KEY`.

---

## Step 3: Run the SQL Database Schema Migration

1. In your Supabase Dashboard, click on **SQL Editor** in the left navigation.
2. Click **"New Query"**.
3. Open the migration file:
   [`supabase/migrations/20261024000000_init_nekinet_schema.sql`](file:///c:/Users/ASUS/Desktop/NekiNet/supabase/migrations/20261024000000_init_nekinet_schema.sql)
4. Copy the entire contents of that SQL file and paste it into the Supabase SQL Editor.
5. Click the green **"Run"** button.

### What this migration sets up:
- **`profiles` table**: Extends Supabase `auth.users` with user roles, fuzzed location coordinates, ratings, and contact info.
- **`volunteer_skills` table**: Maps verified volunteer competencies (elder care, pharmacy pickups, heavy lifting, tech aid).
- **`help_requests` table**: Stores hyperlocal assistance requests with urgency, fuzzed coordinates, status, and required skills.
- **`request_feedback` table**: Manages verified star ratings and reviews.
- **`notifications` table**: Broadcasts live updates when volunteers accept requests.
- **Row Level Security (RLS)**: Enforces privacy rules so exact details are only accessible to permitted participants.
- **Trigger `on_auth_user_created`**: Automatically provisions a `profiles` row whenever a user signs up.

---

## Step 4: Configure Authentication Settings

1. In the Supabase Dashboard, go to **Authentication** &rarr; **Providers** &rarr; **Email**.
2. **For local development / easy testing**:
   - You can toggle **"Confirm email"** to **OFF** if you want to test signing up immediately without waiting for verification emails.
   - For production, keep **"Confirm email"** **ON**.
3. Save your settings.

---

## Step 5: Test the Integration in NekiNet

1. Run the local dev server:
   ```bash
   npm run dev
   ```
2. Open your browser.
3. Look at the top navigation bar or the **Sign In / Account** modal:
   - When connected, you will see a badge: **`🟢 Live Supabase Connected`**.
   - Create a test account using the Sign Up form.
   - Check the **Table Editor** in your Supabase Dashboard &rarr; **`profiles`** to see your new user created automatically!
