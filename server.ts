import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI SDK safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Config endpoint (exposes DEMO_MODE safely, default false)
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    demoMode: process.env.DEMO_MODE === 'true' || process.env.VITE_DEMO_MODE === 'true',
    aiConfigured: !!ai,
  });
});

// 1. Voice audio transcription endpoint
app.post('/api/gemini/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    if (ai) {
      const audioPart = {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            audioPart,
            {
              text: 'Transcribe this voice answer accurately. Return only the plain transcript text with no extra commentary.',
            },
          ],
        },
      });

      const transcript = response.text?.trim() || '';
      return res.json({ transcript });
    }

    return res.json({
      transcript: 'Voice input received (audio captured). Edit or refine this text as needed.',
    });
  } catch (error: any) {
    console.warn('Transcription error, falling back:', error.message);
    return res.json({
      transcript: 'Voice input received. Please review and edit your response.',
      fallback: true,
    });
  }
});

// 2. Draft move profile from story answers & CV/LinkedIn
app.post('/api/gemini/draft-profile', async (req: Request, res: Response) => {
  try {
    const { storyAnswers, cvText, linkedInText, detailChips } = req.body;

    const combinedInput = `
Story Answers:
- Coming from: ${storyAnswers?.coming_from || 'N/A'}
- Going to: ${storyAnswers?.going_to || 'N/A'}
- Pushing change: ${storyAnswers?.pushing_change || 'N/A'}
- Tried so far: ${storyAnswers?.tried_so_far || 'N/A'}
- Holding back: ${storyAnswers?.holding_back || 'N/A'}
- Additional story: ${storyAnswers?.story || 'N/A'}

CV/LinkedIn Text:
${cvText || linkedInText || 'None provided'}

User Selected Details:
- Current Role: ${detailChips?.from_role || ''}
- Industry: ${detailChips?.from_field || ''}
- Target Role: ${detailChips?.to_role || ''}
- Years Experience: ${detailChips?.years_experience ?? ''}
- Dependants: ${detailChips?.dependants || 'None'}
- Priority: ${detailChips?.priority || 'Speed to role'}
- Availability: ${(detailChips?.availability || []).join(', ')}
- City: ${detailChips?.city || 'Bengaluru'}
- Preferred Career Guide Gender: ${detailChips?.preferred_guide_gender || 'No preference'}
`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: combinedInput,
        config: {
          systemInstruction:
            'Extract a career move profile. Return only JSON matching the schema. Use only facts in the input. If unknown, use null or an empty list. Never invent employers, numbers or constraints.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              from_role: { type: Type.STRING },
              from_field: { type: Type.STRING },
              from_company_type: { type: Type.STRING },
              to_role: { type: Type.STRING },
              years_experience: { type: Type.INTEGER },
              months_since_leaving: { type: Type.INTEGER },
              dependants: { type: Type.STRING },
              priority: { type: Type.STRING },
              availability: { type: Type.ARRAY, items: { type: Type.STRING } },
              constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
              story: { type: Type.STRING },
            },
            required: ['from_role', 'to_role', 'years_experience'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    }

    const fallbackProfile = {
      from_role: detailChips?.from_role || storyAnswers?.coming_from || 'B2B Sales Lead',
      from_field: detailChips?.from_field || 'Sales & Operations',
      from_company_type: 'Growth-stage tech',
      to_role: detailChips?.to_role || storyAnswers?.going_to || 'Product Manager',
      years_experience: detailChips?.years_experience ?? 5,
      months_since_leaving: null,
      dependants: detailChips?.dependants || 'None',
      priority: detailChips?.priority || 'Speed to role',
      availability: detailChips?.availability || ['Weekday evenings (6:00 PM – 8:00 PM)'],
      constraints: detailChips?.constraints || [],
      story:
        storyAnswers?.pushing_change ||
        'Looking to transition skills into a new product-focused role.',
    };

    return res.json(fallbackProfile);
  } catch (error: any) {
    console.warn('Draft profile failed, using fallback:', error.message);
    return res.json({
      from_role: req.body?.detailChips?.from_role || 'Sales Lead',
      from_field: req.body?.detailChips?.from_field || 'Sales',
      from_company_type: 'Tech company',
      to_role: req.body?.detailChips?.to_role || 'Product Manager',
      years_experience: req.body?.detailChips?.years_experience ?? 5,
      months_since_leaving: null,
      dependants: req.body?.detailChips?.dependants || 'None',
      priority: req.body?.detailChips?.priority || 'Speed to role',
      availability: req.body?.detailChips?.availability || ['Weekday evenings (6:00 PM – 8:00 PM)'],
      constraints: req.body?.detailChips?.constraints || [],
      story: 'Making a deliberate transition leveraging existing domain experience.',
    });
  }
});

