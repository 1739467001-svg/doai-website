/**
 * 赛道详情页 — 参考 GOAI 的赛道模块（会议 2026-10-13）：
 * 赛事中心点「申报赛道」进入本页，浏览赛道完整介绍后点击「立即报名」。
 * 路由：track/industry、track/creator
 */
import React from 'react';
import { useApp } from '../../context/AppContext';
import { contestBriefs } from '../../data/community';
import {
  Cpu,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Target,
  Scale,
  Trophy,
  FileText,
  Clock,
  Users,
} from 'lucide-react';
import { TrackType } from '../../types';

const TRACK_META: Record<
  TrackType,
  {
    name: string;
    en: string;
    color: string;
    icon: React.FC<{ className?: string }>;
    tagline: string;
    positioning: string;
    directions: { title: string; desc: string }[];
    reviewFocus: string;
    requirements: string[];
  }
> = {
  industry: {
    name: '产业赛道',
    en: 'AI + Industry',
    color: '#165DFF',
    icon: Cpu,
    tagline: '命题制解题 · 企业真实场景 · 优先落地孵化',
    positioning:
      '联合长宁区龙头企业发布真实业务命题，参赛团队定向解题。重点考察 AI 技术在真实产业场景中的落地能力与商业闭环，获奖项目优先对接企业采购订单与德必园区落地孵化资源。',
    directions: [
      { title: 'AI + 消费', desc: '电商、IP 类情绪消费、新消费场景中的 AI 原生应用与智能硬件。' },
      { title: 'AI + 专业服务', desc: '出海、法务、财税等专业服务业的智能体与工作流自动化。' },
    ],
    reviewFocus: '商业可行性与商业落地闭环',
    requirements: [
      '参赛团队 2—5 人（含队长），或个人独立参赛',
      '报名及评审全程免费，知识产权 100% 归团队所有',
      '申报时须选择本赛道下的一个命题方向',
      '作品提交阶段需提供 Demo 视频、可访问链接与 GitHub 仓库',
    ],
  },
  creator: {
    name: '自由赛道',
    en: 'AI Creator',
    color: '#00C48C',
    icon: Layers,
    tagline: '开放命题 · 极客精神 · 技术突破优先',
    positioning:
      '不限产业方向，鼓励底层算法突破、原生 Agent 应用与商业模式创新。路演 + 评选 + 投资对接一站式完成，为最具极客精神的创造者提供直达资本与社区的通道。',
    directions: [
      { title: 'Agent 应用', desc: '多智能体协作、对话式应用、垂直领域 Agent。' },
      { title: 'AI Infra', desc: '模型训练、推理部署、算力调度等基础设施创新。' },
      { title: '智能硬件', desc: '具身智能、可穿戴设备、边缘侧 AI 装置。' },
    ],
    reviewFocus: '突破性技术创新与极客精神',
    requirements: [
      '参赛团队 2—5 人（含队长），或个人独立参赛',
      '报名及评审全程免费，知识产权 100% 归团队所有',
      '开放命题，报名即起可申报',
      '作品提交阶段需提供 Demo 视频、可访问链接与 GitHub 仓库',
    ],
  },
};

