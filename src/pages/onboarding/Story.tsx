import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { OnboardingProgressBar } from '../../components/OnboardingProgressBar';
import { transcribeVoiceAudio } from '../../lib/gemini';
import {
  Mic,
  MicOff,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  Check,
} from 'lucide-react';

interface MergedPromptConfig {
  key: 'where_from_to' | 'pushing_and_holding' | 'tried_so_far';
  title: string;
  helper: string;
  groups: {
    groupKey: string;
    label: string;
    options: string[];
  }[];
  placeholder: string;
}

const MERGED_PROMPTS: MergedPromptConfig[] = [
  {
    key: 'where_from_to',
    title: '1. Where are you coming from, and where do you want to go?',
    helper: 'Tap what fits best first, then add any extra detail below if you like.',
    groups: [
      {
        groupKey: 'coming_from_chips',
        label: 'Coming from',
        options: [
          'B2B Sales Lead',
          'Operations & Delivery',
          'Customer Success',
          'Software Engineering',
          'Marketing & Growth',
          'Finance & Consulting',
        ],
      },
      {
        groupKey: 'going_to_chips',
        label: 'Moving into',
        options: [
          'Product Manager',
          'Product Designer',
          'Growth & Strategy',
          'Data & AI Product',
          'Engineering Management',
        ],
      },
    ],
    placeholder:
      'Example: 5 years in B2B SaaS Sales closing enterprise deals, now moving into Product Management at a growth-stage tech company.',
  },
  {
    key: 'pushing_and_holding',
    title: "2. What's pushing you to change, and what's holding you back?",
    helper: 'Select one or more reasons pushing your move and any hurdles you face.',
    groups: [
      {
        groupKey: 'pushing_chips',
        label: 'Pushing me to change',
        options: [
          'Want more growth',
          'Want better pay',
          'Want more meaning',
          "Environment didn't suit me",
        ],
      },
      {
        groupKey: 'holding_chips',
        label: 'Holding me back',
        options: [
          "Don't know where to start",
          'Worried about a pay cut',
          'No time alongside my job',
          'Lack of confidence',
        ],
      },
    ],
    placeholder:
      'Example: I love diagnosing customer workflow problems with engineers, but I am unsure how to frame my sales metrics for PM interviews.',
  },
  {
    key: 'tried_so_far',
    title: '3. What have you tried so far?',
    helper: "We'll skip anything you've already completed when drafting your 8-week plan.",
    groups: [
      {
        groupKey: 'tried_chips',
        label: 'Steps already taken',
        options: [
          'Rewrote my CV',
          'Updated LinkedIn',
          'Spoke to people in the role',
          'Completed a course or teardown',
          'Applied to roles already',
          'Just getting started',
        ],
      },
    ],
    placeholder:
      'Example: Rewrote my CV, completed two product teardowns, and spoke with two PMs at my company.',
  },
];

