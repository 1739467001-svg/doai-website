/**
 * 大会报名 — conference attendance registration (as distinct from 赛事报名,
 * which is the contest entry). Mirrors the plan's 票务预约 module:
 * 「按分会场与场次选座预约，生成入场凭证」.
 *
 * Everything the plan states about attendance is honoured here:
 *   - 参会全程免费，不设任何付费通道（并给出防诈骗提示）
 *   - 双会场：11/14 德必大园区（开幕与社交），11/15 外滩德必园区（路演·游园·市集）
 *   - 游园 / 市集 / AI 互动区对公众开放
 *   - 需要名额的是开幕主会场、决赛路演厅与 18 个分会场
 */
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DetailShell } from '../detail/DetailShell';
import { event, venues as planVenues, forums as planForums, agenda } from '../../data/plan';
import {
  Ticket, Check, Users, Calendar, MapPin, QrCode, Download, AlertTriangle,
  Sparkles, Baby, Accessibility, Coffee,
} from 'lucide-react';

/* ------------------------------------------------------------ 参会类型 */

interface PassType {
  id: string;
  name: string;
  nameEn: string;
  audience: string;
  price: '免费';
  quota: string;
  perks: string[];
  needsSeat: boolean;
  badge: string;
  badgeEn?: string;
  audienceEn?: string;
  priceEn?: string;
  quotaEn?: string;
}

const PASS_TYPES: PassType[] = [
  {
    id: 'pass-full',
    name: '全程通票',
    nameEn: 'Full Pass',
    audience: '所有公众与创客', audienceEn: 'All visitors & makers',
    price: '免费', priceEn: 'Free',
    quota: '不限量', quotaEn: 'Unlimited',
    perks: [
      '11/14 德必园区签到与开幕主会场（需选座）',
      '11/15 外滩德必园区决赛路演厅（需选座）',
      'AI 创客游园会与 3F 选手作品展',
      '黄浦市集与 AI 互动区',
      '展商展位区与樊登书店求职功能区',
    ],
    needsSeat: true,
    badge: '推荐', badgeEn: 'Recommended',
  },
  {
    id: 'pass-day2',
    name: '公众开放日',
    nameEn: 'Open Day',
    audience: '面向普通观众与家庭', audienceEn: 'General public & families',
    price: '免费', priceEn: 'Free',
    quota: '不限量', quotaEn: 'Unlimited',
    perks: [
      '11/15 全天游园会、市集与 AI 互动大厅',
      '选手作品布展区自由参观',
      '游园护照与打卡集章',
      '不含开幕主会场与决赛路演厅席位',
    ],
    needsSeat: false,
    badge: '免预约', badgeEn: 'No booking',
  },
  {
    id: 'pass-forum',
    name: '分论坛选座',
    nameEn: 'Forums Only',
    audience: '有明确议题关注的观众', audienceEn: 'Focused forum-goers',
    price: '免费', priceEn: 'Free',
    quota: '按场次容量', quotaEn: 'Per-session capacity',
    perks: [
      '18 个分会场按场次选座预约',
      '同一时段可预约 1 场，场次间可连排',
      '开场前 48 小时可自助取消释放名额',
      '预约成功自动生成电子入场凭证',
    ],
    needsSeat: true,
    badge: '需选座', badgeEn: 'Seat pick',
  },
  {
    id: 'pass-media',
    name: '媒体 / 行业观摩',
    nameEn: 'Media & Industry',
    audience: '媒体、投资机构、产业方', audienceEn: 'Media, VCs, industry',
    price: '免费', priceEn: 'Free',
    quota: '审核制', quotaEn: 'By application',
    perks: [
      '开幕主会场与决赛路演厅优先席位',
      '媒体采访区与产业对接区通行',
      '需提交机构信息，组委会 3 个工作日内审核',
    ],
    needsSeat: true,
    badge: '审核制', badgeEn: 'Review',
  },
];

/* ------------------------------------------------------------ 页面 */

