import React, { useState, useEffect, useRef } from 'react';
import heroHorizon from '../../assets/images/hero_ai_horizon_1790923964186.jpg';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Volume2,
  VolumeX,
  MessageSquare,
  Send,
  Eye,
  Bell,
  Play,
  Share2,
  Tv,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

interface Danmaku {
  id: string;
  text: string;
  sender: string;
  color?: string;
  top: number;
}

export const LiveView: React.FC = () => {
  const { lang, t, currentUser, setLoginModalOpen, tr } = useApp();

  const [activeVenue, setActiveVenue] = useState<'main' | 'agent' | 'hardware' | 'global'>('main');
  const [audioOnly, setAudioOnly] = useState(false);
  const [danmakuEnabled, setDanmakuEnabled] = useState(true);
  const [danmakuInput, setDanmakuInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Danmaku list
  const [danmakus, setDanmakus] = useState<Danmaku[]>([
    { id: '1', text: '沈院士讲的计算拓扑结构太精彩了！', sender: 'Alex', top: 15 },
    { id: '2', text: '这次双赛道的奖金池非常实在', sender: 'Dev_Chen', top: 35 },
    { id: '3', text: '请问下午的 Agent 分论坛有重播吗？', sender: 'Zoe', top: 55 },
    { id: '4', text: '音画同步非常流畅，赞一个', sender: 'Makers', top: 75 },
  ]);

  // Last sent time for 5s rate limiter
  const [lastSentTime, setLastSentTime] = useState(0);
  const [rateLimitNotice, setRateLimitNotice] = useState('');

  const venueConfig = {
    main: {
      title: '主会场 · 开幕式与主旨演讲 (Live)',
      titleEn: 'Main Keynote & Grand Opening',
      viewers: 12480,
      topic: '开幕式主会场：主办方战略发布与全球 AI 创客生态圆桌',
      scheduleNow: '当前议程：主旨演讲与全球生态发布',
      nextUp: '14:00 创客大赛总决赛路演抽签',
    },
    agent: {
      title: '分会场 A · Agent 基础设施与自主多智能体',
      titleEn: 'Session A · Autonomous Agents & Protocols',
      viewers: 6320,
      topic: 'LangGraph 与分布式 AgentMesh 拓扑架构演进',
      scheduleNow: '当前议程：多智能体状态持久化技术研讨',
      nextUp: '15:30 智能体安全与抗对抗测试',
    },
    hardware: {
      title: '分会场 B · 具身智能与消费级创客硬件',
      titleEn: 'Session B · Embodied AI & Maker Hardware',
      viewers: 4890,
      topic: '微型驱控机构与端侧微模型协同测试',
      scheduleNow: '当前议程：硬件黑客现场拆解与实时演示',
      nextUp: '16:00 消费级桌面陪伴体原型展示',
    },
    global: {
      title: '海外连线 · Global AI Horizon (Silicon Valley & London)',
      titleEn: 'Global Stream · Worldwide Creators',
      viewers: 8150,
      topic: 'Global Frontier Models & Cross-Border Collaboration',
      scheduleNow: '当前议程：伦敦与旧金山实验室双向连线',
      nextUp: '17:00 Global Hackathon Winners Showcase',
    },
  };

  const currentInfo = venueConfig[activeVenue];

  const handleSendDanmaku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    const now = Date.now();
    if (now - lastSentTime < 5000) {
      setRateLimitNotice('发言过于频繁，请间隔 5 秒后再试');
      setTimeout(() => setRateLimitNotice(''), 2500);
      return;
    }
    if (!danmakuInput.trim()) return;

    const newDanmaku: Danmaku = {
      id: `d-${Date.now()}`,
      text: danmakuInput.trim(),
      sender: currentUser.name,
      top: Math.floor(Math.random() * 60) + 15,
    };

    setDanmakus(prev => [newDanmaku, ...prev.slice(0, 15)]);
    setDanmakuInput('');
    setLastSentTime(now);
  };

  return (
    <div className="pt-24 pb-24">
      {/* 1. Header Banner */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EAED]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>DOAI LIVE BROADCAST NETWORK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1B3A] mt-1">
              {currentInfo.title}
            </h1>
          </div>

          {/* Subscribe Remind Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSubscribed(!subscribed)}
              className={`px-5 py-2 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 ${
                subscribed
                  ? 'bg-[#00C48C]/10 text-[#00C48C] border-[#00C48C]/30'
                  : 'bg-white text-[#0B1B3A] border-[#E8EAED] hover:bg-[#F7F8FA]'
              }`}
            >
              {subscribed ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              <span>{subscribed ? (lang === 'en' ? 'Reminder On' : t.live.subscribed) : (lang === 'en' ? 'Notify When Live' : t.live.subscribeRemind)}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main Live Media Player (Strictly Dark Container as per Visual Design Spec V2.0 Section 17) */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: 16:9 Video Canvas */}
          <div className="lg:col-span-3">
            <div className="relative rounded-3xl overflow-hidden bg-[#0A0D14] aspect-[16/9] shadow-floating border border-neutral-800 flex flex-col justify-between p-6">
              {/* Top Controls Overlay */}
              <div className="flex items-center justify-between z-20 text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                  <span className="text-neutral-300 font-mono flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {currentInfo.viewers.toLocaleString()} {t.live.viewers}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Audio-only Mode Toggle */}
                  <button
                    onClick={() => setAudioOnly(!audioOnly)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      audioOnly
                        ? 'bg-[#165DFF] text-white font-medium'
                        : 'bg-white/10 hover:bg-white/20 text-neutral-300'
                    }`}
                  >
                    {audioOnly ? '纯音频模式 (已开启)' : '超清视频'}
                  </button>

                  <button
                    onClick={() => setDanmakuEnabled(!danmakuEnabled)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      danmakuEnabled
                        ? 'bg-white/20 text-white'
                        : 'bg-transparent text-neutral-400'
                    }`}
                  >
                    {tr('弹幕', 'Danmaku')}: {danmakuEnabled ? tr('开', 'ON') : tr('关', 'OFF')}
                  </button>
                </div>
              </div>

              {/* Main Simulated Stream Visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                {audioOnly ? (
                  <div className="text-center space-y-3 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#165DFF]/20 text-[#165DFF] flex items-center justify-center mx-auto animate-pulse">
                      <Volume2 className="w-8 h-8" />
                    </div>
                    <div className="text-white text-sm font-semibold">弱网省流：纯音频低延迟推流中</div>
                    <div className="text-neutral-400 text-xs">{currentInfo.topic}</div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Simulated Stage Visual Background */}
                    <img
                      src={heroHorizon}
                      alt="Live Stage Stream"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

                    {/* Stage Presentation Title */}
                    <div className="absolute bottom-16 left-8 right-8 text-white z-10">
                      <div className="text-xs uppercase text-[#00C48C] font-semibold tracking-wider">
                        {currentInfo.scheduleNow}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold mt-1">
                        {currentInfo.topic}
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Danmaku Overlay */}
                {danmakuEnabled && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    {danmakus.map((d, index) => (
                      <div
                        key={d.id}
                        className="absolute whitespace-nowrap text-white/95 text-sm font-medium px-3 py-1 bg-black/40 backdrop-blur-xs rounded-full shadow-sm animate-sweep"
                        style={{
                          top: `${d.top}%`,
                          left: `${(index * 22) % 60}%`,
                        }}
                      >
                        <span className="text-neutral-400 text-xs mr-1">{d.sender}:</span>
                        <span>{d.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Control Bar */}
              <div className="flex items-center justify-between z-20 text-white text-xs pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Play className={`w-4 h-4 ${isPlaying ? 'fill-current' : ''}`} />
                  </button>
                  <span className="text-neutral-400">01:42:18 · 4K 60FPS</span>
                </div>

                <div className="text-neutral-400 text-xs font-medium">
                  下一环节: {currentInfo.nextUp}
                </div>
              </div>
            </div>

            {/* Danmaku Input Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <form onSubmit={handleSendDanmaku} className="flex-1 flex gap-2 w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={danmakuInput}
                    onChange={e => setDanmakuInput(e.target.value)}
                    placeholder={t.live.sendDanmaku}
                    className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#165DFF]"
                  />
                  {rateLimitNotice && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-rose-500 font-medium">
                      {rateLimitNotice}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{tr('发射', 'Send')}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Venue Channels & Schedule */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0B1B3A]">{tr('多路直播信号分流', 'Multi-Venue Streams')}</h3>

            <div className="space-y-3">
              {[
                { id: 'main', name: '主会场 · 主旨报告厅', status: '进行中', viewers: '12.4k' },
                { id: 'agent', name: '分会场 A · Agent 架构', status: '进行中', viewers: '6.3k' },
                { id: 'hardware', name: '分会场 B · 具身硬件', status: '进行中', viewers: '4.8k' },
                { id: 'global', name: '海外连线 · Global Stream', status: '连线中', viewers: '8.1k' },
              ].map(venue => (
                <button
                  key={venue.id}
                  onClick={() => setActiveVenue(venue.id as any)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    activeVenue === venue.id
                      ? 'bg-[#165DFF]/5 border-[#165DFF] shadow-xs'
                      : 'bg-white border-[#E8EAED] hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#0B1B3A]">{venue.name}</span>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                      {venue.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#888888] flex items-center justify-between mt-2">
                    <span>超清低延时信号</span>
                    <span className="font-mono">{venue.viewers} 观看</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Broadcast Advisory Box */}
            <div className="p-4 doa-panel text-xs text-[#666666] space-y-1.5">
              <div className="font-semibold text-[#0B1B3A]">{tr('直播合规与回放说明', 'Replays & Guidelines')}</div>
              <p className="text-[11px] leading-relaxed">
                全场视频录像将在直播结束后 24 小时内剪辑上线。用户弹幕发言受敏感词过滤保护，营造开放包容的技术交流场域。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
