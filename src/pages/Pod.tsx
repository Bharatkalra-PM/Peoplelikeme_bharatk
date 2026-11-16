import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { WhyThisMatchModal } from '../components/WhyThisMatchModal';
import { PodMember } from '../types';
import {
  Heart,
  Send,
  MoreVertical,
  Info,
  Sparkles,
  Users,
  CheckCircle2,
  X,
  Shield,
  Briefcase,
  MapPin,
  Target,
  Award,
  CheckCircle,
  Circle,
  MessageSquare,
} from 'lucide-react';

interface RichPodMemberDetails {
  pod_intro: string;
  years_experience: number;
  from_company_type: string;
  current_focus: string;
  superpower: string;
  weekly_goals: { text: string; status: 'done' | 'partly' | 'not_yet' }[];
}

const DEFAULT_MEMBER_PROFILES: Record<string, RichPodMemberDetails> = {
  'user-anand': {
    pod_intro:
      'Spent 5 years in B2B Enterprise SaaS Sales in Bengaluru. I have sat on 300+ customer discovery and renewal calls and now I am channeling that voice-of-customer instinct into B2B Product Management.',
    years_experience: 5,
    from_company_type: 'B2B SaaS Growth Startup',
    current_focus: 'Reframing enterprise deal teardowns into 2 structured product case studies',
    superpower: 'Customer discovery interviews & B2B buyer psychology',
    weekly_goals: [
      { text: 'Complete B2B onboarding PRD case study', status: 'done' },
      { text: 'Speak with 2 fintech PMs from warm network', status: 'done' },
      { text: 'Review pod members’ LinkedIn headline drafts', status: 'partly' },
    ],
  },
  'user-claire': {
    pod_intro:
      '4 years as a mid-market Account Executive at a payments company. Partnered closely with our PM team on merchant checkout friction and decided to make the leap into Product full-time.',
    years_experience: 4,
    from_company_type: 'Fintech Payments Scaleup',
    current_focus: 'Building a checkout drop-off teardown & practicing product sense prompts',
    superpower: 'Fintech domain workflow & commercial impact sizing',
    weekly_goals: [
      { text: 'Publish checkout flow teardown on Notion portfolio', status: 'done' },
      { text: 'Run 1 mock product sense interview with pod peer', status: 'partly' },
      { text: 'Shortlist 15 Series B/C product teams hiring in Q2', status: 'not_yet' },
    ],
  },
  'user-rohit': {
    pod_intro:
      'Led marketplace supply operations and SQL analytics for 6 years. Used to owning P&L metrics and working with engineering on internal ops tooling—now transitioning into Core Marketplace PM.',
    years_experience: 6,
    from_company_type: 'Consumer Marketplace',
    current_focus: 'Translating ops automation projects into PM impact bullets on CV',
    superpower: 'SQL funnel analysis, marketplace metrics & experimentation',
    weekly_goals: [
      { text: 'Rewrite resume bullets around product outcomes vs ops tasks', status: 'done' },
      { text: 'Share metric tree template with the pod', status: 'done' },
      { text: 'Send 5 tailored outreach notes to hiring managers', status: 'partly' },
    ],
  },
  'user-priya': {
    pod_intro:
      'Managed enterprise post-sales onboarding and product adoption for 5 years. I ran our customer advisory board and quarterly roadmap feedback loops, and I am ready to own the product roadmap directly.',
    years_experience: 5,
    from_company_type: 'Enterprise SaaS',
    current_focus: 'Preparing retention & activation product improvement deck for interviews',
    superpower: 'User onboarding, retention loops & stakeholder alignment',
    weekly_goals: [
      { text: 'Draft activation funnel improvement spec with Career Guide', status: 'done' },
      { text: 'Complete mid-week pod check-in & peer CV swap', status: 'done' },
      { text: 'Book 2 informational chats with B2B SaaS PMs', status: 'partly' },
    ],
  },
  'user-mira': {
    pod_intro:
      'Worked as a Strategy Consultant for 4 years solving complex workflow problems. Transitioning into Product Design where I can turn user research directly into intuitive product interfaces.',
    years_experience: 4,
    from_company_type: 'Strategy Consulting Firm',
    current_focus: 'Polishing end-to-end B2B workflow redesign case study in Figma',
    superpower: 'Systems thinking, information architecture & executive storytelling',
    weekly_goals: [
      { text: 'Finalize interactive Figma prototype for case study #1', status: 'done' },
      { text: 'Run usability test with 3 pod peers', status: 'done' },
      { text: 'Prepare 10-minute portfolio walkthrough deck', status: 'partly' },
    ],
  },
  'user-james': {
    pod_intro:
      'Spent 5 years in Operations Analytics mapping internal tool bottlenecks. Fell in love with UX prototyping while redesigning our dispatch dashboard.',
    years_experience: 5,
    from_company_type: 'Logistics Tech',
    current_focus: 'Documenting before/after usability metrics for portfolio',
    superpower: 'Data-informed UX decisions & complex dashboard design',
    weekly_goals: [
      { text: 'Add quantitative impact metrics to design case study', status: 'done' },
      { text: 'Critique 2 pod members’ portfolios', status: 'partly' },
      { text: 'Reach out to 3 design managers for portfolio feedback', status: 'not_yet' },
    ],
  },
  'user-simran': {
    pod_intro:
      'Brand Strategist for 4 years across consumer tech startups. Moving into Product Design to own the full customer journey from acquisition to core product experience.',
    years_experience: 4,
    from_company_type: 'Consumer Tech',
    current_focus: 'Completing mobile onboarding flow redesign & design system tokens',
    superpower: 'Visual craft, micro-copy & consumer psychology',
    weekly_goals: [
      { text: 'Build component library for mobile habit tracker case study', status: 'done' },
      { text: 'Practice whiteboard design challenge with pod', status: 'partly' },
      { text: 'Update LinkedIn featured section with case study link', status: 'done' },
    ],
  },
  'user-david': {
    pod_intro:
      'Managed cross-functional digital projects for 6 years. Transitioning into Product Design after completing a 6-month UX mentorship and shipping 2 client redesigns.',
    years_experience: 6,
    from_company_type: 'Digital Product Agency',
    current_focus: 'Preparing live portfolio walkthrough and whiteboard exercises',
    superpower: 'Cross-functional collaboration & edge-case mapping',
    weekly_goals: [
      { text: 'Record 5-minute Loom walkthrough of flagship project', status: 'done' },
      { text: 'Apply to 5 mid-level Product Designer roles', status: 'partly' },
      { text: 'Share agency handoff checklist with pod', status: 'done' },
    ],
  },
};

