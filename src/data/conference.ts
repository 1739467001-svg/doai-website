/**
 * Content for the detail pages: schedule, venues, program blocks, and the
 * per-recruitment applicant pool. Kept separate from AppContext so the
 * context file stays focused on state and actions.
 */
import { ScheduleItem, Venue, ProgramBlock } from '../types';
import forumImg from '../assets/images/forum_panel_1790923996404.jpg';
import hallImg from '../assets/images/conference_auditorium_1790923976092.jpg';
import bazaarImg from '../assets/images/venue_maker_bazaar_1790924729315.jpg';
import partyImg from '../assets/images/evening_after_party_1790924737645.jpg';
import heroImg from '../assets/images/hero_ai_horizon_1790923964186.jpg';
import makersImg from '../assets/images/makers_collaborating_1790923986603.jpg';

/**
 * Agenda and venue data, taken from the official plan's 日程总览.
 * `speakers` is intentionally omitted — the plan lists 出席领导名单 as 待确认.
 */
export const schedule: ScheduleItem[] = [
  // ---------------- Day 1 · 11/14 · 外滩德必园区 · 开幕与社交 ----------------
  { id: 'sch-101', day: 'day1', startTime: '09:00', endTime: '12:30', title: '报到签到', venue: '德必园区 · 签到区', type: 'social', track: 'general', description: '报到签到、领取物料包与嘉宾证；参赛团队报到、媒体采访、自由交流。' },
  { id: 'sch-102', day: 'day1', startTime: '13:00', endTime: '13:30', title: '入场就座、暖场视频', venue: '德必园区 · 主会场', type: 'social', track: 'general', description: '' },
  { id: 'sch-103', day: 'day1', startTime: '13:30', endTime: '14:00', title: '开场：领导致辞', venue: '德必园区 · 主会场', type: 'keynote', track: 'general', description: '政府领导、主办方致辞。' },
  { id: 'sch-104', day: 'day1', startTime: '14:00', endTime: '14:40', title: '主办方分享：战略发布与大会愿景', venue: '德必园区 · 主会场', type: 'keynote', track: 'general', description: '原子公社、德必集团战略发布与大会愿景（直播）。' },
  { id: 'sch-105', day: 'day1', startTime: '14:40', endTime: '15:40', title: '圆桌论坛：全球 AI 创客生态', venue: '德必园区 · 主会场', type: 'symposium', track: 'general', description: '海外专家连线 + 投资人 + 创客代表。' },
  { id: 'sch-106', day: 'day1', startTime: '16:00', endTime: '16:40', title: '赛制发布与高校签约', venue: '德必园区 · 主会场', type: 'keynote', track: 'general', description: '双赛道赛制正式发布，现场签署高校合作协议。' },
  { id: 'sch-107', day: 'day1', startTime: '18:30', endTime: '21:30', title: 'After Party 创客社交之夜', venue: '外滩德必园区', type: 'social', track: 'general', description: '创客社交之夜，自由交流与合作对接。' },

  // ---------------- Day 2 · 11/15 · 外滩德必园区 · 赛果绽放 ----------------
  { id: 'sch-201', day: 'day2', startTime: '09:30', endTime: '12:00', title: '展区开市', venue: '外滩德必园区 1F', type: 'workshop', track: 'general', description: '黄浦市集开市、AI 互动区开放、樊登书店求职区开放、展商开馆、游园护照发放。' },
  { id: 'sch-202', day: 'day2', startTime: '09:30', endTime: '12:00', title: '决赛路演第一场：产业赛道', venue: '外滩德必园区 · 路演厅', type: 'roadshow', track: 'industry', capacity: 320, description: '8 分钟路演 + 5 分钟答辩，全程直播。' },
  { id: 'sch-204', day: 'day2', startTime: '09:30', endTime: '12:00', title: '「逐梦星河」商业航天论坛（上午场）', venue: '外滩德必园区 2F', type: 'symposium', track: 'general', description: '' },
  { id: 'sch-205', day: 'day2', startTime: '13:30', endTime: '16:00', title: '决赛路演第二场：自由赛道', venue: '外滩德必园区 · 路演厅', type: 'roadshow', track: 'creator', capacity: 320, description: '8 分钟路演 + 5 分钟答辩，全程直播。' },
  { id: 'sch-206', day: 'day2', startTime: '13:30', endTime: '17:00', title: '分论坛（7—8 场并行）', venue: '外滩德必园区 3F', type: 'symposium', track: 'general', description: '18 个分会场中当日排期场次依次进行。' },
  { id: 'sch-207', day: 'day2', startTime: '16:30', endTime: '17:30', title: '闭幕式：颁奖与项目落地签约', venue: '外滩德必园区 · 主会场', type: 'keynote', track: 'general', description: '公布获奖名单，现场推动项目与企业需求签约。' },
];

