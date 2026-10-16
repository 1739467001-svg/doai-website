import React, { useState } from 'react';
import confAuditorium from '../../assets/images/conference_auditorium_1790923976092.jpg';
import makersCollab from '../../assets/images/makers_collaborating_1790923986603.jpg';
import forumPanel from '../../assets/images/forum_panel_1790923996404.jpg';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MapPin,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ConferenceView: React.FC = () => {
  const { lang, setActiveRoute, tr } = useApp();
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');


  const scheduleData = {
    day1: [
      { time: '09:00 - 12:30', title: '报到签到与物料领取', speaker: '参赛团队 · 媒体 · 嘉宾', venue: '德必园区 · 签到区' },
      { time: '13:30 - 14:00', title: '开场：领导致辞', speaker: '政府领导 · 主办方', venue: '德必园区 · 主会场' },
      { time: '14:00 - 14:40', title: '主办方分享：战略发布与大会愿景', speaker: '原子公社 · 德必集团', venue: '德必园区 · 主会场' },
      { time: '14:40 - 15:40', title: '圆桌论坛：全球 AI 创客生态', speaker: '海外专家连线 · 投资人 · 创客代表', venue: '德必园区 · 主会场' },
      { time: '16:00 - 16:40', title: '赛制发布与高校签约', speaker: '组委会 · 高校代表', venue: '德必园区 · 主会场' },
      { time: '18:30 - 21:30', title: 'After Party 创客社交之夜', speaker: '全体参会创客', venue: '德必大虹桥园区' },
    ],
    day2: [
      { time: '09:30 起', title: '展区开市：市集 · 互动 · 求职 · 展商', speaker: '长宁味道市集 · AI 互动区', venue: '乐动虹桥 1F' },
      { time: '09:30 - 12:00', title: '决赛路演第一场：产业赛道（8+5 分钟制）', speaker: '入围产业赛道项目', venue: '乐动虹桥 1F 路演厅' },
      { time: '09:30 - 12:00', title: '自由赛道分会场路演 · 海外线上评审', speaker: '入围自由赛道项目 · 海外专家', venue: '德必园区' },
      { time: '09:30 - 12:00', title: '「逐梦星河」商业航天论坛（上午场）', speaker: '航天机构 · 科研院所', venue: '乐动虹桥 2F 航天馆' },
      { time: '13:30 - 16:00', title: '决赛路演第二场：自由赛道（8+5 分钟制）', speaker: '入围自由赛道项目', venue: '乐动虹桥 1F 路演厅' },
      { time: '13:30 - 17:00', title: '分论坛（7—8 场并行）', speaker: '各分会场承办方', venue: '乐动虹桥 3F' },
      { time: '16:30 - 17:30', title: '闭幕式：颁奖与项目落地签约', speaker: '组委会 · 企业代表', venue: '乐动虹桥 · 主会场' },
    ],
  };

  // Maps each inline agenda row below to a full entry in the schedule dataset,
  // in the same order, so "查看详情" lands on the right session.
  const dayScheduleIds: Record<string, string[]> = {
    day1: ['sch-101', 'sch-103', 'sch-104', 'sch-105', 'sch-106', 'sch-107'],
    day2: ['sch-201', 'sch-202', 'sch-203', 'sch-204', 'sch-205', 'sch-206', 'sch-207'],
  };

  return (
    <div className="pt-24 pb-20">
      {/* 1. Header Narrative */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#165DFF] tracking-wider uppercase">
            <span>{lang === 'zh' ? '大会愿景与使命' : 'Conference Vision & Mission'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0B1B3A] tracking-tight leading-tight">
            {lang === 'zh'
              ? '从信息互联到智能共生：全球 AI 创作者的新视界'
              : 'From Connectivity to Co-Intelligence: The Horizon of Global AI Creators'}
          </h1>
          <p className="text-base text-[#666666] leading-relaxed">
            {lang === 'zh'
              ? '过去二十年，互联网连接了全球的信息与节点；今天，人工智能正在连接人类的灵感与行动。DOAI 2026 是一场纯粹献给全球创造者的盛会，不设门槛、免费开放，让思想碰撞、让代码奔跑、让智能落地。'
              : 'In the past two decades, the internet connected distributed nodes of information. Today, AI connects human intention with instant execution. DOAI 2026 is an open-access sanctuary built exclusively for creators worldwide.'}
          </p>
        </div>
      </section>

      {/* 1.5 Conference hub — key figures + entry points to the three
          sub-sections of 大会介绍 (分论坛 / 大会报名 / 活动动态). */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: '大会时间', labelEn: 'When', value: '11.14 — 11.15', note: '周六 — 周日 · 两天', noteEn: 'Sat — Sun · 2 days' },
            { label: '线下人流', labelEn: 'On-site', value: '2000—4000', note: '人次 · 线上辐射 10 万+', noteEn: 'attendees · 100k+ online reach' },
            { label: '分会场', labelEn: 'Venues', value: '18', note: '两天合计 30—40 场', noteEn: '30–40 sessions over 2 days' },
            { label: '演讲嘉宾', labelEn: 'Speakers', value: '80—120', note: '位 · 含至少 1 位海外专家', noteEn: 'incl. 1+ international expert' },
          ].map((st, i) => (
            <div key={i} className="doa-card p-5">
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1.5">
                {tr(st.label, st.labelEn)}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight tabular-nums">
                {st.value}
              </div>
              <div className="text-[11px] text-[#6B7C9B] mt-1">{tr(st.note, st.noteEn)}</div>
            </div>
          ))}
        </div>

        {/* Entry cards to the three sub-sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              route: 'forum',
              eyebrow: 'FORUMS',
              title: '分论坛',
              desc: '18 个分会场，覆盖人才、创投、设计、航天、Agent 与应用前沿，按场次选座免费预约。',
              action: '浏览分会场',
            },
            {
              route: 'attend',
              eyebrow: 'ATTENDANCE',
              title: '大会报名',
              desc: '免费参会，全程不设付费通道。通票、公众开放日与分论坛选座，提交即刻生成电子凭证。',
              action: '立即报名参会',
            },
            {
              route: 'news',
              eyebrow: 'UPDATES',
              title: '活动动态',
              desc: '组委会公告、赛题发布、分会场与合作进展，第一时间在此更新。',
              action: '查看最新动态',
            },
          ].map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveRoute(c.route)}
              className="doa-card doa-card-hover p-6 text-left group"
            >
              <div className="doa-eyebrow mb-2.5">{c.eyebrow}</div>
              <h3 className="text-lg font-bold text-[#0B1B3A] mb-2 group-hover:text-[#165DFF] transition-colors">
                {c.title}
              </h3>
              <p className="text-[13px] text-[#6B7C9B] leading-relaxed mb-4">{c.desc}</p>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#165DFF]">
                {c.action}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </button>
          ))}
        </div>

        {/* Organisers, per the official plan */}
        <div className="doa-panel p-6 mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="text-[11px] uppercase tracking-widest text-[#98A6BE] font-semibold">主办单位</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#1A2B4D] font-semibold">
            <span>原子公社 AtomHub</span>
            <span className="text-[#C0CBDD]">×</span>
            <span>德必集团</span>
            <span className="text-[#C0CBDD]">|</span>
            <span className="text-[#48597A] font-normal">联合主办：上海市时代青年科创中心</span>
            <span className="text-[#C0CBDD]">|</span>
            <span className="text-[#48597A] font-normal">支持：长宁区人民政府</span>
          </div>
        </div>
      </section>

      {/* 2. Hero Editorial Photography Showcase */}
      <section id="conf-venue" className="max-w-[1200px] mx-auto px-6 sm:px-8 scroll-mt-24 py-6">
        <div className="relative rounded-3xl overflow-hidden border border-[#E8EAED] aspect-[16/9] sm:aspect-[21/9] shadow-floating">
          <img
            src={confAuditorium}
            alt="DOAI 2026 Auditorium"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8 sm:p-12">
            <div className="text-white max-w-xl space-y-2">
              <div className="text-xs uppercase tracking-wider text-neutral-300 font-semibold">
                DOAI Grand Auditorium
              </div>
              <h3 className="text-xl sm:text-3xl font-bold">
                {lang === 'zh' ? '汇聚全球 700+ 顶尖创客与智库先锋' : 'Gathering 700+ Global Creators & Researchers'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                2026.11.14 – 11.15 · 德必大虹桥园区 × 乐动虹桥 · 全球线上同步
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why DOAI Bento Section */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-16">
        <div id="conf-vision" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3A]">
            {lang === 'zh' ? '为什么参与 DOAI 2026？' : 'Why Participate in DOAI 2026?'}
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            {lang === 'zh' ? '不仅是一场会议，更是一套持续生长的数字化创客协作基础设施' : 'More than a summit—a sustainable digital creator collaboration infrastructure'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F7F8FA] rounded-3xl p-8 border border-[#E8EAED] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#165DFF]/10 text-[#165DFF] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-[#0B1B3A]">
                {lang === 'zh' ? '100% 免费与去中心化' : '100% Free & Decentralized'}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                全链路零报名费、零评审费。拒绝商业赞助包过，评审完全基于创新、代码与落地实用性，由业界公信力专家独立评判。
              </p>
            </div>
            <div className="pt-6 text-xs text-[#165DFF] font-medium flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#00C48C]" />
              <span>纯粹极客精神</span>
            </div>
          </div>

          <div className="bg-[#F7F8FA] rounded-3xl p-8 border border-[#E8EAED] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#00C48C]/10 text-[#00C48C] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-[#0B1B3A]">
                {lang === 'zh' ? '数字身份与终身网络' : 'Digital Passport & Mesh'}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                依托 atomclub.cn 统一账户发放 DOAI Passport，线下无感核销入场，支持现场碰一碰交换数字名片，积累长效创客声誉与人脉。
              </p>
            </div>
            <div className="pt-6 text-xs text-[#00C48C] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>可持续创客资产</span>
            </div>
          </div>

          <div className="bg-[#F7F8FA] rounded-3xl p-8 border border-[#E8EAED] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF7D00]/10 text-[#FF7D00] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-[#0B1B3A]">
                {lang === 'zh' ? '产业对接与真实场景' : 'Industry Integration & Grants'}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                双赛道覆盖真实工业/金融/企业服务落地场景。20 万元总奖金池，赛后直通常态化产业孵化与算力资源包支持。
              </p>
            </div>
            <div className="pt-6 text-xs text-[#FF7D00] font-medium flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              <span>真场景 · 真资本</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Two Editorial Visuals & Collaboration */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl overflow-hidden border border-[#E8EAED] relative group aspect-[4/3]">
            <img
              src={makersCollab}
              alt="Makers Collaborating"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white">
                <h4 className="text-lg font-bold">创客工坊与现场黑客松</h4>
                <p className="text-xs text-neutral-300 mt-1">48 小时极速原型冲刺，软硬一体敏捷迭代</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-[#E8EAED] relative group aspect-[4/3]">
            <img
              src={forumPanel}
              alt="Forum Panel"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white">
                <h4 className="text-lg font-bold">思想交流峰会与专家评审</h4>
                <p className="text-xs text-neutral-300 mt-1">全球顶尖导师面对面深度剖析技术路径与商业模式</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3-Day Agenda Schedule */}
      <section id="conf-schedule" className="max-w-[1200px] mx-auto px-6 sm:px-8 scroll-mt-24 py-16 doa-panel">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1B3A]">
              {lang === 'zh' ? '大会日程总览' : 'Full 3-Day Agenda'}
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              2026.11.15 – 11.17 · 每日精彩日程与会场指引
            </p>
          </div>

          {/* Day Selector Segmented Control */}
          <div className="flex items-center p-1 bg-white border border-[#E8EAED] rounded-xl self-start">
            {[
              { id: 'day1', label: 'Day 1 · 11/14 开幕与社交' },
              { id: 'day2', label: 'Day 2 · 11/15 赛果绽放' },
            ].map(day => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeDay === day.id
                    ? 'bg-[#165DFF] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#0B1B3A]'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Cards */}
        <div className="space-y-4">
          {scheduleData[activeDay].map((item, idx) => {
            // Each inline row maps to a full agenda entry so the CTA can
            // deep-link into that entry's detail page.
            const detailId = dayScheduleIds[activeDay]?.[idx];
            return (
            <div
              key={idx}
              className="doa-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-xs text-[#888888]">
                  <span className="font-mono text-[#165DFF] font-semibold">{item.time}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.venue}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#0B1B3A]">{item.title}</h4>
                <p className="text-xs text-[#666666]">{item.speaker}</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveRoute(detailId ? `detail/schedule/${detailId}` : 'forum')
                }
                className="self-start sm:self-center px-4 py-2 text-xs font-semibold text-[#165DFF] hover:bg-[#F2F7FF] rounded-full border border-[#A9CCFF] transition-colors whitespace-nowrap"
              >
                {detailId ? '查看详情 →' : '预约本场分论坛 →'}
              </button>
            </div>
          )})}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 pt-16 text-center">
        <h3 className="text-2xl font-bold text-[#0B1B3A]">
          {lang === 'zh' ? '准备好展示你的 AI 创造力了吗？' : 'Ready to Showcase Your AI Innovations?'}
        </h3>
        <p className="text-xs text-[#666666] mt-2 mb-6">
          报名参赛完全免费，提交项目申报即可锁定决赛入围评定资格
        </p>
        <button
          onClick={() => setActiveRoute('maker/tracks')}
          className="px-8 py-3.5 text-sm font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-all shadow-md inline-flex items-center gap-2"
        >
          <span>立即免费报名 AI 创客大赛</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
