# People Like Me: Build Spec for Google AI Studio

Build **People Like Me** as a production-ready, responsive web app that real users will sign up for from a public launch. It must feel polished from the first visit: fast, calm, trustworthy and private.

Use the attached **PRD** for the why, and the attached **Stitch screens** for visual style. **Where a Stitch screen conflicts with this document, this document wins** (section 3 lists the remaining corrections).

---

## 1. Product in one paragraph

People Like Me matches **career switchers** with a **guide** (someone one to five years past the same career move) and a **pod** (five others making a similar move at the same stage). For eight weeks: a **30-minute guide conversation every week**, **two pod sessions a week** (a 30-minute call and a 15-minute check-in), and **two or three weekly goals** the guide and pod can see. When someone slips or goes quiet, their guide and pod are prompted to reach out personally. AI drafts profiles and matches people; every supportive conversation is human.

---

## 2. Design principles

Usable, valuable, intuitive, subtle and calm. One primary action per screen. Plain words. No gamification, streaks, red alerts, rankings or match percentages. Mobile first (390 px), excellent on desktop (1280 px), light and dark mode.

**Design tokens**

| Token | Light | Dark |
| --- | --- | --- |
| dark (sidebar active, avatars) | #102A2E | #0B1D20 |
| bg (page) | #F1F5F2 | #122523 |
| surface (cards) | #FFFFFF | #0E1E1D |
| ink (text) | #13231F | #E6EEEA |
| soft (secondary text) | #55665F | #A6B8B0 |
| line (borders) | #D3DDD8 | #2A403C |
| accent (buttons, progress fills only) | #F2B134 | #F2B134 |
| accent-text (highlighted text) | #8A5A00 | #F2B134 |
| good | #2F7D5B | #5FBF8F |
| info (links) | #2D6B8F | #7FB6D6 |
| warn (gentle) | #A8432C | #E58C73 |

Fonts: **Source Serif 4** (headings), **Instrument Sans** (everything else). Radius 12 px cards, 10 px inputs, pill buttons. 8 px grid. Thin borders, no heavy shadows or gradients.

---

## 3. Using the Stitch screens

The revised Stitch screens are the visual reference: brand mark, initials avatars, the abstract guide-and-pod diagram on the welcome page, equal guide cards, Home, Pod and the desktop sidebar layout. Build to them, with these corrections:

1. **Soften the continuity promise.** Several screens say "a similar matching profile steps in so your pod rhythm never falters" or "Pod guarantee". Don't promise that. Use, in one place only (the Pod screen): "If your pod gets small, we'll add someone making the same move when we can, or offer to merge with another pod." Remove the line from the welcome page, guide matching screens and Home.
2. **"Why we matched you" is one sentence, under 20 words,** using only facts both profiles share. The desktop cards run to four lines and include guesses ("before deciding sales was his better long-term fit"). Mobile and desktop must show the same reason text.
3. **Show the "Verified" tag on desktop guide cards too,** as on mobile. Keep each guide's name on one line ("Dev M." must not wrap).
4. **Plain words:** "Pod call", not "Upcoming gathering"; remove "Active circle", "1:5 dynamic" and the "Active sprint" pill.
5. **No duplicates:** on the mobile Pod screen, the session card shows "Opens in 1d 4h" once, as the disabled button label, and the title appears once.
6. **No truncation:** the pod note on mobile is cut off behind the composer; show it fully above the composer, or move it to a small info icon.
7. **Desktop Home session rows:** keep the description at a readable width; place "Opens 10 min before" under the Join button rather than beside it.
8. **Pod agenda** (desktop) is optional, written by that week's host, and hidden when empty.

These rules still apply everywhere:

- Brand mark as three marigold dots plus "PEOPLE LIKE ME" text, never an image file.
- Initials avatars only, no photos; first name and last initial unless the person shares more.
- No cohorts, fake counts, testimonials, stock photos, percentages, numbering, presence dots or design-preview toggles.
- One move-line format from one function; a guide who went back shows the return ("Retail sales → Associate PM → back to sales").
- Nudges only when true; Join active from 10 minutes before a session until it ends; check marks rather than strikethrough for done goals.
- Pod check-ins show only "[Name] hasn't posted this week" with "Say hello", never reasons or labels.
- Guide conversations are 30 minutes everywhere.

---

## 4. Architecture

