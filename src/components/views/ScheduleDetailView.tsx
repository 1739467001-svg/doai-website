import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DetailShell, NotFound } from '../detail/DetailShell';
import { schedule, typeMeta, dayMeta } from '../../data/conference';
import {
  Clock, MapPin, Users, Bookmark, Bell, Check, Navigation, Ticket,
} from 'lucide-react';

export const ScheduleDetailView: React.FC<{ id?: string }> = ({ id }) => {
  const { setActiveRoute, currentUser, setLoginModalOpen } = useApp();
  const [reminded, setReminded] = useState(false);

  const item = schedule.find(s => s.id === id);
  if (!item) return <NotFound what="该日程" backRoute="conference/schedule" backLabel="返回完整日程" />;

  const meta = typeMeta[item.type];
  const day = dayMeta[item.day];

  const sameVenue = schedule.filter(s => s.venue === item.venue && s.id !== item.id);
  const sameDay = schedule.filter(s => s.day === item.day && s.id !== item.id);

  return (
    <DetailShell
      backRoute="conference/schedule"
      backLabel="返回完整日程"
      eyebrow={`${day.label} · ${day.date} · ${meta.label}`}
      title={item.title}
      subtitle={item.description}
      meta={[
        { label: '日期', value: `${day.date} (${day.label})` },
        { label: '时间', value: `${item.startTime} - ${item.endTime}` },
        { label: '场地', value: item.venue },
        ...(item.speaker ? [{ label: '主讲', value: item.speaker }] : []),
        ...(item.capacity ? [{ label: '容量', value: `${item.capacity} 人` }] : []),
      ]}
      actions={
        <>
          <button
            type="button"
            onClick={() => {
              if (!currentUser) return setLoginModalOpen(true);
              setReminded(r => !r);
            }}
            className="doa-btn doa-btn-primary"
          >
            {reminded ? <><Check className="w-4 h-4" /> 已加入日程</> : <><Bell className="w-4 h-4" /> 加入我的日程</>}
          </button>
          <button type="button" className="doa-btn doa-btn-ghost">
            <Bookmark className="w-4 h-4" /> 收藏
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-5">时间与地点</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#E3ECFA]">
                <Clock className="w-4 h-4 text-[#165DFF] mb-2" />
                <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">时间</div>
                <div className="text-[13px] font-semibold text-[#1A2B4D] font-mono">{item.startTime} — {item.endTime}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#E3ECFA]">
                <MapPin className="w-4 h-4 text-[#165DFF] mb-2" />
                <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">场地</div>
                <div className="text-[13px] font-semibold text-[#1A2B4D]">{item.venue}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#E3ECFA]">
                <Users className="w-4 h-4 text-[#165DFF] mb-2" />
                <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">形式</div>
                <div className="text-[13px] font-semibold text-[#1A2B4D]">{item.capacity ? '名额制 · 需预约' : '自由参加'}</div>
              </div>
            </div>
          </section>

          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-4">内容介绍</h2>
            <p className="text-sm text-[#48597A] leading-[1.9]">{item.description}</p>
            {item.speaker && (
              <div className="mt-6 pt-5 border-t border-[#E3ECFA]">
                <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-2">主讲嘉宾</div>
                <div className="font-bold text-[#1A2B4D]">{item.speaker}</div>
              </div>
            )}
          </section>

          {sameDay.length > 0 && (
            <section className="doa-card p-6 sm:p-7">
              <h2 className="text-lg font-bold text-[#0B1B3A] mb-5">当天其他安排</h2>
              <div className="space-y-2.5">
                {sameDay.map((s) => {
                  const m = typeMeta[s.type];
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveRoute(`detail/schedule/${s.id}`)}
                      className="w-full text-left flex items-center gap-4 p-3.5 rounded-2xl border border-[#E3ECFA] hover:border-[#A9CCFF] hover:bg-[#F7FAFF] transition-colors"
                    >
                      <span className="font-mono text-[12px] font-semibold text-[#6B7C9B] w-[86px] shrink-0">
                        {s.startTime}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                        style={{ background: `${m.color}14`, color: m.color }}
                      >
                        {m.label}
                      </span>
                      <span className="text-[13px] font-medium text-[#1A2B4D] truncate">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="doa-card p-6">
            <h3 className="font-bold text-[#0B1B3A] text-sm mb-4">位置导航</h3>
            <div className="rounded-2xl bg-[#F2F7FF] border border-[#E3ECFA] h-32 flex items-center justify-center mb-4">
              <Navigation className="w-7 h-7 text-[#A9CCFF]" />
            </div>
            <p className="text-[13px] font-semibold text-[#1A2B4D] mb-1">{item.venue}</p>
            <button type="button" className="doa-btn doa-btn-secondary w-full">
              <Navigation className="w-4 h-4" /> 打开地图导航
            </button>
          </section>

          {sameVenue.length > 0 && (
            <section className="doa-card p-6">
              <h3 className="font-bold text-[#0B1B3A] text-sm mb-3">同场地安排</h3>
              <div className="space-y-2.5">
                {sameVenue.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveRoute(`detail/schedule/${s.id}`)}
                    className="w-full text-left text-[13px] text-[#48597A] hover:text-[#165DFF] transition-colors py-1"
                  >
                    <span className="font-mono text-[11px] text-[#98A6BE] mr-2">{s.startTime}</span>
                    {s.title}
                  </button>
                ))}
              </div>
            </section>
          )}

          {item.capacity && (
            <section className="doa-panel p-6 border-[#A9CCFF] bg-[#F2F7FF]">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="w-4 h-4 text-[#165DFF]" />
                <h3 className="font-bold text-[#0B1B3A] text-sm">需要预约</h3>
              </div>
              <p className="text-[13px] text-[#48597A] leading-relaxed mb-4">
                该场次容量 {item.capacity} 人，建议提前预约以便预留席位。
              </p>
              <button type="button" onClick={() => setActiveRoute('forum')} className="doa-btn doa-btn-ghost w-full">
                前往预约
              </button>
            </section>
          )}
        </aside>
      </div>
    </DetailShell>
  );
};