export const TrackDetailView: React.FC<{ track?: string }> = ({ track }) => {
  const { setActiveRoute } = useApp();
  const trackId: TrackType = track === 'industry' ? 'industry' : 'creator';
  const meta = TRACK_META[trackId];
  const Icon = meta.icon;
  const briefs = contestBriefs.filter(b => b.track === trackId);

  return (
    <div className="pt-24 pb-24">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(165deg, #FFFFFF 0%, ${meta.color}0A 100%)` }}
      >
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-14">
          <button
            onClick={() => setActiveRoute('maker')}
            className="text-xs font-semibold text-[#666666] hover:text-[#165DFF] transition-colors flex items-center gap-1 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            返回赛事中心
          </button>

          <div className="flex items-start gap-6">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center shrink-0"
              style={{ background: `${meta.color}14`, color: meta.color }}
            >
              <Icon className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-4xl font-bold text-[#0B1B3A] tracking-tight">
                  {meta.name}
                </h1>
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ background: `${meta.color}14`, color: meta.color }}
                >
                  {meta.en}
                </span>
              </div>
              <p className="text-base text-[#48597A]">{meta.tagline}</p>
              <p className="text-sm text-[#666666] leading-relaxed max-w-3xl">{meta.positioning}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveRoute(`register/${trackId}`)}
              className="px-10 py-4 text-base font-semibold text-white rounded-full transition-all shadow-lg flex items-center gap-2 hover:shadow-xl active:scale-[0.98]"
              style={{ background: meta.color }}
            >
              立即报名
              <ArrowRight className="w-5 h-5" />
            </button>
            <span className="text-xs text-[#888888]">报名截止 2026/10/31 · 全程免费</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 space-y-16 py-14">
        {/* 命题方向 */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <Target className="w-5 h-5" style={{ color: meta.color }} />
            <h2 className="text-2xl font-bold text-[#0B1B3A]">命题方向</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {meta.directions.map(d => (
              <div key={d.title} className="doa-card p-6">
                <h3 className="text-base font-bold text-[#0B1B3A] mb-2">{d.title}</h3>
                <p className="text-[13px] text-[#6B7C9B] leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 评审侧重 + 申报要求 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="doa-card p-7">
            <div className="flex items-center gap-2.5 mb-4">
              <Scale className="w-5 h-5" style={{ color: meta.color }} />
              <h2 className="text-lg font-bold text-[#0B1B3A]">评审侧重</h2>
            </div>
            <p className="text-sm text-[#48597A] leading-relaxed mb-4">
              本赛道重点考量：<strong style={{ color: meta.color }}>{meta.reviewFocus}</strong>
            </p>
            <div className="space-y-2">
              {[
                { k: '创新能力', v: '30%' },
                { k: '技术能力', v: '30%' },
                { k: '商业价值', v: trackId === 'industry' ? '25%' : '20%' },
                { k: '现场表现', v: trackId === 'industry' ? '15%' : '20%' },
              ].map(row => (
                <div key={row.k} className="flex items-center justify-between text-[13px] py-1.5 border-b border-[#F0F2F5] last:border-0">
                  <span className="text-[#48597A]">{row.k}</span>
                  <span className="font-mono font-bold text-[#0B1B3A]">{row.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="doa-card p-7">
            <div className="flex items-center gap-2.5 mb-4">
              <CheckCircle2 className="w-5 h-5" style={{ color: meta.color }} />
              <h2 className="text-lg font-bold text-[#0B1B3A]">申报要求</h2>
            </div>
            <ul className="space-y-3">
              {meta.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[#48597A] leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: meta.color }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 本赛道赛题 */}
        <section>
          <div className="flex items-center gap-2.5 mb-6">
            <FileText className="w-5 h-5" style={{ color: meta.color }} />
            <h2 className="text-2xl font-bold text-[#0B1B3A]">赛题设置</h2>
            <span className="text-xs text-[#98A6BE]">完整赛制说明见「赛题与赛制」页</span>
          </div>
          <div className="space-y-4">
            {briefs.length === 0 ? (
              <div className="doa-panel p-8 text-center text-sm text-[#6B7C9B]">
                本赛道命题即将发布，敬请期待（产业赛道命题 10 月中旬由长宁区龙头企业正式发布）
              </div>
            ) : (
              briefs.map(b => (
                <div key={b.id} className="doa-card p-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-mono text-[#98A6BE]">{b.code}</span>
                      <span className="text-[11px] font-semibold text-[#00B48C] bg-[#00B48C]/10 px-2 py-0.5 rounded-full">
                        申报中
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#0B1B3A]">{b.title}</h3>
                    <p className="text-[13px] text-[#6B7C9B] leading-relaxed mt-1.5">{b.summary}</p>
                    <div className="text-[12px] text-[#888888] mt-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> 命题方：{b.sponsor}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-[#98A6BE] flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" /> 提交截止
                    </div>
                    <div className="text-sm font-bold font-mono text-[#0B1B3A]">
                      {b.deadline.slice(5).replace('-', '/')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 奖项 + 报名 CTA */}
        <section
          className="rounded-3xl p-8 sm:p-10 text-center"
          style={{ background: `linear-gradient(165deg, ${meta.color}0D 0%, #FFFFFF 100%)`, border: `1px solid ${meta.color}26` }}
        >
          <Trophy className="w-10 h-10 mx-auto mb-4" style={{ color: meta.color }} />
          <h2 className="text-2xl font-bold text-[#0B1B3A]">赛道等级奖 · 20 万元总奖金池</h2>
          <p className="text-sm text-[#666666] mt-2 max-w-xl mx-auto">
            按决赛排名阶梯式发放，另设专项荣誉奖与普惠激励奖。获奖项目优先对接企业订单与落地孵化。
          </p>
          <button
            onClick={() => setActiveRoute(`register/${trackId}`)}
            className="mt-8 px-12 py-4 text-base font-semibold text-white rounded-full transition-all shadow-lg inline-flex items-center gap-2 hover:shadow-xl active:scale-[0.98]"
            style={{ background: meta.color }}
          >
            立即报名 {meta.name}
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </div>
    </div>
  );
};
