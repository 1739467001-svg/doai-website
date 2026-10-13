/**
 * 主席团 · 专家评委 · 生态伙伴
 *
 * Modelled on the GOAI reference site: a large presidium row, a grouped judge
 * panel, and a logo wall of partners. All entries are placeholders until the
 * official roster is confirmed.
 */
import React, { useState } from 'react';
import {
  presidium, judges, judgeGroups, partners, partnerCategories, Person,
} from '../../data/community';
import { useApp } from '../../context/AppContext';
import { ChevronDown, Users, Handshake, Sparkles, BadgeCheck } from 'lucide-react';

const PersonCard: React.FC<{ p: Person; size?: 'lg' | 'sm' }> = ({ p, size = 'sm' }) => (
  <div className="doa-card doa-card-hover p-5 text-center flex flex-col items-center">
    <div
      className={`rounded-2xl overflow-hidden bg-gradient-to-br from-[#E4EFFF] to-[#CFE2FF] mb-3 shrink-0 flex items-center justify-center ${
        size === 'lg' ? 'w-20 h-20' : 'w-14 h-14'
      }`}
    >
      {p.avatar ? (
        <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" draggable={false} />
      ) : (
        <span className={`font-black text-[#165DFF] ${size === 'lg' ? 'text-xl' : 'text-base'}`}>
          {p.title.slice(0, 1)}
        </span>
      )}
    </div>
    <div className={`font-bold text-[#0B1B3A] ${size === 'lg' ? 'text-base' : 'text-sm'}`}>{p.name}</div>
    <div className="text-[12px] text-[#165DFF] font-semibold mt-1">{p.title}</div>
    <div className="text-[11px] text-[#6B7C9B] mt-1 leading-snug">{p.org}</div>
  </div>
);

export const PeopleSection: React.FC = () => {
  const { setActiveRoute } = useApp();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-24 max-w-[1200px] mx-auto px-6 md:px-10">
      {/* ---------------- 主席团 ---------------- */}
      <div className="mb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="doa-eyebrow mb-3">PRESIDIUMS</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
              大赛主席团
            </h2>
            <p className="text-[13px] text-[#6B7C9B] mt-2 max-w-xl leading-relaxed">
              主席团由主办方、产业方与学术代表组成，负责赛事方向与赛制制定。
              <span className="text-[#98A6BE]">（嘉宾名单依姓氏笔画排序，排名不分主次）</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveRoute('conference')}
            className="shrink-0 text-[13px] font-semibold text-[#165DFF] hover:underline"
          >
            了解更多 →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {presidium.map(p => (
            <PersonCard key={p.id} p={p} size="lg" />
          ))}
        </div>
      </div>

      {/* ---------------- 专家评委 ---------------- */}
      <div className="mb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="doa-eyebrow mb-3">JURY</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
              专家评委团
            </h2>
            <p className="text-[13px] text-[#6B7C9B] mt-2 max-w-xl leading-relaxed">
              评审团 12—15 名，由五类代表构成，覆盖政府、产业、投资、技术与主办方视角。
            </p>
          </div>
        </div>

        {/* Composition summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {judgeGroups.map(g => (
            <div key={g.title} className="doa-card p-4">
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">
                {g.title}
              </div>
              <div className="text-xl font-extrabold text-[#0B1B3A] tabular-nums">{g.count}</div>
              <div className="text-[11px] text-[#6B7C9B] mt-0.5">{g.org}</div>
            </div>
          ))}
        </div>

        {/* Judgement dimensions */}
        <div className="doa-panel p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck className="w-4 h-4 text-[#165DFF]" />
            <h3 className="font-bold text-[#0B1B3A] text-sm">核心评审维度（五维一体）</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['技术创新性', '商业可行性', '产业适配度', '团队与落地力', '需求匹配度'].map(d => (
              <span key={d} className="doa-chip">{d}</span>
            ))}
          </div>
        </div>

        {/* Judge list, expandable by group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {judgeGroups.map((g, gi) => {
            const groupJudges = judges.filter(j => j.title === g.title);
            const isOpen = openGroup === g.title;
            const shown = isOpen ? groupJudges : groupJudges.slice(0, 2);
            return (
              <div key={g.title} className="doa-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : g.title)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[#F7FAFF] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#E4EFFF] text-[#165DFF] text-[11px] font-bold flex items-center justify-center shrink-0">
                      {String(gi + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] font-bold text-[#1A2B4D]">{g.title}</span>
                    <span className="text-[11px] text-[#98A6BE]">{g.count} 名</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#98A6BE] transition-transform ${isOpen ? 'rotate-180 text-[#165DFF]' : ''}`}
                  />
                </button>
                <div className="px-5 pb-4 space-y-2">
                  {shown.map(j => (
                    <div key={j.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E4EFFF] text-[#165DFF] flex items-center justify-center shrink-0 text-[12px] font-bold">
                        {j.title.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#1A2B4D]">{j.name}</div>
                        <div className="text-[11px] text-[#6B7C9B] truncate">{j.org}</div>
                      </div>
                    </div>
                  ))}
                  {!isOpen && groupJudges.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setOpenGroup(g.title)}
                      className="text-[12px] font-semibold text-[#165DFF] hover:underline pt-1"
                    >
                      展开全部 {groupJudges.length} 名 →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- 生态伙伴 ---------------- */}
      <div>
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="doa-eyebrow mb-3">PARTNERS</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
              生态伙伴
            </h2>
            <p className="text-[13px] text-[#6B7C9B] mt-2 max-w-xl leading-relaxed">
              主办、联合主办、支持单位、场地与内容合作方，以及 3 个海外分会场。
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {partnerCategories.map(cat => {
            const list = partners.filter(p => p.category === cat);
            if (!list.length) return null;
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  {cat === '主办' ? (
                    <Sparkles className="w-3.5 h-3.5 text-[#165DFF]" />
                  ) : cat === '海外分会场' ? (
                    <Users className="w-3.5 h-3.5 text-[#165DFF]" />
                  ) : (
                    <Handshake className="w-3.5 h-3.5 text-[#165DFF]" />
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7C9B]">
                    {cat}
                  </span>
                  <span className="text-[11px] text-[#C0CBDD]">{list.length}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map(p => (
                    <div key={p.id} className="doa-card p-5 flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#E4EFFF] text-[#165DFF] flex items-center justify-center shrink-0">
                        <span className="text-[13px] font-black">{p.name.slice(0, 2)}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#1A2B4D] text-sm leading-snug">{p.name}</div>
                        <p className="text-[12px] text-[#6B7C9B] mt-1 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
