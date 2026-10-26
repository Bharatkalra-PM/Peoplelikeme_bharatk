import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InitialsAvatar } from '../components/InitialsAvatar';
import {
  Heart,
  Send,
  MoreVertical,
  Info,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const Pod: React.FC = () => {
  const {
    userPod,
    podPosts,
    addPodPost,
    toggleCheer,
    currentUser,
    currentMoveProfile,
    sessions,
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

  const nextPodSession = sessions.find((s) => s.kind === 'pod_call') || sessions[1];
  const membersCount = userPod ? userPod.members.length : 2;
  const targetSize = userPod?.target_size || 4;
  const isForming = membersCount < 4;

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D3DDD8] dark:border-[#2A403C]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-2xl sm:text-3xl font-normal text-[#13231F] dark:text-[#E6EEEA]">
              {userPod?.name || 'Your Pod'}
            </h1>
            {userPod?.is_sample && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#89BBD6]">
                Sample pod
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#55665F] dark:text-[#A6B8B0] mt-0.5">
            {isForming
              ? `Your pod is forming. ${membersCount} of ${targetSize} have joined.`
              : '4 to 6 people making a similar career move at the same stage'}
          </p>
        </div>

        <div className="max-w-xs text-[11px] text-[#55665F] dark:text-[#A6B8B0] p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] leading-tight">
          If your pod gets small, we'll add someone making the same move when we can, or offer to merge with another pod.
        </div>
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
            className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium shrink-0"
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

      {/* Next Pod Session Card */}
      {nextPodSession && (
        <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#2F7D5B]/10 text-[#2F7D5B] dark:text-[#5FBF8F]">
                Pod call
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
              Weekly 30-min Pod Call
            </h2>

            {userPod?.agenda && (
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0] mt-1">
                <span className="font-medium text-[#13231F] dark:text-[#E6EEEA]">Agenda:</span> {userPod.agenda}
                {userPod.host_name && ` (Host: ${userPod.host_name})`}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
            <button
              disabled
              className="px-5 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium text-[#55665F] dark:text-[#A6B8B0] bg-[#F1F5F2]/50 dark:bg-[#122523]/50 cursor-not-allowed"
            >
              Opens in 1d 4h
            </button>
            <span className="text-[10px] text-[#55665F] dark:text-[#A6B8B0]">
              Opens 10 min before
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
                  {prompt.subject_name} {prompt.subject_initial} hasnâ€™t posted this week
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPersonalMessageModalUser(`${prompt.subject_name} ${prompt.subject_initial}`)}
                className="px-3 py-1 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] hover:bg-[#F1F5F2] dark:hover:bg-[#122523] text-xs font-medium text-[#2D6B8F] dark:text-[#7FB6D6] transition-colors"
              >
                Say hello
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pod Members Grid */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
          Members ({membersCount})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Current user */}
          <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <InitialsAvatar
                firstName={currentUser?.first_name || 'You'}
                lastInitial={currentUser?.last_initial || ''}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA] truncate">
                  {currentUser?.first_name} {currentUser?.last_initial}{' '}
                  <span className="font-normal text-[#55665F] dark:text-[#A6B8B0]">(You)</span>
                </p>
                <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] truncate">
                  {currentMoveProfile?.from_role || 'Sales'} â†’ {currentMoveProfile?.to_role || 'PM'}
                </p>
              </div>
            </div>
          </div>

          {/* Fellow members */}
          {userPod?.members
            .filter((m) => m.user_id !== currentUser?.id)
            .map((member) => (
              <div
                key={member.user_id}
                className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-xl p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <InitialsAvatar
                    firstName={member.profile.first_name}
                    lastInitial={member.profile.last_initial}
                    size="md"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-[#13231F] dark:text-[#E6EEEA] truncate">
                        {member.profile.first_name} {member.profile.last_initial}
                      </p>
                      {member.profile.is_sample && (
                        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-[#2D6B8F]/15 text-[#2D6B8F] dark:text-[#89BBD6]">
                          Sample profile
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#55665F] dark:text-[#A6B8B0] truncate">
                      {member.move_line}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setReportModalUser({
                      id: member.user_id,
                      name: `${member.profile.first_name} ${member.profile.last_initial}`,
                    })
                  }
                  className="p-1 text-[#55665F] dark:text-[#A6B8B0] hover:text-[#A8432C] dark:hover:text-[#E58C73]"
                  title="Report concern"
                  aria-label={`Report concern regarding ${member.profile.first_name} ${member.profile.last_initial}`}
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* Pod Feed & Composer */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#55665F] dark:text-[#A6B8B0]">
          Updates & Wins
        </h2>

        <div className="p-3.5 rounded-xl bg-[#F1F5F2] dark:bg-[#122523] border border-[#D3DDD8]/70 dark:border-[#2A403C] text-xs text-[#55665F] dark:text-[#A6B8B0] flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 text-[#2D6B8F] dark:text-[#7FB6D6] mt-0.5" />
          <p className="leading-relaxed">
            This space is private to your pod. Share small wins, roadblocks, or honest weekly check-ins.
            No automated messages are ever sent on anyone's behalf.
          </p>
        </div>

        {/* Post Composer */}
        <form onSubmit={handlePostSubmit} className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
          <textarea
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
            placeholder="Share an update or a win with your pod..."
            rows={3}
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
              className="px-5 py-2 rounded-full bg-[#102A2E] hover:bg-[#193d43] dark:bg-[#F2B134] dark:hover:bg-[#e0a32e] text-white dark:text-[#102A2E] text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
            >
              <span>Share with pod</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Feed Posts */}
        <div className="space-y-3">
          {podPosts.length === 0 ? (
            <div className="bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-8 text-center space-y-2">
              <p className="text-sm font-medium text-[#13231F] dark:text-[#E6EEEA]">No updates yet.</p>
              <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
                Share how your week is going, and your pod will see it.
              </p>
            </div>
          ) : (
            podPosts.map((post) => (
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
                    className={`text-xs flex items-center gap-1.5 transition-colors ${
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
            ))
          )}
        </div>
      </section>

      {/* Say Hello Personal Message Modal */}
      {personalMessageModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#0E1E1D] border border-[#D3DDD8] dark:border-[#2A403C] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-heading text-base text-[#13231F] dark:text-[#E6EEEA]">
              Say hello to {personalMessageModalUser}
            </h3>
            <p className="text-xs text-[#55665F] dark:text-[#A6B8B0]">
              Send a human check-in note. We never send messages on anyone's behalf.
            </p>

            {sentMessageToast ? (
              <p className="text-xs text-[#2F7D5B] dark:text-[#5FBF8F] font-medium py-3">
                âœ“ Message sent directly to {personalMessageModalUser}.
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
                    className="px-4 py-2 rounded-full border border-[#D3DDD8] dark:border-[#2A403C] text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-[#102A2E] dark:bg-[#F2B134] text-white dark:text-[#102A2E] text-xs font-medium"
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

