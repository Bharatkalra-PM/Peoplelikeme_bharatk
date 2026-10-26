# People Like Me

> Matches career switchers with a **Career Guide** who has made the same move and a **pod** of 4 to 6 others at the same stage. Over eight weeks: a weekly 30-minute Career Guide conversation, two pod sessions a week, a personal 8-week milestone plan, and weekly goals visible to your Career Guide and pod.

---

## 1. Key Capabilities & Product Flows

1. **Career Guide Everywhere**: User-facing screens, navigation, headings, buttons, and empty states consistently use **Career Guide** (`Ask Arjun to be your Career Guide`, `Your Career Guide`, `Become a Career Guide`, `Recommended Career Guides`, `Choose your Career Guide`).
2. **End-to-End First-Run Journey (Varun)**:
   - **Step 1 (`/signup`)**: Sign in with Google or email magic link; new users go to `/onboarding/objective`, returning users go straight to their dashboard; clear error handling with retry.
   - **Step 2 (`/onboarding/objective`)**: Choose between `"Switch to a new role or field"`, `"Restart after a career break"`, or `"I've made a switch and want to be a Career Guide"` (`/become-a-guide`).
   - **Step 3 (4-Step Onboarding with Slim Progress Bar)**:
     1. `/onboarding/story` — 5 optional prompts (text or voice) or `"Skip for now"`.
     2. `/onboarding/background` — Upload CV (PDF), paste LinkedIn profile, or fill in manually.
     3. `/onboarding/details` — Industry, current role, years of experience, target role, city, when you're free, who depends on you, what matters most, and optional `"Prefer a Career Guide of a particular gender"`.
     4. `/onboarding/confirm` — Gemini drafts the move profile; every field is editable on one screen; fallback prefill if Gemini is unavailable; confirms and navigates to `/home`.
   - **Step 4 (`/home` Pre-Matching State)**: Focused `"Your next step"` card: **"Choose your Career Guide"**.
   - **Step 5 (`/guides` — Recommended Career Guides)**: 3 to 5 approved Career Guides, `"These are your closest matches, not everyone."`, initials avatar, move line (`Sales, consumer goods → Product manager · 2 years ago`), 1-sentence match reason (<20 words), rating & `"Guided N people"` (or `"New"` if <3 ratings, **at most one `"New"` Career Guide per set**), **"Adjust what matters"** modal, and honest empty state (`"Nobody has made exactly this move with us yet. We'd rather tell you honestly than show a weak match."`).
   - **Step 6 (`/guides/:id` & `/request-sent`)**: Add a short note and send `"Ask Arjun to be your Career Guide"`. Waiting screen: `"Request sent. Arjun will reply within 48 hours. If he can't, we'll offer your next best match automatically."`
   - **Step 7 (Pod in Parallel)**: Placed into a pod of 4 to 6 people. If fewer than 4 are available, shows `"Your pod is forming. 2 of 4 have joined."` and starts with the Career Guide alone, notifying when the pod is ready.
   - **Step 8 & 9 (8-Week Plan, Week 1 & Automatic Rollover)**: Starts at **Week 1 of 8** with 4 to 6 personal milestones drafted from the user's background (skipping anything already done, such as rewriting a CV). Labelled `"Draft: you'll finalise this with Arjun in your first conversation."` Rolls over automatically every 7 days from `start_date`.
3. **Career Guide Owns the Plan (`/guide-home/switcher/:id`)**:
   - Career Guide views the switcher's story, profile, and draft milestones; can **add, remove, edit, and reorder milestones**, then mark the plan **"Finalised"** (`"Finalised with Arjun"`).
   - Career Guide can **suggest weekly goals** that appear on the switcher's Goals & Home screens to **accept, edit, or replace**.
   - Switcher privately rates each conversation on `"Was this helpful?"` (1–5) and `"Has Arjun made a move like yours?"` (1–5), feeding the Career Guide's rating and ranking.
4. **Career Guide Applications & Admin Queue (`/become-a-guide` & `/admin`)**:
   - Applicants connect LinkedIn, verify work email, upload CV, write `"Your move, in your words"`, and confirm the 8-week commitment.
   - `/admin` (restricted to Admin role) displays automatic checks (`LinkedIn connected`, `Email verified`, `"Move found"` ≥2y earlier / ≥1y current role, mismatch flags), story, CV, and **Approve**, **Reject**, and **Ask for more** actions.
   - Applicants see their live status: `"Under review"`, `"Approved"`, or `"We need a little more"`.
5. **Demo Mode (`DEMO_MODE`)**:
   - Default `false`. When `DEMO_MODE=true` (or toggled in the testing bar), seeds 12 sample Career Guides and 2 sample pods with every sample person labelled `"Sample profile"`, never mixing sample and real profiles.

---

## 2. Environment Variables

Copy `.env.example` to `.env`:

```env
GEMINI_API_KEY="your-gemini-api-key"
VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
DEMO_MODE="false"
VITE_DEMO_MODE="false"
PORT=3000
```

---

## 3. Running Locally & Testing

```bash
# Install dependencies
npm install

# Start development server (Express + Vite middleware on http://localhost:3000)
npm run dev

# Typecheck
npm run lint

# Run unit tests (matching score, at-most-one-New rule, week rollover, milestone drafting)
npm run test:unit

# Run Playwright E2E tests
npm run test:e2e

# Production build & start
npm start
```

---

## 4. Database Migrations (Supabase PostgreSQL + RLS)

Run the SQL migrations in order in the Supabase SQL Editor:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_career_guide_and_plan.sql`

---

## 5. Deploying to Render

- **Repository**: `https://github.com/Bharatkalra-PM/Peoplelikeme_bharatk.git`
- **Build Command**: `bun install` (or `npm install && npm run build`)
- **Start Command**: `bun run start` (which runs `vite build && node server.ts`)
- **Environment Variables on Render**:
  - `GEMINI_API_KEY`
  - `DEMO_MODE` (`false` by default, or `true` for sample demo profiles)
