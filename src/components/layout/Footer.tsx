import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, HeartHandshake, Lock, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setActiveRoute, openPolicy } = useApp();

  return (
    <footer className="bg-white border-t border-[#E8EAED] pt-16 pb-12 text-sm text-[#666666]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E8EAED]">
          {/* Brand & Narrative */}
          <div className="sm:col-span-3 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#0B1B3A]">
                DOAI <span className="font-light text-[#165DFF]">2026</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#666666] max-w-sm">
              {lang === 'zh'
                ? '2026 Dobe 外滩 AI 创客大会官方数字基础设施。连接全球智能创造者，构筑下一代开放式协作网络。'
                : '2026 DOBE Bund AI Makers Conference — Official Digital Infrastructure. Connecting decentralized intelligence into an open creative network.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#888888]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C48C]" />
                {lang === 'zh' ? '全流程免费' : '100% Free'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#165DFF]" />
                {lang === 'zh' ? '项目知识产权受保' : 'IP Protected'}
              </span>
            </div>
          </div>

          {/* Nav Column 1: 大会与赛事 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#0B1B3A] uppercase tracking-wider">
              {lang === 'zh' ? '大会与赛事' : 'Event & Contest'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveRoute('conference')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? '大会日程与使命' : 'Schedule & Mission'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveRoute('rules')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? '双赛道规则指南' : 'Dual Track Guidelines'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveRoute('maker/tracks')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? '赛事申报通道' : 'Contest Submission'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('rules')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? '奖金兑付与合规说明' : 'Prize & Integrity Policy'}
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: 生态与连接 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#0B1B3A] uppercase tracking-wider">
              {lang === 'zh' ? '生态与协作' : 'Ecosystem'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveRoute('square')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? '创客社区' : 'Maker Community'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveRoute('forum')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? 'DOAI Forum 分论坛' : 'DOAI Forum'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveRoute('live')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? '多路超清直播' : 'Live Streams'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveRoute('dashboard')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? 'DOAI Passport 身份卡' : 'DOAI Passport ID'}
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: 账号与支持 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#0B1B3A] uppercase tracking-wider">
              {lang === 'zh' ? '账号与法律合规' : 'Account & Compliance'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openPolicy('terms')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? '用户协议 (User Terms)' : 'Terms of Service'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('privacy')}
                  className="hover:text-[#165DFF] transition-colors"
                >
                  {lang === 'zh' ? '隐私政策 (Privacy Policy)' : 'Privacy Policy'}
                </button>
              </li>
              <li className="text-[#888888]">
                {lang === 'zh'
                  ? '与 atomclub.cn 账号统一打通'
                  : 'Unified with atomclub.cn ID'}
              </li>
              <li>
                <a
                  href="mailto:committee@doai2026.org"
                  className="break-all hover:text-[#165DFF] transition-colors"
                >
                  committee@doai2026.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888888]">
          <p>© 2026 DOAI Organizing Committee & Atomclub Network. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Official Global Digital Platform</span>
            <span>·</span>
            <span>Made for AI Creators Worldwide</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => setActiveRoute('admin')} className="hover:text-[#165DFF] transition-colors">
              {lang === 'en' ? 'Operations' : '运营管理'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
