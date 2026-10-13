/**
 * 赛题与赛制 — the contest's rulebook, modelled on the GOAI reference site:
 * brief cards per 赛题 (with sponsor, deliverables, weighted criteria,
 * resources), followed by an accordion of 赛制 rules.
 */
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DetailShell } from '../detail/DetailShell';
import { contestBriefs, contestRules, ContestBrief } from '../../data/community';
import { contest } from '../../data/plan';
import {
  ChevronDown, FileText, Target, Package, Scale, Gift, Calendar, Building2,
  ArrowRight, CheckCircle2, Layers,
} from 'lucide-react';

const trackMeta = {
  industry: { name: '产业赛道', color: '#165DFF' },
  creator: { name: '自由赛道', color: '#00B487' },
} as const;

const statusMeta = {
  open: { label: '申报中', color: '#00B487' },
  upcoming: { label: '待发布', color: '#FF8A1F' },
  closed: { label: '已截止', color: '#98A6BE' },
} as const;

/* ------------------------------------------------------------------ 赛题卡 */

const BriefCard: React.FC<{ b: ContestBrief }> = ({ b }) => {
  const [open, setOpen] = useState(false);
  const tm = trackMeta[b.track];
  const sm = statusMeta[b.status];

  return (
    <div className="doa-card overflow-hidden">
      {/* head */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="w-full text-left p-6 sm:p-7 hover:bg-[#F7FAFF] transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${tm.color}14`, color: tm.color }}
              >
                {tm.name}
              </span>
              <span className="text-[11px] font-mono text-[#98A6BE]">{b.code}</span>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${sm.color}14`, color: sm.color }}
              >
                {sm.label}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1B3A] leading-snug">{b.title}</h3>
            <p className="text-[13px] text-[#48597A] leading-relaxed mt-2">{b.summary}</p>
            <div className="flex items-center gap-4 mt-3 text-[12px] text-[#6B7C9B]">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {b.sponsor}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> 提交截止 {b.deadline.slice(5).replace('-', '/')}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[#98A6BE] shrink-0 mt-1 transition-transform ${open ? 'rotate-180 text-[#165DFF]' : ''}`}
          />
        </div>
      </button>

      {/* detail */}
      {open && (
        <div className="px-6 sm:px-7 pb-7 pt-1 border-t border-[#EFF5FF] space-y-6 animate-in slide-in-from-top-1 duration-200">
          <section>
            <h4 className="flex items-center gap-2 text-[13px] font-bold text-[#1A2B4D] mb-2.5">
              <FileText className="w-4 h-4 text-[#165DFF]" /> 赛题背景
            </h4>
            <p className="text-[13px] text-[#48597A] leading-[1.85]">{b.background}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="flex items-center gap-2 text-[13px] font-bold text-[#1A2B4D] mb-2.5">
                <Package className="w-4 h-4 text-[#165DFF]" /> 交付物
              </h4>
              <ul className="space-y-2">
                {b.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#48597A]">
                    <CheckCircle2 className="w-4 h-4 text-[#00B487] shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-[13px] font-bold text-[#1A2B4D] mb-2.5">
                <Gift className="w-4 h-4 text-[#165DFF]" /> 配套资源
              </h4>
              <ul className="space-y-2">
                {b.resources.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#48597A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#165DFF] shrink-0 mt-1.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h4 className="flex items-center gap-2 text-[13px] font-bold text-[#1A2B4D] mb-3">
              <Scale className="w-4 h-4 text-[#165DFF]" /> 评审维度与权重
            </h4>
            <div className="space-y-2.5">
              {b.criteria.map((c, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-[13px] mb-1">
                    <span className="font-semibold text-[#1A2B4D]">{c.name}</span>
                    <span className="font-bold text-[#165DFF]">{c.weight}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EFF5FF] overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6FA8FF] to-[#165DFF]"
                      style={{ width: c.weight }}
                    />
                  </div>
                  <p className="text-[12px] text-[#6B7C9B]">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('noop'))}
            className="doa-btn doa-btn-primary"
          >
            前往申报 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ 页面 */

export const RulesView: React.FC = () => {
  const { setActiveRoute } = useApp();
  const [openRule, setOpenRule] = useState<string | null>(contestRules[0]?.id ?? null);
  const [trackFilter, setTrackFilter] = useState<'all' | 'industry' | 'creator'>('all');

  const briefs = contestBriefs.filter(b => trackFilter === 'all' || b.track === trackFilter);

  return (
    <DetailShell
      backRoute="maker"
      backLabel="返回赛事中心"
      eyebrow="BRIEFS & RULES"
      title="赛题与赛制"
      subtitle={contest.tagline}
      meta={[
        { label: '赛道', value: '双赛道' },
        { label: '赛题', value: `${contestBriefs.length} 个` },
        { label: '决赛赛制', value: contest.format },
        { label: '入围数量', value: contest.finalistCount },
      ]}
      actions={
        <button type="button" onClick={() => setActiveRoute('maker/tracks')} className="doa-btn doa-btn-primary">
          立即报名参赛 <ArrowRight className="w-4 h-4" />
        </button>
      }
    >
      {/* ---------------- 赛制总览 ---------------- */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
        {[
          { icon: Layers, label: '双赛道并行', desc: '产业 + 自由' },
          { icon: Target, label: '线上初筛', desc: '11/8 — 11/11' },
          { icon: FileText, label: '作品提交', desc: '11/3 — 11/7' },
          { icon: Scale, label: '五维评审', desc: '12—15 名评委' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="doa-card p-5">
              <Icon className="w-5 h-5 text-[#165DFF] mb-3" />
              <div className="font-bold text-[#0B1B3A] text-sm">{s.label}</div>
              <div className="text-[12px] text-[#6B7C9B] mt-0.5">{s.desc}</div>
            </div>
          );
        })}
      </section>

      {/* ---------------- 赛题列表 ---------------- */}
      <section className="mb-14">
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <div>
            <div className="doa-eyebrow mb-2.5">CONTEST BRIEFS</div>
            <h2 className="text-2xl font-extrabold text-[#0B1B3A] tracking-tight">赛题</h2>
            <p className="text-[13px] text-[#6B7C9B] mt-1.5 max-w-2xl leading-relaxed">
              产业赛道命题将于 10 月中旬由长宁区龙头企业正式发布；自由赛道为开放命题，报名即起可申报。
            </p>
          </div>
          <div className="flex items-center p-1 bg-white border border-[#E3ECFA] rounded-xl self-start">
            {([
              ['all', '全部'],
              ['industry', '产业赛道'],
              ['creator', '自由赛道'],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTrackFilter(id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  trackFilter === id ? 'bg-[#165DFF] text-white' : 'text-[#48597A] hover:text-[#0B1B3A]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {briefs.map(b => (
            <BriefCard key={b.id} b={b} />
          ))}
        </div>
      </section>

      {/* ---------------- 赛制规则 ---------------- */}
      <section>
        <div className="mb-6">
          <div className="doa-eyebrow mb-2.5">RULES</div>
          <h2 className="text-2xl font-extrabold text-[#0B1B3A] tracking-tight">赛制规则</h2>
          <p className="text-[13px] text-[#6B7C9B] mt-1.5 max-w-2xl leading-relaxed">
            参赛资格、提交要求、评审机制、决赛路演与知识产权，逐条说明。
          </p>
        </div>

        <div className="space-y-3">
          {contestRules.map((r, ri) => {
            const isOpen = openRule === r.id;
            return (
              <div key={r.id} className="doa-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenRule(isOpen ? null : r.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-[#F7FAFF] transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-[#E4EFFF] text-[#165DFF] text-[12px] font-bold flex items-center justify-center shrink-0">
                    {String(ri + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-[#0B1B3A] text-[15px]">{r.title}</span>
                    <span className="block text-[12px] text-[#6B7C9B] mt-0.5">{r.summary}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#98A6BE] shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#165DFF]' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 space-y-4 border-t border-[#EFF5FF] pt-5 animate-in slide-in-from-top-1 duration-200">
                    {r.items.map((it, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-[minmax(0,220px)_1fr] gap-1.5 sm:gap-5">
                        <div className="text-[13px] font-semibold text-[#1A2B4D]">{it.q}</div>
                        <div className="text-[13px] text-[#48597A] leading-relaxed">{it.a}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </DetailShell>
  );
};