// 3. Write match reason (one sentence under 20 words, shared facts only)
app.post('/api/gemini/match-reason', async (req: Request, res: Response) => {
  try {
    const { switcherProfile, guideProfile } = req.body;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `
Switcher:
- From: ${switcherProfile.from_role} (${switcherProfile.from_field})
- To: ${switcherProfile.to_role}
- Experience: ${switcherProfile.years_experience} years
- Priority: ${switcherProfile.priority}
- Dependants: ${switcherProfile.dependants}

Career Guide:
- From: ${guideProfile.from_role} (${guideProfile.from_field})
- To: ${guideProfile.to_role}
- Experience: ${guideProfile.years_experience} years
- Priority: ${guideProfile.priority}
- Dependants: ${guideProfile.dependants}
- Went back to original field: ${guideProfile.went_back ? 'Yes' : 'No'}
`,
        config: {
          systemInstruction:
            'Write one plain sentence under 20 words about what these two moves have in common. Use only facts present in both profiles. If the guide went back after the move, say so. No praise, no promises.',
        },
      });

      let text = response.text?.trim() || '';
      const words = text.split(/\s+/);
      if (words.length > 19) {
        text = words.slice(0, 19).join(' ') + '.';
      }
      return res.json({ reason: text });
    }

    let fallback = `Both navigated moving from ${switcherProfile.from_role} to ${guideProfile.to_role} with similar experience.`;
    if (guideProfile.went_back) {
      fallback = `Both moved from ${switcherProfile.from_role} into ${guideProfile.to_role}; Career Guide later returned to ${guideProfile.from_role}.`;
    }
    return res.json({ reason: fallback });
  } catch (error: any) {
    return res.json({
      reason: 'Both shared similar career backgrounds and transitioned into the same target role.',
    });
  }
});

// 4. Draft 4 to 6 personal milestones across 8 weeks (skipping anything already done)
app.post('/api/gemini/draft-milestones', async (req: Request, res: Response) => {
  try {
    const { moveProfile, triedSoFar = '' } = req.body;
    const targetRole = moveProfile?.to_role || 'Product Manager';
    const fromRole = moveProfile?.from_role || 'Sales';

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `
User Profile:
- Moving from: ${fromRole} (${moveProfile?.from_field || ''})
- Moving to: ${targetRole}
- Years of experience: ${moveProfile?.years_experience || 5}
- Priority: ${moveProfile?.priority || 'Speed to role'}
- Already tried / completed: ${triedSoFar} ${(moveProfile?.already_done || []).join(', ')}
`,
        config: {
          systemInstruction:
            'Draft 5 personal career transition milestones placed across an 8-week plan (weeks 1, 2, 4, 6, 8). Skip anything the user has already done (for example, if the CV is already rewritten, do not include rewriting the CV). Return JSON array of objects with week (1-8), title, and description.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.INTEGER },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['week', 'title', 'description'],
            },
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return res.json({
            milestones: parsed.slice(0, 6).map((m: any, idx: number) => ({
              id: `ms-ai-${idx + 1}`,
              week: Math.min(8, Math.max(1, m.week || idx + 1)),
              title: m.title,
              description: m.description,
              completed: false,
            })),
          });
        }
      }
    }

    const combinedText = `${triedSoFar} ${(moveProfile?.already_done || []).join(' ')}`.toLowerCase();
    const cvDone =
      combinedText.includes('cv') ||
      combinedText.includes('resume');

    const fallbackMilestones = [
      {
        id: 'ms-1',
        week: 1,
        title: `Validate target ${targetRole} roles & map transferable strengths from ${fromRole}`,
        description: 'Align with your Career Guide on target company stages and role expectations.',
        completed: false,
      },
      cvDone
        ? {
            id: 'ms-2',
            week: 2,
            title: `Shortlist 15 high-fit companies hiring ${targetRole}s with domain overlap`,
            description: 'Focus outreach on teams where your prior industry context is an unfair advantage.',
            completed: false,
          }
        : {
            id: 'ms-2',
            week: 2,
            title: `Reframe CV & LinkedIn narrative for ${targetRole} hiring managers`,
            description: `Translate ${fromRole} achievements into ${targetRole} outcomes.`,
            completed: false,
          },
      {
        id: 'ms-3',
        week: 4,
        title: `Complete 2 practical ${targetRole} case studies / tear-downs`,
        description: 'Build tangible proof-of-work artifacts to share in warm outreach and interviews.',
        completed: false,
      },
      {
        id: 'ms-4',
        week: 6,
        title: 'Run 6 warm informational conversations & referral requests',
        description: 'Speak with hiring peers and alumni who transitioned from similar backgrounds.',
        completed: false,
      },
      {
        id: 'ms-5',
        week: 8,
        title: `Mock interviews & live ${targetRole} case drills with Career Guide`,
        description: 'Practice behavioural storytelling and structured problem solving.',
        completed: false,
      },
    ];

    return res.json({ milestones: fallbackMilestones });
  } catch (error: any) {
    return res.json({ milestones: [] });
  }
});

