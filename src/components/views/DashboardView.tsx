import React, { useState, useCallback, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { TeamPanel } from './TeamPanel';
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
  ChevronRight,
  RefreshCw,
  ImagePlus,
} from 'lucide-react';

/* ------------------------------------------------------------------
 * 个人资料编辑：改名 / 自定义头像 / AtomClub 头像一键同步
 * （点击头像也可直接同步 AtomClub 头像；自定义头像与名字可随时覆盖）
 * ------------------------------------------------------------------ */
const ProfileEditor: React.FC = () => {
  const { currentUser, setCurrentUser, saveProfile, tr } = useApp();
  const me = currentUser!;
  const [name, setName] = useState(me.name);
  const [avatarUrl, setAvatarUrl] = useState(me.avatar);
  const [notice, setNotice] = useState('');
  const [syncing, setSyncing] = useState(false);

  // 挂载后后端覆盖加载完成时（或外部同步头像后），本地输入跟随最新资料
  useEffect(() => {
    setName(me.name);
    setAvatarUrl(me.avatar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.name, me.avatar]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2600);
  };

  const syncAtomClub = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/atomclub/avatar?userId=${me.id}`);
      const d = await res.json();
      if (res.ok && d.ok) {
        setAvatarUrl(d.avatar);
        saveProfile({ avatar: d.avatar });
        setCurrentUser({ ...me, avatar: d.avatar });
        flash('已同步 AtomClub 头像');
      } else {
        flash(d.message || '同步失败');
      }
    } catch {
      flash('后端服务不可用');
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile({ name: name.trim(), avatar: avatarUrl.trim() });
    flash('个人资料已保存');
  };

  return (
    <div className="doa-card p-8 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-[#0B1B3A] pb-4 border-b border-[#E8EAED]">
        {tr('个人资料', 'Profile')}
      </h3>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* 头像：点击即同步 AtomClub */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={syncAtomClub}
            disabled={syncing || !me.atomclubBound}
            title={me.atomclubBound ? '点击同步 AtomClub 头像' : '未绑定 AtomClub'}
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#E3ECFA] hover:border-[#A9CCFF] transition-colors group disabled:cursor-default"
          >
            <img
              src={avatarUrl}
              alt={me.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {me.atomclubBound && (
              <span className="absolute inset-0 bg-[#0B1B3A]/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <RefreshCw className={`w-5 h-5 text-white ${syncing ? 'animate-spin' : ''}`} />
              </span>
            )}
          </button>
          {me.atomclubBound ? (
            <button
              type="button"
              onClick={syncAtomClub}
              disabled={syncing}
              className="text-[11px] font-semibold text-[#165DFF] hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
              {tr('同步 AtomClub 头像', 'Sync AtomClub Avatar')}
            </button>
          ) : (
            <span className="text-[11px] text-[#98A6BE]">{tr('未绑定 AtomClub', 'Not linked to AtomClub')}</span>
          )}
        </div>

        <form onSubmit={handleSave} className="flex-1 space-y-4 w-full">
          <div>
            <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
              {tr('昵称', 'Name')} <span className="text-red-500">*</span>
            </label>
            <input
              required
              maxLength={30}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
              <ImagePlus className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              {tr('自定义头像链接', 'Custom Avatar URL')}
              <span className="ml-2 font-normal text-[#98A6BE]">留空保持当前头像，保存后全站生效</span>
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm font-mono focus:outline-none focus:border-[#165DFF]"
            />
          </div>
          {notice && (
            <div className="p-3 rounded-xl bg-[#00C48C]/10 text-[#00876A] text-xs font-medium">{notice}</div>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-colors"
          >
            {tr('保存资料', 'Save Profile')}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------
 * 提交作品表单（会议 2026-10-13）：报名成功后提交三个链接
 * —— Demo 视频链接 / 可访问链接 / GitHub 链接
 * ------------------------------------------------------------------ */
const SubmitWorkForm: React.FC<{ registrationId: string; onDone?: () => void }> = ({
  registrationId,
}) => {
  const { submitWork, tr } = useApp();
  const [videoUrl, setVideoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState('');

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidUrl(videoUrl)) {
      setError('Demo 视频链接不合法（仅接受 http/https 外部公开直链，如 Bilibili / 腾讯视频 / YouTube）');
      return;
    }
    if (!isValidUrl(demoUrl)) {
      setError('可访问链接不合法（请填写可在线访问的项目地址）');
      return;
    }
    if (!/^https:\/\/github\.com\//.test(githubUrl.trim())) {
      setError('GitHub 仓库链接需以 https://github.com/ 开头');
      return;
    }
    submitWork(registrationId, {
      videoUrl: videoUrl.trim(),
      demoUrl: demoUrl.trim(),
      githubUrl: githubUrl.trim(),
    });
  };

  const field =
    'w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm font-mono focus:outline-none focus:border-[#165DFF]';

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 doa-panel space-y-4"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#FF8A1F]" />
        <div className="text-xs font-bold text-[#0B1B3A]">{tr('提交作品', 'Submit Work')}</div>
        <span className="text-[11px] text-[#98A6BE]">作品提交窗口：11/03 — 11/07 · 仅接受链接，不收文件</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
            {tr('1. Demo 视频链接', '1. Demo Video URL')} <span className="text-red-500">*</span>
            <span className="ml-2 font-normal text-[#888888]">支持 Bilibili / 腾讯视频 / YouTube</span>
          </label>
          <input
            type="url"
            required
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.bilibili.com/video/BV..."
            className={field}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
            {tr('2. 可访问链接（在线 Demo / 官网）', '2. Live URL (online demo / site)')} <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required
            value={demoUrl}
            onChange={e => setDemoUrl(e.target.value)}
            placeholder="https://your-demo.app"
            className={field}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
            {tr('3. GitHub 仓库链接', '3. GitHub Repo URL')} <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required
            value={githubUrl}
            onChange={e => setGithubUrl(e.target.value)}
            placeholder="https://github.com/your-team/your-repo"
            className={field}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-xl transition-colors"
      >
        {tr('提交作品', 'Submit Work')}
      </button>
    </form>
  );
};

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
    activeRoute,
    submitWork,
    tr,
  } = useApp();

  // 支持子路由直链：dashboard/registrations 等（报名成功后「去提交作品」用）
  const routeSub = activeRoute.split('/')[1];
  const initialTab =
    routeSub === 'registrations' || routeSub === 'team' || routeSub === 'settings'
      ? (routeSub as 'registrations' | 'team' | 'settings')
      : 'passport';
  const [activeTab, setActiveTab] = useState<'passport' | 'registrations' | 'team' | 'settings'>(initialTab);
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

  // 选手通行票（Passport 卡二维码的内容来源）
  const makerTicket = tickets.find(t => t.type === 'maker');

  // 现场核销：走后端校验（重复拦截 / 闸口记录 / 持久化），成功后更新本地状态
  const handleSimulateCheckIn = async (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ticket.qrCode, gate: '主入口', holder: ticket.holderName }),
      });
      const d = await res.json();
      if (res.ok && d.ok) {
        performCheckIn(ticketId);
        setCheckInNotice(`核销成功：${d.record.gate} · ${d.record.time}`);
      } else if (res.status === 409) {
        performCheckIn(ticketId);
        setCheckInNotice('该凭证已核销过（后台记录）');
      } else {
        setCheckInNotice(`核销失败：${d.message || '请稍后再试'}`);
      }
    } catch {
      setCheckInNotice('后端服务不可用，请确认 server.js 已启动');
    }
    setTimeout(() => setCheckInNotice(null), 3000);
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
                  <span>{tr('atomclub 已绑定', 'atomclub linked')}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#666666] mt-1">{currentUser.bio}</p>
          </div>
        </div>

        {/* Quick Tabs Bar — 移动端窄屏横向滚动，避免四个标签挤压断字 */}
        <div className="flex items-center p-1 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl self-start sm:self-center max-w-full overflow-x-auto">
          {[
            { id: 'passport', label: '数字身份卡 (Passport)', labelEn: 'Passport' },
            { id: 'registrations', label: '我的报名', labelEn: 'My Entries' },
            { id: 'team', label: '我的战队', labelEn: 'My Team' },
            { id: 'settings', label: '资料与隐私', labelEn: 'Profile & Privacy' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-[#0B1B3A] shadow-xs'
                  : 'text-[#666666] hover:text-[#0B1B3A]'
              }`}
            >
              {tr(tab.label, tab.labelEn)}
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

                {/* 入场二维码：编码选手数字身份通行码，闸机扫码核销 */}
                <div className="p-2.5 bg-white rounded-2xl shadow-sm text-center">
                  <QRCodeSVG
                    value={makerTicket?.qrCode || `DOAI-PASS-${myRegistration?.makerId || currentUser.id}`}
                    size={84}
                    level="M"
                    className="mx-auto block"
                  />
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
              {tr('现场入场时向工作人员出示二维码核销，或贴近 NFC 胸牌闸机感应通行', 'Show the QR at the gate or tap the NFC reader to enter.')}
            </p>
          </div>

          {/* Digital Tickets (选手票 / 论坛预约) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#0B1B3A]">{tr('我的电子通行凭证', 'My Digital Passes')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="doa-card p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#888888] mb-2">
                      <span className="font-semibold text-[#165DFF]">
                        {ticket.type === 'maker' ? tr('选手全场通行票', 'Maker All-Access Pass') : tr('分论坛预约票', 'Forum Reservation')}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.status === 'checked_in'
                            ? 'bg-neutral-100 text-neutral-500'
                            : 'bg-[#00C48C]/10 text-[#00C48C]'
                        }`}
                      >
                        {ticket.status === 'checked_in' ? tr('已现场核销', 'Checked In') : tr('有效凭证', 'Valid')}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#0B1B3A] mb-1">{ticket.title}</h4>
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-xs text-[#666666] space-y-1">
                        <div>{tr('有效时间', 'Valid')}: {ticket.sessionTime}</div>
                        <div>{tr('通行区域', 'Access')}: {ticket.venue}</div>
                        <div className="font-mono text-[11px] text-[#888888]">{tr('凭证码', 'Code')}: {ticket.qrCode}</div>
                      </div>
                      {/* 入场二维码：闸机扫码核销 */}
                      <div className="p-1.5 bg-white border border-[#E8EAED] rounded-lg shrink-0">
                        <QRCodeSVG value={ticket.qrCode} size={56} level="M" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0F2F5] flex items-center justify-between">
                    <span className="text-[11px] text-[#888888]">持票人：{ticket.holderName}</span>
                    {ticket.status !== 'checked_in' && (
                      <button
                        onClick={() => handleSimulateCheckIn(ticket.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#165DFF] hover:bg-[#165DFF]/10 rounded-full border border-[#165DFF]/30 transition-colors"
                      >
                        {tr('模拟现场闸机扫码核销', 'Simulate Gate Check-in')}
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
              {tr('已互换的名片盒', 'Exchanged Cards')} ({exchangedCards.length})
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

            {/* 提交作品（会议 2026-10-13：报名后提交 视频 / 可访问 / GitHub 三个链接） */}
            {myRegistration.submission ? (
              <div className="p-5 doa-panel space-y-2">
                <div className="font-semibold text-[#0B1B3A] text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00C48C]" />
                  <span>{tr('作品已提交', 'Work submitted')}（{myRegistration.submission.submittedAt}）</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs pt-1">
                  {[
                    { label: 'Demo 视频链接', url: myRegistration.submission.videoUrl },
                    { label: '可访问链接（在线 Demo）', url: myRegistration.submission.demoUrl },
                    { label: 'GitHub 仓库链接', url: myRegistration.submission.githubUrl },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-2 justify-between">
                      <span className="text-[#888888] shrink-0">{row.label}：</span>
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[#165DFF] hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{row.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <SubmitWorkForm registrationId={myRegistration.id} onDone={() => setActiveTab('registrations')} />
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Team Management（后端驱动：建队/移除队员/互关邀请） */}
      {activeTab === 'team' && <TeamPanel />}

      {/* Tab 4: Settings & Privacy */}
      {activeTab === 'settings' && (
        <div className="pt-8 max-w-2xl space-y-6">
          {/* 个人资料：改名 / 自定义头像 / AtomClub 同步 */}
          <ProfileEditor />

          <div className="doa-card p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-[#0B1B3A] pb-4 border-b border-[#E8EAED]">
              {tr('创客资料与广场隐私设置', 'Profile & Community Privacy')}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 doa-panel">
                <div>
                  <div className="text-xs font-bold text-[#0B1B3A]">{tr('在组队广场公开展示我的人才卡', 'Show my card on the Maker Wall')}</div>
                  <div className="text-[11px] text-[#666666]">
                    {tr('开启后，其他创客可在人才市场查阅您的特长并向您发送战队邀请', 'Others can find your card and send team invites.')}
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
                  <div className="text-xs font-bold text-[#0B1B3A]">{tr('允许名片交换', 'Allow card exchange')}</div>
                  <div className="text-[11px] text-[#666666]">
                    {tr('开启后，现场及线上创客可向您发起数字名片交换请求', 'Makers can send you card exchange requests.')}
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
                <div className="font-semibold text-[#0B1B3A]">{tr('atomclub.cn 账号统一关联', 'atomclub.cn Account Link')}</div>
                <p className="text-[11px] text-[#666666]">
                  您的 DOAI 创客身份已与 atomclub.cn 手机主体保持双向绑定，如需注销仅清除 DOAI 赛事历史数据，主体账号不受影响。
                </p>
              </div>
            </div>
          </div>

          {/* 退出登录（会议结论 2026-10-13：我的 DOAI 需要退出登录入口） */}
          <div className="doa-card p-8 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#0B1B3A]">{tr('退出登录', 'Sign Out')}</h3>
              <p className="text-[11px] text-[#666666] mt-0.5">
                退出后将返回官网首页，报名与战队数据保留在账号中
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentUser(null);
                setActiveRoute('home');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-red-600 hover:text-white hover:bg-red-500 border border-red-300 hover:border-red-500 rounded-full transition-colors shrink-0"
            >
              {tr('退出登录', 'Sign Out')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
