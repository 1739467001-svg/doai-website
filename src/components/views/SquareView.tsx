import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../lib/api';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Heart,
  Share2,
  CheckCircle2,
  MapPin,
  Clock,
  Briefcase,
  X,
  CreditCard,
  Send,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  HeartHandshake,
  BadgeCheck
} from 'lucide-react';
import { RecruitmentPost, TrackType } from '../../types';


/* ------------------------------------------------------------------ 名片墙 */
/* 创客数字名片墙：数据来自后端用户目录，关注/互关走后端 follows API。
 * 互相关注后即可在「我的 DOAI → 我的战队」发起组队邀请。 */

interface WallUser {
  id: string;
  name: string;
  roleTitle: string;
  avatar?: string;
  skills?: string[];
  city?: string;
  availableTime?: string;
  bio?: string;
  atomclubVerified?: boolean;
}

const CardWall: React.FC = () => {
  const { currentUser, setActiveRoute, tr } = useApp();
  const [users, setUsers] = useState<WallUser[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [mutual, setMutual] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const refresh = async () => {
    if (!currentUser) return;
    try {
      const [u, f] = await Promise.all([
        fetch(apiUrl('/api/users')).then(r => r.json()),
        fetch(apiUrl(`/api/follows?userId=${currentUser.id}`)).then(r => r.json()),
      ]);
      if (u.ok) setUsers(u.users.filter((x: WallUser) => x.id !== currentUser.id));
      if (f.ok) {
        setFollowing(f.following);
        setMutual(f.mutual);
      }
    } catch {
      /* 后端不可用时静默 */
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const toggleFollow = async (user: WallUser) => {
    if (!currentUser || busyId) return;
    const isFollowing = following.includes(user.id);
    setBusyId(user.id);
    try {
      const res = await fetch(apiUrl('/api/follows'), {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: currentUser.id, to: user.id }),
      });
      const d = await res.json();
      if (d.ok) {
        setNotice(
          !isFollowing && d.mutual
            ? `与 ${user.name} 互相关注，可以邀请 TA 加入战队了`
            : isFollowing
              ? `已取消关注 ${user.name}`
              : `已关注 ${user.name}，对方回关后即可互相关注`,
        );
        setTimeout(() => setNotice(''), 2600);
      }
    } finally {
      setBusyId(null);
      refresh();
    }
  };

  if (users.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-6 sm:px-8 pt-14">
      <div className="flex items-end justify-between flex-wrap gap-3 pb-6 border-b border-[#E8EAED]">
        <div>
          <div className="text-xs font-semibold text-[#165DFF] tracking-wider uppercase mb-1">
            DOAI MAKER CARD WALL
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3A]">{tr('创客名片墙', 'Maker Card Wall')}</h2>
          <p className="text-xs text-[#666666] mt-1.5 flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-[#165DFF]" />
            <span>{tr('发现感兴趣的创作伙伴 · 互相关注后可在「我的战队」发起组队邀请', 'Discover makers — mutual follows unlock team invites in My Team')}</span>
          </p>
        </div>
        <button
          onClick={() => setActiveRoute('dashboard/team')}
          className="px-5 py-2 text-xs font-semibold text-[#165DFF] hover:text-[#1453E6] bg-white hover:bg-[#F5F8FF] border border-[#165DFF]/40 rounded-full transition-colors"
        >
          {tr('去我的战队邀请 →', 'Invite from My Team →')}
        </button>
      </div>

      {notice && (
        <div className="mt-4 p-3 rounded-xl bg-[#00C48C]/10 text-[#00876A] text-xs font-medium">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
        {users.map(user => {
          const iFollow = following.includes(user.id);
          const weAreMutual = mutual.includes(user.id);
          return (
            <div key={user.id} className="doa-card doa-card-hover p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-[#E8EAED] shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#E4EFFF] text-[#165DFF] font-bold flex items-center justify-center shrink-0">
                      {user.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#0B1B3A] truncate">{user.name}</span>
                      {user.atomclubVerified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-[#165DFF] shrink-0" aria-label="atomclub 已认证" />
                      )}
                    </div>
                    <div className="text-[11px] text-[#888888] truncate">{user.roleTitle}</div>
                  </div>
                </div>
                {weAreMutual && (
                  <span className="text-[10px] font-bold text-[#165DFF] bg-[#165DFF]/10 px-2 py-0.5 rounded-full shrink-0">
                    互相关注
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="text-xs text-[#6B7C9B] leading-relaxed line-clamp-3">{user.bio}</p>
              )}

              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-[10px] font-medium text-[#48597A] bg-[#F7FAFF] border border-[#E3ECFA] rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-3 border-t border-[#F0F2F5] flex items-center justify-between gap-2 text-[11px] text-[#888888]">
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {user.city || '—'}
                  {user.availableTime ? ` · ${user.availableTime}` : ''}
                </span>
                <button
                  onClick={() => toggleFollow(user)}
                  disabled={busyId === user.id}
                  className={`px-3.5 py-1.5 rounded-full font-semibold text-xs border transition-colors shrink-0 disabled:opacity-40 ${
                    iFollow
                      ? 'text-[#666666] border-[#E8EAED] hover:text-red-500 hover:border-red-200'
                      : 'text-[#165DFF] border-[#165DFF]/40 hover:bg-[#165DFF]/5'
                  }`}
                >
                  {iFollow ? tr('取消关注', 'Unfollow') : tr('+ 关注', '+ Follow')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const SquareView: React.FC = () => {
  const {
    lang,
    t,
    tr,
    recruitments,
    setRecruitments,
    currentUser,
    setLoginModalOpen,
    toggleLikeRecruit,
    addExchangedCard,
    setNotificationDrawerOpen,
    setActiveRoute,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Modal State: Publish Recruitment
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newTrack, setNewTrack] = useState<TrackType>('creator');
  const [newRoles, setNewRoles] = useState('Rust核心研发、AI安全');
  const [newSkills, setNewSkills] = useState('Rust、LLM Agent、Libp2p');
  const [newStage, setNewStage] = useState<'idea' | 'prototype' | 'demo'>('prototype');
  const [newCity, setNewCity] = useState('北京 (支持远程)');

  // Modal State: Apply to Join
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingRecruit, setApplyingRecruit] = useState<RecruitmentPost | null>(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Card Exchange Notification Modal
  const [exchangeSuccess, setExchangeSuccess] = useState<string | null>(null);

  // Filtered Recruitments
  const filteredRecruitments = recruitments.filter(item => {
    if (selectedTrack !== 'all' && item.track !== selectedTrack) return false;
    if (selectedCity !== 'all' && !item.city.includes(selectedCity)) return false;
    if (selectedRole !== 'all' && !item.neededRoles.some(r => r.includes(selectedRole))) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchSkills = item.skills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchSkills) return false;
    }
    return true;
  });

  // Filtered Talents
  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }

    const newPost: RecruitmentPost = {
      id: `rec-${Date.now()}`,
      track: newTrack,
      title: newTitle,
      summary: newSummary,
      neededRoles: newRoles.split('、').map(r => r.trim()),
      skills: newSkills.split('、').map(s => s.trim()),
      stage: newStage,
      city: newCity,
      isRemote: newCity.includes('远程'),
      leader: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        city: currentUser.city,
      },
      likes: 1,
      hasLiked: true,
      applicationsCount: 0,
      status: 'open',
      createdAt: '刚刚',
    };

    setRecruitments([newPost, ...recruitments]);
    setPublishModalOpen(false);
    // Reset
    setNewTitle('');
    setNewSummary('');
  };

  const handleOpenApply = (recruit: RecruitmentPost) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setApplyingRecruit(recruit);
    setApplyMessage(`你好，我是 ${currentUser.name}，具备 ${currentUser.skills.slice(0, 2).join('/')} 经验，希望加入您的队伍！`);
    setApplyModalOpen(true);
    setAppliedSuccess(false);
  };

  const handleConfirmApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setApplyModalOpen(false);
      setAppliedSuccess(false);
    }, 1500);
  };

  return (
    <div className="pt-24 pb-24">
      {/* Top Banner & Header */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8EAED]">
          <div>
            <div className="text-xs font-semibold text-[#165DFF] tracking-wider uppercase mb-1">
              DOAI CREATOR NETWORK
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1B3A]">
              {tr('组队广场', 'Team Square')}
            </h1>
            <p className="text-xs text-[#666666] mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C48C]" />
              <span>{tr('严格遵循项目保密原则：报名项目不公开展示，仅发布合规招募需求与人才经历', 'Projects stay confidential — only compliant recruitment posts and profiles are shown.')}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!currentUser) {
                  setLoginModalOpen(true);
                } else {
                  setPublishModalOpen(true);
                }
              }}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t.square.postRecruitBtn}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t.square.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#165DFF] transition-all"
            />
          </div>
        </div>

        {/* Filter Chips Bar (Clean interactive buttons with instant filtering) */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs py-2">
          <span className="text-[#888888] text-[11px] mr-1">{tr('赛道方向', 'Track')}:</span>
          {['all', 'industry', 'creator'].map(track => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedTrack === track
                  ? 'bg-[#165DFF] text-white'
                  : 'bg-[#F7F8FA] text-[#666666] hover:text-[#0B1B3A] border border-[#E8EAED]'
              }`}
            >
              {track === 'all' ? tr('全部赛道', 'All') : track === 'industry' ? tr('产业赛道', 'Industry') : tr('自由赛道', 'Creator')}
            </button>
          ))}

          <span className="text-[#888888] text-[11px] ml-3 mr-1">{tr('角色方向', 'Role')}:</span>
          {[['all', 'All'], ['算法', 'Algo'], ['前端', 'Frontend'], ['后端', 'Backend'], ['硬件', 'Hardware'], ['产品', 'Product']].map(([role, roleEn]) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedRole === role
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F7F8FA] text-[#666666] hover:text-[#0B1B3A] border border-[#E8EAED]'
              }`}
            >
              {role === 'all' ? tr('全部角色', 'All') : tr(role, roleEn)}
            </button>
          ))}

          <span className="text-[#888888] text-[11px] ml-3 mr-1">{tr('城市分布', 'City')}:</span>
          {[['all', 'All'], ['深圳', 'Shenzhen'], ['北京', 'Beijing'], ['上海', 'Shanghai'], ['杭州', 'Hangzhou']].map(([city, cityEn]) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                selectedCity === city
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F7F8FA] text-[#666666] hover:text-[#0B1B3A] border border-[#E8EAED]'
              }`}
            >
              {city === 'all' ? tr('全域', 'All') : tr(city, cityEn)}
            </button>
          ))}
        </div>
      </section>

      {/* Success Toast for Card Exchange */}
      {exchangeSuccess && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-white rounded-2xl shadow-floating border border-[#00C48C] text-xs flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#00C48C]" />
          <div>
            <div className="font-bold text-[#0B1B3A]">名片交换成功！</div>
            <div className="text-[#666666]">已将 {exchangeSuccess} 的数字名片存入您的 DOAI Passport 名片盒</div>
          </div>
        </div>
      )}

      {/* Main Grid Content */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 pt-4">
        {(
          /* Tab 1: Recruitment Posts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecruitments.map(item => (
              <div
                key={item.id}
                className="doa-card doa-card-hover p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between text-xs text-[#888888] mb-3">
                    <span className="font-bold text-[#165DFF]">
                      {item.track === 'industry' ? '产业赛道 · AI + Industry' : '自由赛道 · AI Creator'}
                    </span>
                    <span className="font-mono text-[11px]">{item.createdAt}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveRoute(`detail/recruit/${item.id}`)}
                    className="block text-left mb-2"
                  >
                    <h3 className="text-lg font-bold text-[#0B1B3A] hover:text-[#165DFF] transition-colors">
                      {item.title}
                    </h3>
                  </button>
                  <p className="text-xs text-[#666666] leading-relaxed line-clamp-3 mb-5">
                    {item.summary}
                  </p>

                  {/* Needed Roles */}
                  <div className="space-y-2 mb-5">
                    <div className="text-[11px] font-semibold text-[#0B1B3A]">急需角色：</div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.neededRoles.map(role => (
                        <span
                          key={role}
                          className="px-2.5 py-1 text-xs rounded-lg bg-[#F7F8FA] border border-[#E8EAED] text-[#0B1B3A] font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div className="text-xs text-[#888888] flex items-center gap-1.5 flex-wrap">
                    <span>技术偏好:</span>
                    {item.skills.map((skill, sIdx) => (
                      <span key={skill} className="text-[#555555]">
                        {skill}
                        {sIdx < item.skills.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-5 mt-6 border-t border-[#F0F2F5] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.leader.avatar}
                      alt={item.leader.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#E8EAED]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#0B1B3A]">{item.leader.name}</div>
                      <div className="text-[11px] text-[#888888] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLikeRecruit(item.id)}
                      className={`p-2 rounded-full border transition-colors ${
                        item.hasLiked
                          ? 'text-rose-500 border-rose-200 bg-rose-50'
                          : 'text-[#888888] border-[#E8EAED] hover:bg-[#F7F8FA]'
                      }`}
                      title="点赞 / 关注"
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.hasLiked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleOpenApply(item)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-colors shadow-xs"
                    >
                      {t.square.applyJoin}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 创客名片墙（项目墙下方） */}
      <CardWall />

      {/* Modal: Publish Recruitment */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-8 shadow-floating border border-[#E8EAED] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8EAED] mb-4">
              <h3 className="text-lg font-bold text-[#0B1B3A]">发布项目队友招募</h3>
              <button
                onClick={() => setPublishModalOpen(false)}
                className="p-1.5 text-[#888888] hover:text-[#0B1B3A] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
                  招募项目方向 / 战队名称
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="例如: AgentMesh 分布式智能体总线"
                  className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
                  目标赛道
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewTrack('industry')}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      newTrack === 'industry'
                        ? 'bg-[#165DFF]/10 text-[#165DFF] border-[#165DFF]'
                        : 'border-[#E8EAED]'
                    }`}
                  >
                    产业赛道 (AI + Industry)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTrack('creator')}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      newTrack === 'creator'
                        ? 'bg-[#00C48C]/10 text-[#00C48C] border-[#00C48C]'
                        : 'border-[#E8EAED]'
                    }`}
                  >
                    自由赛道 (AI Creator)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
                  招募介绍与项目现状
                </label>
                <textarea
                  rows={3}
                  required
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="阐明项目的核心想法、目前已有的成果以及需要什么伙伴协同..."
                  className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
                  急需角色 (以顿号隔开)
                </label>
                <input
                  type="text"
                  required
                  value={newRoles}
                  onChange={e => setNewRoles(e.target.value)}
                  placeholder="例如: Rust核心研发、AI安全研究员"
                  className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
                  常驻城市 / 协作方式
                </label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  placeholder="例如: 深圳 (支持线上远程)"
                  className="w-full px-4 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E8EAED]">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="px-5 py-2 text-xs font-semibold text-[#666666]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full shadow-sm"
                >
                  提交机审并即时发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Apply to Join */}
      {applyModalOpen && applyingRecruit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-floating border border-[#E8EAED]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED] mb-3">
              <h3 className="text-base font-bold text-[#0B1B3A]">{tr('申请加入战队', 'Apply to Join')}</h3>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="p-1.5 text-[#888888] hover:text-[#0B1B3A] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {appliedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#00C48C] mx-auto" />
                <h4 className="text-base font-bold text-[#0B1B3A]">{tr('申请已提交！', 'Application Sent!')}</h4>
                <p className="text-xs text-[#666666]">队长将收到站内信审核提醒，48 小时内处理</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmApply} className="space-y-4">
                <div className="p-3 doa-panel text-xs">
                  <div className="font-semibold text-[#0B1B3A] mb-1">{applyingRecruit.title}</div>
                  <div className="text-[#666666]">队长：{applyingRecruit.leader.name}</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
                    向队长留言说明您的优势
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={applyMessage}
                    onChange={e => setApplyMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs focus:outline-none focus:border-[#165DFF]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E8EAED]">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#666666]"
                  >
                    {tr('取消', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full"
                  >
                    {tr('发送加入申请', 'Send Application')}
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