| Part | Choice | Notes |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS | Single-page app, React Router |
| Auth, database, storage | **Supabase** | Postgres with row-level security, Google and email (magic link) sign-in, private storage bucket for CVs |
| API server | Node.js with Express | Holds all secrets; calls Gemini; runs scheduled jobs |
| AI | **Gemini API**, called only from the server | A Flash-class model is enough |
| Email | Resend (or SendGrid) | Transactional emails with calendar invites attached as .ics files |
| Video links | Generated Jitsi Meet room URLs per session | No accounts needed; swap for Google Meet later |
| Scheduled jobs | node-cron in the API server | 48-hour expiry, slip detection, reminders |
| Hosting | GitHub, deployed to **Render** | Static site for the frontend, web service for the API |

**Environment variables:** `SUPABASE_URL`, `SUPABASE_ANON_KEY` (frontend), `SUPABASE_SERVICE_ROLE_KEY` (server only), `GEMINI_API_KEY` (server only), `RESEND_API_KEY`, `APP_BASE_URL`. Never expose server keys to the browser.

**Repository layout:** `/web` (frontend), `/server` (API and jobs), `/supabase/migrations` (SQL schema and RLS policies), plus a README with setup and deploy steps for Render.

---

## 5. Data model

```sql
profiles(id uuid pk = auth.users.id, role text check (role in ('switcher','guide')),
  first_name text, last_initial text, full_name text, city text,
  share_contact_with_guide bool default false, share_contact_with_pod bool default false,
  created_at timestamptz)

story_answers(id, user_id, prompt_key text, answer text, input_mode text check (input_mode in ('text','voice')), created_at)
  -- prompt_key: coming_from | going_to | pushing_change | tried_so_far | holding_back

move_profiles(user_id pk, from_role, from_field, from_company_type, to_role,
  years_experience int, months_since_leaving int null, dependants text, priority text,
  availability text[], constraints text[], went_back bool default false,
  years_since_move int null, story text null, confirmed_at timestamptz)

guide_requests(id, switcher_id, guide_id, note text,
  status text check (status in ('pending','accepted','declined','expired')),
  sent_at timestamptz, respond_by timestamptz, match_reason text)

pods(id, name text, created_at, status text check (status in ('forming','active','completed')))
pod_members(pod_id, user_id, joined_at, left_at null)

rhythms(id, switcher_id, guide_id null, pod_id null, start_date date, week int,
  status text check (status in ('active','completed','landed','ended_early')))

sessions(id, rhythm_id null, pod_id null, kind text check (kind in ('guide','pod_call','pod_checkin')),
  starts_at timestamptz, duration_min int, video_url text, agenda text null, held bool null)

goals(id, user_id, week_start date, text, status text check (status in ('not_yet','partly','done')), updated_at)

pod_posts(id, pod_id, author_id, body text, is_win bool, created_at)
cheers(post_id, user_id, created_at)

reach_out_prompts(id, subject_user_id, audience text check (audience in ('guide','pod')),
  reason text check (reason in ('few_goals_two_weeks','no_update_7_days')), created_at, resolved_at null)

reports(id, reporter_id, reported_user_id, reason text, details text, created_at, status text)
```

**Row-level security, minimum:** users read and write their own rows; pod members read their pod's members (first name, last initial, move line only), posts and sessions; a guide reads only their own switchers' goals and sessions; `reach_out_prompts.reason` is visible to the guide only, never to pod members; reports are visible only to admins. No table exposes email or phone unless the matching `share_contact_*` flag is true.

---

## 6. Core logic

### 6.1 Matching guides

Candidates: guides with fewer than two active switchers, `years_since_move` between 1 and 5.

```
score = 0.35 * moveSimilarity        // 1.0 if from and to both match (with synonyms, e.g. "PM" = "product manager"), 0.6 if only "to" matches
      + 0.25 * startingPoint         // 1 - min(|yearsA - yearsB|, 10)/10, +0.2 if company type matches (cap 1)
      + 0.20 * constraintsOverlap    // share of dependants, priority and constraints in common
      + 0.10 * sameCityOrRemote
      + 0.10 * availabilityOverlap
```

Show the **top three with score ≥ 0.45**. If any guide with `went_back = true` clears 0.45, include them. If none clear 0.45, show the no-match state with up to two closest guides and what differs. Scores are never shown to users.

### 6.2 Forming pods

