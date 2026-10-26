import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { OnboardingProgressBar } from '../../components/OnboardingProgressBar';
import { transcribeVoiceAudio } from '../../lib/gemini';
import { Mic, MicOff, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface PromptConfig {
  key: string;
  title: string;
  helper: string;
  placeholder: string;
}

const PROMPTS: PromptConfig[] = [
  {
    key: 'coming_from',
    title: "1. Where you're coming from",
    helper: 'Your current or recent role, industry, and day-to-day focus.',
    placeholder: 'e.g. 5 years in B2B SaaS Sales and enterprise account management.',
  },
  {
    key: 'going_to',
    title: '2. Where you want to go',
    helper: 'The target role or field you want to move into.',
    placeholder: 'e.g. Product Manager at a growth-stage software company.',
  },
  {
    key: 'pushing_change',
    title: "3. What's pushing you to change",
    helper: 'What spark, frustration, or realization made you decide to make this move?',
    placeholder:
      'e.g. I realized I loved diagnosing customer workflow problems and shaping product specs with engineers.',
  },
  {
    key: 'tried_so_far',
    title: "4. What you've tried",
    helper: 'Courses, CV rewrites, informational coffees, side projects, or applications.',
    placeholder:
      'e.g. Rewrote my CV, completed a product teardown, and spoke with two PMs at my company.',
  },
  {
    key: 'holding_back',
    title: "5. What's holding you back",
    helper: 'Where do you feel stuck or unsure right now?',
    placeholder:
      'e.g. Positioning my sales background for PM interviews without an official prior PM title.',
  },
];

export const Story: React.FC = () => {
  const { storyAnswers, saveStoryAnswer } = useApp();
  const navigate = useNavigate();

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

  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    PROMPTS.forEach((p) => {
      map[p.key] = storyAnswers[p.key]?.answer || '';
    });
    return map;
  });

  const handleTextChange = (key: string, val: string) => {
    setLocalAnswers((prev) => ({ ...prev, [key]: val }));
    saveStoryAnswer(key, val, 'text');
  };

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = async (promptKey: string) => {
    try {
      setVoiceError(null);
      setActiveVoicePrompt(promptKey);
      setIsRecording(true);
      setRecordedSuccessKey(null);

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const initialText = localAnswers[promptKey] ? `${localAnswers[promptKey].trim()} ` : '';

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
            setLocalAnswers((prev) => ({ ...prev, [promptKey]: updated }));
            saveStoryAnswer(promptKey, updated, 'voice');
          };

          recognition.start();
        } catch (e) {
          console.warn('Could not start native SpeechRecognition:', e);
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

        const currentAns = localAnswers[promptKey];
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
                setLocalAnswers((prev) => ({ ...prev, [promptKey]: combined }));
                saveStoryAnswer(promptKey, combined, 'voice');
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
    } catch (err) {
      setIsRecording(false);
      setActiveVoicePrompt(null);
      setVoiceError(
        'Microphone access was unavailable. You can type your answer directly into the box below.'
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
    Object.entries(localAnswers).forEach(([k, v]) => {
      if (v.trim()) {
        saveStoryAnswer(k, v.trim(), 'text');
      }
    });
    navigate('/onboarding/background');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <OnboardingProgressBar step={1} label="Your story" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              Your story
            </h1>
            <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
              Five optional prompts. Answer by text or voice, any length, or skip for now.
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

        {/* Story Prompts List */}
        <div className="space-y-5">
          {PROMPTS.map((prompt) => {
            const isThisPromptRecording = activeVoicePrompt === prompt.key && isRecording;
            const isThisPromptTranscribing = transcribingKey === prompt.key;
            const hasSuccessFeedback = recordedSuccessKey === prompt.key;

            return (
              <div
                key={prompt.key}
                className={`bg-[#FFFFFF] dark:bg-[#0E1E1D] border rounded-2xl p-5 space-y-3 shadow-xs transition-colors ${
                  isThisPromptRecording
                    ? 'border-[#F2B134] ring-2 ring-[#F2B134]/20'
                    : 'border-[#D3DDD8] dark:border-[#2A403C]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <label
                      htmlFor={`prompt-${prompt.key}`}
                      className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] block"
                    >
                      {prompt.title}
                    </label>
                    <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                      {prompt.helper}
                    </p>
                  </div>

                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isThisPromptRecording) {
                        stopRecording();
                      } else {
                        startRecording(prompt.key);
                      }
                    }}
                    disabled={isThisPromptTranscribing}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isThisPromptRecording
                        ? 'bg-[#A8432C] text-white animate-pulse shadow-xs'
                        : isThisPromptTranscribing
                        ? 'bg-[#F1F5F2] text-[#55665F] dark:bg-[#122523]'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA]'
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

                {isThisPromptRecording && (
                  <div className="p-2.5 rounded-xl bg-[#F2B134]/15 border border-[#F2B134]/40 flex items-center gap-2 text-xs text-[#8A5A00] dark:text-[#F2B134]">
                    <span className="w-2 h-2 rounded-full bg-[#A8432C] animate-ping" />
                    <span className="font-medium">
                      Listening & transcribing live ({formatTimer(recordingSeconds)})...
                    </span>
                  </div>
                )}

                {hasSuccessFeedback && !isThisPromptRecording && (
                  <div className="p-2.5 rounded-xl bg-[#2F7D5B]/10 border border-[#2F7D5B]/30 flex items-center gap-2 text-xs text-[#2F7D5B] dark:text-[#5FBF8F]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Voice answer transcribed. Feel free to edit any words below.</span>
                  </div>
                )}

                <textarea
                  id={`prompt-${prompt.key}`}
                  value={localAnswers[prompt.key]}
                  onChange={(e) => handleTextChange(prompt.key, e.target.value)}
                  placeholder={prompt.placeholder}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] placeholder:text-[#55665F]/60 text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-y transition-colors"
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/onboarding/objective')}
              className="px-4 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const sample = {
                  coming_from: 'B2B Sales Lead in consumer goods & SaaS',
                  going_to: 'Product Manager',
                  pushing_change:
                    'Constantly addressing product friction for customers and wanting to own the roadmap directly.',
                  tried_so_far:
                    'Rewrote my CV, completed a product metrics course, and shadowed two PM discovery calls.',
                  holding_back:
                    'Breaking through resume screens without a prior official PM job title.',
                };
                setLocalAnswers(sample);
                Object.entries(sample).forEach(([k, v]) => saveStoryAnswer(k, v, 'text'));
              }}
              className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline cursor-pointer"
            >
              Pre-fill example answers
            </button>
          </div>

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
              className="px-6 py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
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
