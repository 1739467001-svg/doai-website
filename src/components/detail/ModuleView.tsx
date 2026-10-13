import React from 'react';
import { useApp } from '../../context/AppContext';
import { DetailShell, NotFound } from './DetailShell';
import { modulePages } from '../../data/conference';
import { ArrowRight, Check, Sparkles, ShieldCheck, Users } from 'lucide-react';

/**
 * A dedicated page for one navbar sub-module (e.g. 大会介绍 → 大会愿景与使命).
 * Every sub-item in the nav resolves to one of these, so each click lands on a
 * page of its own rather than scrolling within a shared one.
 */
export const ModuleView: React.FC<{ id?: string }> = ({ id }) => {
  const { setActiveRoute } = useApp();
  const mod = modulePages.find(m => m.id === id);

  if (!mod) {
    return <NotFound what="该模块" backRoute="home" backLabel="返回首页" />;
  }

  const backRoute = mod.parent;
  const backLabel =
    backRoute === 'conference' ? '返回大会介绍' : backRoute === 'maker' ? '返回赛事中心' : '返回创客社区';

  // Sibling modules in the same nav group, for cross-linking.
  const siblings = modulePages.filter(m => m.parent === mod.parent && m.id !== mod.id);

  return (
    <DetailShell
      backRoute={backRoute}
      backLabel={backLabel}
      eyebrow={mod.eyebrow}
      title={mod.title}
      subtitle={mod.subtitle}
      actions={
        mod.cta ? (
          <button type="button" onClick={() => setActiveRoute(mod.cta!.route)} className="doa-btn doa-btn-primary">
            {mod.cta.label}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : undefined
      }
    >
      {/* Hero image — the module's key visual */}
      <figure className="doa-card overflow-hidden mb-10">
        <div className="relative aspect-[21/9] overflow-hidden bg-[#EFF5FF]">
          <img
            src={mod.heroImage}
            alt={mod.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(11,27,58,0) 40%, rgba(11,27,58,0.55) 100%)',
            }}
          />
          <figcaption className="absolute left-5 bottom-4 right-5 text-white">
            <div className="text-[11px] uppercase tracking-[0.22em] opacity-80 font-semibold">
              DOAI 2026 · {mod.eyebrow}
            </div>
            <div className="text-lg sm:text-xl font-extrabold mt-1">{mod.title}</div>
          </figcaption>
        </div>
      </figure>

      {/* Stat strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {mod.stats.map((s, i) => (
          <div key={i} className="doa-card p-5">
            <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1.5">
              {s.label}
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Content sections */}
      <div className="space-y-6">
        {mod.sections.map((sec, si) => (
          <section key={si} className="doa-card p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#E4EFFF] text-[#165DFF] flex items-center justify-center text-[12px] font-bold shrink-0">
                {si + 1}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#0B1B3A]">{sec.heading}</h2>
            </div>
            <p className="text-sm text-[#48597A] leading-[1.9] mb-5">{sec.body}</p>

            {sec.items && sec.items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sec.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-[#F7FAFF] border border-[#E3ECFA]"
                  >
                    <span className="w-6 h-6 rounded-lg bg-white border border-[#E3ECFA] text-[#165DFF] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#1A2B4D] mb-0.5">{item.title}</div>
                      <div className="text-[12px] text-[#6B7C9B] leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Closing CTA */}
      {mod.cta && (
        <section className="doa-panel p-8 sm:p-10 mt-8 text-center">
          <h2 className="text-xl font-extrabold text-[#0B1B3A] mb-2">准备好了吗？</h2>
          <p className="text-sm text-[#48597A] mb-6">
            报名、评审与参会全程免费，谨防任何以大会名义收费的诈骗。
          </p>
          <button type="button" onClick={() => setActiveRoute(mod.cta!.route)} className="doa-btn doa-btn-primary">
            {mod.cta.label}
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* Sibling modules */}
      {siblings.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-[#0B1B3A] mb-5">相关模块</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {siblings.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveRoute(`module/${s.id}`)}
                className="doa-card doa-card-hover p-5 text-left flex items-start gap-4 group"
              >
                <img
                  src={s.heroImage}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-20 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="doa-eyebrow mb-1.5">{s.eyebrow}</div>
                  <h3 className="font-bold text-[#1A2B4D] text-sm mb-1 group-hover:text-[#165DFF] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[12px] text-[#6B7C9B] line-clamp-2 leading-relaxed">{s.subtitle}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#98A6BE] group-hover:text-[#165DFF] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </section>
      )}
    </DetailShell>
  );
};