export const venues: Venue[] = [
  {
    id: 'venue-debei',
    name: '外滩德必园区',
    nameEn: 'Debei Hongqiao Park',
    address: '上海市黄浦区外滩（园区入口详见现场指引）',
    district: '黄浦 · 外滩',
    capacity: 1200,
    image: hallImg,
    tags: ['主会场', '开幕式', '分论坛'],
    intro:
      '大会主会场。开幕式、主旨演讲与颁奖典礼均在此举行。园区集会议、展览与办公于一体，可容纳 1200 人同时参会。',
    facilities: ['同声传译', '4K 巨幕', '高速 Wi-Fi', '无障碍通道', '母婴室', '全程直播'],
    transit: '地铁 2 / 10 / 17 号线 虹桥火车站下车，步行 8 分钟；或乘 74 路至虹许路金钟路站。',
  },
  {
    id: 'venue-ledong',
    name: '外滩德必园区',
    nameEn: 'Ledong Hongqiao',
    address: '上海市黄浦区外滩（园区入口详见现场指引）',
    district: '黄浦 · 外滩',
    capacity: 2000,
    image: bazaarImg,
    tags: ['决赛', '市集', 'After Party'],
    intro:
      '赛事与狂欢主场。承载双赛道决赛路演、智能硬件市集与闭幕 After Party，层高 12 米，可承载大型搭建与光影装置。',
    facilities: ['专业舞台', '重载电力', '货运通道', '装备寄存', '餐饮市集', 'DJ 舞台'],
    transit: '地铁 2 / 10 / 17 号线 淞虹路站下车，步行 10 分钟；园区提供接驳车。',
  },
];

export const programBlocks: ProgramBlock[] = [
  {
    id: 'pb-vision',
    eyebrow: 'MISSION',
    title: '大会愿景与使命',
    titleEn: 'Vision & Mission',
    summary:
      'DOAI 致力于把 AI 从屏幕带进现实。我们不办只讲概念的会，而是搭建一条创客可以立刻动手、立刻验证、立刻找到伙伴的完整链路。',
    bullets: [
      { title: '开放', desc: '报名、参会全程免费，不设任何门槛与付费通道。', icon: 'globe' },
      { title: '可造', desc: '双赛道 + 硬件市集，代码与电路板同样被尊重。', icon: 'bolt' },
      { title: '真实', desc: '产业对接、真实场景验证，而非停留在 Demo。', icon: 'shield' },
      { title: '连接', desc: '700+ 创客、14 位评委、30+ 投资机构同场。', icon: 'people' },
    ],
    image: heroImg,
    stats: [
      { label: '报名创客', value: '742' },
      { label: '入围项目', value: '32' },
      { label: '奖金池', value: '¥200,000' },
      { label: '专家评委', value: '14' },
    ],
  },
  {
    id: 'pb-venue',
    eyebrow: 'VENUE',
    title: '双会场空间与路线导引',
    titleEn: 'Two Venues & Wayfinding',
    summary:
      '外滩德必园区承载思想与荣誉，外滩德必园区承载创造与狂欢。两会场相距 1.8 公里，大会全程提供接驳车。',
    bullets: [
      { title: '外滩德必园区', desc: '开幕式 · 主旨演讲 · 颁奖典礼', icon: 'globe' },
      { title: '外滩德必园区', desc: '双赛道决赛 · 硬件市集 · After Party', icon: 'bolt' },
      { title: '接驳车', desc: '两会场之间每 20 分钟一班，全程免费。', icon: 'people' },
      { title: '参会指引', desc: '凭 DOAI Passport 扫码即可上车与入场。', icon: 'shield' },
    ],
    image: bazaarImg,
  },
  {
    id: 'pb-schedule',
    eyebrow: 'AGENDA',
    title: '核心议程日程',
    titleEn: 'Core Agenda',
    summary:
      '三天议程围绕「思想 — 创造 — 狂欢」展开。每天上午是论坛与路演，下午是深度分会场与工作坊，晚上留给创客交流。',
    bullets: [
      { title: '11.14 开幕日', desc: '主旨演讲、双赛道快闪、创客酒会', icon: 'spark' },
      { title: '11.15 决赛日', desc: '产业与自由赛道决赛、硬件市集全天开放', icon: 'trophy' },
      { title: '11.16 收官日', desc: '开发者工作坊、颁奖典礼、After Party', icon: 'people' },
      { title: '全天候直播', desc: '主会场与决赛场同步直播，弹幕互动。', icon: 'globe' },
    ],
    image: makersImg,
  },
  {
    id: 'pb-social',
    eyebrow: 'AFTER PARTY',
    title: 'After Party 狂欢与社交',
    titleEn: 'After Party',
    summary:
      '闭幕夜不散场。电子音乐、生成式光影、全场数字名片交换，让最后一次相遇发生在舞池里。',
    bullets: [
      { title: '生成式光影', desc: '现场实时生成，投射在园区立面上。', icon: 'spark' },
      { title: '数字名片墙', desc: '扫码即可交换联系方式与项目资料。', icon: 'people' },
      { title: '自由麦', desc: '任何人都可以上台讲一个还没做完的想法。', icon: 'bolt' },
      { title: '全程开放', desc: '凭任意一张 DOAI 通行证即可入场。', icon: 'shield' },
    ],
    image: partyImg,
  },
];

