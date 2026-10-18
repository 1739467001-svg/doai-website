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
import { ChevronDown, Users, Handshake, Sparkles, BadgeCheck, ShieldCheck } from 'lucide-react';

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
  const { setActiveRoute, tr, lang } = useApp();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-24 max-w-[1200px] mx-auto px-6 md:px-10">
      {/* ---------------- 专家评委 ---------------- */}
      <div className="mb-16">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="doa-eyebrow mb-3">JURY</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
              {tr('专家评委团', 'Jury')}
            </h2>
            <p className="text-[13px] text-[#6B7C9B] mt-2 max-w-xl leading-relaxed">
              {tr('评审团 12—15 名，由五类代表构成，覆盖政府、产业、投资、技术与主办方视角。', 'A 12–15 member jury across government, industry, investment, technology and organizers.')}
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
              <div className="text-xl font-extrabold text-[#0B1B3A] tabular-nums">{g.label}</div>
              <div className="text-[11px] text-[#6B7C9B] mt-0.5">{g.org}</div>
            </div>
          ))}
        </div>

        {/* Judgement dimensions */}
        <div className="doa-panel p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck className="w-4 h-4 text-[#165DFF]" />
            <h3 className="font-bold text-[#0B1B3A] text-sm">{tr('核心评审维度（五维一体）', 'Core Criteria')}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[['技术创新性', 'Tech novelty'], ['商业可行性', 'Viability'], ['产业适配度', 'Industry fit'], ['团队与落地力', 'Execution'], ['需求匹配度', 'Problem fit']].map(d => (
              <span key={d[0]} className="doa-chip">{tr(d[0], d[1])}</span>
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
                    <span className="text-[11px] text-[#98A6BE]">{g.label}</span>
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
                      {tr('展开全部', 'Show all')} {groupJudges.length} →
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
              {tr('组织架构', 'Organizers')}
            </h2>
            <p className="text-[13px] text-[#6B7C9B] mt-2 max-w-xl leading-relaxed">
              {tr('指导单位、主办方、联合主办、战略合作方与内容平台，以飞书《赛事方案》为准。', 'Per the official plan: guiding unit, hosts, co-organizer, strategic partners and content platform.')}
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
                  {cat === '指导单位' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#165DFF]" />
                  ) : cat === '主办方' ? (
                    <Sparkles className="w-3.5 h-3.5 text-[#165DFF]" />
                  ) : cat === '内容平台' ? (
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

      {/* ---------------- 合作媒体 ---------------- */}
      <div className="mt-16">
        <div className="doa-eyebrow mb-3">MEDIA PARTNERS</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
          {tr('合作媒体', 'Media Partners')}
        </h2>
        <div className="flex flex-wrap gap-2.5 mt-6">
          {[
            ['这很容易', 'This Is Easy'], ['赛博禅心', 'Cyber Zen'], ['特工宇宙', 'Agent Universe'],
            ['观猹', 'GuanCha'], ['硅星人', 'Silicon Star'], ['手工川', 'HandCraft'], ['椒盐玉兔', 'Salt Bunny'],
          ].map(([zh, en], i) => (
            <span key={i} className="doa-card px-5 py-3 text-sm font-bold text-[#1A2B4D]">
              {lang === 'en' ? en : zh}
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- 合作社区 ---------------- */}
      <div className="mt-16">
        <div className="doa-eyebrow mb-3">COMMUNITY PARTNERS</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight">
          {tr('合作社区', 'Community Partners')}
        </h2>
        <p className="text-[13px] text-[#6B7C9B] mt-2">
          {tr('25 家 AI 与创客社区联合推广，覆盖全国开发者与高校社群。', '25 AI & maker communities co-promoting nationwide.')}
        </p>
        <div className="flex flex-wrap gap-2.5 mt-6">
          {[
            'Datawhale', '去探索', '杭州AI工坊', '出海去', '周周黑客松', '云谷中心', 'Y/our Space',
            'SeeAI', 'WaytoAGI', '十堰黑客松', '清华创协', '北京理工大学创业协会', '北理工灵动工厂',
            'vibefriends', 'AGI Bar知识蒸馏', 'EPIC', 'BoHack', '一支烟花', '超越之路', 'AtomGit',
            '多多群岛', 'she Nicest', 'Rebuild-Z', '塞托邦', '徽客松',
          ].map((name, i) => (
            <span key={i} className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#48597A] bg-white border border-[#E3ECFA]">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
