# Antigravity Task: Bugfixes & Demo Flow Upgrades

Please apply the following exact modifications across the repository, verify with `npm run lint` and `npm run build`, and push the commit to `main`.

---

## 1. `server.ts`

### Changes:
- Use type-only import for `Request` and `Response` from `express` to resolve Node 24 CommonJS runtime named-export errors.
- Import `fs` and update `startServer()` so production static assets in `dist/` are automatically detected and served regardless of `NODE_ENV`.

### Code Replacement:

At the top of `server.ts`:
```ts
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
```

In `startServer()` near the bottom of `server.ts`:
```ts
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const indexHtml = path.resolve(distPath, 'index.html');
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.RENDER === 'true' ||
    fs.existsSync(indexHtml);

  if (isProduction && fs.existsSync(indexHtml)) {
    app.use(express.static(distPath));
    app.use((req: Request, res: Response, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(indexHtml);
      }
      next();
    });
  } else {
    // Dynamic import vite server for development middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`People Like Me server running at http://0.0.0.0:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}
```

---

## 2. `src/index.css`

### Changes:
- Add `@custom-variant dark (&:where(.dark, .dark *));` to enable Tailwind v4 class-based dark mode toggling.
- Enforce `cursor: pointer !important;` across all buttons, links, and triggers.

### Code Replacement:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-sans: 'Instrument Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

And in the interactive elements rule:
```css
/* Ensure all interactive buttons, links, and triggers display pointer cursor */
button,
a,
[role="button"],
input[type="button"],
input[type="submit"],
input[type="checkbox"],
input[type="radio"],
select,
label[for] {
  cursor: pointer !important;
}
```

---

## 3. `src/context/AppContext.tsx`

### Changes:
1. Update `AppContextType` interface:
```ts
sendGuideRequest: (guideId: string, note: string, matchReason: string, autoAccept?: boolean) => void;
```

2. Update `sendGuideRequest`, `acceptGuideRequest`, and `simulate48HourExpiry`:
```ts
  // Send guide request (with automatic demo acceptance)
  const sendGuideRequest = (guideId: string, note: string, matchReason: string, autoAccept: boolean = true) => {
    if (!currentUser) return;
    const now = new Date();
    const respondBy = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

    const newRequest: GuideRequest = {
      id: `req-${Date.now()}`,
      switcher_id: currentUser.id,
      guide_id: guideId,
      note,
      status: autoAccept ? 'accepted' : 'pending',
      sent_at: now.toISOString(),
      respond_by: respondBy,
      match_reason: matchReason,
    };

    setGuideRequests((prev) => [newRequest, ...prev]);

    if (autoAccept) {
      const matchedGuide = guidesList.find((g) => g.profile.id === guideId) || guidesList[0];

      setGuidesList((prev) =>
        prev.map((g) =>
          g.profile.id === guideId
            ? { ...g, active_switchers_count: g.active_switchers_count + 1 }
            : g
        )
      );

      const newRhythm: Rhythm = {
        id: `rhythm-${Date.now()}`,
        switcher_id: currentUser.id,
        guide_id: guideId,
        pod_id: 'pod-pm-forming',
        start_date: new Date().toISOString().split('T')[0],
        week: 1,
        status: 'active',
        guide_slot: 'Wednesdays 6:30 PM (6:00 PM – 8:00 PM)',
      };
      setCurrentRhythm(newRhythm);

      const guideSession: Session = {
        id: `sess-guide-${Date.now()}`,
        rhythm_id: newRhythm.id,
        pod_id: null,
        kind: 'guide',
        starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration_min: 30,
        video_url: generateJitsiUrl('guide', Date.now().toString()),
        agenda: 'Kickoff: Understand move timeline and first week priorities',
        held: null,
        title: `Guide conversation with ${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`,
        with_name: `${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`,
      };
      setSessions((prev) => [guideSession, ...prev]);
    }
  };

  // Guide accepts request
  const acceptGuideRequest = (requestId: string) => {
    let guideId = requestId;
    const req = guideRequests.find((r) => r.id === requestId);
    if (req) {
      guideId = req.guide_id;
    }

    setGuideRequests((prev) =>
      prev.map((r) => (r.id === requestId || r.guide_id === guideId ? { ...r, status: 'accepted' as const } : r))
    );

    const matchedGuide = guidesList.find((g) => g.profile.id === guideId) || guidesList[0];

    setGuidesList((prev) =>
      prev.map((g) =>
        g.profile.id === matchedGuide.profile.id
          ? { ...g, active_switchers_count: g.active_switchers_count + 1 }
          : g
      )
    );

    const newRhythm: Rhythm = {
      id: `rhythm-${Date.now()}`,
      switcher_id: currentUser?.id || 'user-bharat-k',
      guide_id: matchedGuide.profile.id,
      pod_id: 'pod-pm-forming',
      start_date: new Date().toISOString().split('T')[0],
      week: 1,
      status: 'active',
      guide_slot: 'Wednesdays 6:30 PM (6:00 PM – 8:00 PM)',
    };
    setCurrentRhythm(newRhythm);

    const guideSession: Session = {
      id: `sess-guide-${Date.now()}`,
      rhythm_id: newRhythm.id,
      pod_id: null,
      kind: 'guide',
      starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 30,
      video_url: generateJitsiUrl('guide', Date.now().toString()),
      agenda: 'Kickoff: Understand move timeline and first week priorities',
      held: null,
      title: `Guide conversation with ${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`,
      with_name: `${matchedGuide.profile.first_name} ${matchedGuide.profile.last_initial}`,
    };
    setSessions((prev) => [guideSession, ...prev]);
  };

  // 48-Hour Expiry Simulation
  const simulate48HourExpiry = () => {
    setRematchOffered(true);
    setRematchReasonNote("Your previous guide request reached the 48-hour response limit. We've automatically refreshed your alternative guide matches so you can keep moving forward.");
    setGuideRequests((prev) =>
      prev.map((r) => ({ ...r, status: 'expired' as const }))
    );
  };
