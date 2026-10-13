/**
 * 活动动态 — the conference news feed, modelled on the GOAI reference site:
 * category filters, a featured pinned item, and an article list that expands
 * inline instead of opening a separate URL.
 */
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DetailShell } from '../detail/DetailShell';
import { news, newsCategories, NewsItem } from '../../data/community';
import { Calendar, Pin, ChevronDown, ArrowRight, Megaphone } from 'lucide-react';

const catColor: Record<NewsItem['category'], string> = {
  赛事: '#165DFF',
  大会: '#722ED1',
  分会场: '#00B487',
  合作: '#FF8A1F',
  公告: '#E5484D',
};

const ArticleCard: React.FC<{ item: NewsItem; featured?: boolean }> = ({ item, featured }) => {
  const [open, setOpen] = useState(false);
  const c = catColor[item.category];

  return (
    <article className={`doa-card overflow-hidden ${featured ? 'lg:flex' : ''}`}>
      <div className={featured ? 'lg:flex-1 p-6 sm:p-8' : 'p-6'}>
        <div className="flex items-center gap-2.5 flex-wrap mb-3">
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${c}14`, color: c }}
          >
            {item.category}
          </span>
          {item.pinned && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF8A1F]">
              <Pin className="w-3 h-3" /> 置顶
            </span>
          )}
          <span className="text-[12px] text-[#98A6BE] font-mono flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {item.date}
          </span>
        </div>

        <h3 className={`font-bold text-[#0B1B3A] leading-snug ${featured ? 'text-xl sm:text-2xl' : 'text-base'}`}>
          {item.title}
        </h3>
        <p className="text-[13px] text-[#48597A] leading-relaxed mt-2">{item.summary}</p>

        {open && (
          <div className="mt-4 space-y-3 border-t border-[#EFF5FF] pt-4 animate-in slide-in-from-top-1 duration-200">
            {item.body.map((para, i) => (
              <p key={i} className="text-[13px] text-[#48597A] leading-[1.9]">{para}</p>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#165DFF] hover:underline"
        >
          {open ? '收起' : '阅读全文'}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </article>
  );
};

export const NewsView: React.FC = () => {
  const { setActiveRoute } = useApp();
  const [cat, setCat] = useState<string>('全部');

  const list = news.filter(n => cat === '全部' || n.category === cat);
  const featured = list.find(n => n.pinned);
  const rest = list.filter(n => n !== featured);

  return (
    <DetailShell
      backRoute="conference"
      backLabel="返回大会介绍"
      eyebrow="NEWS & UPDATES"
      title="活动动态"
      subtitle="组委会公告、赛事进展、分会场与合作动态，第一时间在这里更新。"
      meta={[
        { label: '动态总数', value: `${news.length} 条` },
        { label: '最近更新', value: news[0]?.date ?? '—' },
        { label: '覆盖类别', value: `${newsCategories.length - 1} 类` },
      ]}
      actions={
        <button type="button" onClick={() => setActiveRoute('register')} className="doa-btn doa-btn-primary">
          报名参赛 <ArrowRight className="w-4 h-4" />
        </button>
      }
    >
      {/* category filter */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        {newsCategories.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
              cat === c
                ? 'bg-[#165DFF] text-white shadow-[0_6px_16px_rgba(22,93,255,0.24)]'
                : 'bg-white text-[#48597A] border border-[#E3ECFA] hover:border-[#A9CCFF] hover:text-[#165DFF]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="doa-panel p-12 text-center">
          <Megaphone className="w-8 h-8 text-[#C0CBDD] mx-auto mb-3" />
          <p className="text-sm text-[#6B7C9B]">该分类暂无动态</p>
        </div>
      ) : (
        <div className="space-y-4">
          {featured && <ArticleCard item={featured} featured />}
          {rest.map(n => (
            <ArticleCard key={n.id} item={n} />
          ))}
        </div>
      )}
    </DetailShell>
  );
};
