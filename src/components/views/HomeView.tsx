import React, { useState } from 'react';
import confAuditorium from '../../assets/images/conference_auditorium_1790923976092.jpg';
import venueBazaar from '../../assets/images/venue_maker_bazaar_1790924729315.jpg';
import forumPanel from '../../assets/images/forum_panel_1790923996404.jpg';
import eveningParty from '../../assets/images/evening_after_party_1790924737645.jpg';
import { useApp } from '../../context/AppContext';
import { PeopleSection } from '../sections/PeopleSection';
import { DoAiLogo } from '../common/DoAiLogo';
import heroGlobeVideo from '../../assets/video/hero-globe.mp4';
import heroGlobePoster from '../../assets/video/hero-globe-poster.jpg';
import {
  ArrowRight,
  Play,
  FileText,
  Users,
  Calendar,
  Award,
  Video,
  Ticket,
  ChevronRight,
  MapPin,
  Footprints,
  Compass,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveRoute, setLoginModalOpen, currentUser, tr } = useApp();

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<{
    title: string;
    dateVenue: string;
    desc: string;
    img: string;
  } | null>(null);

  const quickNavItems = [
    {
      id: 'register',
      title: '赛事报名', titleEn: 'Contest Entry',
      subtitle: '双赛道 · 全球征集', subtitleEn: 'Dual tracks · Open worldwide',
      icon: FileText,
      iconColor: 'text-[#165DFF]',
      iconBg: 'bg-[#165DFF]/10',
      action: () => setActiveRoute('maker/tracks'),
    },
    {
      id: 'team',
      title: '组队社区', titleEn: 'Community',
      subtitle: '找到你的创意伙伴', subtitleEn: 'Find your creative partners',
      icon: Users,
      iconColor: 'text-[#00C48C]',
      iconBg: 'bg-[#00C48C]/10',
      action: () => setActiveRoute('square'),
    },
    {
      id: 'forum',
      title: '论坛预约', titleEn: 'Forums',
      subtitle: '18 个分会场 · 30—40 场', subtitleEn: '18 venues · 30–40 sessions',
      icon: Calendar,
      iconColor: 'text-[#FF4D4F]',
      iconBg: 'bg-[#FF4D4F]/10',
      action: () => setActiveRoute('forum'),
    },
    {
      id: 'showcase',
      title: '项目展示', titleEn: 'Showcase',
      subtitle: '入围项目 · 观众投票', subtitleEn: 'Finalists · Audience voting',
      icon: Award,
      iconColor: 'text-[#722ED1]',
      iconBg: 'bg-[#722ED1]/10',
      action: () => setActiveRoute('maker'),
    },
    {
      id: 'live',
      title: '直播中心', titleEn: 'Live',
      subtitle: '全球连线 · 实时观看', subtitleEn: 'Global streams · Watch live',
      icon: Video,
      iconColor: 'text-[#1890FF]',
      iconBg: 'bg-[#1890FF]/10',
      action: () => setActiveRoute('live'),
    },
    {
      id: 'tickets',
      title: '票务预约', titleEn: 'Tickets',
      subtitle: '门票 · 游园 · 市集', subtitleEn: 'Entry · fair · marketplace',
      icon: Ticket,
      iconColor: 'text-[#FA8C16]',
      iconBg: 'bg-[#FA8C16]/10',
      action: () => setActiveRoute('attend'),
    },
  ];

  const highlightCards = [
    {
      id: 'opening',
      title: '开幕式 & 社交', titleEn: 'Opening & Social',
      dateVenue: '11/14 德必大虹桥园区', dateVenueEn: '11/14 Dobe Park',
      img: confAuditorium,
      desc: '全球 AI 思想领袖与学术院士主旨演讲，开幕发布仪式，并举行首日创客交流酒会。',
    },
    {
      id: 'finals',
      title: '决赛路演 & 游园市集', titleEn: 'Finals & Maker Fair',
      dateVenue: '11/15 乐动虹桥', dateVenueEn: '11/15 LeDoong',
      img: venueBazaar,
      desc: '双赛道 30+ 决赛入围团队现场 Demo 路演与专家答辩；全天候沉浸式智能硬件市集与互动游园展区。',
    },
    {
      id: 'forums',
      title: '18个分会场', titleEn: '18 Forums',
      dateVenue: '全球AI创想，思想碰撞', dateVenueEn: 'Global AI ideas, live',
      img: forumPanel,
      desc: '覆盖 Agent 框架、具身智能、微机电、消费级创客硬件、商业出海等 18 个细分前沿议题。',
    },
    {
      id: 'party',
      title: 'After Party', titleEn: 'After Party',
      dateVenue: '与全球创客一起狂欢', dateVenueEn: 'Party with global makers',
      img: eveningParty,
      desc: '闭幕狂欢社交夜，电子音乐与生成式光影互动，全场创客举杯畅聊，交换数字名片与未来合作机会。',
    },
  ];

  return (
    <div className="pt-[72px] bg-white text-[#0B1B3A] overflow-hidden">
      {/* =========================================================================
          1. HERO SECTION — full-bleed looping globe film as the backdrop.
          Copy sits over the pale sky on the left; the film's own globe and
          city skyline carry the right side. Poster covers the first paint.
         ========================================================================= */}
      <section className="relative overflow-hidden bg-white text-[#0B1B3A]">
        {/* Background: looping globe film — muted, autoplay, seamless loop.
            Poster (a 2s frame) covers the first paint so there is no flash. */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroGlobeVideo}
          poster={heroGlobePoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        {/* 白色提亮渐变：左侧文字区对比度更高，右侧保留影片原貌 */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.42) 38%, rgba(255,255,255,0.10) 68%)',
          }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-28 lg:pb-36">
          <div className="max-w-[620px] space-y-4 lg:space-y-5">
            <div className="doa-rise doa-rise-1 flex items-center gap-2">
              <span className="h-px w-7 bg-[#165DFF]/70" aria-hidden="true" />
              <span className="text-[11px] lg:text-xs font-semibold text-[#165DFF] tracking-[0.28em]">
                {tr('智 汇 长 宁 · 创 享 全 球', 'CHANGNING · AI FOR EVERY MAKER')}
              </span>
            </div>

            <h1 className="doa-rise doa-rise-2 leading-[0.98]">
              <span className="block text-[#141B45]">
                <DoAiLogo className="h-[62px] sm:h-[76px] lg:h-[92px]" />
              </span>
              <span className="block text-[17px] sm:text-[22px] lg:text-[28px] font-black text-[#0B1B3A] tracking-[-0.01em] uppercase leading-[1.2] mt-3">
                Global AI Makers
              </span>
              <span className="block text-[17px] sm:text-[22px] lg:text-[28px] font-black text-[#0B1B3A] tracking-[-0.01em] uppercase leading-[1.2]">
                Conference
              </span>
              <span className="block text-[22px] sm:text-[30px] lg:text-[38px] font-bold text-[#1a2b4d] tracking-[-0.02em] leading-[1.15] mt-1.5">
                {tr('Dobe全球 AI 创客大会', 'DOBE Global AI Makers Conference')}
              </span>
            </h1>

            <div className="doa-rise doa-rise-3 space-y-1">
              <div className="text-[15px] sm:text-[17px] lg:text-[19px] font-bold text-[#0B1B3A]">
                {tr('AI 造物，人人创客', 'Build with AI. Everyone a Maker.')}
              </div>
              <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-[#5a6b85] leading-[1.7]">
                {tr('让 AI 从屏幕走进现实，', 'Bringing AI from the screen into reality —')}
                <br className="hidden sm:inline" />
                {tr('可逛、可玩、可学、可赛、可合作。', 'explore, play, learn, compete and collaborate.')}
              </p>
            </div>

            <div className="doa-rise doa-rise-4 flex flex-wrap items-center gap-2.5 lg:gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveRoute('maker/tracks')}
                className="group px-6 py-2.5 lg:px-7 lg:py-3 text-[12px] lg:text-sm font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full shadow-[0_8px_20px_rgba(22,93,255,0.28)] hover:shadow-[0_12px_28px_rgba(22,93,255,0.34)] transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DFF] focus-visible:ring-offset-2 active:scale-[0.97]"
              >
                <span>{tr('报名参赛', 'Enter the Contest')}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveRoute('forum')}
                className="px-5 py-2.5 lg:px-6 lg:py-3 text-[12px] lg:text-sm font-semibold text-[#165DFF] bg-white/85 hover:bg-white border border-[#165DFF] rounded-full backdrop-blur-sm transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DFF] focus-visible:ring-offset-2 active:scale-[0.97]"
              >
                <Ticket className="w-3.5 h-3.5 text-[#165DFF]" />
                <span>{tr('报名参会', 'Get Tickets')}</span>
              </button>
            </div>

            {/* ---------- Date / venue ---------- */}
            <div className="doa-rise doa-rise-5 flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
              <span className="text-[11px] font-mono text-[#55627a]">2026</span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-[#0B1B3A] tracking-tight">
                11.14 <span className="font-light text-[#b6c2d4]">——</span> 11.15
              </span>
              <span className="h-4 w-px bg-[#111111]/15" aria-hidden="true" />
              <span>
                <span className="block text-[13px] font-semibold text-[#1a2b4d] leading-tight">
                  {tr('上海 · 长宁', 'Shanghai · Changning')}
                </span>
                <span className="block text-[11px] text-[#55627a]">
                  {tr('德必大虹桥园区 × 乐动虹桥', 'Dobe Park × LeDoong Hongqiao')}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom fade into the next white section */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 lg:h-28 pointer-events-none z-10"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 94%)' }}
        />
      </section>



      {/* =========================================================================
          2. FLOATING QUICK NAVIGATION BAR (6 Features in a single rounded white bar)
         ========================================================================= */}
      <section className="relative z-30 -mt-10 sm:-mt-12 max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(22,93,255,0.08)] border border-[#EAECEF] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#F0F2F5]">
          {quickNavItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="group flex items-center gap-3.5 p-2 sm:px-3 text-left transition-all hover:translate-y-[-2px] focus:outline-none"
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1B3A] group-hover:text-[#165DFF] transition-colors">
                    {tr(item.title, item.titleEn)}
                  </h4>
                  <p className="text-[11px] text-[#888888] mt-0.5 whitespace-normal sm:whitespace-nowrap">
                    {tr(item.subtitle, item.subtitleEn)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. EVENT OVERVIEW ("活动亮点" - 4 Cards Layout)
         ========================================================================= */}
      <section className="py-20 lg:py-24 max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column Narrative */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-xs font-bold text-[#888888] tracking-widest uppercase">
              {tr('EVENT OVERVIEW', 'EVENT OVERVIEW')}
            </div>
            <h2 className="text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
              {tr('活动亮点', 'Event Highlights')}
            </h2>
            <p className="text-xs sm:text-[13px] text-[#666666] leading-relaxed">
              {tr('DOAI 全球 AI 创客大会是面向全球开发者、创业者、企业、大学生与公众的复合型 AI 创客大会，融合线上赛事、行业论坛、创客大赛、求职招聘、市集消费与互动体验于一体。', 'DOAI is a global AI makers conference for developers, founders, enterprises, students and the public — blending an online contest, industry forums, hiring, a maker market and hands-on experiences.')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveRoute('conference')}
                className="text-xs font-semibold text-[#165DFF] hover:text-[#1453E6] inline-flex items-center gap-1 group"
              >
                <span>{tr('了解更多', 'Learn more')}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: 4 Cards in a row (Matching Screenshot Exactly) */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlightCards.map(card => (
              <div
                key={card.id}
                onClick={() => setDetailModalItem(card)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E8EAED] hover:border-[#165DFF]/40 shadow-xs hover:shadow-premium transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Photo with subtle zoom on hover */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={card.img}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-bold text-[#0B1B3A] group-hover:text-[#165DFF] transition-colors">
                      {tr(card.title, card.titleEn)}
                    </h3>
                  </div>
                </div>

                {/* Card Footer with right arrow circle */}
                <div className="px-4 sm:px-5 pb-4 flex items-center justify-between text-xs text-[#888888] pt-1">
                  <span className="truncate pr-2">{tr(card.dateVenue, card.dateVenueEn)}</span>
                  <div className="w-6 h-6 rounded-full bg-[#F7F8FA] group-hover:bg-[#165DFF] text-[#888888] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <span className="text-xs font-bold leading-none">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. DUAL VENUE LAYOUT ("双会场布局" - Exact Diagram with walking path)
         ========================================================================= */}
      <section className="relative py-20 lg:py-24 bg-gradient-to-b from-[#EBF3FF]/60 via-[#F4F8FF]/40 to-white border-y border-[#EAEFF8] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-xs font-bold text-[#888888] tracking-widest uppercase">
                {tr('DUAL VENUE', 'DUAL VENUE')}
              </div>
              <h2 className="text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
                {tr('双会场布局', 'Two Venues')}
              </h2>
              <p className="text-xs sm:text-[13px] text-[#666666] leading-relaxed">
                {tr('德必大虹桥园区与乐动虹桥两大主会场，', 'Two main venues — Dobe Grand Hongqiao Park and LeDoong —')}
                <br />
                {tr('相距约500米，步行8–10分钟可达。', 'about 500m apart, an 8–10 minute walk.')}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setMapModalOpen(true)}
                  className="px-6 py-2.5 text-xs font-semibold text-[#165DFF] hover:text-[#1453E6] bg-white hover:bg-[#F5F8FF] border border-[#165DFF] rounded-full transition-all inline-flex items-center gap-1.5 shadow-xs"
                >
                  <span>{tr('查看会场地图', 'Venue Map')}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right: The Two Venue Cards with Connecting Walking Path (Exact Layout) */}
            <div className="lg:col-span-8 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center relative">
                {/* Connecting Curved Dotted Walking Path (Positioned between cards) */}
                <div className="hidden md:flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-[#165DFF] text-white flex items-center justify-center shadow-md animate-bounce">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <div className="mt-2 px-3 py-1 bg-white/95 backdrop-blur-md border border-[#165DFF]/30 rounded-full shadow-sm text-center">
                    <div className="text-xs font-bold text-[#165DFF]">{tr('约500m', '≈500m')}</div>
                    <div className="text-[10px] text-[#666666] whitespace-nowrap">{tr('步行8-10分钟', '8–10 min walk')}</div>
                  </div>
                </div>

                {/* Venue 1: 德必大虹桥园区 */}
                <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-floating hover:shadow-premium transition-all">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-[#0B1B3A]">
                      {tr('德必大虹桥园区', 'Dobe Grand Hongqiao Park')}
                    </h3>
                    <button
                      onClick={() => setMapModalOpen(true)}
                      className="w-6 h-6 rounded-full bg-[#F7F8FA] hover:bg-[#165DFF] text-[#888888] hover:text-white flex items-center justify-center text-xs transition-colors"
                    >
                      ↗
                    </button>
                  </div>

                  {/* Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#165DFF] rounded-lg">
                      {tr('11.14 下午 — 晚间', '11/14 Afternoon — Night')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#555555]">
                    <div className="font-semibold text-[#0B1B3A]">
                      {tr('开幕式论坛 · 自由社交 · After Party', 'Opening forum · social · after party')}
                    </div>
                    <div className="text-[#888888] text-[11px]">
                      部分赛道路演分会场 · 海外线上评审室
                    </div>
                  </div>
                </div>

                {/* Venue 2: 乐动虹桥 */}
                <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-floating hover:shadow-premium transition-all">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-[#0B1B3A]">
                      {tr('乐动虹桥', 'LeDoong Hongqiao')}
                    </h3>
                    <button
                      onClick={() => setMapModalOpen(true)}
                      className="w-6 h-6 rounded-full bg-[#F7F8FA] hover:bg-[#165DFF] text-[#888888] hover:text-white flex items-center justify-center text-xs transition-colors"
                    >
                      ↗
                    </button>
                  </div>

                  {/* Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#165DFF] rounded-lg">
                      {tr('11.15 全天', '11/15 All Day')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#555555]">
                    <div className="font-semibold text-[#0B1B3A]">
                      {tr('决赛路演 · 游园会 · 市集 · 分论坛', 'Finals · fair · market · forums')}
                    </div>
                    <div className="text-[#888888] text-[11px]">
                      AI 互动 · 招聘 · 晨商 · 航天体验论坛
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4.5 PEOPLE — 大赛主席团 · 专家评委团 · 生态伙伴
         ========================================================================= */}
      <PeopleSection />

      {/* =========================================================================
          5. GLOBAL PARTNERS — 合作方名片墙
          Meeting 2026-10-13: partners should read as proper name cards /
          posters, not a bare logo strip. Card grid with mark + name + tag.
         ========================================================================= */}
      <section className="py-14 sm:py-16 max-w-[1200px] mx-auto px-6 md:px-10 border-t border-[#F0F2F5]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <div className="doa-eyebrow">GLOBAL PARTNERS</div>
            <h3 className="text-lg font-bold text-[#0B1B3A] mt-1">{tr('全球合作伙伴', 'Global Partners')}</h3>
            <p className="text-xs text-[#888888] mt-1">
              {tr('感谢所有合作伙伴的支持，让 AI 创造更大的价值', 'With gratitude to our partners helping AI create greater value')}
            </p>
          </div>
          <button
            onClick={() => window.open('https://pcntu7vxqu2m.feishu.cn/share/base/shrcneQMxqly9NmTAFQXqzYj0xf', '_blank', 'noopener')}
            className="self-start lg:self-auto px-5 py-2.5 text-xs font-semibold text-[#165DFF] hover:text-[#1453E6] bg-white hover:bg-[#F5F8FF] border border-[#165DFF]/50 rounded-full transition-all inline-flex items-center gap-1.5"
          >
            {tr('成为合作伙伴 / 展商', 'Become a Partner / Exhibitor')}
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { mark: '原', markBg: 'bg-neutral-100', markText: 'text-neutral-700', name: '原子公社', en: 'AtomHub', tag: '社区伙伴', tagEn: 'Community' },
            { mark: 'DB', markBg: 'bg-[#165DFF]', markText: 'text-white', name: '德必集团', en: 'DOBE GROUP', tag: '主办场地', tagEn: 'Venue Host' },
            { mark: '长', markBg: 'bg-[#F2F7FF]', markText: 'text-[#165DFF]', name: '长宁区人民政府', en: 'Changning Gov.', tag: '指导单位', tagEn: 'Guiding Body' },
            { mark: 'MS', markBg: 'bg-[#F25022]/10', markText: 'text-[#F25022]', name: 'Microsoft', en: '微软', tag: '技术伙伴', tagEn: 'Technology' },
            { mark: 'N', markBg: 'bg-[#76B900]/10', markText: 'text-[#76B900]', name: 'NVIDIA', en: '英伟达', tag: '算力伙伴', tagEn: 'Compute' },
            { mark: 'intel', markBg: 'bg-[#0068B5]/10', markText: 'text-[#0068B5]', name: 'Intel', en: '英特尔', tag: '硬件伙伴', tagEn: 'Hardware' },
          ].map(p => (
            <div
              key={p.name}
              className="doa-card doa-card-hover p-4 flex flex-col items-start gap-3 min-h-[120px]"
            >
              <div
                className={`w-9 h-9 rounded-xl ${p.markBg} ${p.markText} flex items-center justify-center font-bold text-xs shrink-0`}
              >
                {p.mark}
              </div>
              <div className="mt-auto">
                <div className="text-[13px] font-bold text-[#0B1B3A] leading-tight truncate">{p.name}</div>
                <div className="text-[10px] text-[#98A6BE] tracking-tight truncate">{p.en}</div>
                <span className="inline-block mt-1.5 px-1.5 py-0.5 text-[10px] font-medium text-[#48597A] bg-[#F7FAFF] border border-[#E3ECFA] rounded">
                  {tr(p.tag, p.tagEn)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          MODAL: Venue Map Modal ("查看会场地图")
         ========================================================================= */}
      {mapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-floating border border-[#E8EAED] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8EAED] mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#0B1B3A]">{tr('DOAI 2026 双会场空间与路线导引', 'DOAI 2026 Venues & Walking Guide')}</h3>
                <p className="text-xs text-[#666666] mt-0.5">{tr('上海 · 长宁 · 德必大虹桥园区 ↔ 乐动虹桥', 'Shanghai · Changning · Dobe Park ↔ LeDoong')}</p>
              </div>
              <button
                onClick={() => setMapModalOpen(false)}
                className="p-1.5 text-[#888888] hover:text-[#0B1B3A] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs text-[#555555]">
              {/* Walking Route Guide */}
              <div className="p-5 bg-[#F5F8FF] rounded-2xl border border-[#165DFF]/20 space-y-2">
                <div className="font-bold text-[#165DFF] text-sm flex items-center gap-2">
                  <Footprints className="w-4 h-4" />
                  <span>步行接驳指引（约 500 米 · 8-10 分钟）</span>
                </div>
                <p className="leading-relaxed">
                  德必大虹桥园区（天山西路567号）出发，沿临虹路向北步行约 400 米至协和路交口即达乐动虹桥。沿途设有大会志愿者导引台与地面发光路标。
                </p>
              </div>

              {/* Venue 1 Breakdown */}
              <div className="p-4 doa-panel space-y-2">
                <div className="font-bold text-[#0B1B3A] text-sm">德必大虹桥园区 (11.14 主场)</div>
                <ul className="list-disc list-inside space-y-1 leading-relaxed text-[#666666]">
                  <li>德必主会场：开幕式、主办方战略发布、圆桌论坛、赛制发布与高校签约</li>
                  <li>2F 创客空中花园：自由社交茶歇、After Party 狂欢晚会</li>
                  <li>3F 国际研讨室：海外线上双向连线评审室与闭门路演分会场</li>
                </ul>
              </div>

              {/* Venue 2 Breakdown */}
              <div className="p-4 doa-panel space-y-2">
                <div className="font-bold text-[#0B1B3A] text-sm">乐动虹桥 (11.15 主场)</div>
                <ul className="list-disc list-inside space-y-1 leading-relaxed text-[#666666]">
                  <li>中庭路演大厅：30+ 决赛团队全天路演与答辩评审</li>
                  <li>A/B/C/D 分论坛厅：18 个垂直前沿技术与出海商业分论坛</li>
                  <li>户外创客市集展区：智能硬件、具身机器人、端侧推理装置互动游园</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E8EAED] flex justify-end">
              <button
                onClick={() => setMapModalOpen(false)}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full"
              >
                {tr('已了解', 'Got it')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: Event Highlight Details Modal
         ========================================================================= */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-floating border border-[#E8EAED]">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
              <img
                src={detailModalItem.img}
                alt={detailModalItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailModalItem(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#0B1B3A]">{detailModalItem.title}</h3>
            <div className="text-xs text-[#165DFF] font-semibold mt-1 mb-3">
              {detailModalItem.dateVenue}
            </div>
            <p className="text-xs text-[#666666] leading-relaxed mb-6">
              {detailModalItem.desc}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8EAED]">
              <button
                onClick={() => {
                  setDetailModalItem(null);
                  setActiveRoute('maker/tracks');
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full"
              >
                {tr('立即免费报名参会', 'Register Free Now')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