export const dayMeta: Record<ScheduleItem['day'], { label: string; date: string; title: string; accent: string }> = {
  day1: { label: 'Day 1', date: '11.14', title: '开幕日 · 思想与开幕', accent: '#165DFF' },
  day2: { label: 'Day 2', date: '11.15', title: '决赛日 · 创造与对决', accent: '#00B487' },
  day3: { label: 'Day 3', date: '11.16', title: '收官日 · 狂欢与告别', accent: '#FF8A1F' },
};

export const typeMeta: Record<ScheduleItem['type'], { label: string; color: string }> = {
  keynote: { label: '主旨', color: '#165DFF' },
  symposium: { label: '分论坛', color: '#2E7BF6' },
  roadshow: { label: '路演', color: '#00B487' },
  workshop: { label: '工作坊', color: '#FF8A1F' },
  social: { label: '社交', color: '#722ED1' },
  break: { label: '休息', color: '#98A6BE' },
};

/* ==========================================================================
   Module pages — one dedicated detail page per navbar sub-item.
   ========================================================================== */

export interface ModuleSection {
  heading: string;
  body: string;
  items?: { title: string; desc: string }[];
}

export interface ModulePage {
  id: string;
  parent: 'conference' | 'maker' | 'square';
  eyebrow: string;
  title: string;
  subtitle: string;
  heroImage: string;
  stats: { label: string; value: string }[];
  sections: ModuleSection[];
  cta?: { label: string; route: string };
}

