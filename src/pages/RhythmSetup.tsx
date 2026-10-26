import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BrandMark } from '../components/BrandMark';
import { downloadIcsFile, generateIcsContent } from '../lib/calendar';
import { Calendar, Video, Download, ArrowRight, Clock, Check } from 'lucide-react';

const GUIDE_SLOT_OPTIONS = [
  'Wednesdays 6:30 PM',
  'Thursdays 7:00 PM',
  'Tuesdays 8:00 PM',
  'Saturdays 10:30 AM',
];

const POD_CALL_OPTIONS = ['Thursdays 7:00 PM', 'Wednesdays 6:30 PM', 'Sundays 11:00 AM'];
const POD_CHECKIN_OPTIONS = ['Tuesdays 1:00 PM', 'Mondays 12:30 PM', 'Fridays 5:00 PM'];

export const RhythmSetup: React.FC = () => {
  const { currentRhythm, updateRhythmSchedule, sessions } = useApp();
  const navigate = useNavigate();

  const [guideSlot, setGuideSlot] = useState(currentRhythm?.guide_slot || 'Wednesdays 6:30 PM');
  const [podCallSlot, setPodCallSlot] = useState('Thursdays 7:00 PM');
  const [podCheckinSlot, setPodCheckinSlot] = useState('Tuesdays 1:00 PM');
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadCalendar = () => {
    const guideSession = sessions.find((s) => s.kind === 'guide') || sessions[0];
    const icsText = generateIcsContent({
      title: guideSession.title,
      description: 'Weekly 30-minute Career Guide conversation on People Like Me',
      startsAt: guideSession.starts_at,
      durationMin: guideSession.duration_min,
      videoUrl: guideSession.video_url,
    });
    downloadIcsFile('people-like-me-guide-session', icsText);
    setDownloaded(true);
  };

  const handleFinish = () => {
    updateRhythmSchedule(guideSlot, podCallSlot, podCheckinSlot);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
      <header className="max-w-2xl mx-auto w-full pt-4">
        <BrandMark />
      </header>

      <main className="max-w-2xl mx-auto w-full py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134]">
            <Clock className="w-4 h-4" />
            <span>Eight-Week Rhythm</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Set your weekly rhythm
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Confirm your weekly Career Guide slot and pod session times. You can reschedule any session up to 2 hours before.
          </p>
        </div>

        <div className="space-y-5">
          {/* Guide Slot Card */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  Weekly Career Guide Conversation (30 min)
                </h2>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                  One-on-one session with your Career Guide
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] font-medium">
                1:1 Call
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {GUIDE_SLOT_OPTIONS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setGuideSlot(slot)}
                  className={`p-3 rounded-xl text-xs font-medium text-left transition-colors flex items-center justify-between ${
                    guideSlot === slot
                      ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                  }`}
                >
                  <span>{slot}</span>
                  {guideSlot === slot && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pod Slots Card */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                  Pod Sessions (Two a week)
                </h2>
                <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                  A 30-min structured call and a 15-min check-in
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F] font-medium">
                Pod Group
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="space-y-1">
                <span className="font-medium text-[#55665F] dark:text-[#A6B8B0]">Weekly 30-min Pod Call</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {POD_CALL_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPodCallSlot(opt)}
                      className={`p-2.5 rounded-xl font-medium text-left transition-colors ${
                        podCallSlot === opt
                          ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                          : 'border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <span className="font-medium text-[#55665F] dark:text-[#A6B8B0]">Weekly 15-min Pod Check-in</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {POD_CHECKIN_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPodCheckinSlot(opt)}
                      className={`p-2.5 rounded-xl font-medium text-left transition-colors ${
                        podCheckinSlot === opt
                          ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                          : 'border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Video link & Calendar export preview */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2D6B8F]/10 text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#13231F] dark:text-[#E6EEEA]">
                  Encrypted Jitsi Video Rooms
                </p>
                <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                  No account or software installation required to join
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadCalendar}
              className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloaded ? '✓ Calendar invite downloaded' : 'Add to calendar (.ics)'}</span>
            </button>
          </div>
        </div>

        {/* Start Sprint Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Confirm rhythm & enter Home</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <footer className="text-center text-xs text-[#55665F] dark:text-[#A6B8B0] py-4">
        Rescheduling is permitted up to 2 hours before session start time.
      </footer>
    </div>
  );
};