export const Pod: React.FC = () => {
  const {
    userPod,
    podPosts,
    addPodPost,
    toggleCheer,
    currentUser,
    currentMoveProfile,
    currentRhythm,
    sessions,
    goals,
    reachOutPrompts,
    setReportModalUser,
    simulatePodReady,
    podReadyNotification,
  } = useApp();

  const [postBody, setPostBody] = useState('');
  const [isWin, setIsWin] = useState(false);
  const [personalMessageModalUser, setPersonalMessageModalUser] = useState<string | null>(null);
  const [personalMessageText, setPersonalMessageText] = useState('');
  const [sentMessageToast, setSentMessageToast] = useState(false);
  const [selectedMember, setSelectedMember] = useState<PodMember | null>(null);
  const [showWhyMatch, setShowWhyMatch] = useState(false);

  const nextPodSession = sessions.find((s) => s.kind === 'pod_call') || sessions[1];
  const peerMembers = (userPod?.members || []).filter(
    (m) => m.user_id !== currentUser?.id
  );
  const membersCount = peerMembers.length + 1;
  const targetSize = userPod?.target_size || 5;
  const isForming = membersCount < 4;
  const currentWeek = currentRhythm?.week || 1;

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postBody.trim()) return;
    addPodPost(postBody.trim(), isWin);
    setPostBody('');
    setIsWin(false);
  };

  const handleSendPersonalMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalMessageText.trim()) return;
    setSentMessageToast(true);
    setTimeout(() => {
      setSentMessageToast(false);
      setPersonalMessageModalUser(null);
      setPersonalMessageText('');
    }, 1500);
  };

  const inactivePrompts = reachOutPrompts.filter(
    (p) => p.audience === 'pod' && !p.resolved_at
  );

  const getMemberRichDetails = (member: PodMember): RichPodMemberDetails => {
    const cleanId = member.user_id.replace(/^sample-/, '');
    if (DEFAULT_MEMBER_PROFILES[cleanId]) {
      return DEFAULT_MEMBER_PROFILES[cleanId];
    }
    if (member.user_id === currentUser?.id || member.user_id === 'user-you') {
      return {
        pod_intro:
          currentMoveProfile?.story ||
          `Transitioning via ${member.move_line}. Focused on building weekly momentum, completing practical case studies, and trading honest peer feedback with the pod.`,
        years_experience: currentMoveProfile?.years_experience || 5,
        from_company_type: currentMoveProfile?.from_company_type || 'Tech & Growth',
        current_focus: `Week ${currentWeek} Sprint: Executing weekly goals & 1:1 Career Guide milestones`,
        superpower: `Domain expertise in ${currentMoveProfile?.from_field || 'Operations & Sales'} & cross-functional execution`,
        weekly_goals:
          goals.length > 0
            ? goals.map((g) => ({ text: g.text, status: g.status }))
            : [
                { text: 'Confirm the first Career Guide conversation', status: 'done' },
                { text: 'Set this week’s goals', status: 'partly' },
                { text: 'Introduce yourself to your pod', status: 'done' },
              ],
      };
    }
    return {
      pod_intro:
        (member as any).pod_intro ||
        `Transitioning via ${member.move_line}. Focused on building weekly momentum, completing practical case studies, and trading honest peer feedback with the pod.`,
      years_experience: (member as any).years_experience || 5,
      from_company_type: (member as any).from_company_type || 'Growth Startup',
      current_focus:
        (member as any).current_focus ||
        'Refining role-specific case study and preparing for mock interviews',
      superpower:
        (member as any).superpower ||
        'Structured problem solving, stakeholder alignment & peer accountability',
      weekly_goals: (member as any).weekly_goals || [
        { text: 'Complete weekly case study milestone', status: 'done' },
        { text: 'Share 1 win and 1 blocker in pod check-in', status: 'done' },
        { text: 'Reach out to 3 hiring managers in target role', status: 'partly' },
      ],
    };
  };

  return (
    <div className="space-y-8">
      {/* Header with "Why this match" trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              {userPod?.name || 'Your Pod'}
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]">
              {membersCount} Active Pod Members
            </span>
            {userPod?.is_sample && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#89BBD6]">
                Sample pod
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            Click any pod member below to open their full transition profile, weekly goals, and story.
          </p>
        </div>

        <button
          type="button"
          data-testid="pod-why-this-match-btn"
          onClick={() => setShowWhyMatch(true)}
          className="self-start sm:self-auto px-3.5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] bg-[#FFFFFF] dark:bg-[#0E1E1D] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#13231F] dark:text-[#E6EEEA] flex items-center gap-1.5 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-[#2D6B8F] dark:text-[#7FB6D6]" />
          <span>Why this match</span>
        </button>
      </div>

      {/* Pod Forming Card if < 4 members */}
      {isForming && (
        <div
          data-testid="pod-page-forming-card"
          className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#F2B134]/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              <Users className="w-4 h-4 text-[#8A5A00] dark:text-[#F2B134]" />
              <span>Your pod is forming. {membersCount} of {targetSize} have joined.</span>
            </div>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              You start with your Career Guide alone while your pod fills to 4 members, and we will notify you when it is ready.
            </p>
          </div>
          <button
            type="button"
            onClick={simulatePodReady}
            className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium shrink-0 cursor-pointer"
          >
            Simulate: Pod reaches 4 members
          </button>
        </div>
      )}

      {podReadyNotification && !isForming && (
        <div className="p-4 rounded-xl bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F] text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{podReadyNotification}</span>
        </div>
      )}

      {/* Next Pod Session Card with Guiding Instruction */}
      {nextPodSession && (
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]">
                Pod call • 30 min
              </span>
              <span className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                {new Date(nextPodSession.starts_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <h2 className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA]">
              Pod call: share one win and one struggle
            </h2>

            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              Pod check-in: 15 minutes, update your goals mid-week
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
            <a
              href={nextPodSession.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full bg-[#2F7D5B] hover:bg-[#25664a] text-white text-xs font-semibold transition-colors"
            >
              Join pod call
            </a>
            <span className="text-[10px] text-[#55665F] dark:text-[#A6B8B0]">
              Active 10 min before
            </span>
          </div>
        </div>
      )}

      {/* Check In On Row */}
      {inactivePrompts.length > 0 && (
        <div className="space-y-2">
          {inactivePrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] flex items-center justify-between gap-4 text-xs shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <InitialsAvatar firstName={prompt.subject_name} lastInitial={prompt.subject_initial} size="sm" />
                <span className="text-[#13231F] dark:text-[#E6EEEA] font-medium">
                  {prompt.subject_name} {prompt.subject_initial} hasn&apos;t posted this week
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPersonalMessageModalUser(`${prompt.subject_name} ${prompt.subject_initial}`)}
                className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#2D6B8F] dark:text-[#7FB6D6] transition-colors cursor-pointer"
              >
                Say hello
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pod Members Grid: Clicking any member opens their rich Profile Sheet */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
            Pod Members ({membersCount}) • Click any member to view their profile &amp; weekly goals
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Current user */}
          <button
            type="button"
            onClick={() =>
              setSelectedMember({
                pod_id: userPod?.id || 'pod-pm-forming',
                user_id: currentUser?.id || 'user-you',
                joined_at: new Date().toISOString(),
                profile: currentUser || {
                  id: 'user-you',
                  role: 'switcher',
                  first_name: 'Bharat',
                  last_initial: 'K.',
                  full_name: 'Bharat K.',
                  email: 'bharatk6325@gmail.com',
                  city: 'Bengaluru',
                  avatar_color: '#102A2E',
                  share_contact_with_guide: false,
                  share_contact_with_pod: false,
                  created_at: new Date().toISOString(),
                },
                move_line: `${currentMoveProfile?.from_role || 'Operations & Strategy Lead'} → ${
                  currentMoveProfile?.to_role || 'Product Manager'
                }`,
              })
            }
            className="text-left bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-2xs cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2.5 w-full">
              <div className="flex items-center gap-3 min-w-0">
                <InitialsAvatar
                  firstName={currentUser?.first_name || 'You'}
                  lastInitial={currentUser?.last_initial || ''}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] truncate">
                    {currentUser?.first_name} {currentUser?.last_initial}{' '}
                    <span className="text-xs font-normal text-[#55665F] dark:text-[#A6B8B0]">(You)</span>
                  </p>
                  <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{currentUser?.city || 'Bengaluru'}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#102A2E]/10 dark:bg-[#F2B134]/20 text-[#102A2E] dark:text-[#F2B134] shrink-0">
                View profile
              </span>
            </div>

            <div className="pt-2 border-t border-[#D3DDD8]/50 dark:border-[#2A403C] space-y-1 w-full">
              <p className="text-xs font-medium text-[#2F7D5B] dark:text-[#5FBF8F] truncate">
                {currentMoveProfile?.from_role || 'Operations & Strategy'} → {currentMoveProfile?.to_role || 'Product Manager'}
              </p>
              <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] line-clamp-1">
                Week {currentWeek} Sprint • {goals.filter((g) => g.status === 'done').length}/{goals.length || 3} weekly goals done
              </p>
            </div>
          </button>

          {/* Fellow pod members (3-4 peers) */}
          {peerMembers.map((member) => {
            const details = getMemberRichDetails(member);
            const doneCount = details.weekly_goals.filter((g) => g.status === 'done').length;

            return (
              <div
                key={member.user_id}
                data-testid={`pod-member-card-${member.user_id}`}
                onClick={() => setSelectedMember(member)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedMember(member)}
                className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] hover:border-[#F2B134] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-2xs cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <InitialsAvatar
                      firstName={member.profile.first_name}
                      lastInitial={member.profile.last_initial}
                      size="lg"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-[#13231F] dark:text-[#E6EEEA] truncate">
                          {member.profile.first_name} {member.profile.last_initial}
                        </p>
                        {member.profile.is_sample && (
                          <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#89BBD6]">
                            Sample
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{member.profile.city} • {details.years_experience} yrs exp</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F2] dark:bg-[#122523] text-[#2D6B8F] dark:text-[#7FB6D6] group-hover:bg-[#F2B134]/20 group-hover:text-[#8A5A00] dark:group-hover:text-[#F2B134] transition-colors">
                      Profile
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReportModalUser({
                          id: member.user_id,
                          name: `${member.profile.first_name} ${member.profile.last_initial}`,
                        });
                      }}
                      className="p-1 text-[#55665F] dark:text-[#A6B8B0] hover:text-[#A8432C] dark:hover:text-[#E58C73] cursor-pointer"
                      title="Report concern"
                      aria-label={`Report concern regarding ${member.profile.first_name} ${member.profile.last_initial}`}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D3DDD8]/50 dark:border-[#2A403C] space-y-1 w-full">
                  <p className="text-xs font-medium text-[#2F7D5B] dark:text-[#5FBF8F] truncate">
                    {member.move_line}
                  </p>
                  <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] line-clamp-1">
                    {doneCount}/{details.weekly_goals.length} weekly goals done • {details.from_company_type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pod Feed & Composer */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
          Updates &amp; Wins
        </h2>

        <form onSubmit={handlePostSubmit} className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <textarea
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            placeholder="Share an update or a win with your pod..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/30 dark:bg-[#122523]/30 text-[#13231F] dark:text-[#E6EEEA] placeholder:text-[#55665F]/60 text-sm focus:bg-white dark:focus:bg-[#0E1E1D] resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#55665F] dark:text-[#A6B8B0]">
              <input
                type="checkbox"
                checked={isWin}
                onChange={(e) => setIsWin(e.target.checked)}
                className="rounded border-[#D3DDD8] text-[#F2B134] focus:ring-[#F2B134]"
              />
              <span>Mark as a win</span>
            </label>

            <button
              type="submit"
              disabled={!postBody.trim()}
              className="px-5 py-2 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Share with pod</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {podPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <InitialsAvatar firstName={post.author_name} lastInitial={post.author_initial} size="sm" />
                  <div>
                    <p className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                      {post.author_name} {post.author_initial}
                    </p>
                    <p className="text-[10px] text-[#55665F] dark:text-[#A6B8B0]">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {post.is_win && (
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F2B134]/15 text-[#8A5A00] dark:text-[#F2B134] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Win</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#13231F] dark:text-[#E6EEEA] leading-relaxed">
                {post.body}
              </p>

              <div className="pt-2 border-t border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleCheer(post.id)}
                  className={`text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    post.cheered_by_me
                      ? 'text-[#A8432C] dark:text-[#E58C73] font-medium'
                      : 'text-[#55665F] dark:text-[#A6B8B0] hover:text-[#13231F]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${post.cheered_by_me ? 'fill-current' : ''}`} />
                  <span>{post.cheers_count} {post.cheers_count === 1 ? 'cheer' : 'cheers'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rich Pod Member Profile Modal */}
      {selectedMember && (() => {
        const richDetails = getMemberRichDetails(selectedMember);
        const isCurrentUser =
          selectedMember.user_id === currentUser?.id || selectedMember.user_id === 'user-you';

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            data-testid="pod-member-profile-sheet"
          >
            <div className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Top Profile Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#D3DDD8] dark:border-[#2A403C]">
                <div className="flex items-center gap-3.5">
                  <InitialsAvatar
                    firstName={selectedMember.profile.first_name}
                    lastInitial={selectedMember.profile.last_initial}
                    size="xl"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading text-xl font-semibold text-[#13231F] dark:text-[#E6EEEA]">
                        {selectedMember.profile.first_name} {selectedMember.profile.last_initial}
                      </h3>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134]">
                        Week {Math.min(4, currentWeek)} of 4
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#2F7D5B] dark:text-[#5FBF8F] mt-1">
                      {selectedMember.move_line}
                    </p>
                    <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedMember.profile.city}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {richDetails.years_experience} yrs exp ({richDetails.from_company_type})
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  aria-label="Close member profile"
                  className="p-1.5 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-[#55665F] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* About / Shared Pod Intro */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
                  About &amp; Shared Pod Intro
                </span>
                <p className="text-xs sm:text-sm text-[#13231F] dark:text-[#E6EEEA] leading-relaxed p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/60 dark:border-[#2A403C]">
                  &ldquo;{richDetails.pod_intro}&rdquo;
                </p>
              </div>

              {/* Current Focus & Superpower */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A5A00] dark:text-[#F2B134] flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>Current Week Focus</span>
                  </span>
                  <p className="font-medium text-[#13231F] dark:text-[#E6EEEA] leading-snug">
                    {richDetails.current_focus}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-[#D3DDD8] dark:border-[#2A403C] space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Pod Superpower</span>
                  </span>
                  <p className="font-medium text-[#13231F] dark:text-[#E6EEEA] leading-snug">
                    {richDetails.superpower}
                  </p>
                </div>
              </div>

              {/* Member's Active Weekly Goals in Pod */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
                  {selectedMember.profile.first_name}&apos;s Week {currentWeek} Goals
                </span>
                <div className="space-y-2">
                  {richDetails.weekly_goals.map((wg, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#F1F5F2]/50 dark:bg-[#122523]/50 border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {wg.status === 'done' ? (
                          <CheckCircle className="w-4 h-4 text-[#2F7D5B] dark:text-[#5FBF8F] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#F2B134] shrink-0" />
                        )}
                        <span className="text-[#13231F] dark:text-[#E6EEEA] font-medium">
                          {wg.text}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          wg.status === 'done'
                            ? 'bg-[#2F7D5B]/15 text-[#2F7D5B] dark:text-[#5FBF8F]'
                            : wg.status === 'partly'
                            ? 'bg-[#F2B134]/20 text-[#8A5A00] dark:text-[#F2B134]'
                            : 'bg-[#D3DDD8]/40 text-[#55665F] dark:text-[#A6B8B0]'
                        }`}
                      >
                        {wg.status === 'done' ? 'Done' : wg.status === 'partly' ? 'Partly' : 'In progress'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact / Privacy Status */}
              {selectedMember.profile.share_contact_with_pod ? (
                <div className="p-3 rounded-xl bg-[#2F7D5B]/10 border border-[#2F7D5B]/30 text-xs text-[#13231F] dark:text-[#E6EEEA]">
                  <p>
                    <strong>Shared with Pod:</strong> {selectedMember.profile.full_name || `${selectedMember.profile.first_name} ${selectedMember.profile.last_initial}`} • {selectedMember.profile.email || `${selectedMember.profile.first_name.toLowerCase()}@example.com`}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#F1F5F2]/60 dark:bg-[#122523]/60 border border-[#D3DDD8]/60 dark:border-[#2A403C] flex items-center gap-2 text-[11px] text-[#55665F] dark:text-[#A6B8B0]">
                  <Shield className="w-3.5 h-3.5 text-[#2F7D5B] shrink-0" />
                  <span>
                    Email, phone, and employer are kept private by default unless {selectedMember.profile.first_name} turns sharing on.
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#D3DDD8] dark:border-[#2A403C]">
                {!isCurrentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      const targetName = `${selectedMember.profile.first_name} ${selectedMember.profile.last_initial}`;
                      setSelectedMember(null);
                      setPersonalMessageModalUser(targetName);
                    }}
                    className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-semibold text-[#2D6B8F] dark:text-[#7FB6D6] flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send note to {selectedMember.profile.first_name}</span>
                  </button>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Why This Match Sheet */}
      <WhyThisMatchModal
        isOpen={showWhyMatch}
        onClose={() => setShowWhyMatch(false)}
        mode="pod"
        userProfile={currentUser}
        userMove={currentMoveProfile}
        podName={userPod?.name}
        podMembersCount={membersCount}
      />

      {/* Say Hello Personal Message Modal */}
      {personalMessageModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-heading text-base text-[#13231F] dark:text-[#E6EEEA]">
              Say hello to {personalMessageModalUser}
            </h3>
            {sentMessageToast ? (
              <p className="text-xs text-[#2F7D5B] dark:text-[#5FBF8F] font-medium py-3">
                ✓ Message sent directly to {personalMessageModalUser}.
              </p>
            ) : (
              <form onSubmit={handleSendPersonalMessage} className="space-y-3">
                <textarea
                  value={personalMessageText}
                  onChange={(e) => setPersonalMessageText(e.target.value)}
                  placeholder="Hey, just checking in to see how your week is going..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#D3DDD8] dark:border-[#2A403C] bg-[#F1F5F2]/40 dark:bg-[#122523]/40 text-[#13231F] dark:text-[#E6EEEA] text-xs resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPersonalMessageModalUser(null)}
                    className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium cursor-pointer"
                  >
                    Send note
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