Group switchers with the same `to_role` family, years of experience within ±3, overlapping availability and confirmed profiles from the last 21 days. Pods start at four and fill to six. A pod is `forming` until four members join; the switcher starts with their guide meanwhile. When a member leaves or pauses, and a pod drops below six, invite a waiting switcher with a matching move and stage to join at the next check-in, if one exists. If an active pod falls below three and nobody suitable is waiting, offer the remaining members a merge with another pod at a similar week. Never promise a replacement in the interface.

**Experiment flag:** assign about 30% of new switchers to "guide only" (no pod) for the first eight weeks, stored on `rhythms`, so the key metric can be compared. Don't mention the flag in the interface; offer a pod at wrap-up.

### 6.3 The 48-hour rule

A job runs every 15 minutes: pending requests past `respond_by` become `expired`, and the switcher is offered their next best match with the message "Arjun couldn't take this on right now. Here's your next best match."

### 6.4 Rhythm and sessions

After acceptance, the switcher picks weekly slots for the guide conversation; the pod's two weekly slots are chosen by the first four members (most common overlap) and editable by any member, with all members notified. Each session gets a Jitsi URL and an .ics invite by email. Rescheduling is allowed up to two hours before. After a session's end time, ask "Did this happen?" (Yes / Rescheduled).

### 6.5 Goals and slipping

Each Monday, users set two or three goals for the week. A daily job creates a `reach_out_prompt` when fewer than half of a user's goals were done in each of the last two weeks, or when there's been no goal update or post in 7 days. The **guide** sees the reason and a blank message box; the **pod** sees only "[Name] hasn't posted this week" with "Say hello". Nothing is ever sent automatically on anyone's behalf. Prompts resolve when the user updates goals or posts.

### 6.6 Wrap-up

After week 8: continue with the same guide and pod, start a fresh match, or "I've landed a role" (mark the rhythm `landed`, post a win to the pod if the user agrees, and invite them to become a guide).

---

## 7. Gemini usage (server only)

Use Gemini for exactly three jobs, always returning JSON validated against a schema, with a non-AI fallback if the call fails.

**7.1 Transcribe voice answers.** Accept short audio recordings (up to 3 minutes) from the story prompts and return the transcript, which the user can edit before saving. Fallback: the browser's speech recognition, or typing.

**7.2 Draft the move profile.** Input: story answers, CV text (extracted server-side from the PDF) or pasted LinkedIn text, and the detail chips.
System prompt: *"Extract a career move profile. Return only JSON matching the schema. Use only facts in the input. If unknown, use null or an empty list. Never invent employers, numbers or constraints."*
Fallback: prefill from the chips and let the user complete the confirm screen.

**7.3 Write the match reason.** Input: the switcher's and guide's move profiles.
System prompt: *"Write one plain sentence under 20 words about what these two moves have in common. Use only facts present in both profiles. If the guide went back after the move, say so. No praise, no promises."*
Fallback: a template built from the matching fields.

**Never** use Gemini to write messages, replies, nudges or posts between people.

---

## 8. Screens and routes

| Route | Screen |
| --- | --- |
| `/` | Welcome (abstract diagram, three value lines, "Find my people", "I've made a switch and want to guide") |
| `/signup` | Google or email sign-in |
| `/onboarding/story` | Tell your story: five optional prompts, voice or text, any length (step 1 of 4) |
| `/onboarding/background` | CV upload or LinkedIn paste, or fill in manually (step 2) |
| `/onboarding/details` | Dependants, priority, availability, city (step 3) |
| `/onboarding/confirm` | Editable move profile (step 4) |
| `/matching` | Finding your people (loading) |
| `/guides` | Choose your guide: three equal cards, or the no-match state |
| `/guides/:id` | Guide story and request form |
| `/request-sent` | Waiting state with the 48-hour timeline |
| `/pod/intro` | Meet your pod, or "Your pod is forming (3 of 6)" |
| `/rhythm` | Set your rhythm (guide slot; pod slots) |
| `/home` | Home: up next, this week's goals, from your pod, a nudge when true |
| `/goals` | Set or update this week's goals |
| `/pod` | Pod space: members, next session, posts and wins, composer, "check in on" row |
| `/guide` | Your guide: next conversation, agenda note, past conversations, eight-dot progress |
| `/wrap-up` | Eight-week wrap-up and landed flow |
| `/become-a-guide` | Guide onboarding with story prompts |
| `/guide-home` | Requests (accept or decline, 36 hours left), active switchers, empty state |
| `/guide-home/switcher/:id` | Switcher summary before a conversation |
| `/guide-home/reach-out/:promptId` | Reach-out prompt with a blank message box |
| `/settings` | Contact-sharing toggles, notifications, download data, delete account |