export const Story: React.FC = () => {
  const { storyAnswers, saveStoryAnswer, setDetailChips } = useApp();
  const navigate = useNavigate();

  const [selectedChips, setSelectedChips] = useState<Record<string, string[]>>({
    coming_from_chips: [],
    going_to_chips: [],
    pushing_chips: [],
    holding_chips: [],
    tried_chips: [],
  });

  const [localNotes, setLocalNotes] = useState<Record<string, string>>({
    where_from_to: storyAnswers.coming_from?.answer || '',
    pushing_and_holding: storyAnswers.pushing_change?.answer || '',
    tried_so_far: storyAnswers.tried_so_far?.answer || '',
  });

  const [activeVoicePrompt, setActiveVoicePrompt] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcribingKey, setTranscribingKey] = useState<string | null>(null);
  const [recordedSuccessKey, setRecordedSuccessKey] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const toggleChip = (groupKey: string, option: string) => {
    setSelectedChips((prev) => {
      const current = prev[groupKey] || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [groupKey]: updated };
    });
  };

  const syncMergedAnswersToContext = () => {
    const fromRoleChip = selectedChips.coming_from_chips[0] || '';
    const toRoleChip = selectedChips.going_to_chips[0] || '';
    const fromToText = [
      selectedChips.coming_from_chips.length
        ? `Coming from: ${selectedChips.coming_from_chips.join(', ')}`
        : '',
      selectedChips.going_to_chips.length
        ? `Moving to: ${selectedChips.going_to_chips.join(', ')}`
        : '',
      localNotes.where_from_to.trim(),
    ]
      .filter(Boolean)
      .join('. ');

    const pushingText = [
      selectedChips.pushing_chips.length
        ? `Pushing change: ${selectedChips.pushing_chips.join(', ')}`
        : '',
      localNotes.pushing_and_holding.trim(),
    ]
      .filter(Boolean)
      .join('. ');

    const holdingText = selectedChips.holding_chips.length
      ? `Holding back: ${selectedChips.holding_chips.join(', ')}`
      : localNotes.pushing_and_holding.trim();

    const triedText = [
      selectedChips.tried_chips.join(', '),
      localNotes.tried_so_far.trim(),
    ]
      .filter(Boolean)
      .join('. ');

    if (fromRoleChip || localNotes.where_from_to.trim()) {
      saveStoryAnswer('coming_from', fromRoleChip || localNotes.where_from_to.trim(), 'text');
    }
    if (toRoleChip) {
      saveStoryAnswer('going_to', toRoleChip, 'text');
    }
    if (fromToText) {
      saveStoryAnswer('story', fromToText, 'text');
    }
    if (pushingText) {
      saveStoryAnswer('pushing_change', pushingText, 'text');
    }
    if (holdingText) {
      saveStoryAnswer('holding_back', holdingText, 'text');
    }
    if (triedText) {
      saveStoryAnswer('tried_so_far', triedText, 'text');
    }

    if (fromRoleChip || toRoleChip) {
      setDetailChips((prev) => ({
        ...prev,
        from_role: fromRoleChip || prev.from_role,
        from_field: fromRoleChip ? fromRoleChip.split(' ')[0] : prev.from_field,
        to_role: toRoleChip || prev.to_role,
      }));
    }
  };

  const startRecording = async (promptKey: string) => {
    try {
      setVoiceError(null);
      setActiveVoicePrompt(promptKey);
      setIsRecording(true);
      setRecordedSuccessKey(null);

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const initialText = localNotes[promptKey] ? `${localNotes[promptKey].trim()} ` : '';

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let sessionTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              sessionTranscript += event.results[i][0].transcript + ' ';
            }
            const updated = `${initialText}${sessionTranscript}`.trim();
            setLocalNotes((prev) => ({ ...prev, [promptKey]: updated }));
          };
          recognition.start();
        } catch {
          // fallback to MediaRecorder
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const currentAns = localNotes[promptKey];
        if (!currentAns || currentAns === initialText.trim()) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setTranscribingKey(promptKey);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = (reader.result as string)?.split(',')[1];
            if (base64Data) {
              const transcript = await transcribeVoiceAudio(base64Data);
              if (transcript) {
                const combined = `${initialText}${transcript}`.trim();
                setLocalNotes((prev) => ({ ...prev, [promptKey]: combined }));
              }
            }
            setTranscribingKey(null);
            setRecordedSuccessKey(promptKey);
          };
        } else {
          setRecordedSuccessKey(promptKey);
        }
        setActiveVoicePrompt(null);
      };

      mediaRecorder.start();
    } catch {
      setIsRecording(false);
      setActiveVoicePrompt(null);
      setVoiceError(
        'Microphone access was unavailable. You can tap options above or type below.'
      );
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleContinue = () => {
    syncMergedAnswersToContext();
    navigate('/onboarding/background');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <OnboardingProgressBar step={1} label="Your story" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>About 3 minutes • Tap options or add a note</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              Your story in 3 quick steps
            </h1>
            <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
              Tap the options that fit you best. You can add optional text or voice notes, or skip any question.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/onboarding/background')}
            className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
          >
            Skip for now
          </button>
        </div>

        {voiceError && (
          <div className="p-3.5 rounded-xl bg-[#A8432C]/10 border border-[#A8432C]/30 text-xs text-[#A8432C] dark:text-[#E58C73]">
            {voiceError}
          </div>
        )}

        {/* 3 Merged Prompts */}
        <div className="space-y-5">
          {MERGED_PROMPTS.map((prompt) => {
            const isThisPromptRecording = activeVoicePrompt === prompt.key && isRecording;
            const isThisPromptTranscribing = transcribingKey === prompt.key;
            const hasSuccessFeedback = recordedSuccessKey === prompt.key;

            return (
              <div
                key={prompt.key}
                data-testid={`story-prompt-${prompt.key}`}
                className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                      {prompt.title}
                    </h2>
                    <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                      {prompt.helper}
                    </p>
                  </div>

                  {/* Optional Voice Button */}
                  <button
                    type="button"
                    onClick={() =>
                      isThisPromptRecording
                        ? stopRecording()
                        : startRecording(prompt.key)
                    }
                    disabled={isThisPromptTranscribing}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isThisPromptRecording
                        ? 'bg-[#A8432C] text-white animate-pulse'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                    }`}
                  >
                    {isThisPromptTranscribing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Transcribing...</span>
                      </>
                    ) : isThisPromptRecording ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop ({formatTimer(recordingSeconds)})</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-[#F2B134]" />
                        <span>Voice</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Tap-to-select option groups */}
                <div className="space-y-3">
                  {prompt.groups.map((grp) => (
                    <div key={grp.groupKey} className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
                        {grp.label}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {grp.options.map((opt) => {
                          const isSelected = (selectedChips[grp.groupKey] || []).includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleChip(grp.groupKey, opt)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] shadow-2xs'
                                  : 'bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8] dark:border-[#2A403C] text-[#13231F] dark:text-[#E6EEEA] hover:border-[#F2B134]'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 shrink-0" />}
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {hasSuccessFeedback && !isThisPromptRecording && (
                  <div className="p-2.5 rounded-xl bg-[#2F7D5B]/10 border border-[#2F7D5B]/30 flex items-center gap-2 text-xs text-[#2F7D5B] dark:text-[#5FBF8F]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Voice note added below.</span>
                  </div>
                )}

                {/* Optional text input with example placeholder */}
                <div className="space-y-1 pt-1">
                  <label
                    htmlFor={`prompt-${prompt.key}`}
                    className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0]"
                  >
                    Optional details (text or voice)
                  </label>
                  <textarea
                    id={`prompt-${prompt.key}`}
                    value={localNotes[prompt.key] || ''}
                    onChange={(e) =>
                      setLocalNotes((prev) => ({ ...prev, [prompt.key]: e.target.value }))
                    }
                    placeholder={prompt.placeholder}
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] placeholder:text-[#55665F]/60 text-xs sm:text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-y"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <button
            type="button"
            onClick={() => navigate('/onboarding/objective')}
            className="px-4 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/onboarding/background')}
              className="px-4 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] cursor-pointer"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="px-6 py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>Next: Your background</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};