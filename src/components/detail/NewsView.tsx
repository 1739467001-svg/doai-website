/**
 * 活动动态 — 会议结论 2026-10-13：
 * 1) 卡片重设计（更清爽的横排层级 + 悬停反馈）
 * 2) 顶部「公众号动态」：同步公众号文章封面+标题，点击跳转公众号原文
 *    （数据来自简单后端 /api/wx/articles，封面走 /api/wx/cover 代理防盗链）
 */
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../../lib/api';
import { useApp } from '../../context/AppContext';
import { DetailShell } from '../detail/DetailShell';
import { news, newsCategories, NewsItem } from '../../data/community';
import { Calendar, Pin, ChevronDown, ArrowRight, Megaphone, ExternalLink, Rss } from 'lucide-react';

interface WxArticle {
  url: string;
  title: string;
  cover: string;
  description: string;
  publishTime: string;
  source: string;
  error?: string;
}

const coverProxy = (u: string) => `/api/wx/cover?u=${encodeURIComponent(u)}`;

const catColor: Record<NewsItem['category'], string> = {
  赛事: '#165DFF',
  大会: '#722ED1',
  分会场: '#00B487',
  合作: '#FF8A1F',
  公告: '#E5484D',
};

/** 公众号动态卡片：封面 + 标题 + 摘要，整卡跳转原文 */
const WxArticleCard: React.FC<{ item: WxArticle }> = ({ item }) => (
  <a
    href={item.url}
    target="_blank"
    rel="noopener noreferrer"
    className="doa-card doa-card-hover group overflow-hidden lg:flex"
  >
    <div className="relative lg:w-[300px] shrink-0 aspect-[16/10] lg:aspect-auto bg-[#F2F7FF] overflow-hidden">
      {item.cover ? (
        <img
          src={coverProxy(item.cover)}
          alt={item.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Rss className="w-8 h-8 text-[#C0CBDD]" />
        </div>
      )}
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-white bg-[#00C48C] rounded-full">
        <Rss className="w-3 h-3" /> 公众号
      </span>
    </div>
    <div className="p-5 sm:p-6 flex flex-col justify-between gap-3 lg:flex-1">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-[#0B1B3A] leading-snug group-hover:text-[#165DFF] transition-colors">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-[13px] text-[#6B7C9B] leading-relaxed mt-2 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between text-[12px] text-[#98A6BE]">
        <span className="flex items-center gap-1.5 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          {item.publishTime || '刚刚更新'}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#165DFF] opacity-0 group-hover:opacity-100 transition-opacity">
          阅读原文 <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  </a>
);

/** 站内公告卡片：横排层级重设计 */
const ArticleCard: React.FC<{ item: NewsItem; featured?: boolean }> = ({ item, featured }) => {
  const [open, setOpen] = useState(false);
  const { tr } = useApp();
  const c = catColor[item.category];

  return (
    <article
      className={`doa-card doa-card-hover overflow-hidden ${featured ? 'border-l-4' : ''}`}
      style={featured ? { borderLeftColor: c } : undefined}
    >
      <div className="p-6">
        <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
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

        <h3 className={`font-bold text-[#0B1B3A] leading-snug ${featured ? 'text-lg sm:text-xl' : 'text-[15px]'}`}>
          {item.title}
        </h3>
        <p className="text-[13px] text-[#6B7C9B] leading-relaxed mt-1.5">{item.summary}</p>

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
          className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#165DFF] hover:underline"
        >
          {open ? tr('收起', 'Collapse') : tr('阅读全文', 'Read more')}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </article>
  );
};

export const NewsView: React.FC = () => {
  const { setActiveRoute, tr } = useApp();
  const [cat, setCat] = useState<string>('全部');
  const [wxArticles, setWxArticles] = useState<WxArticle[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(apiUrl('/api/wx/articles'))
      .then(r => r.json())
      .then(d => {
        if (alive && d?.ok) setWxArticles(d.articles);
      })
      .catch(() => {
        if (alive) setWxArticles([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const list = news.filter(n => cat === '全部' || n.category === cat);
  const featured = list.find(n => n.pinned);
  const rest = list.filter(n => n !== featured);

  return (
    <DetailShell
      backRoute="conference"
      backLabel={tr('返回大会介绍', 'Back to Conference')}
      eyebrow="NEWS & UPDATES"
      title={tr('活动动态', 'News & Updates')}
      subtitle={tr('组委会公告、赛事进展、分会场与合作动态，第一时间在这里更新。', 'Announcements, contest progress, forums and partnerships — updated here first.')}
      meta={[
        { label: tr('动态总数', 'Posts'), value: `${news.length}` },
        { label: tr('最近更新', 'Latest'), value: news[0]?.date ?? '—' },
        { label: tr('覆盖类别', 'Categories'), value: `${newsCategories.length - 1}` },
      ]}
      actions={
        <button type="button" onClick={() => setActiveRoute('maker/tracks')} className="doa-btn doa-btn-primary">
          报名参赛 <ArrowRight className="w-4 h-4" />
        </button>
      }
    >
      {/* 公众号动态：同步封面+标题，点击跳原文 */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-4 bg-[#00C48C] rounded-full" aria-hidden="true" />
          <h2 className="text-base font-bold text-[#0B1B3A]">{tr('公众号动态', 'From WeChat')}</h2>
          <span className="text-[11px] text-[#98A6BE]">{tr('同步自官方微信公众号 · 点击前往原文', 'Synced from our official WeChat · click to read')}</span>
        </div>
        {wxArticles === null ? (
          <div className="doa-card h-40 animate-pulse bg-[#F7FAFF]" aria-hidden="true" />
        ) : wxArticles.length === 0 ? (
          <div className="doa-panel p-8 text-center text-sm text-[#6B7C9B]">
            {tr('公众号动态暂时拉取不到，稍后再来看看', 'WeChat feed unavailable right now — check back soon.')}
          </div>
        ) : (
          <div className="space-y-4">
            {wxArticles.map(a => (
              <WxArticleCard key={a.url} item={a} />
            ))}
          </div>
        )}
      </section>

      {/* category filter */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <span className="w-1 h-4 bg-[#165DFF] rounded-full mr-1" aria-hidden="true" />
        <h2 className="text-base font-bold text-[#0B1B3A] mr-2">{tr('官方公告', 'Official')}</h2>
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
          <p className="text-sm text-[#6B7C9B]">{tr('该分类暂无动态', 'Nothing here yet.')}</p>
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