Report a concern opens as a bottom sheet from any person's menu. Navigation after onboarding: bottom tabs on mobile (Home, Pod, Guide) and a left sidebar on desktop; guides see Requests and Switchers instead.

---

## 9. User stories and acceptance criteria

1. **Tell my story.** Five optional prompts, each by voice or text with no length limit; CV or LinkedIn optional, with manual fallback; the drafted profile is editable on one screen. Onboarding is possible in under 5 minutes.
2. **Meet my guide.** At most three guides with one-sentence reasons and equal buttons; contact details hidden until acceptance; automatic rematch after 48 hours.
3. **Join my pod.** Pods of four to six by move and stage; pod content visible only to members; no contact details unless shared.
4. **Keep the rhythm.** Weekly guide sessions and two weekly pod sessions with email invites and video links; Home shows the next two sessions; reschedule up to two hours before.
5. **Stay accountable.** Two or three goals a week with three states, updated in under two minutes; slip prompts per section 6.5; wins shareable in one tap.
6. **Guide lightly.** Requests show the switcher's move and note; decline needs no reason; at most two switchers per guide; a summary of goals before each conversation.

---

## 10. Edge cases and empty states

| Case | Behaviour |
| --- | --- |
| No guide match | "Nobody has made exactly this move with us yet. We'd rather tell you honestly than show a weak match." Closest guides with what differs, "Notify me", "Invite someone who made this move" |
| Pod still forming | Start with the guide; pod tab shows "Your pod is forming. 3 of 6 have joined." |
| First day on Home | "Welcome to week 1. Start by setting this week's goals." with one button |
| No pod posts | "No updates yet. Share how your week is going, and your pod will see it." |
| Guide has no requests | "No requests yet. We'll let you know when someone making your move asks for help." |
| Few goals met | Plain "1 of 3 done this week"; no warnings or red |
| Guide stops | Offer a rematch, with a handover note if the guide agrees |
| Landed mid-way | Celebrate quietly, close the rhythm, invite to guide later |
| Report | Pause the reported person from the pod pending human review |
| Serious distress in a post or goal note | Show the guide and pod a short list of professional support resources to pass on |
| CV unreadable | "We couldn't read this file. You can fill in your details instead." |
| Gemini fails | Use the fallbacks in section 7; never block the flow |
| Offline or save fails | "Not saved. Check your connection and try again." Keep the user's input |

---

## 11. Privacy and safety

- Contact details, full names and emails are hidden from guides and pods unless the user turns sharing on.
- CVs are stored in a private bucket, readable only by the owner and the server.
- Data export (JSON) and account deletion from settings, deleting CVs, stories and posts.
- A short, plain privacy page: what's collected, why, who sees it, and that personal data is never sold. Follow India's data protection law.
- Rate-limit sign-ups, requests and posts. Verify guides' email and LinkedIn URL before they can receive requests (manual approval by an admin in version 1).

---

## 12. Not in this build

No WhatsApp or outside chat; no feeds of strangers, forums or messages inbox; no in-app video calling; no payments; no job listings or employer access; no AI chat assistant or AI-written messages; no match scores, streaks or leaderboards; no presence indicators; no photos.

---

## 13. Seed data and launch readiness

- Production starts with **no fake people or numbers**. Real guides are added through `/become-a-guide` and approved by an admin.
- For local development only, a seed script (behind `SEED_DEMO=true`) creates 12 fictional guides across three moves (sales to product, engineering to product, corporate roles to design) and two forming pods.
- A minimal admin page (`/admin`, admin role only) to approve guides and review reports.

---

## 14. Quality bar before going public

- Every screen works at 360 px and 1280 px, in light and dark mode.
- Text contrast at least 4.5 to 1; visible labels and focus states; keyboard navigation; reduced-motion support.
- First page load under 2 seconds on a typical 4G phone.
- Walk through the full journey end to end: sign up, story, confirm, choose guide, guide accepts (log in as the guide), pod forms, rhythm set, goals set and updated, slip prompt appears after simulated time, wrap-up.
- No placeholder text, broken images, preview toggles or invented numbers anywhere.