// 5. Verify Career Guide CV ("Move found": >= 2 years in earlier role, >= 1 year in current role)
app.post('/api/gemini/verify-guide-cv', async (req: Request, res: Response) => {
  try {
    const {
      cvText = '',
      fromRole = '',
      toRole = '',
      yearsInEarlierRole = 0,
      yearsInCurrentRole = 0,
    } = req.body;

    const mismatchFlags: string[] = [];
    if (yearsInEarlierRole < 2) {
      mismatchFlags.push(`Earlier role duration (${yearsInEarlierRole}y) is under the 2-year minimum.`);
    }
    if (yearsInCurrentRole < 1) {
      mismatchFlags.push(`Current role duration (${yearsInCurrentRole}y) is under the 1-year minimum.`);
    }
    if (cvText && fromRole && !cvText.toLowerCase().includes(fromRole.toLowerCase().split(' ')[0])) {
      mismatchFlags.push(`CV text does not clearly mention earlier role "${fromRole}".`);
    }

    const moveFound = yearsInEarlierRole >= 2 && yearsInCurrentRole >= 1 && mismatchFlags.length === 0;

    return res.json({
      move_found: moveFound,
      mismatch_flags: mismatchFlags,
    });
  } catch (error: any) {
    return res.json({
      move_found: true,
      mismatch_flags: [],
    });
  }
});

// Persistent User Database & Activity Log Store
const DB_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DB_DIR, 'user_records_db.json');

interface ServerDbStore {
  users: Record<string, any>;
  activity_logs: any[];
}

function loadServerDb(): ServerDbStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read DB file, initializing default:', err);
  }
  const now = new Date().toISOString();
  const initial: ServerDbStore = {
    users: {
      'bharatk6325@gmail.com': {
        user_id: 'user-bharat-k',
        full_name: 'Bharat K.',
        email: 'bharatk6325@gmail.com',
        role: 'switcher',
        city: 'Bengaluru',
        created_at: now,
        last_login_at: now,
        login_count: 3,
        onboarding_completed: true,
        from_role: 'B2B Sales Lead',
        to_role: 'Product Manager',
        from_field: 'Sales',
        years_experience: 5,
        priority: 'Speed to role',
        matched_guide: 'Arjun K.',
        goals_count: 3,
        latest_action: 'Active Week 1 Sprint with Career Guide Arjun K.',
        actions_history: [
          {
            timestamp: now,
            action: 'Signed In',
            details: 'Authenticated via email & password (bharatk6325@gmail.com)',
          },
          {
            timestamp: now,
            action: 'Connected with Career Guide',
            details: 'Matched and started Week 1 sprint with Arjun K. (B2B Sales → PM)',
          },
        ],
      },
      'varunk6325@gmail.com': {
        user_id: 'user-varun-k',
        full_name: 'Varun K.',
        email: 'varunk6325@gmail.com',
        role: 'switcher',
        city: 'Bengaluru',
        created_at: now,
        last_login_at: now,
        login_count: 1,
        onboarding_completed: false,
        from_role: '',
        to_role: '',
        from_field: '',
        years_experience: 3,
        priority: 'Speed to role',
        matched_guide: 'Not connected yet',
        goals_count: 0,
        latest_action: 'Account registered (Onboarding Step 2)',
        actions_history: [
          {
            timestamp: now,
            action: 'Account Created',
            details: 'Registered new switcher account (varunk6325@gmail.com)',
          },
        ],
      },
    },
    activity_logs: [
      {
        log_id: 'log-seed-1',
        timestamp: now,
        user_id: 'user-bharat-k',
        full_name: 'Bharat K.',
        email: 'bharatk6325@gmail.com',
        role: 'switcher',
        action: 'Signed In',
        details: 'Logged into active Week 1 dashboard (Matched with Arjun K.)',
      },
      {
        log_id: 'log-seed-2',
        timestamp: now,
        user_id: 'user-varun-k',
        full_name: 'Varun K.',
        email: 'varunk6325@gmail.com',
        role: 'switcher',
        action: 'Account Created',
        details: 'Created new switcher account',
      },
    ],
  };
  saveServerDb(initial);
  return initial;
}

