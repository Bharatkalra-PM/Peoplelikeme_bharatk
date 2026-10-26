import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandMark } from '../../components/BrandMark';
import { transcribeVoiceAudio } from '../../lib/gemini';
import { Mic, MicOff, ArrowRight, Loader2, CheckCircle2, Sparkles } from 'lucide-react';

interface PromptConfig {
  key: string;
  title: string;
  helper: string;
  placeholder: string;
}

const PROMPTS: PromptConfig[] = [
  {
    key: 'coming_from',
    title: '1. Where are you moving from, and where do you want to go?',
    helper: 'Your current or recent role, field, and the role you want to switch into.',
    placeholder: 'e.g. 6 years in Operations and Business Strategy; looking to transition into a Product Manager role in tech.',
  },
  {
    key: 'pushing_change',
    title: "2. What's pushing you to make this change now?",
    helper: 'What spark, frustration, or realization made you decide to move?',
    placeholder: "e.g. I realized I was constantly defining feature specs and workflows for our engineers. I want to own the product roadmap directly.",
  },
  {
    key: 'tried_so_far',
    title: '3. What have you tried so far?',
    helper: 'Courses, applications, coffees, side projects, or just started.',
    placeholder: 'e.g. Completed a product metrics course, attended 2 PM conferences, spoke with 3 product managers, but haven\'t converted interviews yet.',
  },
  {
    key: 'holding_back',
    title: "4. What feels like it's holding you back?",
    helper: 'Where do you feel stuck or unsure?',
    placeholder: 'e.g. Articulating cross-functional operational experience into PM language without an official prior PM title.',
  },
  {
    key: 'story',
    title: '5. Any personal context shaping this move?',
    helper: 'Optional: timeline, caregiving, location, or financial considerations.',
    placeholder: 'e.g. Based in Bengaluru, target salary parity within 15%, aiming to complete transition within 6 months.',
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Local answers state initialized from context
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

  // Timer effect for active recording
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

  // Start voice recording with LIVE parallel transcription
  const startRecording = async (promptKey: string) => {
    try {
      setActiveVoicePrompt(promptKey);
      setIsRecording(true);
      setRecordedSuccessKey(null);

      // 1. Initialize native Web Speech Recognition for real-time parallel transcription
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      let speechRecognitionActive = false;
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

          recognition.onerror = (err: any) => {
            console.warn('SpeechRecognition error:', err);
          };

          recognition.start();
          speechRecognitionActive = true;
        } catch (e) {
          console.warn('Could not start native SpeechRecognition:', e);
        }
      }

      // 2. Also record audio via MediaStream for backup transcription
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

        // If native speech recognition didn't yield text, call Gemini transcribe as fallback
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
      console.warn('Microphone access unavailable or denied:', err);
      setIsRecording(false);
      setActiveVoicePrompt(null);
      alert('Microphone permission not granted. You can type your answer directly into the text box below.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
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
        <header className="flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <BrandMark />
          <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
            Step 1 of 4
          </span>
        </header>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Tell your story
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Five optional prompts. Answer by voice or text. Watch your words transcribe live into the box as you speak.
          </p>
        </div>

        {/* Story Prompts List */}
        <div className="space-y-6">
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
                    <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                      {prompt.title}
                    </h2>
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
                    title={isThisPromptRecording ? 'Stop recording' : 'Record voice answer'}
                  >
                    {isThisPromptTranscribing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Refining transcript...</span>
                      </>
                    ) : isThisPromptRecording ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop recording ({formatTimer(recordingSeconds)})</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-[#F2B134]" />
                        <span>Record voice</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Live recording status indicator */}
                {isThisPromptRecording && (
                  <div className="p-2.5 rounded-xl bg-[#F2B134]/15 border border-[#F2B134]/40 flex items-center gap-2 text-xs text-[#8A5A00] dark:text-[#F2B134]">
                    <span className="w-2 h-2 rounded-full bg-[#A8432C] animate-ping" />
                    <span className="font-medium">
                      Listening & transcribing live parallelly ({formatTimer(recordingSeconds)})... Speak naturally into your mic.
                    </span>
                  </div>
                )}

                {/* Post-recording confirmation feedback */}
                {hasSuccessFeedback && !isThisPromptRecording && (
                  <div className="p-2.5 rounded-xl bg-[#2F7D5B]/10 border border-[#2F7D5B]/30 flex items-center gap-2 text-xs text-[#2F7D5B] dark:text-[#5FBF8F]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Voice answer successfully transcribed into the box below. Feel free to refine or edit any words.</span>
                  </div>
                )}

                {/* Textarea for typing or watching live voice transcript */}
                <textarea
                  value={localAnswers[prompt.key]}
                  onChange={(e) => handleTextChange(prompt.key, e.target.value)}
                  placeholder={prompt.placeholder}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] placeholder:text-[#55665F]/60 text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-y transition-colors"
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <button
            type="button"
            onClick={() => {
              // Pre-fill realistic sample story for fast testing
              setLocalAnswers({
                coming_from: 'Operations & Strategy Lead with 6 years experience',
                pushing_change: 'Constantly addressing product friction for customers and wanting to build solutions directly.',
                tried_so_far: 'Completed Reforge Product Strategy, attended local PM meetups, built a prototype app.',
                holding_back: 'Breaking through resume screens without prior official PM job title.',
                story: 'Based in Bengaluru, looking for mid-level PM roles with focus on speed to transition.',
              });
            }}
            className="text-xs text-[#2D6B8F] dark:text-[#7FB6D6] hover:underline cursor-pointer"
          >
            Pre-fill example answers
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span>Next: Background details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