export const modulePages: ModulePage[] = [
  /* ---------------- 大会介绍 · 大会愿景与使命 ---------------- */
  {
    id: 'vision',
    parent: 'conference',
    eyebrow: 'MISSION & VISION',
    title: '大会愿景与使命',
    subtitle:
      '2026 Dobe 外滩 AI 创客大会（DOAI）由德必集团与 Flowmind 主办、原子公社联合主办，黄浦区政府相关单位指导，定位为「全球 AI 创客的线下连接器 + 线上平台」——把「三天赛程」沉淀为「黄浦 = 全球 AI 创客目的地」的长期 IP。',
    heroImage: heroImg,
    stats: [
      { label: '线下人流', value: '2000—4000' },
      { label: '线上辐射', value: '10万+' },
      { label: '分会场', value: '18 个' },
      { label: '演讲嘉宾', value: '80—120 位' },
    ],
    sections: [
      {
        heading: '大会定位',
        body: '以赛事为核心引擎，以官网为线上入口：一端连接全球 AI 公司与开发者（赛事、论坛、招聘、展示），一端连接公众与消费者（体验、市集、游园）。',
        items: [
          { title: '线下连接器', desc: '德必园区与外滩德必园区双会场，步行 8—10 分钟可达。' },
          { title: '线上平台', desc: '报名、组队、初筛、论坛发起全部在官网完成。' },
          { title: '产业落地', desc: '命题企业真实业务需求 + 获奖项目现场签约。' },
          { title: '公众体验', desc: '市集、游园、AI 互动让普通人也能逛、能玩、能学。' },
        ],
      },
      {
        heading: '主题口号',
        body: '「AI 造物，人人创客」——让 AI 从屏幕走进现实，人人可逛、可玩、可学、可赛、可合作。',
      },
      {
        heading: '主办与支持',
        body: '大会由产业园区与创客社区共同发起，通过政府与产业资源形成合力。',
        items: [
          { title: '主办单位', desc: '原子公社 AtomHub、德必集团。' },
          { title: '联合主办', desc: '原子公社 AtomHub。' },
          { title: '支持单位', desc: '黄浦区人民政府。' },
        ],
      },
    ],
    cta: { label: '立即报名参赛', route: 'register' },
  },

  /* ---------------- 大会介绍 · 双会场空间规划 ---------------- */
  {
    id: 'venue',
    parent: 'conference',
    eyebrow: 'TWO VENUES',
    title: '双会场空间规划',
    subtitle:
      '外滩德必园区承担开幕与社交，外滩德必园区承担路演、游园与市集。两场地相距约 500m，步行 8—10 分钟可达，11/14—11/15 连续两天。',
    heroImage: bazaarImg,
    stats: [
      { label: '外滩德必园区', value: '开幕 · 社交' },
      { label: '外滩德必园区', value: '路演 · 游园' },
      { label: '场地间距', value: '约 500m' },
      { label: '步行时间', value: '8—10 分钟' },
    ],
    sections: [
      {
        heading: '外滩德必园区 · 开幕与社交主场',
        body: '三天赛程均在外滩德必园区进行：Day 1 开幕与破冰，Day 2 封闭开发，Day 3 游园会与决赛路演。',
        items: [
          { title: '11/14 下午—晚间', desc: '开幕式论坛（领导致辞、主办方分享、圆桌、赛制发布 / 高校签约）、自由社交、After Party。' },
          { title: '11/15 白天', desc: 'AI 创客游园会、决赛路演与颁奖典礼、现场直播。' },
        ],
      },
      {
        heading: '外滩德必园区 · 路演 · 游园 · 市集主场',
        body: '地址位于外滩德必园区（现场设指引），是第二天人流最密集的场地。',
        items: [
          { title: '1F 迎宾与市集', desc: '黄浦市集、AI 互动大厅、樊登书店求职区、大中小展商展位。' },
          { title: '1F 路演厅', desc: '决赛路演主会场，8+5 分钟制，全程直播。' },
          { title: '2F 航天馆', desc: '「逐梦星河」商业航天论坛全天进行。' },
          { title: '3F 游园会与分论坛', desc: '选手作品布展，同层并行 7—8 场分论坛。' },
        ],
      },
      {
        heading: '双会场动线',
        body: '两场地相距约 500m，步行 8—10 分钟可达，现场安排接驳与引导。',
      },
    ],
  },

  /* ---------------- 赛事中心 · 产业赛道 ---------------- */
  {
    id: 'industry',
    parent: 'maker',
    eyebrow: 'TRACK · AI + INDUSTRY',
    title: '产业赛道',
    subtitle:
      '面向黄浦区龙头产业企业真实命题解题的团队。联合黄浦区龙头产业企业发布真实业务命题，定向解题；获奖项目优先对接企业采购订单与落地孵化。',
    heroImage: hallImg,
    stats: [
      { label: '面向对象', value: '龙头企业解题团队' },
      { label: '路演赛制', value: '8+5 分钟' },
      { label: '路演地点', value: '外滩德必园区 1F' },
      { label: '落地对接', value: '采购订单优先' },
    ],
    sections: [
      {
        heading: '命题方向',
        body: '产业赛道不设泛命题，而是围绕黄浦区本地龙头企业的真实业务需求定向解题。',
        items: [
          { title: 'AI + 消费', desc: '电商、IP 类情绪消费、新消费。' },
          { title: 'AI + 专业服务', desc: '出海、法务、财税。' },
        ],
      },
      {
        heading: '参赛与解题',
        body: '命题将于 10 月中旬正式发布，团队可在官网领取命题卡并针对性组队。',
        items: [
          { title: '10 月中旬', desc: '命题发布，官网同步上线命题专区。' },
          { title: '定向解题', desc: '按企业真实需求设计 Demo 与落地方案。' },
          { title: '11/15 现场', desc: '外滩德必园区 · 路演厅，8 分钟路演 + 5 分钟答辩。' },
        ],
      },
      {
        heading: '落地机制',
        body: '获奖项目将优先对接企业采购订单与落地孵化，并在闭幕式现场推动签约。',
      },
    ],
    cta: { label: '申报产业赛道', route: 'register' },
  },

  /* ---------------- 赛事中心 · 自由赛道 ---------------- */
  {
    id: 'creator',
    parent: 'maker',
    eyebrow: 'TRACK · AI CREATOR',
    title: '自由赛道',
    subtitle:
      '面向全球 AI 创业者、开发者与硬件工程师。不限产业方向，鼓励底层算法突破与商业模式创新；路演 + 评选 + 投资对接一站式完成。',
    heroImage: partyImg,
    stats: [
      { label: '面向对象', value: '全球创客' },
      { label: '路演赛制', value: '8+5 分钟' },
      { label: '路演地点', value: '德必园区分会场' },
      { label: '评审方式', value: '现场 + 海外连线' },
    ],
    sections: [
      {
        heading: '命题方向',
        body: '不限产业方向，只要技术过硬或模式有新意，都可以报名。',
        items: [
          { title: 'Agent 应用', desc: '多智能体协作、对话式应用、垂直 Agent。' },
          { title: 'AI Infra', desc: '模型训练、推理部署、算力调度。' },
          { title: '智能硬件', desc: '具身智能、可穿戴、边缘设备。' },
        ],
      },
      {
        heading: '评审与投资对接',
        body: '自由赛道在德必园区分会场路演，海外专家通过线上评审室远程参与评审。',
        items: [
          { title: '现场答辩', desc: '8 分钟路演 + 5 分钟答辩。' },
          { title: '海外连线', desc: '海外专家经德必园区线上评审室远程接入。' },
          { title: '投资对接', desc: '资深投资人在评审团中，路演后直接对接。' },
        ],
      },
    ],
    cta: { label: '申报自由赛道', route: 'register' },
  },

  /* ---------------- 创客社区 · 交换数字名片 ---------------- */
  {
    id: 'cards',
    parent: 'square',
    eyebrow: 'DIGITAL BUSINESS CARDS',
    title: '交换数字名片',
    subtitle:
      '赛事组队需打通原子公社的名片模块。创客在社区交换数字名片，形成可检索的战队档案，让组队撮合有据可依。',
    heroImage: makersImg,
    stats: [
      { label: '名片来源', value: '原子公社' },
      { label: '适用场景', value: '组队 · 求职' },
      { label: '档案沉淀', value: '战队档案' },
      { label: '隐私原则', value: '双方同意' },
    ],
    sections: [
      {
        heading: '为什么需要名片',
        body: '组队是本届赛事的核心环节之一。数字名片把「谁是创客、会什么、想做什么」结构化，让匹配更高效。',
        items: [
          { title: '赛事组队', desc: '发布项目简介与技能标签，开发者匹配组队。' },
          { title: '人才市场', desc: 'AI 公司现场招聘展位与求职者双向撮合。' },
          { title: '战队档案', desc: '组队成功后自动形成战队档案，随项目进入评审。' },
        ],
      },
      {
        heading: '交换流程',
        body: '名片仅在双方同意后互相可见，联系方式不会公开展示。',
        items: [
          { title: '1. 发起交换', desc: '在人才市场或组队广场向对方发起。' },
          { title: '2. 对方确认', desc: '双方同意后名片互相存入。' },
          { title: '3. 沉淀档案', desc: '组队成功后进入战队档案。' },
        ],
      },
    ],
  },
];
