import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Users,
  Award,
  FileText,
  Mail,
  Share2,
  Check,
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    registrations,
    tickets,
    exchangedCards,
    performCheckIn,
    lang,
    setLoginModalOpen,
    setActiveRoute,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'passport' | 'registrations' | 'team' | 'settings'>('passport');
  const [copiedId, setCopiedId] = useState(false);
  const [checkInNotice, setCheckInNotice] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="pt-32 pb-24 text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-full bg-[#165DFF]/10 text-[#165DFF] flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0B1B3A]">请先登录 DOAI 创客平台</h2>
        <p className="text-xs text-[#666666] mt-1 mb-6">
          登录后可查看专属 DOAI Passport、管理赛事申报、电子入场券及组队申请
        </p>
        <button
          onClick={() => setLoginModalOpen(true)}
          className="px-8 py-3 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full shadow-sm"
        >
          手机号快捷登录
        </button>
      </div>
    );
  }

  // Find user's current project submission
  const myRegistration = registrations.find(r =>
    r.members.some(m => m.name.includes(currentUser.name.split(' ')[0]))
  ) || registrations[0];

  const handleCopyMakerId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSimulateCheckIn = (ticketId: string) => {
    const success = performCheckIn(ticketId);
    if (success) {
      setCheckInNotice('现场核销成功！通行凭证已激活');
      setTimeout(() => setCheckInNotice(null), 2500);
    }
  };

  return (
    <div className="pt-24 pb-24 max-w-[1200px] mx-auto px-6 sm:px-8">
      {/* 1. Header Profile Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-[#E8EAED]">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#165DFF]/30 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0B1B3A]">{currentUser.name}</h1>
              {currentUser.atomclubBound && (
                <span className="text-[11px] font-semibold text-[#00C48C] bg-[#00C48C]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>atomclub 已绑定</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#666666] mt-1">{currentUser.bio}</p>
          </div>
        </div>

        {/* Quick Tabs Bar */}
        <div className="flex items-center p-1 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl self-start sm:self-center">
          {[
            { id: 'passport', label: '数字身份卡 (Passport)' },
            { id: 'registrations', label: '我的报名' },
            { id: 'team', label: '我的战队' },
            { id: 'settings', label: '资料与隐私' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#0B1B3A] shadow-xs'
                  : 'text-[#666666] hover:text-[#0B1B3A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Check In Success Notice Toast */}
      {checkInNotice && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-white rounded-2xl shadow-floating border border-[#00C48C] text-xs flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#00C48C]" />
          <div>
            <div className="font-bold text-[#0B1B3A]">{checkInNotice}</div>
            <div className="text-[#666666]">闸机已接收电子签到信号，祝参会愉快！</div>
          </div>
        </div>
      )}

      {/* Tab 1: DOAI Passport & Digital Passes */}
      {activeTab === 'passport' && (
        <div className="pt-8 space-y-12">
          {/* Apple Wallet Style DOAI Passport Card (420x260 ratio design spec #20) */}
          <div className="max-w-[440px] mx-auto">
            <div className="text-center text-xs font-semibold text-[#888888] uppercase tracking-wider mb-3">
              OFFICIAL DIGITAL PASSPORT · APPLE WALLET SPEC
            </div>

            <div className="relative w-full rounded-3xl p-7 bg-gradient-to-br from-[#111625] via-[#1A2238] to-[#0D111A] text-white shadow-floating border border-white/10 overflow-hidden">
              {/* Subtle dynamic iridescent shimmer */}
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#165DFF]/25 blur-3xl" />
              <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[#00C48C]/20 blur-3xl" />

              {/* Passport Header */}
              <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight">
                    DOAI <span className="text-[#165DFF]">PASSPORT</span>
                  </span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#00C48C] uppercase font-bold">
                  PASS · VERIFIED
                </div>
              </div>

              {/* Passport Body */}
              <div className="relative z-10 py-6 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider">CREATOR NAME</div>
                  <div className="text-xl font-bold mt-0.5">{currentUser.name}</div>
                  <div className="text-xs text-neutral-400 mt-1">{currentUser.city}</div>

                  <div className="mt-4">
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wider">MAKER IDENTIFIER</div>
                    <div className="text-sm font-mono font-bold text-[#165DFF]">
                      {myRegistration?.makerId || 'DOAI-2026-M8921'}
                    </div>
                  </div>
                </div>

                {/* Simulated QR Code for NFC and Gate Check-In */}
                <div className="p-2.5 bg-white rounded-2xl shadow-sm text-center">
                  <QrCode className="w-20 h-20 text-[#0B1B3A]" />
                  <div className="text-[8px] font-mono text-[#555555] mt-1 font-bold">NFC READY</div>
                </div>
              </div>

              {/* Passport Skills Footer */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                  {currentUser.skills.map((s, idx) => (
                    <span key={s} className="text-[11px] text-neutral-300">
                      {s}
                      {idx < currentUser.skills.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">2026.11</div>
              </div>
            </div>

            <p className="text-center text-[11px] text-[#888888] mt-3">
              现场入场时向工作人员出示二维码核销，或贴近 NFC 胸牌闸机感应通行
            </p>
          </div>

          {/* Digital Tickets (选手票 / 论坛预约) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0B1B3A]">我的电子通行凭证</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="doa-card p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#888888] mb-2">
                      <span className="font-semibold text-[#165DFF]">
                        {ticket.type === 'maker' ? '选手全场通行票' : '分论坛预约票'}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.status === 'checked_in'
                            ? 'bg-neutral-100 text-neutral-500'
                            : 'bg-[#00C48C]/10 text-[#00C48C]'
                        }`}
                      >
                        {ticket.status === 'checked_in' ? '已现场核销' : '有效凭证'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#0B1B3A] mb-1">{ticket.title}</h4>
                    <div className="text-xs text-[#666666] space-y-1">
                      <div>有效时间：{ticket.sessionTime}</div>
                      <div>通行区域：{ticket.venue}</div>
                      <div className="font-mono text-[11px] text-[#888888]">凭证码：{ticket.qrCode}</div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0F2F5] flex items-center justify-between">
                    <span className="text-[11px] text-[#888888]">持票人：{ticket.holderName}</span>
                    {ticket.status !== 'checked_in' && (
                      <button
                        onClick={() => handleSimulateCheckIn(ticket.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#165DFF] hover:bg-[#165DFF]/10 rounded-full border border-[#165DFF]/30 transition-colors"
                      >
                        模拟现场闸机扫码核销
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exchanged Digital Name Cards Box */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0B1B3A]">
              已互换的名片盒 ({exchangedCards.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {exchangedCards.map(card => (
                <div
                  key={card.id}
                  className="p-5 doa-panel space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={card.avatar}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-bold text-[#0B1B3A]">{card.name}</div>
                      <div className="text-[11px] text-[#888888]">{card.org}</div>
                    </div>
                  </div>

                  <div className="text-xs text-[#555555] space-y-1">
                    <div>联系方式：<span className="font-mono font-medium text-[#0B1B3A]">{card.phone}</span></div>
                    <div>常驻城市：{card.city}</div>
                  </div>

                  <div className="text-[10px] text-[#888888] pt-2 border-t border-[#E8EAED] flex items-center justify-between">
                    <span>互换日期: {card.exchangedAt}</span>
                    <span className="text-[#00C48C] font-semibold">互为创客同行</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Registrations State Machine */}
      {activeTab === 'registrations' && (
        <div className="pt-8 space-y-8">
          <div className="doa-card p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8EAED]">
              <div>
                <span className="text-xs font-semibold text-[#165DFF] uppercase tracking-wider">
                  CONTEST APPLICATION STATUS
                </span>
                <h3 className="text-2xl font-bold text-[#0B1B3A] mt-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveRoute(`detail/project/${myRegistration.id}`)}
                    className="text-left hover:text-[#165DFF] transition-colors"
                  >
                    {myRegistration.projectName}
                  </button>
                </h3>
                <div className="text-xs text-[#666666] mt-1">
                  所属赛道：{myRegistration.track === 'industry' ? '产业赛道' : '自由赛道'} · 提交于 {myRegistration.submittedAt}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    myRegistration.status === 'shortlisted'
                      ? 'bg-[#00C48C]/10 text-[#00C48C]'
                      : myRegistration.status === 'reviewing'
                      ? 'bg-[#165DFF]/10 text-[#165DFF]'
                      : myRegistration.status === 'needs_info'
                      ? 'bg-[#FF7D00]/10 text-[#FF7D00]'
                      : 'bg-red-50 text-red-500'
                  }`}
                >
                  {myRegistration.status === 'shortlisted'
                    ? '已通过初审 · 入围决赛'
                    : myRegistration.status === 'reviewing'
                    ? '智能机审通过 · 专家人工评审中'
                    : myRegistration.status === 'needs_info'
                    ? '需补充材料'
                    : '已驳回'}
                </span>
              </div>
            </div>

            {/* State Machine Visual Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-2">
              {[
                { title: '1. 提交成功', desc: '机审查重通过', done: true },
                { title: '2. 资格初筛', desc: '专家人工独立核验', done: true },
                {
                  title: '3. 入围决赛',
                  desc: '30+ 名单公示',
                  done: myRegistration.status === 'shortlisted',
                },
                { title: '4. 现场路演', desc: '乐动虹桥 1F 路演厅现场答辩', done: false },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs ${
                    step.done
                      ? 'bg-[#00C48C]/5 border-[#00C48C]/30 text-[#0B1B3A]'
                      : 'bg-[#F7F8FA] border-[#E8EAED] text-neutral-400'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{step.title}</span>
                    {step.done && <CheckCircle2 className="w-3.5 h-3.5 text-[#00C48C]" />}
                  </div>
                  <div className="text-[11px] mt-1">{step.desc}</div>
                </div>
              ))}
            </div>

            {/* Review Feedback Box */}
            {myRegistration.reviewFeedback && (
              <div className="p-5 doa-panel text-xs space-y-1">
                <div className="font-semibold text-[#0B1B3A] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#165DFF]" />
                  <span>评委会审核意见与指导反馈</span>
                </div>
                <p className="text-[#555555] leading-relaxed pt-1">
                  {myRegistration.reviewFeedback}
                </p>
              </div>
            )}

            {/* Submitted URLs info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 doa-panel">
                <div className="text-[#888888] mb-1">Demo 视频直链 (仅供评委保密评审)：</div>
                <a
                  href={myRegistration.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#165DFF] hover:underline flex items-center gap-1 truncate"
                >
                  <span className="truncate">{myRegistration.videoUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>

              <div className="p-4 doa-panel">
                <div className="text-[#888888] mb-1">项目白皮书 / 文档链接：</div>
                <a
                  href={myRegistration.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#165DFF] hover:underline flex items-center gap-1 truncate"
                >
                  <span className="truncate">{myRegistration.docUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Team Management */}
      {activeTab === 'team' && (
        <div className="pt-8 space-y-6">
          <div className="doa-card p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EAED]">
              <div>
                <h3 className="text-xl font-bold text-[#0B1B3A]">
                  战队管理：{myRegistration.teamName}
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  成员上限 5 人 · 负责人可生成专属免审邀请码
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#888888]">6 位专属邀请码：</span>
                <span className="px-3 py-1 bg-[#165DFF]/10 text-[#165DFF] font-mono font-bold text-xs rounded-lg">
                  {myRegistration.inviteCode}
                </span>
                <button
                  onClick={() => handleCopyMakerId(myRegistration.inviteCode)}
                  className="p-1 text-[#666666] hover:text-[#0B1B3A]"
                  title="复制邀请码"
                >
                  {copiedId ? <Check className="w-4 h-4 text-[#00C48C]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#0B1B3A]">现有成员名单</div>
              {myRegistration.members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 doa-panel text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B1B3A]">{member.name}</span>
                    <span className="text-[#888888] font-mono">{member.phone}</span>
                    <span className="px-2.5 py-0.5 bg-white border border-[#E8EAED] rounded-full text-[11px] text-[#555555]">
                      {member.roleTitle}
                    </span>
                    {member.isLeader && (
                      <span className="text-[10px] font-bold text-[#165DFF] bg-[#165DFF]/10 px-2 py-0.5 rounded-full">
                        战队队长
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Settings & Privacy */}
      {activeTab === 'settings' && (
        <div className="pt-8 max-w-2xl space-y-6">
          <div className="doa-card p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#0B1B3A] pb-4 border-b border-[#E8EAED]">
              创客资料与广场隐私设置
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 doa-panel">
                <div>
                  <div className="text-xs font-bold text-[#0B1B3A]">在组队广场公开展示我的人才卡</div>
                  <div className="text-[11px] text-[#666666]">
                    开启后，其他创客可在人才市场查阅您的特长并向您发送战队邀请
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentUser.isPublicInSquare}
                  onChange={e =>
                    setCurrentUser({ ...currentUser, isPublicInSquare: e.target.checked })
                  }
                  className="rounded text-[#165DFF] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 doa-panel">
                <div>
                  <div className="text-xs font-bold text-[#0B1B3A]">允许名片交换</div>
                  <div className="text-[11px] text-[#666666]">
                    开启后，现场及线上创客可向您发起数字名片交换请求
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={currentUser.allowCardExchange}
                  onChange={e =>
                    setCurrentUser({ ...currentUser, allowCardExchange: e.target.checked })
                  }
                  className="rounded text-[#165DFF] focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-4 doa-panel space-y-2 text-xs">
                <div className="font-semibold text-[#0B1B3A]">atomclub.cn 账号统一关联</div>
                <p className="text-[11px] text-[#666666]">
                  您的 DOAI 创客身份已与 atomclub.cn 手机主体保持双向绑定，如需注销仅清除 DOAI 赛事历史数据，主体账号不受影响。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
