# People Like Me — Don't switch careers alone

**The go-to place for a career change in any field.**

People Like Me matches a **career changer** one-on-one with an approved **Career Guide** who made that exact career transition 1–5 years ago for a structured **four-week pilot**.

---

## Guide-First 4-Week Pilot Highlights

1. **Terminology & Positioning**:
   - Uses **career changer** and **Career Guide** across the product, prompts, notifications, and database.
   - Vision on the landing page: *"The go-to place for a career change in any field"*, starting with admin-managed pilot moves (`Sales to Product`, `Developer to Product`, `Operations to Product`, `Operations to Business Analyst`).
2. **Feature Flag `PODS_ENABLED` (Default: `false`)**:
   - Peer pods are gated behind `PODS_ENABLED` / `VITE_PODS_ENABLED` (default `false`) for Phase 1 so career changers go from sign-up to Week 1–4 in a focused 1:1 Career Guide experience without any pod references.
   - Setting `VITE_PODS_ENABLED=true` restores all Phase 2 peer pod functionality.
3. **4-Week Rhythm & 1 Weekly Call**:
   - Four weeks (`Week 1 of 4` to `Week 4 of 4`), one 30-minute 1:1 call every week with `.ics` calendar invite and encrypted Jitsi video room, reschedulable up to 2 hours before.
   - 3 to 5 personal milestones drafted around what the career changer has already tried.
   - 2 to 3 weekly goals (`Done`, `Partly`, `Not yet`) visible to the Career Guide.
4. **Career Guide Capacity (Max 2)**:
   - Each Career Guide supports at most **2 active career changers** at a time. Full guides are hidden from new match lists and display **Currently full** if opened directly.
5. **Pilot Moves & Waitlist**:
   - Career changers whose move matches an active pilot move proceed directly to matching.
   - Non-pilot moves are saved to the **Waitlist** (visible in Admin) with a clear message: *"We're starting with a few common moves. We'll let you know when we have Career Guides for yours."*
6. **Ratings, Call Attendance & Week 4 Month 2 Price Test**:
   - Career Guides confirm whether each weekly call was **Attended** or **Missed**.
   - Career changers rate each weekly call (`1 to 5`) and give an overall guide rating (`1 to 5`) in Week 4.
   - In Week 4, career changers see the **Month 2 Offer** (`"Keep going with your Career Guide for month 2"`), randomly and persistently assigned 50/50 to **₹499** or **₹699**, with a one-time **₹199** follow-up question if they select *"Not now"*.
7. **Admin Pilot Go/No-Go Dashboard (`/admin/pilot` & `/admin`)**:
   - Tracks all 5 cohort Go/No-Go measures (`x of y` with green Go badges), Rethink warning triggers, Month 2 price test split (`₹499`, `₹699`, `₹199`, and Admin `Mark as Paid`), editable thresholds, pilot moves, and waitlist.

---

## Running Locally

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```
