import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BrandMark } from '../../components/BrandMark';
import { ArrowLeft, ArrowRight, Check, MapPin, Clock, Target, Users, Shield } from 'lucide-react';

const POPULAR_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'London',
  'New York',
  'San Francisco',
  'Singapore',
  'Remote (Global)',
];

const DEPENDANTS_OPTIONS = ['None', 'Children', 'Elderly parents', 'Partner'];

const PRIORITY_OPTIONS = [
  'Speed to role (Fastest transition)',
  'Target salary parity (Protecting income)',
  'Domain & Culture fit (Right company & team)',
  'Work-life balance & Family flexibility',
  'Career longevity (Future-proof skills)',
  'Title & Seniority matching',
];

const AVAILABILITY_OPTIONS = [
  'Weekday evenings (6:00 PM – 8:00 PM)',
  'Weekday late evenings (8:00 PM – 10:00 PM)',
  'Weekend mornings (9:00 AM – 12:00 PM)',
  'Weekend afternoons (2:00 PM – 5:00 PM)',
  'Weekday lunchtimes (12:30 PM – 2:00 PM)',
];

const COMMON_CONSTRAINTS = [
  'Self-taught tech knowledge',
  'Notice period: 60–90 days',
  'Caregiving duties',
  'Target salary parity',
  'Career break / unemployed',
  'Remote-only transition',
];

export const Details: React.FC = () => {
  const { detailChips, setDetailChips } = useApp();
  const navigate = useNavigate();

  const [city, setCity] = useState(detailChips.city || 'Bengaluru');
  const [priority, setPriority] = useState(detailChips.priority || PRIORITY_OPTIONS[0]);
  const [dependants, setDependants] = useState(detailChips.dependants || 'None');
  const [availability, setAvailability] = useState<string[]>(
    detailChips.availability?.length ? detailChips.availability : [AVAILABILITY_OPTIONS[0], AVAILABILITY_OPTIONS[2]]
  );
  const [constraints, setConstraints] = useState<string[]>(detailChips.constraints || []);
  const [customConstraint, setCustomConstraint] = useState('');

  const toggleAvailability = (opt: string) => {
    setAvailability((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const toggleConstraint = (opt: string) => {
    setConstraints((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const addCustomConstraint = () => {
    if (customConstraint.trim() && !constraints.includes(customConstraint.trim())) {
      setConstraints((prev) => [...prev, customConstraint.trim()]);
      setCustomConstraint('');
    }
  };

  const handleContinue = () => {
    setDetailChips({
      dependants,
      priority,
      availability,
      city,
      constraints,
    });
    navigate('/onboarding/confirm');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F2] dark:bg-[#122523] text-[#13231F] dark:text-[#E6EEEA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
          <BrandMark />
          <span className="text-xs font-medium text-[#55665F] dark:text-[#A6B8B0]">
            Step 3 of 4
          </span>
        </header>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
            Context & Constraints
          </h1>
          <p className="text-sm text-[#55665F] dark:text-[#A6B8B0]">
            Select your city, primary goals, and preferred session windows so we match you with people whose schedules align.
          </p>
        </div>

        <div className="space-y-6">
          {/* City Selection */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F2B134]" />
                <span>Your City or Timezone</span>
              </h2>
              <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                Selected: <strong className="text-[#13231F] dark:text-[#E6EEEA]">{city || 'None'}</strong>
              </span>
            </div>

            {/* Popular City Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {POPULAR_CITIES.map((c) => {
                const isSelected = city.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] shadow-xs'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom City Input */}
            <div className="pt-2">
              <label className="text-[11px] font-medium text-[#55665F] dark:text-[#A6B8B0]">
                Or enter another city / region:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Toronto, Berlin, Dubai, Chennai"
                className="w-full mt-1 px-3.5 py-2 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-sm focus:bg-white dark:focus:bg-[#0E1E1D]"
              />
            </div>
          </div>

          {/* Primary Priority */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#F2B134]" />
              <span>What is your primary priority for this move?</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPriority(opt)}
                  className={`p-3 rounded-xl text-xs font-medium text-left transition-all cursor-pointer flex items-center justify-between ${
                    priority === opt
                      ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] shadow-xs'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                  }`}
                >
                  <span>{opt}</span>
                  {priority === opt && <Check className="w-4 h-4 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Slot Windows */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <div>
              <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F2B134]" />
                <span>When can you attend 30-min weekly sessions?</span>
              </h2>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
                Concrete time windows to ensure scheduling overlap with your guide and pod peers.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {AVAILABILITY_OPTIONS.map((opt) => {
                const selected = availability.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAvailability(opt)}
                    className={`w-full p-3 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E] shadow-xs'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        selected
                          ? 'border-white dark:border-[#102A2E] bg-white/20'
                          : 'border-[#55665F]'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dependants */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2D6B8F]" />
              <span>Dependants or family responsibilities</span>
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {DEPENDANTS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDependants(opt)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    dependants === opt
                      ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                      : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Key constraints */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2F7D5B]" />
              <span>Specific constraints (select all that apply)</span>
            </h2>
            <div className="flex flex-wrap gap-2 pt-1">
              {COMMON_CONSTRAINTS.map((opt) => {
                const selected = constraints.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleConstraint(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#102A2E] text-white dark:bg-[#F2B134] dark:text-[#102A2E]'
                        : 'border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] dark:text-[#A6B8B0] hover:bg-[#F1F5F2] dark:hover:bg-[#122523]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customConstraint}
                onChange={(e) => setCustomConstraint(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomConstraint())}
                placeholder="Add other constraint..."
                className="flex-1 px-3 py-1.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-xs text-[#13231F] dark:text-[#E6EEEA]"
              />
              <button
                type="button"
                onClick={addCustomConstraint}
                className="px-3.5 py-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium hover:bg-[#F1F5F2] dark:hover:bg-[#122523] cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D3DDD8] dark:border-[#2A403C]">
          <button
            type="button"
            onClick={() => navigate('/onboarding/background')}
            className="px-4 py-2.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F] dark:hover:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="px-6 py-3 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span>Next: Confirm Move Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
