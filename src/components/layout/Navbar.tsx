import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import doaiLogo from '../../assets/images/doai_logo.png';
import { Search, ChevronDown, User as UserIcon, X, Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activeRoute,
    setActiveRoute,
    setLoginModalOpen,
    quickSwitchRole,
    lang,
    setLang,
  } = useApp();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Every dropdown entry resolves to a distinct destination: either a scoped
  // sub-route (parent/child) or a detail page. Nothing collapses onto a shared
  // coarse route any more, so a click always changes what you see.
  //
  // `route` is where the section button itself lands; `children` are the
  // deep-links inside its dropdown.
  interface MenuItem {
    key: string;
    label: string;
    labelEn?: string;
    hasDropdown: boolean;
    route?: string;
    children?: { label: string; labelEn?: string; route: string }[];
  }

  const menuItems: MenuItem[] = [
    { key: 'home', label: '首页', labelEn: 'Home', hasDropdown: false },
    {
      key: 'conference',
      label: '大会介绍', labelEn: 'Conference',
      hasDropdown: true,
      route: 'conference',
      children: [
        { label: '分论坛', labelEn: 'Forums', route: 'forum' },
        { label: '大会报名', labelEn: 'Attend', route: 'attend' },
        { label: '活动动态', labelEn: 'News', route: 'news' },
      ],
    },
    {
      key: 'maker',
      label: '赛事中心', labelEn: 'Contest',
      hasDropdown: true,
      route: 'maker',
      children: [
        { label: '赛事总览', labelEn: 'Overview', route: 'maker' },
        { label: '赛题与赛制', labelEn: 'Tracks & Rules', route: 'rules' },
      ],
    },
    {
      key: 'square',
      label: '创客社区', labelEn: 'Community',
      hasDropdown: false,
      route: 'square',
    },
    { key: 'live', label: '直播中心', labelEn: 'Live', hasDropdown: false },
    { key: 'dashboard', label: '我的 DOAI', labelEn: 'My DOAI', hasDropdown: false },
  ];


  // Which nav section each module page belongs to, for active-state highlighting.
  const MODULE_PARENT: Record<string, string> = {
    vision: 'conference',
    venue: 'conference',
    industry: 'maker',
    creator: 'maker',
    cards: 'square',
  };

  // 中 / EN language toggle (site i18n). Many marketing pages remain zh-first,
  // but the switch drives every view that consumes the translation table.
  const LangToggle: React.FC = () => (
    <button
      type="button"
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      aria-label={lang === 'zh' ? 'Switch to English' : '切换为中文'}
      className="flex items-center h-9 px-2.5 rounded-full border border-[#E3ECFA] text-[12px] font-bold text-[#48597A] hover:text-[#165DFF] hover:border-[#A9CCFF] transition-colors"
    >
      <span className={lang === 'zh' ? 'text-[#165DFF]' : ''}>中</span>
      <span className="mx-1 text-[#C0CBDD]">/</span>
      <span className={lang === 'en' ? 'text-[#165DFF]' : ''}>EN</span>
    </button>
  );

  // Resolve which top-level nav item should light up for the current route.
  // Sub-routes stay under their parent; detail routes map to their section;
  // the agenda page is the landing page of 活动体验.
  const activeNavKey = (route: string): string => {
    const parts = String(route || 'home').split('/');
    let base = parts[0];
    if (base === 'detail') {
      base =
        { recruit: 'square', talent: 'square', schedule: 'conference', project: 'maker', forum: 'conference' }[
          parts[1]
        ] || 'home';
    } else if (base === 'module') {
      // Each module page belongs to the nav section it was listed under.
      base = MODULE_PARENT[parts[1]] || 'home';
    } else if (base === 'rules' || base === 'register') {
      base = 'maker';
    } else if (base === 'news' || base === 'attend' || base === 'forum') {
      base = 'conference';
    }
    return base;
  };

  const currentNav = activeNavKey(activeRoute);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F0F2F5] transition-all">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
          {/* Left Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveRoute('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
              aria-label="DOAi 首页"
            >
              {/* Official DOAi lockup, lifted from the hero key art so the
                  header and the first screen share one identity. */}
              <img
                src={doaiLogo}
                alt="DOAi — Dobe Bund AI Makers Conference 2026"
                className="h-[24px] lg:h-[30px] w-auto object-contain transition-opacity group-hover:opacity-70"
                draggable={false}
              />
            </button>
          </div>

          {/* Center Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-[#333333]">
            {menuItems.map(item => {
              // A sub-route like "maker/industry" should still light up "maker",
              // and a detail route lights up the section it belongs to.
              const isActive = currentNav === item.key;
              return (
                <div
                  key={item.key}
                  className="relative py-6"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      const target = item.route || item.key;
                      if (!item.hasDropdown) {
                        setActiveRoute(item.key);
                        return;
                      }
                      // A section button should land on the section itself, at
                      // the top — not deep-jump to its first sub-item, which
                      // reads as "nothing happened".
                      if (isActive) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setActiveRoute(target);
                      }
                    }}
                    className={`flex items-center gap-1 transition-colors hover:text-[#165DFF] focus:outline-none ${
                      isActive ? 'text-[#165DFF] font-semibold' : 'text-[#333333]'
                    }`}
                  >
                    <span>{lang === 'en' && item.labelEn ? item.labelEn : item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#999999] transition-transform duration-200 ${
                          activeDropdown === item.key ? 'rotate-180 text-[#165DFF]' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Active Blue Bottom Underline Indicator (exact screenshot style) */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#165DFF] rounded-t-full" />
                  )}

                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.key && item.children && (
                    <div className="absolute top-[64px] left-1/2 -translate-x-1/2 w-48 bg-white border border-[#E8EAED] rounded-2xl shadow-floating p-2 z-50 animate-in fade-in duration-100">
                      {item.children.map((child, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => {
                            setActiveRoute(child.route);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs font-medium text-[#444444] hover:text-[#165DFF] hover:bg-[#F7F8FA] rounded-xl transition-colors"
                        >
                          {lang === 'en' && child.labelEn ? child.labelEn : child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right controls — language toggle + search.
              Sign-in and the register CTA live inside their own sections now
              (我的 DOAI handles auth, 大会报名 / 赛事报名 handle sign-up). */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LangToggle />
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="搜索"
              title="搜索大会议程与项目"
              className="w-9 h-9 flex items-center justify-center text-[#555555] hover:text-[#165DFF] hover:bg-[#F2F7FF] rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DFF]"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 账号入口（会议结论）：登录态点头像跳「我的 DOAI」；未登录显示登录按钮 */}
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  setActiveRoute('dashboard');
                  setMobileMenuOpen(false);
                }}
                aria-label="我的 DOAI"
                title={currentUser.name}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E3ECFA] hover:border-[#A9CCFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DFF] shrink-0"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-colors shrink-0"
              >
                登录
              </button>
            )}

            {/* Mobile menu trigger — the desktop nav is hidden below lg, so
                without this there is no site navigation on phones at all. */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-expanded={mobileMenuOpen}
              aria-controls="doai-mobile-menu"
              aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
              className="lg:hidden ml-1 w-10 h-10 -mr-1 rounded-xl flex items-center justify-center text-[#0B1B3A] hover:bg-[#F2F7FF] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#165DFF]"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- Mobile navigation panel ---------------- */}
      {mobileMenuOpen && (
        <>
          {/* Scrim closes the panel on an outside tap. */}
          <div
            className="fixed inset-0 top-[72px] z-40 bg-[#0B1B3A]/25 backdrop-blur-[2px] lg:hidden animate-in fade-in duration-150"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="doai-mobile-menu"
            aria-label="移动端导航"
            className="fixed left-0 right-0 top-[72px] z-40 max-h-[calc(100vh-72px)] overflow-y-auto bg-white border-b border-[#E3ECFA] shadow-[0_20px_50px_rgba(11,27,58,0.12)] lg:hidden animate-in slide-in-from-top-2 duration-200"
          >
            <div className="px-5 py-4 divide-y divide-[#EFF5FF]">
              {menuItems.map(item => {
                const active = currentNav === item.key;
                return (
                  <div key={item.key} className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.hasDropdown) {
                          // Always expand first — a single tap must never
                          // navigate away, or the sub-items are unreachable
                          // on touch. A second tap navigates to the section.
                          if (activeDropdown !== item.key) {
                            setActiveDropdown(item.key);
                          } else {
                            setActiveRoute(item.route || item.key);
                            setActiveDropdown(null);
                            setMobileMenuOpen(false);
                          }
                        } else {
                          setActiveRoute(item.key);
                          setMobileMenuOpen(false);
                        }
                      }}
                      aria-expanded={item.hasDropdown ? activeDropdown === item.key : undefined}
                      className={`w-full flex items-center justify-between py-3 text-left text-[15px] font-semibold transition-colors ${
                        active ? 'text-[#165DFF]' : 'text-[#0B1B3A]'
                      }`}
                    >
                      <span>{lang === 'en' && item.labelEn ? item.labelEn : item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`w-4 h-4 text-[#98A6BE] transition-transform duration-200 ${
                            activeDropdown === item.key ? 'rotate-180 text-[#165DFF]' : ''
                          }`}
                        />
                      )}
                    </button>

                    {item.hasDropdown && activeDropdown === item.key && item.children && (
                      <div className="pb-2 pl-3 space-y-1 animate-in slide-in-from-top-1 duration-150">
                        {item.children.map((child, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setActiveRoute(child.route);
                              setActiveDropdown(null);
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2.5 text-[14px] text-[#48597A] hover:text-[#165DFF] rounded-lg hover:bg-[#F2F7FF] transition-colors min-h-[44px] flex items-center"
                          >
                            {lang === 'en' && child.labelEn ? child.labelEn : child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Language switch sits at the bottom for thumb reach; the
                  register CTAs now live inside their own sections. */}
              <div className="pt-4 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#0B1B3A]">{lang === 'en' ? 'Language' : '语言 / Language'}</span>
                  <LangToggle />
                </div>
              </div>
            </div>
          </nav>
        </>
      )}

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-floating border border-[#E8EAED]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED] mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B3A]">
                <Search className="w-4 h-4 text-[#165DFF]" />
                <span>{lang === 'en' ? 'Site Search' : '站内全量搜索'}</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[#888888] hover:text-[#0B1B3A] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search forums, teams, speakers, rules...' : '搜索分论坛主题、参赛团队、嘉宾、赛道规则...'}
                className="w-full px-4 py-3 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#165DFF]"
              />
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-semibold text-[#888888]">{lang === 'en' ? 'Trending:' : '热搜推荐：'}</div>
              <div className="flex flex-wrap gap-2 text-xs">
                {['产业命题赛道', '自由创意赛道', 'After Party', '外滩市集', '创投引力场'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchOpen(false);
                      if (tag.includes('赛道')) setActiveRoute('maker');
                      else if (tag.includes('论坛')) setActiveRoute('forum');
                      else setActiveRoute('conference');
                    }}
                    className="px-3 py-1 rounded-full bg-[#F7F8FA] border border-[#E8EAED] text-[#555555] hover:text-[#165DFF] hover:border-[#165DFF]/40 text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
