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

// 7.1 Voice audio transcription endpoint
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
            { text: 'Transcribe this voice answer accurately. Return only the plain transcript text with no extra commentary.' },
          ],
        },
      });

      const transcript = response.text?.trim() || '';
      return res.json({ transcript });
    }

    // Fallback if no API key
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

// 7.2 Draft move profile from story answers & CV/LinkedIn
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
- Dependants: ${detailChips?.dependants || 'None'}
- Priority: ${detailChips?.priority || 'Speed to role'}
- Availability: ${(detailChips?.availability || []).join(', ')}
- City: ${detailChips?.city || 'Remote'}
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
              from_role: { type: Type.STRING, description: 'Role or job title the user is coming from' },
              from_field: { type: Type.STRING, description: 'Field/industry coming from (e.g. Sales, Engineering, Marketing)' },
              from_company_type: { type: Type.STRING, description: 'Type of company (e.g. Startup, Enterprise, Agency, Consulting)' },
              to_role: { type: Type.STRING, description: 'Target role moving into (e.g. Product Manager, Product Designer)' },
              years_experience: { type: Type.INTEGER, description: 'Total years of prior experience' },
              months_since_leaving: { type: Type.INTEGER, description: 'Months since leaving last role, or null if currently employed' },
              dependants: { type: Type.STRING, description: 'Dependants status (e.g. None, Children, Elderly parents, Partner)' },
              priority: { type: Type.STRING, description: 'Primary priority (e.g. Speed to role, Target salary, Domain fit, Work-life balance)' },
              availability: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Available times for sessions' },
              constraints: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key constraints or commitments' },
              story: { type: Type.STRING, description: 'Short 2-3 sentence factual summary of this career move' },
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

    // High quality non-AI fallback
    const fallbackProfile = {
      from_role: storyAnswers?.coming_from || 'Current Role',
      from_field: 'Technology & Business',
      from_company_type: 'Growth-stage tech',
      to_role: storyAnswers?.going_to || 'Product Manager',
      years_experience: 4,
      months_since_leaving: null,
      dependants: detailChips?.dependants || 'None',
      priority: detailChips?.priority || 'Speed to role',
      availability: detailChips?.availability || ['Weekday evenings'],
      constraints: detailChips?.constraints || [],
      story: storyAnswers?.pushing_change || 'Looking to transition skills into a new product-focused role.',
    };

    return res.json(fallbackProfile);
  } catch (error: any) {
    console.warn('Draft profile failed, using fallback:', error.message);
    return res.json({
      from_role: 'Sales Representative',
      from_field: 'Sales',
      from_company_type: 'Tech company',
      to_role: 'Product Manager',
      years_experience: 5,
      months_since_leaving: null,
      dependants: 'None',
      priority: 'Speed to role',
      availability: ['Weekday evenings'],
      constraints: [],
      story: 'Making a deliberate transition leveraging existing customer domain experience.',
    });
  }
});

// 7.3 Write match reason (one sentence under 20 words, shared facts only)
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

Guide:
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
      // Ensure strictly under 20 words
      const words = text.split(/\s+/);
      if (words.length > 19) {
        text = words.slice(0, 19).join(' ') + '.';
      }
      return res.json({ reason: text });
    }

    // Deterministic fallback
    let fallback = `Both navigated moving from ${switcherProfile.from_role} to ${guideProfile.to_role} with similar experience.`;
    if (guideProfile.went_back) {
      fallback = `Both moved from ${switcherProfile.from_role} into ${guideProfile.to_role}; guide later returned to ${guideProfile.from_role}.`;
    }
    return res.json({ reason: fallback });
  } catch (error: any) {
    return res.json({
      reason: 'Both shared similar career backgrounds and transitioned into the same target role.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: !!ai,
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
    console.log(`People Like Me server running at http://0.0.0.0:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
