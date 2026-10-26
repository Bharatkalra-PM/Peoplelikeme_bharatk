import React from 'react';
import { Key, CheckCircle, ExternalLink, X, Shield, Sparkles, Database, Mail } from 'lucide-react';

interface ApiKeysInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeysInfoModal: React.FC<ApiKeysInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0E1E1D] text-[#13231F] dark:text-[#E6EEEA] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-keys-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Key className="w-4 h-4 text-[#F2B134]" />
            <span id="api-keys-title">APIs & Keys Overview</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#55665F] hover:text-[#13231F] dark:hover:text-[#E6EEEA]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] leading-relaxed">
          Here is a breakdown of all APIs and keys for <strong>People Like Me</strong>, what they do, and how to get them.
        </p>

        <div className="space-y-3 text-xs">
          {/* 1. Google Identity / Gmail ID */}
          <div className="p-3.5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google Sign-In / Gmail ID
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${googleClientId ? 'bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]' : 'bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134]'}`}>
                {googleClientId ? 'Client ID Configured' : 'Direct Gmail Enabled'}
              </span>
            </div>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              <strong>Env Variable:</strong> <code className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-1 py-0.5 rounded">VITE_GOOGLE_CLIENT_ID</code>
            </p>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              <strong>Where to get:</strong> In <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-[#2D6B8F] dark:text-[#7FB6D6] underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-2.5 h-2.5" /></a>, create an <em>OAuth 2.0 Client ID (Web Application)</em>. Add your app URL as an Authorized Origin.
            </p>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              <em>Note: You can already sign in immediately with any Gmail address using our built-in Gmail ID flow!</em>
            </p>
          </div>

          {/* 2. Gemini AI API */}
          <div className="p-3.5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F2B134]" />
                Gemini AI API
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Connected (Server)
              </span>
            </div>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              <strong>Env Variable:</strong> <code className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-1 py-0.5 rounded">GEMINI_API_KEY</code>
            </p>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              Used server-side via <code className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-1 py-0.5 rounded">@google/genai</code> for transcribing voice answers, drafting move profiles, and generating 1-sentence match reasons.
            </p>
          </div>

          {/* 3. Database & Auth (Supabase / Postgres) */}
          <div className="p-3.5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#2D6B8F]" />
                Supabase / Postgres
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2D6B8F]/10 text-[#2D6B8F] dark:text-[#7FB6D6]">
                Optional for Hosted DB
              </span>
            </div>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              <strong>Env Variables:</strong> <code className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-1 py-0.5 rounded">SUPABASE_URL</code>, <code className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-1 py-0.5 rounded">SUPABASE_ANON_KEY</code>
            </p>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              Full SQL migration with Row Level Security is already prepared in <code className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-1 py-0.5 rounded">supabase/migrations/001_initial_schema.sql</code>.
            </p>
          </div>

          {/* 4. Resend Email Service */}
          <div className="p-3.5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#55665F]" />
                Resend / SendGrid (Email Invites)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F2] dark:bg-[#122523] text-[#55665F]">
                Optional
              </span>
            </div>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              <strong>Env Variable:</strong> <code className="bg-[#FFFFFF] dark:bg-[#0E1E1D] px-1 py-0.5 rounded">RESEND_API_KEY</code>
            </p>
            <p className="text-[#55665F] dark:text-[#A6B8B0]">
              For sending emails with calendar invites. The app also generates and downloads .ics files directly in the browser without requiring email keys.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