```

---

## 4. `src/pages/GuideDetail.tsx`

### Changes:
- Fall back to the first available guide if the route ID doesn't match so it never throws "Guide not found".
- Set `autoAccept: true` on submit so demo testing connects immediately.

```tsx
  const guideItem =
    guidesList.find((g) => g.profile.id === id || g.move_profile.user_id === id) ||
    guidesList[0];

  const { profile: guide, move_profile: moveProf } = guideItem;
  const moveLine = formatMoveLine(moveProf.from_role, moveProf.to_role, moveProf.went_back);

  const [note, setNote] = useState(() =>
    `Hi ${guide.first_name}, I saw that you transitioned from ${moveProf.from_role} to ${moveProf.to_role}. I am currently navigating a similar move and would love your guidance on prioritizing my weekly learning and navigating the transition.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendGuideRequest(guide.id, note, `Shared transition background in ${moveProf.to_role}.`, true);
    navigate('/request-sent');
  };
```

---

## 5. `src/pages/Guides.tsx`

### Changes:
- Import `sendGuideRequest` from `useApp()`.
- Add direct **"Connect with [Guide]"** primary button alongside the secondary **"View full story & details"** button on each guide card.

```tsx
  const { guideCandidates, rematchOffered, rematchReasonNote, sendGuideRequest } = useApp();
```

And in the guide card footer:
```tsx
  {/* Actions: Direct Connect & View Story */}
  <div className="pt-4 mt-3 border-t border-[#D3DDD8] dark:border-[#2A403C] space-y-2">
    <button
      type="button"
      onClick={() => {
        sendGuideRequest(
          guide.id,
          `Hi ${guide.first_name}, I saw your transition path and would love to connect for guidance during my move.`,
          candidate.match_reason,
          true
        );
        navigate('/request-sent');
      }}
      className="w-full py-2.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-semibold transition-colors text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
    >
      <span>Connect with {guide.first_name}</span>
      <ArrowRight className="w-3.5 h-3.5" />
    </button>
    <button
      type="button"
      onClick={() => navigate(`/guides/${guide.id}`)}
      className="w-full py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] transition-colors text-center cursor-pointer"
    >
      View full story & details
    </button>
  </div>
```

---

## 6. `src/pages/RequestSent.tsx`

### Changes:
- Update main card to display confirmed acceptance with green badge: `Accepted by Guide (Demo Mode)`.
- Replace simulate button with primary action: `Continue to Pod Intro & Sprint Rhythm →`.

```tsx
          <div className="w-12 h-12 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accepted by Guide (Demo Mode)</span>
            </div>
            <h1 className="font-heading text-2xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              {targetGuide.profile.first_name} accepted your request!
            </h1>
            <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
              Your 1:1 mentorship connection is confirmed. You are now being placed into your career pod to coordinate weekly rhythm and goals.
            </p>
          </div>

          {/* Connection summary card */}
          <div className="p-4 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C] text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="uppercase text-[#55665F] dark:text-[#A6B8B0]">Mentorship Status</span>
              <span className="text-[#2F7D5B] dark:text-[#5FBF8F] font-medium">✓ Active Connection</span>
            </div>

            <div className="text-xs text-[#55665F] dark:text-[#A6B8B0] space-y-1">
              <p>• <strong>Weekly 1:1:</strong> 30 minutes every Wednesday with {targetGuide.profile.first_name}.</p>
              <p>• <strong>Pod:</strong> 4 switchers making the same transition for peer accountability.</p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C] space-y-3">
            <button
              type="button"
              onClick={handleSimulateAccept}
              className="w-full py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>Continue to Pod Intro & Sprint Rhythm →</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSimulateTimeout}
              className="w-full py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Test: Simulate 48h Timeout & Rematch</span>
            </button>
          </div>
```

---

## 7. `src/components/WalkthroughToolbar.tsx`

### Changes:
- Remove "Simulate Slip" button.
- Make "Simulate 48h Rematch" navigate directly to `/guides` so the rematch banner is instantly displayed.
- Add `cursor-pointer` to theme toggle and collapse buttons.

```tsx
              {/* Simulation triggers */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    simulate48HourExpiry();
                    navigate('/guides');
                  }}
                  className="px-2.5 py-1 rounded bg-[#0B1D20] hover:bg-[#193d43] border border-[#2A403C] text-[11px] flex items-center gap-1 text-[#E58C73] hover:text-white transition-colors cursor-pointer"
                  title="Simulate 48-Hour guide expiration to see automatic rematch state"
                >
                  <Clock className="w-3 h-3" />
                  <span>Simulate 48h Rematch</span>
                </button>

                <button
                  type="button"
                  onClick={simulateWeekAdvance}
                  className="px-2.5 py-1 rounded bg-[#0B1D20] hover:bg-[#193d43] border border-[#2A403C] text-[11px] flex items-center gap-1 text-[#5FBF8F] hover:text-white transition-colors cursor-pointer"
                  title="Advance current sprint by 1 week"
                >
                  <FastForward className="w-3 h-3" />
                  <span>+1 Wk</span>
                </button>

                <button
                  type="button"
                  onClick={resetAllData}
                  className="p-1.5 rounded bg-[#0B1D20] hover:bg-[#193d43] border border-[#2A403C] text-[#A6B8B0] hover:text-white transition-colors cursor-pointer"
                  title="Reset demo data"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
```
