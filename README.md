# People Like Me

> Matches career switchers with a guide who has made the same move and a pod of five others at the same stage. Over eight weeks: a weekly guide conversation, two pod sessions a week, and weekly goals visible to the guide and pod.

---

## 1. Product Principles & Architecture

- **Subtle, Calm, Trustworthy**: No gamification, streaks, red alerts, rankings or match percentages. Plain words.
- **Privacy by Default**: No full names, emails, or contact information are shared without explicit consent.
- **Human Mentorship**: AI is only used server-side for drafting move profiles and writing 1-sentence match reasons from shared facts. Every advice message and supportive conversation is 100% human.
- **Full-Stack SPA**: React 19 + TypeScript + Vite + Tailwind CSS with an Express server holding Gemini API routes and cron routines.

---

## 2. Repository Structure

```
├── README.md                           # Setup & Render deployment instructions
├── metadata.json                       # Applet configuration & server-side Gemini capability
├── server.ts                           # Express server with @google/genai & Vite SPA middleware
├── index.html                          # Entry HTML with Source Serif 4 & Instrument Sans
├── package.json                        # Dependencies & start scripts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql      # Complete PostgreSQL schema & Row-Level Security (RLS)
├── src/
│   ├── types/                          # Data models matching PRD Section 5
│   ├── context/AppContext.tsx          # State management, demo walkthrough, and persistence
│   ├── lib/
│   │   ├── matching.ts                 # Section 6.1 formula & formatMoveLine()
│   │   ├── calendar.ts                 # Jitsi video links & .ics calendar downloads
│   │   └── gemini.ts                   # Resilient client API calls with non-AI fallbacks
│   ├── data/seedData.ts                # 12 fictional guides across 3 moves, forming pods
│   ├── components/                     # BrandMark, InitialsAvatar, Navigation, ReportModal, Toolbar
│   └── pages/
│       ├── Welcome.tsx                 # Abstract diagram & three value lines
│       ├── SignUp.tsx                  # Google & magic link authentication
│       ├── onboarding/                 # 4-step story onboarding (voice/text, CV/LinkedIn, details, confirm)
│       ├── Matching.tsx                # Calm matching transition
│       ├── Guides.tsx                  # 3 equal cards, 1-sentence reasons, or no-match state
│       ├── GuideDetail.tsx             # 48-hour request form
│       ├── RequestSent.tsx             # 48-hour timeline & countdown
│       ├── PodIntro.tsx                # Pod forming state (3 of 6 joined)
│       ├── RhythmSetup.tsx             # Weekly slots, Jitsi URLs & .ics download
│       ├── Home.tsx                    # Up Next, 2-3 weekly goals, from your pod, nudge
│       ├── Goals.tsx                   # Three states (not_yet, partly, done) & share win
│       ├── Pod.tsx                     # Pod space, session card, posts & wins, "Say hello"
│       ├── GuideSpace.tsx              # 8-dot sprint progress, agenda notes, 30-min call
│       ├── WrapUp.tsx                  # 8-week wrap-up or landed flow
│       ├── Settings.tsx                # Privacy toggles, data export, account deletion
│       ├── guide/                      # Guide dashboard, requests (36h left), pre-call summary, reach out
│       └── admin/AdminHub.tsx          # Guide approvals and community reports review
```

---

## 3. Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Gemini API Key (Server only)
GEMINI_API_KEY="your-gemini-api-key"

# Optional Supabase credentials
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Port (Defaults to 3000)
PORT=3000
```

---

## 4. Deploying to Render

This application is ready to be pushed to GitHub and deployed as a single Web Service on Render:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of People Like Me"
   git remote add origin https://github.com/your-username/people-like-me.git
   git push -u origin main
   ```

2. **Create a Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and click **New + > Web Service**.
   - Connect your GitHub repository.
   - Configure:
     - **Runtime**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `node server.ts` or `npm start`
     - **Environment Variables**:
       - `NODE_ENV`: `production`
       - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API Key)*

3. **Database Setup with Supabase (Optional)**:
   - Create a project on [supabase.com](https://supabase.com).
   - In Supabase SQL Editor, run the script in `supabase/migrations/001_initial_schema.sql`.
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Render Environment Variables.

---

## 5. Walkthrough Guide & Testing

The top **Journey Walkthrough** bar allows instant verification of the entire end-to-end journey:
- **Priya (Switcher)**: View active switcher sprint with weekly goals, pod call, and guide call.
- **Fresh Switcher**: Test 4-step onboarding (voice audio recording or text answers, CV parsing, Gemini drafted profile).
- **Arjun (Guide)**: View incoming switcher requests with 48h timer, accept/decline without explanation, and pre-call goals summaries.
- **Dev (Went Back)**: Explore the transparent guide experience who returned to their previous role.
- **Admin**: Approve real guides and review community concern reports.
- **Simulate 48h Rematch**: Trigger the automatic rematch rule when a guide does not accept in 48 hours.
- **Simulate Slip**: Trigger personal reach-out prompt when goals are missed.
- **+1 Wk**: Advance the sprint towards the 8-week wrap-up / landed milestone.
