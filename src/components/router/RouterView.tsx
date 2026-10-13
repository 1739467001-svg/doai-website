/**
 * Route table + resolution helpers.
 *
 * Routes are plain strings so they can travel through the existing context
 * (`setActiveRoute`). A route is either a top-level view or a scoped sub-route
 * written as `parent/child` (e.g. `maker/industry`), which lets the navbar
 * deep-link into a specific tab of a page.
 */
import React from 'react';
import { useApp } from '../../context/AppContext';
import { HomeView } from '../views/HomeView';
import { ConferenceView } from '../views/ConferenceView';
import { MakerView } from '../views/MakerView';
import { RegisterView } from '../views/RegisterView';
import { TrackDetailView } from '../views/TrackDetailView';
import { SquareView } from '../views/SquareView';
import { ForumView } from '../views/ForumView';
import { LiveView } from '../views/LiveView';
import { DashboardView } from '../views/DashboardView';
import { AdminView } from '../views/AdminView';
import { ForumDetailView } from '../views/ForumDetailView';
import { RecruitDetailView } from '../views/RecruitDetailView';
import { ProjectDetailView } from '../views/ProjectDetailView';
import { ScheduleDetailView } from '../views/ScheduleDetailView';
import { ModuleView } from '../detail/ModuleView';
import { RulesView } from '../detail/RulesView';
import { NewsView } from '../detail/NewsView';
import { AttendView } from '../detail/AttendView';

/** The top-level segments that map to a full page. */
export const TOP_LEVEL = [
  'home',
  'conference',
  'maker',
  'register',
  'square',
  'forum',
  'live',
  'dashboard',
  'admin',
] as const;

export type TopLevel = (typeof TOP_LEVEL)[number];

/** Split "maker/industry" into ["maker", "industry"]. */
export function parseRoute(route: string): { base: string; sub: string | null } {
  const [base, ...rest] = String(route || 'home').split('/');
  return { base: base || 'home', sub: rest.length ? rest.join('/') : null };
}

/** Which top-level nav item should light up for a given route. */
export function navKeyForRoute(route: string): string {
  return parseRoute(route).base;
}

/** Human title for a route, used by the detail pages' back links and <title>. */
export function routeTitle(route: string): string {
  return (
    {
      home: '首页',
      conference: '大会介绍',
      maker: '赛事中心',
      register: '项目申报',
      square: '创客社区',
      forum: 'DOAI Forum',
      live: '直播中心',
      dashboard: '我的 DOAI',
      admin: '运营管理',
    } as Record<string, string>
  )[parseRoute(route).base] || 'DOAI 2026';
}

export const RouterView: React.FC = () => {
  const { activeRoute } = useApp();
  const { base, sub } = parseRoute(activeRoute);

  // Navbar sub-modules each get their own page: module/<id>
  if (base === 'module') {
    const [, id] = String(activeRoute).split('/');
    return <ModuleView id={id} />;
  }

  // Standalone module pages modelled on the GOAI reference site.
  if (base === 'rules') return <RulesView />;
  if (base === 'news') return <NewsView />;
  if (base === 'attend') return <AttendView />;

  // 赛道详情页（参考 GOAI：申报赛道 → 赛道详情 → 报名）
  if (base === 'track') return <TrackDetailView track={sub ?? undefined} />;

  // Detail routes are encoded as `detail/<kind>/<id>`.
  if (base === 'detail') {
    const [, kind, id] = String(activeRoute).split('/');
    switch (kind) {
      case 'forum':
        return <ForumDetailView id={id} />;
      case 'recruit':
        return <RecruitDetailView id={id} />;
      case 'project':
        return <ProjectDetailView id={id} />;
      case 'schedule':
        return <ScheduleDetailView id={id} />;
      default:
        return <HomeView />;
    }
  }

  switch (base) {
    case 'conference':
      return <ConferenceView />;
    case 'maker':
      return <MakerView />;
    case 'register':
      return <RegisterView />;
    case 'square':
      return <SquareView />;
    case 'forum':
      return <ForumView />;
    case 'live':
      return <LiveView />;
    case 'dashboard':
      return <DashboardView />;
    case 'admin':
      return <AdminView />;
    case 'home':
    default:
      return <HomeView />;
  }
};