function saveServerDb(store: ServerDbStore) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist DB file:', err);
  }
}

const serverDb = loadServerDb();

app.get('/api/db/records', (_req: Request, res: Response) => {
  const usersArray = Object.values(serverDb.users).sort(
    (a: any, b: any) =>
      new Date(b.last_login_at || 0).getTime() - new Date(a.last_login_at || 0).getTime()
  );
  res.json({
    database: 'people_like_me_prod',
    updated_at: new Date().toISOString(),
    users: usersArray,
    activity_logs: serverDb.activity_logs.slice(0, 200),
  });
});

app.post('/api/db/sync', (req: Request, res: Response) => {
  try {
    const {
      user_id,
      full_name,
      email,
      role = 'switcher',
      city = 'Bengaluru',
      onboarding_completed = false,
      from_role = '',
      to_role = '',
      from_field = '',
      years_experience = 3,
      priority = 'Speed to role',
      matched_guide = 'Not connected yet',
      goals_count = 0,
      action = 'Updated Activity',
      details = '',
      increment_login = false,
      raw_state,
    } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const now = new Date().toISOString();
    const existing = serverDb.users[cleanEmail];

    const actionEntry = {
      timestamp: now,
      action,
      details: details || action,
    };

    const updatedRecord = {
      user_id: user_id || existing?.user_id || `user-${Date.now()}`,
      full_name: full_name || existing?.full_name || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: role || existing?.role || 'switcher',
      city: city || existing?.city || 'Bengaluru',
      created_at: existing?.created_at || now,
      last_login_at: increment_login ? now : existing?.last_login_at || now,
      login_count: existing
        ? (existing.login_count || 1) + (increment_login ? 1 : 0)
        : 1,
      onboarding_completed:
        onboarding_completed ?? existing?.onboarding_completed ?? false,
      from_role: from_role || existing?.from_role || '',
      to_role: to_role || existing?.to_role || '',
      from_field: from_field || existing?.from_field || '',
      years_experience: years_experience ?? existing?.years_experience ?? 3,
      priority: priority || existing?.priority || 'Speed to role',
      matched_guide:
        matched_guide && matched_guide !== 'Not connected yet'
          ? matched_guide
          : existing?.matched_guide || 'Not connected yet',
      goals_count: goals_count || existing?.goals_count || 0,
      latest_action: `${action}${details ? ` — ${details}` : ''}`,
      actions_history: [
        actionEntry,
        ...(existing?.actions_history || []).slice(0, 49),
      ],
      raw_state: raw_state || existing?.raw_state,
    };

    serverDb.users[cleanEmail] = updatedRecord;

    const logItem = {
      log_id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      user_id: updatedRecord.user_id,
      full_name: updatedRecord.full_name,
      email: cleanEmail,
      role: updatedRecord.role,
      action,
      details: details || action,
    };
    serverDb.activity_logs = [logItem, ...serverDb.activity_logs.slice(0, 299)];

    saveServerDb(serverDb);
    return res.json({ ok: true, record: updatedRecord });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: !!ai,
    demoMode: process.env.DEMO_MODE === 'true',
    timestamp: new Date().toISOString(),
  });
});

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
    console.log(
      `People Like Me server running at http://0.0.0.0:${PORT} (mode: ${
        isProduction ? 'production' : 'development'
      })`
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
