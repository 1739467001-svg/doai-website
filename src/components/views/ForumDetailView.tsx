import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DetailShell, NotFound } from '../detail/DetailShell';
import { typeMeta } from '../../data/conference';
import {
  Calendar, Clock, MapPin, Users, Check, Ticket, Share2, Bookmark, Video,
} from 'lucide-react';

export const ForumDetailView: React.FC<{ id?: string }> = ({ id }) => {
  const { forums, bookForum, cancelForum, currentUser, setLoginModalOpen, setActiveRoute, cmsData } = useApp();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const session = forums.find(f => f.id === id);

  if (!session) {
    return <NotFound what="该分论坛" backRoute="forum" backLabel="返回分论坛列表" />;
  }

  const lang = 'zh' as const;
  const remaining = Math.max(0, session.capacity - session.bookedCount);
  const fillRate = Math.min(100, Math.round((session.bookedCount / session.capacity) * 100));

  const handleBook = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    if (session.isBooked) {
      cancelForum(session.id);
    } else {
      bookForum(session.id);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${session.title} · ${session.date} ${session.time} @ ${session.venue}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <DetailShell
      backRoute="forum"
      backLabel="返回分论坛列表"
      eyebrow={session.track}
      title={lang === 'zh' ? session.title : session.titleEn}
      subtitle={lang === 'zh' ? session.description : session.descriptionEn}
      meta={[
        { label: '日期', value: session.date },
        { label: '时间', value: session.time },
        { label: '场地', value: session.venue },
        { label: '余位', value: `${remaining} / ${session.capacity}` },
      ]}
      actions={
        <>
          <button
            type="button"
            onClick={handleBook}
            className={`doa-btn ${session.isBooked ? 'doa-btn-secondary' : 'doa-btn-primary'}`}
          >
            {session.isBooked ? (
              <>
                <Check className="w-4 h-4" /> 已预约 · 点击取消
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4" /> 预约席位
              </>
            )}
          </button>
          <button type="button" onClick={handleCopy} className="doa-btn doa-btn-ghost">
            <Share2 className="w-4 h-4" /> {copied ? '已复制' : '分享场次'}
          </button>
          <button
            type="button"
            onClick={() => setSaved(v => !v)}
            aria-pressed={saved}
            className="doa-btn doa-btn-ghost"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#165DFF] text-[#165DFF]' : ''}`} />
            {saved ? '已收藏' : '收藏'}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---- Main column ---- */}
        <div className="lg:col-span-2 space-y-6">
          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-4">议程安排</h2>
            <ol className="relative border-l-2 border-[#E3ECFA] pl-6 space-y-6">
              {[
                { t: '签到入场', d: '凭 DOAI Passport 扫码签到，领取本场席位凭证', time: session.time.split(' - ')[0] },
                { t: session.title.split(':')[0] || '主题分享', d: '主讲人分享与现场问答', time: session.time.split(' - ')[0] },
                { t: '自由交流', d: '与讲者及同场创客面对面交流', time: session.time.split(' - ')[1] || '' },
              ].map((row, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#165DFF] ring-4 ring-[#E4EFFF]" />
                  <div className="text-xs font-mono text-[#165DFF] font-semibold mb-1">{row.time}</div>
                  <div className="font-semibold text-[#1A2B4D] text-sm mb-1">{row.t}</div>
                  <p className="text-[13px] text-[#6B7C9B] leading-relaxed">{row.d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-5">主讲嘉宾</h2>
            <div className="space-y-5">
              {session.speakers.map((sp, i) => (
                <div key={i} className="flex items-start gap-4">
                  <img
                    src={sp.avatar}
                    alt={sp.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-2 ring-[#E4EFFF]"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-[#1A2B4D] text-sm">{sp.name}</div>
                    <div className="text-[13px] text-[#48597A] mt-0.5">{sp.role}</div>
                    <div className="doa-chip mt-2">{sp.org}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-3">参与说明</h2>
            <ul className="space-y-2.5 text-[13px] text-[#48597A] leading-relaxed">
              {[
                '本场论坛席位免费，但仍需提前预约以确保入座。',
                '预约成功后电子凭证将自动同步至「我的 DOAI」。',
                '如行程有变，请在开场前 48 小时取消以释放名额给他人。',
                '全程录像将上传至直播中心回放区，无需到场也可观看。',
              ].map((t, i) => (
                <li key={i} className="flex gap-2.5">
                  <Check className="w-4 h-4 text-[#165DFF] shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ---- Side column ---- */}
        <aside className="space-y-6">
          <section className="doa-card p-6">
            <h3 className="font-bold text-[#0B1B3A] text-sm mb-4">席位情况</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-extrabold text-[#0B1B3A] tabular-nums">{session.bookedCount}</span>
              <span className="text-sm text-[#98A6BE]">/ {session.capacity} 已预约</span>
            </div>
            <div className="h-2 rounded-full bg-[#EFF5FF] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6FA8FF] to-[#165DFF] transition-all"
                style={{ width: `${fillRate}%` }}
              />
            </div>
            <p className="mt-3 text-[13px] text-[#6B7C9B]">
              {remaining > 0 ? (
                <>剩余 <strong className="text-[#165DFF]">{remaining}</strong> 个席位</>
              ) : (
                <span className="text-[#E5484D] font-semibold">名额已满，可候补</span>
              )}
            </p>
          </section>

          <section className="doa-card p-6 space-y-4">
            <h3 className="font-bold text-[#0B1B3A] text-sm">场次信息</h3>
            <dl className="space-y-3.5 text-[13px]">
              {[
                { icon: Calendar, label: '日期', value: session.date },
                { icon: Clock, label: '时间', value: session.time },
                { icon: MapPin, label: '场地', value: session.venue },
                { icon: Users, label: '形式', value: '线下 · 名额制' },
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-[#165DFF] shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-[11px] text-[#98A6BE] font-semibold uppercase tracking-wider">{row.label}</dt>
                      <dd className="text-[#1A2B4D] font-medium mt-0.5">{row.value}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </section>

          {session.isBooked && (
            <section className="doa-panel p-6 border-[#A9CCFF] bg-[#F2F7FF]">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-[#00B487]" />
                <h3 className="font-bold text-[#0B1B3A] text-sm">你已预约本场</h3>
              </div>
              <p className="text-[13px] text-[#48597A] leading-relaxed mb-4">
                电子凭证已存入「我的 DOAI」，现场扫码即可入座。
              </p>
              <button type="button" onClick={() => setActiveRoute('dashboard')} className="doa-btn doa-btn-secondary w-full">
                <Ticket className="w-4 h-4" /> 查看我的凭证
              </button>
            </section>
          )}

          <section className="doa-card p-6">
            <h3 className="font-bold text-[#0B1B3A] text-sm mb-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-[#165DFF]" /> 线上同步直播
            </h3>
            <p className="text-[13px] text-[#6B7C9B] leading-relaxed mb-4">
              无法到场的创客可在直播中心观看回放，弹幕区可与现场提问。
            </p>
            <button type="button" onClick={() => setActiveRoute('live')} className="doa-btn doa-btn-ghost w-full">
              前往直播中心
            </button>
          </section>
        </aside>
      </div>

      {/* ---- Related sessions ---- */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-lg font-bold text-[#0B1B3A]">其他分论坛</h2>
          <button type="button" onClick={() => setActiveRoute('forum')} className="text-[13px] font-semibold text-[#165DFF] hover:underline">
            查看全部 →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {forums.filter(f => f.id !== session.id).slice(0, 3).map(f => {
            const meta = typeMeta.symposium;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveRoute(`detail/forum/${f.id}`)}
                className="doa-card doa-card-hover p-5 text-left"
              >
                <span className="doa-chip mb-3" style={{ background: `${meta.color}14`, color: meta.color, borderColor: `${meta.color}30` }}>
                  {f.track}
                </span>
                <h3 className="font-bold text-[#1A2B4D] text-sm leading-snug mb-2 line-clamp-2">{f.title}</h3>
                <p className="text-[12px] text-[#6B7C9B] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {f.date} {f.time}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </DetailShell>
  );
};