export const AttendView: React.FC = () => {
  const { currentUser, setLoginModalOpen, setActiveRoute, tickets, setTickets, setNotifications, tr } = useApp();

  const [selectedPass, setSelectedPass] = useState<string>('pass-full');
  const [seatPicks, setSeatPicks] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ name: '', phone: '', org: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const pass = PASS_TYPES.find(p => p.id === selectedPass)!;

  /* Seat options = the sessions that actually need capacity control. */
  const seatOptions = useMemo(
    () => [
      { id: 'seat-open', label: '开幕主会场', labelEn: 'Opening Main Hall', when: '11/14 13:00—17:30', place: '外滩德必园区', placeEn: 'Dobe Park', cap: 400 },
      { id: 'seat-roadshow', label: '决赛路演厅', labelEn: 'Finals Hall', when: '11/15 09:30—16:00', place: '外滩德必园区 · 路演厅', placeEn: 'LeDoong 1F', cap: 320 },
      { id: 'seat-orbit', label: '逐梦星河 · 商业航天论坛', labelEn: 'Aerospace Forum', when: '11/15', place: '外滩德必园区 2F', placeEn: 'LeDoong 2F', cap: 180 },
      { id: 'seat-afterparty', label: 'After Party 创客社交之夜', labelEn: 'After Party Night', when: '11/14 18:30—21:30', place: '外滩德必园区', placeEn: 'Dobe Park', cap: 300 },
    ],
    []
  );

  const myPassTickets = tickets.filter(t => t.type === 'guest' || t.title.includes('参会'));

  const toggleSeat = (id: string) => setSeatPicks(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    const name = form.name.trim() || currentUser.name;
    const phone = form.phone.trim() || currentUser.phone;
    if (!name || !phone) {
      setError('请填写姓名与手机号，以便生成入场凭证。');
      return;
    }
    const picked = Object.entries(seatPicks).filter(([, v]) => v).map(([k]) => k);
    if (pass.needsSeat && picked.length === 0) {
      setError('该票种需要至少选择 1 个场次席位。');
      return;
    }

    const seatLabels = seatOptions.filter(s => picked.includes(s.id)).map(s => s.label);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // 1) 生成参会凭证
    const newTickets = picked.length
      ? picked.map((sid, i) => {
          const seat = seatOptions.find(s => s.id === sid)!;
          return {
            id: `tkt-attend-${Date.now()}-${i}`,
            title: `DOAI 2026 参会凭证 · ${seat.label}`,
            titleEn: `DOAI 2026 Attendee Pass · ${seat.label}`,
            type: 'guest' as const,
            holderName: name,
            holderPhone: phone,
            qrCode: `DOAI-ATTEND-${sid.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'claimed' as const,
            sessionTime: seat.when,
            venue: seat.place,
            issuedAt: now,
          };
        })
      : [
          {
            id: `tkt-attend-${Date.now()}`,
            title: `DOAI 2026 参会凭证 · ${pass.name}`,
            titleEn: `DOAI 2026 Attendee Pass · ${pass.nameEn}`,
            type: 'guest' as const,
            holderName: name,
            holderPhone: phone,
            qrCode: `DOAI-ATTEND-${pass.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'claimed' as const,
            sessionTime: '2026-11-15 全天',
            venue: '外滩德必园区 · 公共展区',
            issuedAt: now,
          },
        ];

    setTickets(prev => [...newTickets, ...prev]);

    // 2) 推送通知
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'system' as const,
        title: '大会报名成功，电子入场凭证已生成',
        titleEn: 'Attendance confirmed — your pass is ready',
        content: `你已成功报名「${pass.name}」${
          seatLabels.length ? `，并预约 ${seatLabels.length} 个场次：${seatLabels.join('、')}` : ''
        }。凭证已存入「我的 DOAI」，现场扫码入场。`,
        contentEn: `Your "${pass.nameEn}" pass is confirmed and stored in My DOAI.`,
        time: '刚刚',
        read: false,
        link: 'dashboard',
      },
      ...prev,
    ]);

    setSubmitted(true);
  };

  /* ---------------- 已报名成功视图 ---------------- */
  if (submitted) {
    return (
      <DetailShell
        backRoute="conference"
        backLabel={tr('返回大会介绍', 'Back to Conference')}
        eyebrow="REGISTERED"
        title="报名成功"
        subtitle={tr(
          `已为你生成「${pass.name}」电子入场凭证，可在「我的 DOAI · 电子凭证」查看与出示。`,
          `Your "${pass.nameEn}" digital pass is ready — view it in My DOAI.`,
        )}
      >
        <div className="doa-card p-8 sm:p-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-11 h-11 rounded-2xl bg-[#00B487] text-white flex items-center justify-center">
              <Check className="w-6 h-6" />
            </span>
            <div>
              <div className="font-bold text-[#0B1B3A] text-lg">{tr(pass.name, pass.nameEn)}</div>
              <div className="text-[13px] text-[#6B7C9B]">凭电子凭证现场扫码入场，全程免费</div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F7FAFF] border border-[#E3ECFA] p-5 flex items-center gap-4 mb-6">
            <QrCode className="w-14 h-14 text-[#165DFF] shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">凭证编号</div>
              <code className="text-[13px] font-bold text-[#165DFF] break-all">
                {tickets[0]?.qrCode ?? '—'}
              </code>
              <div className="text-[12px] text-[#6B7C9B] mt-1.5">
                入场人：{form.name.trim() || currentUser?.name} · {form.phone.trim() || currentUser?.phone}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setActiveRoute('dashboard')} className="doa-btn doa-btn-primary">
              <Ticket className="w-4 h-4" /> 查看我的凭证
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setSeatPicks({});
              }}
              className="doa-btn doa-btn-ghost"
            >
              再报一个票种
            </button>
            <button type="button" onClick={() => setActiveRoute('live')} className="doa-btn doa-btn-ghost">
              前往直播中心
            </button>
          </div>
        </div>
      </DetailShell>
    );
  }

  /* ---------------- 报名表单视图 ---------------- */
  return (
    <DetailShell
      backRoute="conference"
      backLabel={tr('返回大会介绍', 'Back to Conference')}
      eyebrow="ATTENDANCE"
      title={tr('大会报名', 'Attend DOAI')}
      subtitle={tr(
          `${event.dateRange} · ${event.city} · 双会场步行 ${venueWalking()}。参会全程免费，凭电子凭证入场。`,
          'Nov 14–15 · Shanghai · two venues a short walk apart. Free entry with a digital pass.',
        )}
      meta={[
        { label: tr('大会日期', 'Dates'), value: event.dateLabel },
        { label: tr('会场', 'Venues'), value: tr('外滩德必园区', 'Bund Dobe Park') },
        { label: tr('报名费用', 'Fee'), value: tr('免费', 'Free') },
        { label: tr('已持有凭证', 'My Passes'), value: `${myPassTickets.length}` },
      ]}
      actions={
        <a href="#attend-form" className="doa-btn doa-btn-primary">
          <Ticket className="w-4 h-4" /> {tr('立即报名参会', 'Register to Attend')}
        </a>
      }
    >
      {/* ---------- 参会须知 ---------- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="doa-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-[#0B1B3A] mb-4 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-[#165DFF]" /> {tr('参会须知', 'Good to Know')}
          </h2>
          <ul className="space-y-3 text-[13px] text-[#48597A] leading-relaxed">
            {[
              tr('报名、参会、市集与游园全程免费，不设任何付费通道。', 'Registration, entry, fair and market are entirely free.'),
              tr('开幕主会场、决赛路演厅与分会场均需选座预约，席位有限先到先得。', 'Main hall, finals hall and forums need seat booking — first come, first served.'),
              tr('游园会、市集、AI 互动区与展商展位区对公众开放，无需预约。', 'Fairground, market, AI zones and exhibitors are open without booking.'),
              tr('凭电子凭证现场扫码入场，无需打印，也可出示「我的 DOAI」中的二维码。', 'Scan your digital pass at the gate — or show the QR in My DOAI.'),
              tr('如行程有变，请在活动开始前 48 小时取消预约，以便将名额释放给其他观众。', 'Plans changed? Cancel up to 48h before to release your seat.'),
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#165DFF] shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="doa-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#0B1B3A]">{tr('便民信息', 'Visitor Info')}</h2>
          {[
            { icon: Baby, label: '亲子友好', labelEn: 'Family friendly', desc: '11/15 游园会设亲子体验区', descEn: 'Family zone at the fair on 11/15' },
            { icon: Accessibility, label: '无障碍', labelEn: 'Accessible', desc: '两会场均有无障碍通道与电梯', descEn: 'Accessible routes & lifts at both venues' },
            { icon: Coffee, label: '餐饮', labelEn: 'Food', desc: '黄浦市集 8—12 家本地餐饮', descEn: '8–12 local food stalls at the market' },
            { icon: MapPin, label: '接驳', labelEn: 'Shuttle', desc: '两会场步行 8—10 分钟，现场设引导', descEn: 'Venues 8–10 min walk apart, guided' },
          ].map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#E4EFFF] text-[#165DFF] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-[#1A2B4D]">{tr(r.label, r.labelEn)}</div>
                  <div className="text-[12px] text-[#6B7C9B]">{tr(r.desc, r.descEn)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- 票种 ---------- */}
      <section className="mb-10">
        <div className="mb-5">
          <div className="doa-eyebrow mb-2.5">PASS TYPES</div>
          <h2 className="text-2xl font-extrabold text-[#0B1B3A] tracking-tight">{tr('选择参会类型', 'Choose a Pass')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PASS_TYPES.map(p => {
            const active = selectedPass === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPass(p.id)}
                aria-pressed={active}
                className={`doa-card p-6 text-left transition-all ${
                  active ? 'border-[#165DFF] ring-2 ring-[#165DFF]/15 shadow-[0_12px_30px_rgba(22,93,255,0.12)]' : 'doa-card-hover'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#0B1B3A] text-base">{p.name}</h3>
                      <span className="text-[11px] font-mono text-[#98A6BE]">{p.nameEn}</span>
                    </div>
                    <div className="text-[12px] text-[#6B7C9B] mt-0.5">{tr(p.audience, p.audienceEn)}</div>
                  </div>
                  <span
                    className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: '#E4EFFF', color: '#165DFF' }}
                  >
                    {tr(p.badge, p.badgeEn)}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-extrabold text-[#00B487]">{tr(p.price, p.priceEn)}</span>
                  <span className="text-[12px] text-[#98A6BE]">· {tr("名额", "quota")} {tr(p.quota, p.quotaEn)}</span>
                </div>

                <ul className="space-y-1.5">
                  {p.perks.map((k, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-[#48597A] leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-[#165DFF] shrink-0 mt-1.5" />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>

                {active && (
                  <div className="mt-4 pt-3 border-t border-[#EFF5FF] flex items-center gap-2 text-[12px] font-semibold text-[#165DFF]">
                    <Check className="w-4 h-4" /> 已选择
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------- 选座 ---------- */}
      {pass.needsSeat && (
        <section className="mb-10">
          <div className="mb-5">
            <div className="doa-eyebrow mb-2.5">SEAT RESERVATION</div>
            <h2 className="text-2xl font-extrabold text-[#0B1B3A] tracking-tight">场次选座</h2>
            <p className="text-[13px] text-[#6B7C9B] mt-1.5">
              以下场次设有容量上限，可多选；不选则仅入场公共区域。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seatOptions.map(s => {
              const on = !!seatPicks[s.id];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSeat(s.id)}
                  aria-pressed={on}
                  className={`doa-card p-5 text-left flex items-start gap-4 transition-all ${
                    on ? 'border-[#165DFF] ring-2 ring-[#165DFF]/15' : 'doa-card-hover'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      on ? 'bg-[#165DFF] border-[#165DFF]' : 'border-[#C0CBDD]'
                    }`}
                  >
                    {on && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-[#1A2B4D] text-sm">{tr(s.label, s.labelEn)}</div>
                    <div className="text-[12px] text-[#6B7C9B] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {s.when}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {tr(s.place, s.placeEn)}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 容量 {s.cap}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------- 报名表单 ---------- */}
      <section id="attend-form" className="scroll-mt-24 mb-10">
        <div className="doa-card p-6 sm:p-8 max-w-3xl">
          <h2 className="text-xl font-extrabold text-[#0B1B3A] mb-1.5">填写报名信息</h2>
          <p className="text-[13px] text-[#6B7C9B] mb-6">
            信息仅用于生成入场凭证与现场核验，不会用于任何商业用途。
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="doa-label" htmlFor="att-name">姓名 *</label>
                <input
                  id="att-name"
                  className="doa-input"
                  placeholder={currentUser?.name || '你的姓名'}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="doa-label" htmlFor="att-phone">手机号 *</label>
                <input
                  id="att-phone"
                  className="doa-input"
                  inputMode="tel"
                  placeholder={currentUser?.phone || '用于接收入场凭证'}
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="doa-label" htmlFor="att-org">机构 / 学校（选填）</label>
              <input
                id="att-org"
                className="doa-input"
                placeholder="用于制作参会证件"
                value={form.org}
                onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
              />
            </div>

            {/* summary */}
            <div className="rounded-2xl bg-[#F7FAFF] border border-[#E3ECFA] p-5">
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-2.5">
                报名摘要
              </div>
              <div className="space-y-1.5 text-[13px] text-[#48597A]">
                <div className="flex justify-between gap-4">
                  <span>参会类型</span>
                  <span className="font-semibold text-[#1A2B4D]">{tr(pass.name, pass.nameEn)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>费用</span>
                  <span className="font-semibold text-[#00B487]">免费</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>预约场次</span>
                  <span className="font-semibold text-[#1A2B4D]">
                    {Object.values(seatPicks).filter(Boolean).length || '未选座'}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-[#FFF1F0] border border-[#FFCCC7] p-4">
                <AlertTriangle className="w-4 h-4 text-[#E5484D] shrink-0 mt-0.5" />
                <span className="text-[13px] text-[#B42318]">{error}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="doa-btn doa-btn-primary">
                <Ticket className="w-4 h-4" /> 提交报名
              </button>
              <button type="button" onClick={() => setActiveRoute('forum')} className="doa-btn doa-btn-ghost">
                先浏览 18 个分会场
              </button>
            </div>

            <p className="text-[12px] text-[#98A6BE] flex items-start gap-2 pt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              大会全程免费。任何以「内部推荐」「保进席位」名义收费的行为均为诈骗，请提高警惕。
            </p>
          </form>
        </div>
      </section>

      {/* ---------- 凭证说明 ---------- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: QrCode, title: '凭证形式', desc: '提交后立即生成电子入场凭证，存于「我的 DOAI」。' },
          { icon: Users, title: '现场核验', desc: '入口扫码核验，一号一证，可带 1 名同行（需同场次）。' },
          { icon: Download, title: '改期与取消', desc: '开场前 48 小时可自助取消，释放的名额优先给候补观众。' },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="doa-card p-6">
              <Icon className="w-5 h-5 text-[#165DFF] mb-3" />
              <h3 className="font-bold text-[#0B1B3A] text-sm mb-1.5">{c.title}</h3>
              <p className="text-[13px] text-[#6B7C9B] leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </section>

      {/* ---------- 双会场速览 ---------- */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-[#0B1B3A] mb-5">双会场速览</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {planVenues.map((v, i) => (
            <div key={i} className="doa-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#165DFF]" />
                <h3 className="font-bold text-[#0B1B3A]">{v.name}</h3>
              </div>
              <div className="text-[12px] text-[#6B7C9B] mb-3">{v.role}</div>
              <ul className="space-y-2">
                {v.sessions.map((s, si) => (
                  <li key={si} className="text-[13px] text-[#48597A] leading-relaxed">
                    <span className="font-mono text-[12px] text-[#165DFF] font-semibold mr-2">{s.when}</span>
                    {s.content}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 议题参考 ---------- */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold text-[#0B1B3A]">18 个分会场议题</h2>
          <button type="button" onClick={() => setActiveRoute('forum')} className="text-[13px] font-semibold text-[#165DFF] hover:underline">
            查看全部并预约 →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {planForums.slice(0, 18).map((f, i) => (
            <span key={i} className="doa-chip">{f.name.replace('DOAI ', '')}</span>
          ))}
        </div>
      </section>
    </DetailShell>
  );
};

/** Small helper so the subtitle can quote the plan's walking time. */
function venueWalking() {
  return '8—10 分钟';
}