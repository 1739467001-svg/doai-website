import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const ForumView: React.FC = () => {
  const { lang, t, forums, bookForum, cancelForum, setActiveRoute } = useApp();

  const [filterSlot, setFilterSlot] = useState<'all' | 'morning' | 'afternoon' | 'allday'>('all');

  // 会议结论 2026-10-13：发起分论坛申请不做站内数据收集，直接跳飞书问卷。
  const FORUM_PROPOSE_FORM_URL =
    'https://pcntu7vxqu2m.feishu.cn/share/base/shrcn4bA2qUb1drKi7VVcw3BY1d';

  // Slots follow the plan's 排期建议：上午 / 下午 / 全天。
  const slotOf = (time: string): 'morning' | 'afternoon' | 'allday' => {
    if (time.startsWith('10:00') && time.includes('17:00')) return 'allday';
    if (time.startsWith('10:00')) return 'morning';
    return 'afternoon';
  };

  const filteredForums = forums.filter(f => {
    if (filterSlot === 'all') return true;
    return slotOf(f.time) === filterSlot;
  });

  return (
    <div className="pt-24 pb-24">
      {/* 1. Header Banner */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8EAED]">
          <div>
            <div className="text-xs font-semibold text-[#165DFF] tracking-wider uppercase mb-1">
              DOAI FORUM & INTELLECTUAL SYMPOSIUM
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1B3A]">
              DOAI Forum 思想交流中心
            </h1>
            <p className="text-xs text-[#666666] mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C48C]" />
              <span>18 个分会场 · 11/15 全天并行 7—8 场 · 名额制免费预约 · 凭证自动存入 DOAI Passport</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(FORUM_PROPOSE_FORM_URL, '_blank', 'noopener')}
              className="px-6 py-2.5 text-xs font-semibold text-[#165DFF] bg-white hover:bg-[#F7F8FA] border border-[#165DFF]/30 rounded-full transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t.forum.proposeBtn}</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>

        {/* Overview strip — what the 18 sub-venues are and how booking works */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 mb-2">
          {[
            { label: '分会场', value: '18 个', note: '统一 DOAI 命名体系' },
            { label: '场次总量', value: '30—40 场', note: '两天合计' },
            { label: '举办时间', value: '11/15', note: '乐动虹桥 1F—3F 与德必园区' },
            { label: '预约方式', value: '免费选座', note: '开场前 48 小时可取消' },
          ].map((st, i) => (
            <div key={i} className="doa-card p-5">
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1.5">
                {st.label}
              </div>
              <div className="text-xl font-extrabold text-[#0B1B3A] tracking-tight tabular-nums">{st.value}</div>
              <div className="text-[11px] text-[#6B7C9B] mt-1">{st.note}</div>
            </div>
          ))}
        </div>

        {/* Filter Chips Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#888888] text-[11px] mr-1">举办时段:</span>
          {[
            { id: 'all', label: '全部场次', count: forums.length },
            { id: 'morning', label: '上午场', count: forums.filter(f => slotOf(f.time) === 'morning').length },
            { id: 'afternoon', label: '下午场', count: forums.filter(f => slotOf(f.time) === 'afternoon').length },
            { id: 'allday', label: '全天场', count: forums.filter(f => slotOf(f.time) === 'allday').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterSlot(tab.id as typeof filterSlot)}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                filterSlot === tab.id
                  ? 'bg-[#165DFF] text-white'
                  : 'bg-[#F7F8FA] text-[#666666] hover:text-[#0B1B3A] border border-[#E8EAED]'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">{tab.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Forum Sessions Grid (Magazine style as per spec) */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredForums.map(session => (
            <div
              key={session.id}
              className="doa-card doa-card-hover p-8 flex flex-col justify-between group"
            >
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-[#888888] mb-3">
                  <span className="font-bold text-[#165DFF]">{session.track}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{session.date}</span>
                    <span aria-hidden="true">·</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{session.time}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveRoute(`detail/forum/${session.id}`)}
                  className="block text-left group/title"
                >
                  <h3 className="text-xl font-bold text-[#0B1B3A] mb-2 group-hover/title:text-[#165DFF] transition-colors">
                    {session.title}
                  </h3>
                </button>
                <p className="text-xs text-[#666666] leading-relaxed mb-6">
                  {session.description}
                </p>

                {/* Speakers Lineup */}
                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                    特邀嘉宾阵容
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {session.speakers.map(speaker => (
                      <div key={speaker.name} className="flex items-center gap-2.5">
                        <img
                          src={speaker.avatar}
                          alt={speaker.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-[#E8EAED]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#0B1B3A]">{speaker.name}</div>
                          <div className="text-[11px] text-[#666666]">{speaker.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer with Venue & Reservation Action */}
              <div className="pt-6 border-t border-[#F0F2F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-[#555555] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#165DFF]" />
                    <span>{session.venue}</span>
                  </div>
                  <div className="text-[11px] text-[#888888]">
                    已预约席位：<span className="font-mono font-semibold text-[#0B1B3A]">{session.bookedCount}</span> / {session.capacity}
                  </div>
                </div>

                <div>
                  {session.isBooked ? (
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 text-xs font-semibold text-[#00C48C] bg-[#00C48C]/10 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>已成功锁定席位</span>
                      </span>
                      <button
                        onClick={() => cancelForum(session.id)}
                        className="text-xs text-[#888888] hover:text-red-500 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => bookForum(session.id)}
                      disabled={session.bookedCount >= session.capacity}
                      className={`px-6 py-2.5 text-xs font-semibold rounded-full transition-all shadow-xs ${
                        session.bookedCount >= session.capacity
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                          : 'bg-[#165DFF] hover:bg-[#1453E6] text-white'
                      }`}
                    >
                      {session.bookedCount >= session.capacity ? '席位已约满' : t.forum.reserveBtn}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
