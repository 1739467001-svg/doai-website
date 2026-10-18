import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Cpu,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Award,
  AlertTriangle
} from 'lucide-react';

/* scrollTo: 'tracks' → 落地后平滑滚动到「双赛道设置」（报名参赛 CTA 统一先看赛道） */
export const MakerView: React.FC<{ scrollTo?: string | null }> = ({ scrollTo }) => {
  useEffect(() => {
    if (!scrollTo) return;
    const el = document.getElementById(`maker-${scrollTo}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [scrollTo]);
  const { lang, setActiveRoute, openPolicy, tr } = useApp();


  // 3 天线下黑客松赛程（飞书《赛事方案》四、三天详细赛程安排）
  const DAYS = [
    {
      day: 'Day 1（周五）',
      theme: tr('签到集结 · 重磅发布 · 破冰组队', 'Check-in · Launch · Team-up Night'),
      items: [
        { time: '14:00—16:00', name: tr('签到入场', 'Check-in'), desc: tr('领取赛事物料包（胸牌、赛程手册、周边礼品），自由参观展区', 'Collect your kit and explore the expo') },
        { time: '16:00—18:00', name: tr('开幕盛典暨战略发布会', 'Opening Ceremony'), desc: tr('黄浦区领导致辞发布 AI 产业扶持政策；德必 OPC 战略发布；战略合作签约；评审团公布', 'Policy release, OPC strategy, partnership signing, jury announcement') },
        { time: '18:00—19:30', name: tr('欢迎晚宴', 'Welcome Dinner'), desc: tr('政府嘉宾、企业代表、投资人、参赛团队共进晚餐', 'Dinner with officials, enterprises, investors and teams') },
        { time: '19:30—21:30', name: tr('破冰组队夜', 'Team-up Night'), desc: tr('电梯演讲 · 命题企业现场解读 · 自由组队 · 公布次日任务', 'Pitches, brief walk-throughs, team formation, next-day briefing') },
      ],
    },
    {
      day: 'Day 2（周六）',
      theme: tr('创客攻坚 · 产品打磨 · 物料制作', 'Build Sprint'),
      items: [
        { time: '09:00—09:30', name: tr('开发启动会', 'Kick-off'), desc: tr('明确当日产出：Demo、海报、1 分钟宣传视频、路演 PPT 初稿', 'Deliverables: demo, poster, video, deck draft') },
        { time: '09:30—12:00', name: tr('集中开发 & 导师巡场', 'Hacking & Mentors'), desc: tr('技术导师、产业导师分赛道巡场，一对一答疑', 'Tech & industry mentors on the floor') },
        { time: '13:30—17:30', name: tr('物料制作 & 专项辅导', 'Assets & Coaching'), desc: tr('路演表达工作坊 · 海报设计指导站 · 命题企业二次驻场', 'Pitch workshop, poster clinic, enterprise office hours') },
        { time: '18:30—22:00', name: tr('深夜打磨 & 宵夜补给', 'Late-night Polish'), desc: tr('22:00 作品提交截止（产品原型 · 海报 · 宣传视频 · 路演 PPT）', 'Submission deadline at 22:00') },
      ],
    },
    {
      day: 'Day 3（周日）',
      theme: tr('游园展示 · 决赛路演 · 收官派对', 'Expo · Finals · Party'),
      items: [
        { time: '09:00—12:00', name: tr('AI 创客游园会', 'Maker Expo'), desc: tr('项目快闪区 + 产业对接市集，观众自由参观互动', 'Team booths + industry matchmaking market') },
        { time: '13:30—17:00', name: tr('决赛路演暨颁奖典礼', 'Finals & Awards'), desc: tr('每队 8 分钟展示 + 5 分钟评委问答，现场统分并颁奖', '8-min pitch + 5-min Q&A, live scoring and awards') },
        { time: '17:00—18:00', name: tr('媒体专访 & 自由交流', 'Media & Mixer'), desc: tr('获奖团队与嘉宾接受媒体采访，参会各方自由对接', 'Media interviews and open networking') },
        { time: '18:30—21:30', name: tr('外滩 After Party', 'Bund After Party'), desc: tr('外滩露台轻奢酒会，促进创业者、投资人、产业方深度社交', 'Rooftop social overlooking the Bund') },
      ],
    },
  ];

  return (
    <div className="pt-24 pb-24">
      {/* 1. Header Banner */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#165DFF] tracking-wider uppercase">
            <span>DOAI 2026 AI MAKER CONTEST</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0B1B3A] tracking-tight leading-tight">
            {lang === 'zh'
              ? 'AI 创客大赛：探索下一代智能应用'
              : 'AI Maker Contest: Forging Next-Gen Intelligent Applications'}
          </h1>
          <p className="text-base text-[#666666] leading-relaxed">
            {lang === 'zh'
              ? '面向全球极客与商业探索者的全开放式 AI 赛事。设置「产业命题赛道」与「自由创意赛道」，20 万元总奖金池，3 天线下黑客松，全链路免费参赛。以真实代码与产品说话，让最顶尖的创造力破土而出。'
              : 'A 3-day on-site hackathon with two tracks — Free Creation and Industry Brief — and a ¥200,000 prize pool. Free to enter.'}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={() => setActiveRoute('maker/tracks')}
              className="px-8 py-3.5 text-sm font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>{tr('立即免费报名参赛', 'Register Free Now')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveRoute('square')}
              className="px-6 py-3.5 text-sm font-semibold text-[#0B1B3A] hover:text-[#165DFF] bg-white border border-[#E8EAED] rounded-full transition-all"
            >
              {tr('去组队广场找队友', 'Find Teammates')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Dual Tracks Deep Dive */}
      <section id="maker-tracks" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#0B1B3A]">{tr('赛事双赛道设置', 'Dual Tracks')}</h2>
          <p className="text-xs text-[#666666] mt-1">
            {tr('参赛项目申报时须选择其中一个主赛道方向，评审维度将根据赛道特性差异化考量', 'Pick one track when entering — judging criteria differ by track.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Industry Track Card */}
          <div id="maker-industry" className="bg-[#F7F8FA] rounded-3xl p-8 sm:p-10 border border-[#E8EAED] flex flex-col justify-between scroll-mt-28">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#165DFF]/10 text-[#165DFF] flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B1B3A]">
                {tr('产业命题赛道', 'Industry Brief Track')}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                联合黄浦区/德必园区龙头产业企业发布真实业务需求，参赛团队定向解题，获奖项目优先获得企业采购订单与深度合作机会。
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-[#0B1B3A]">{tr('命题方向：', 'Directions:')}</div>
                <ul className="text-xs text-[#555555] space-y-1.5 list-disc list-inside">
                  <li>{tr('金融科技命题（合作方待官宣）', 'FinTech brief (TBA)')}</li>
                  <li>{tr('商贸零售命题（合作方待官宣）', 'Retail brief (TBA)')}</li>
                  <li>{tr('文旅服务命题（合作方待官宣）', 'Cultural tourism brief (TBA)')}</li>
                  <li>{tr('AIGC 宣传视频命题（合作方待官宣）', 'AIGC video brief (TBA)')}</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-[#E8EAED] mt-6">
              <span className="text-xs text-[#888888]">{tr('重点考量：商业可行性与商业落地闭环', 'Focus: business viability & closed loop')}</span>
              <button
                onClick={() => setActiveRoute('track/industry')}
                className="px-4 py-2 text-xs font-semibold text-[#165DFF] bg-[#165DFF]/5 hover:bg-[#165DFF]/10 rounded-full transition-colors"
              >
                {tr('申报赛道 · 查看详情 →', 'View Track & Enter →')}
              </button>
            </div>
          </div>

          {/* Creator Track Card */}
          <div id="maker-creator" className="bg-[#F7F8FA] rounded-3xl p-8 sm:p-10 border border-[#E8EAED] flex flex-col justify-between scroll-mt-28">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00C48C]/10 text-[#00C48C] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B1B3A]">
                {tr('自由创意赛道', 'Free Creation Track')}
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                面向全球 AI 创业者、开发者、硬件工程师与设计师开放，下设两大平行子赛道，独立评审、独立颁奖。
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-[#0B1B3A]">{tr('命题方向：', 'Directions:')}</div>
                <ul className="text-xs text-[#555555] space-y-1.5 list-disc list-inside">
                  <li>{tr('AI+软件赛道：行业大模型、AI SaaS、智能决策、AIGC 工具、AI 企业服务、金融科技算法、智慧城市', 'AI+Software: industry LLMs, AI SaaS, decision systems, AIGC tools, fintech algorithms, smart city')}</li>
                  <li>{tr('AI+硬件赛道：AI 智能终端、嵌入式 AI、服务机器人、可穿戴、AIoT、商业智能硬件、文旅数字硬件', 'AI+Hardware: smart devices, embedded AI, service robots, wearables, AIoT, cultural-tourism hardware')}</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-[#E8EAED] mt-6">
              <span className="text-xs text-[#888888]">{tr('重点考量：突破性技术创新与极客精神', 'Focus: breakthrough innovation & maker spirit')}</span>
              <button
                onClick={() => setActiveRoute('track/creator')}
                className="px-4 py-2 text-xs font-semibold text-[#00C48C] bg-[#00C48C]/5 hover:bg-[#00C48C]/10 rounded-full transition-colors"
              >
                {tr('申报赛道 · 查看详情 →', 'View Track & Enter →')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Timeline (Apple Design style) */}
      <section id="maker-timeline" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#0B1B3A]">{tr('赛事流程与关键节点', 'Contest Timeline')}</h2>
          <p className="text-xs text-[#666666] mt-1">
            {tr('线下黑客松三天全流程 · 场地：外滩德必园区', 'Three days on-site at Bund Dobe Park')}
          </p>
        </div>

        <div className="space-y-10">
          {DAYS.map(day => (
            <div key={day.day}>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-lg font-extrabold font-mono text-[#165DFF]">{day.day}</span>
                <span className="text-base font-bold text-[#0B1B3A]">{day.theme}</span>
              </div>
              <div className="space-y-3">
                {day.items.map((item, i) => (
                  <div
                    key={i}
                    className="doa-card p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6"
                  >
                    <span className="text-xs font-mono font-bold text-[#165DFF] w-32 shrink-0">
                      {item.time}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0B1B3A]">{item.name}</h4>
                      <p className="text-xs text-[#666666] leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Scoring Criteria (4 Dimensions) */}
      <section id="maker-scoring" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0B1B3A]">{tr('评审维度', 'Judging Criteria')}</h2>
          <p className="text-xs text-[#666666] mt-1">
            {tr('五大评审维度，权重分配待评审委员会公布', 'Five dimensions; weights to be announced by the jury committee.')}
          </p>
        </div>

        <div className="doa-card p-7">
          <p className="text-sm text-[#48597A] leading-relaxed mb-5">
            {tr('综合衡量技术、商业与落地表现，权重分配待评审委员会公布。', 'Five dimensions; weights to be announced by the jury committee.')}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {[
              [tr('技术创新性', ''), tr('商业可行性', ''), tr('产业适配度', ''), tr('团队与落地力', ''), tr('需求匹配度', '')],
            ].flat().map((d, i) => (
              <span key={i} className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#165DFF] bg-[#165DFF]/5 border border-[#165DFF]/25">
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Award Showcase (Apple Design Award style) */}
      <section id="maker-awards" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-16">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0B1B3A]">{tr('奖项体系', 'Awards')}</h2>
          <p className="text-xs text-[#666666] mt-2">
            {tr('总奖金池 20 万元整 · 赛道等级奖 12 万 + 专项荣誉奖 5 万 + 普惠激励奖 3 万', '¥200,000 total prize pool · track awards + special honors + participation grants')}
          </p>
        </div>

        <div className="space-y-6">
          {/* 等级奖 */}
          <div className="doa-card p-7" style={{ borderTop: '3px solid #165DFF' }}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h3 className="text-lg font-bold text-[#0B1B3A]">{tr('赛道等级奖', 'Track Awards')}</h3>
              <span className="text-2xl font-extrabold font-mono text-[#165DFF]">¥120,000</span>
            </div>
            <p className="text-xs text-[#666666] mb-5">{tr('覆盖 20 支团队', '20 winning teams')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#E8EAED]">
                <div className="text-sm font-bold text-[#0B1B3A] mb-1">{tr('自由创意赛道', 'Free Creation Track')}</div>
                <div className="text-xs text-[#888888] mb-3">{tr('两大子赛道独立评奖 · 合计 8 万元', 'Two sub-tracks judged independently · ¥80,000')}</div>
                <ul className="text-xs text-[#48597A] space-y-1.5">
                  <li>{tr('AI+软件赛道（4 万）', 'AI+Software (¥40,000)')}：{tr('金奖 1 名 ¥15,000 / 银奖 2 名 各 ¥8,000 / 铜奖 3 名 各 ¥3,000', 'Gold ×1 ¥15,000 · Silver ×2 ¥8,000 · Bronze ×3 ¥3,000')}</li>
                  <li>{tr('AI+硬件赛道（4 万）', 'AI+Hardware (¥40,000)')}：{tr('金奖 1 名 ¥15,000 / 银奖 2 名 各 ¥8,000 / 铜奖 3 名 各 ¥3,000', 'Gold ×1 ¥15,000 · Silver ×2 ¥8,000 · Bronze ×3 ¥3,000')}</li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#E8EAED]">
                <div className="text-sm font-bold text-[#0B1B3A] mb-1">{tr('产业命题赛道', 'Industry Brief Track')}</div>
                <div className="text-xs text-[#888888] mb-3">{tr('4 大命题独立评奖 · 合计 4 万元', 'Four briefs judged independently · ¥40,000')}</div>
                <ul className="text-xs text-[#48597A] space-y-1.5">
                  <li>{tr('单个命题 金奖 1 名：¥8,000 + 企业 POC 合作绿色通道', 'Gold ×1 per brief: ¥8,000 + enterprise POC fast track')}</li>
                  <li>{tr('单个命题 优秀奖 1 名：¥2,000 + 企业供应商体系入库资格', 'Honorable mention ×1 per brief: ¥2,000 + vendor onboarding')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 专项荣誉奖 */}
          <div className="doa-card p-7" style={{ borderTop: '3px solid #FF7D00' }}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h3 className="text-lg font-bold text-[#0B1B3A]">{tr('专项荣誉奖', 'Special Honors')}</h3>
              <span className="text-2xl font-extrabold font-mono text-[#FF7D00]">¥50,000</span>
            </div>
            <p className="text-xs text-[#666666] mb-4">{tr('跨赛道评选，可与等级奖兼得', 'Cross-track, stackable with track awards')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {[
                [tr('最佳技术创新奖', ''), '¥12,000', tr('技术壁垒最高、AI 应用最前沿', 'Deepest technical moat')],
                [tr('最具商业价值奖', ''), '¥12,000', tr('商业模式清晰、盈利空间明确', 'Clear monetization path')],
                [tr('最佳人气奖', ''), '¥10,000', tr('游园会观众投票 + 线上传播数据综合选出', 'Audience vote + online reach')],
                [tr('最佳落地潜力奖', ''), '¥6,000', tr('高度适配黄浦产业生态', 'Best fit with Huangpu ecosystem')],
                [tr('最佳创意设计奖', ''), '¥5,000', tr('产品设计 · 海报 · 宣传视频创意呈现', 'Product, poster & video creativity')],
                [tr('最佳黑马团队奖', ''), '¥3,000', tr('成立不满 1 年的学生团队 / 现场组队', 'Student or on-site teams under 1 year')],
                [tr('最佳产业适配奖', ''), '¥2,000', tr('最贴合企业真实业务需求', 'Closest to real business needs')],
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#F7F8FA] border border-[#E8EAED]">
                  <span className="font-semibold text-[#0B1B3A]">{row[0]}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-[11px] text-[#888888] hidden sm:inline">{row[2]}</span>
                    <span className="font-mono font-bold text-[#FF7D00]">{row[1]}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 普惠激励奖 */}
          <div className="doa-card p-7" style={{ borderTop: '3px solid #00C48C' }}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h3 className="text-lg font-bold text-[#0B1B3A]">{tr('普惠激励奖', 'Participation Grants')}</h3>
              <span className="text-2xl font-extrabold font-mono text-[#00C48C]">¥30,000</span>
            </div>
            <p className="text-xs text-[#666666] mb-4">{tr('覆盖所有完赛团队：预计 30 支', 'All teams completing the hackathon: ~30 teams')}</p>
            <ul className="text-xs text-[#48597A] space-y-2">
              <li>{tr('完赛现金补贴：每支完赛团队 ¥1,000', 'Cash grant: ¥1,000 per completing team')}</li>
              <li>{tr('完赛纪念权益包', 'Commemorative package')}：</li>
              <li className="pl-4 text-[#888888]">· {tr('赛事定制周边礼盒', 'Custom merch box')}</li>
              <li className="pl-4 text-[#888888]">· {tr('德必园区 1 个月免费开放工位体验', '1-month free desk at Dobe Park')}</li>
              <li className="pl-4 text-[#888888]">· 100 元 {tr('AI 算力资源补贴券', 'AI compute voucher')}</li>
              <li className="pl-4 text-[#888888]">· {tr('黄浦区创业政策申报专属辅导服务', 'Huangpu startup policy application coaching')}</li>
            </ul>
          </div>
        </div>

        <div className="doa-panel p-7 mt-6">
          <h3 className="font-bold text-[#0B1B3A] text-base mb-4">{tr('评审机制', 'Jury')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-2.5">
                {tr('评审团构成（12—15 名）', 'Jury Composition (12–15)')}
              </div>
              <ul className="space-y-2">
                {[
                  { g: '政府产业代表', gEn: 'Government', c: '2—3 名', cEn: '2–3' },
                  { g: '产业企业代表', gEn: 'Industry', c: '4 名', cEn: '4' },
                  { g: '资深投资人', gEn: 'Investors', c: '3—4 名', cEn: '3–4' },
                  { g: '技术专家（含海外）', gEn: 'Tech experts (intl.)', c: '2—3 名', cEn: '2–3' },
                  { g: '主办方代表', gEn: 'Organizers', c: '2 名', cEn: '2' },
                ].map((row, i) => (
                  <li key={i} className="flex items-center justify-between text-[13px] py-1.5 border-b border-[#E3ECFA] last:border-0">
                    <span className="text-[#48597A]">{tr(row.g, row.gEn)}</span>
                    <span className="font-semibold text-[#1A2B4D]">{tr(row.c, row.cEn)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-2.5">
                {tr('核心评审维度（五维一体）', 'Core Criteria')}
              </div>
              <div className="flex flex-wrap gap-2">
                {[['技术创新性', 'Tech novelty'], ['商业可行性', 'Viability'], ['产业适配度', 'Industry fit'], ['团队与落地力', 'Execution'], ['需求匹配度', 'Problem fit']].map((d, i) => (
                  <span key={i} className="doa-chip">{tr(d[0], d[1])}</span>
                ))}
              </div>
              <p className="text-[12px] text-[#6B7C9B] leading-relaxed mt-4">
                决赛评审团由政府代表、产业专家、投资人、技术专家组成，现场统分并公布获奖名单。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 投资机构（飞书《赛事方案》：30+ 创投机构到场） */}
      <section className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0B1B3A]">资本对接 · 投资机构</h2>
          <p className="text-xs text-[#666666] mt-1">
            30+ 创投机构到场，组建专属投资评审团；获奖项目进入投资尽调绿色通道
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            'Monolith', '真格基金', '红杉资本', '风物资本', '光合创投', '上海未来基金', '大观资本',
          ].map((name, i) => (
            <div key={i} className="doa-card p-4 text-center">
              <div className="text-sm font-bold text-[#0B1B3A]">{name}</div>
              <div className="text-[10px] text-[#98A6BE] mt-0.5">投资机构</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Rules & Integrity Box */}
      <section id="maker-rules" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 pt-8">
        <div className="bg-[#F7F8FA] rounded-2xl p-6 sm:p-8 border border-[#E8EAED] text-xs text-[#666666] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B1B3A]">
            <ShieldCheck className="w-4 h-4 text-[#00C48C]" />
            <span>{tr('赛事诚信公约与法律声明', 'Integrity Pledge & Legal Notice')}</span>
          </div>
          <p>
            1. <strong className="text-[#0B1B3A]">全程免费</strong>：报名及评审不收取任何费用。任何声称可代办入围或收取辅导费用的行为均为诈骗，请创客提高警惕。
          </p>
          <p>
            2. <strong className="text-[#0B1B3A]">知识产权归属</strong>：所有参赛项目的完整知识产权严格属于参赛者个人或团队所有，未经团队书面授权，组委会绝不公开发布或商用。
          </p>
          <p>
            3. <strong className="text-[#0B1B3A]">个税代扣代缴与兑付</strong>：所有奖金均为税前金额，组委会将依据相关税法代扣代缴 20% 偶然所得个人所得税，赛后 30 个工作日内拨付至获奖人账户。
          </p>
        </div>
      </section>
    </div>
  );
};
