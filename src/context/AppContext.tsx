import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../lib/api';
import {
  Language,
  User,
  DigitalTicket,
  Registration,
  RecruitmentPost,
  TalentProfile,
  ForumSession,
  NotificationItem,
  CMSData,
  ExchangeCard,
  TrackType
} from '../types';
import { translations } from '../utils/i18n';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['zh'];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeRoute: string;
  setActiveRoute: (route: string) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
  policyModalOpen: boolean;
  setPolicyModalOpen: (open: boolean) => void;
  policyType: 'terms' | 'privacy' | 'rules';
  openPolicy: (type: 'terms' | 'privacy' | 'rules') => void;
  registrations: Registration[];
  setRegistrations: React.Dispatch<React.SetStateAction<Registration[]>>;
  recruitments: RecruitmentPost[];
  setRecruitments: React.Dispatch<React.SetStateAction<RecruitmentPost[]>>;
  talents: TalentProfile[];
  setTalents: React.Dispatch<React.SetStateAction<TalentProfile[]>>;
  forums: ForumSession[];
  setForums: React.Dispatch<React.SetStateAction<ForumSession[]>>;
  tickets: DigitalTicket[];
  setTickets: React.Dispatch<React.SetStateAction<DigitalTicket[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  cmsData: CMSData;
  updateCMSData: (data: Partial<CMSData>) => void;
  exchangedCards: ExchangeCard[];
  addExchangedCard: (card: ExchangeCard) => void;
  unreadCount: number;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  submitRegistration: (data: Omit<Registration, 'id' | 'makerId' | 'status' | 'submittedAt' | 'inviteCode'>) => { id: string; makerId: string };
  updateRegistrationStatus: (id: string, status: Registration['status'], feedback?: string) => void;
  submitWork: (id: string, submission: { videoUrl: string; demoUrl: string; githubUrl: string }) => void;
  toggleLikeRecruit: (id: string) => void;
  toggleLikeTalent: (id: string) => void;
  bookForum: (id: string) => boolean;
  cancelForum: (id: string) => void;
  quickSwitchRole: (role: 'visitor' | 'maker' | 'admin') => void;
  saveProfile: (patch: { name?: string; avatar?: string }) => void;
  tr: (zh: string, en?: string) => string;
  performCheckIn: (ticketId: string) => boolean;
}

// Figures follow the official plan (《Dobe AI 创客大会活动策划方案》):
// 700+ 报名池、20—30 个入围项目、20 万奖金池、12—15 名评审。
const initialCMS: CMSData = {
  stats: {
    makers: 700,
    finalistProjects: 30,
    prizePool: '20万',
    prizePoolEn: '¥200,000',
    judges: 15,
  },
  announcement: 'Dobe AI 创客大会（DOAI）报名 9/28 开启，10/31 截止；11/15 乐动虹桥决赛路演。',
  announcementEn: 'DOAI registration opens 9/28 and closes 10/31; finals on 11/15 at Ledong Hongqiao.',
  streamUrl: 'https://live.doai2026.org/main',
};

const initialUser: User = {
  id: 'user-101',
  phone: '13800138821',
  name: '李晨 Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  city: '深圳 Shenzhen',
  bio: '聚焦自主智能体（Autonomous Agents）协同机制研发，开源爱好者，曾获国际 AI 挑战赛银奖。',
  skills: ['Agent架构', 'PyTorch', 'TypeScript', 'LangChain', '微调优化'],
  role: 'maker',
  atomclubBound: true,
  isPublicInSquare: true,
  allowCardExchange: true,
  notifySettings: {
    system: true,
    review: true,
    team: true,
    forum: true,
    live: true,
  },
};

const initialRegistrations: Registration[] = [
  {
    id: 'reg-001',
    makerId: 'DOAI-2026-M8921',
    type: 'team',
    track: 'creator',
    teamName: 'Synapse Core',
    projectName: 'NeuroFlow 自适应多智能体协作中枢',
    projectSummary: '基于动态拓扑与共识算法的分布式自主智能体协作协议，显著降低复杂多任务下的 LLM 通信损耗与幻觉。',
    videoUrl: 'https://www.bilibili.com/video/BV1xx411c7XN',
    docUrl: 'https://docs.neuroflow.ai/whitepaper-v1',
    inviteCode: 'NF8921',
    status: 'shortlisted',
    reviewFeedback: '创新性与工程完成度兼备，多智能体通信架构清晰，通过初审进入现场路演决赛环节。',
    submittedAt: '2026-09-18 14:32',
    reviewedAt: '2026-09-22 10:15',
    members: [
      { id: 'user-101', name: '李晨 Alex Chen', phone: '138****8821', roleTitle: '项目负责人 / 算法', isLeader: true },
      { id: 'user-102', name: '王嘉敏 (Jasmine)', phone: '139****1920', roleTitle: '全栈架构师', isLeader: false },
      { id: 'user-103', name: '韩立 (Henry)', phone: '137****4412', roleTitle: '产品与商业化', isLeader: false },
    ],
  },
  {
    id: 'reg-002',
    makerId: 'DOAI-2026-M3319',
    type: 'team',
    track: 'industry',
    teamName: 'BioVision Labs',
    projectName: '精密光学与工业微缺陷微米级 AI 检测系统',
    projectSummary: '针对新能源电池与半导体晶圆的高速表面微细缺陷检测算法，毫秒级推理闭环。',
    videoUrl: 'https://v.qq.com/x/cover/mzc00200xyz.html',
    docUrl: 'https://feishu.cn/docx/doxcn9821817263',
    inviteCode: 'BV3319',
    status: 'reviewing',
    submittedAt: '2026-09-29 09:20',
    members: [
      { id: 'user-201', name: '周志恒 Dr. Zhou', phone: '135****3319', roleTitle: '队长 / 机器视觉专家', isLeader: true },
      { id: 'user-202', name: '徐林峰', phone: '136****9981', roleTitle: '硬件嵌入式工程师', isLeader: false },
    ],
  },
  {
    id: 'reg-003',
    makerId: 'DOAI-2026-M4102',
    type: 'individual',
    track: 'industry',
    teamName: 'FinCognition',
    projectName: '多源异构非结构化财报研报智能归因引擎',
    projectSummary: '垂直金融大模型驱动的企业年报因果链推演工具，支持多国会计准则自动校正。',
    videoUrl: 'https://youtube.com/watch?v=demoFinCognition',
    docUrl: 'https://notion.site/fincognition-overview',
    inviteCode: 'FC4102',
    status: 'needs_info',
    reviewFeedback: 'Demo 视频链接由于访问权限设置无法公开校验，请提供无需私密密码的公开链接或直链重新提交。',
    needsInfoDetails: '请更新 Demo 视频链接为公开可访问状态（支持 Bilibili、腾讯视频或 YouTube 公开直链）。',
    submittedAt: '2026-09-25 16:45',
    reviewedAt: '2026-09-28 11:30',
    members: [
      { id: 'user-301', name: '孙博远 (David)', phone: '159****4102', roleTitle: '独立开发者 / 金融工程', isLeader: true },
    ],
  },
  {
    id: 'reg-004',
    makerId: 'DOAI-2026-M1109',
    type: 'individual',
    track: 'creator',
    teamName: 'CyberEcho',
    projectName: '声纹智能合成与环境音景生成硬件',
    projectSummary: '基于低功耗边缘芯片的环境感知与自然交互伴侣。',
    videoUrl: 'https://bilibili.com/video/BV1dummy',
    docUrl: 'https://docs.cyberecho.org',
    inviteCode: 'CE1109',
    status: 'rejected',
    reviewFeedback: '经查重机审检测，与已提交团队项目内容重复度高于 90%，依规则仅保留第一版申请。',
    submittedAt: '2026-09-20 11:10',
    reviewedAt: '2026-09-21 16:00',
    members: [
      { id: 'user-401', name: '李晓明', phone: '131****1109', roleTitle: '开发者', isLeader: true },
    ],
  },
];

const initialRecruitments: RecruitmentPost[] = [
  {
    id: 'rec-1',
    track: 'industry',
    title: '工业级微缺陷 AI 检测系统',
    summary: '面向半导体与精密元器件的高速光学检测，已有高精度测试机台与部分模型，诚邀前端与嵌入式伙伴！',
    neededRoles: ['嵌入式 Linux 工程师', 'Web 端仪表盘全栈', '工业产品设计'],
    skills: ['C++', 'TensorRT', 'Vue / React', '工业总线'],
    stage: 'prototype',
    city: '深圳 Shenzhen',
    isRemote: true,
    leader: {
      id: 'user-201',
      name: '周志恒 Dr. Zhou',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      city: '深圳',
    },
    likes: 42,
    hasLiked: false,
    applicationsCount: 8,
    status: 'open',
    createdAt: '3天前',
  },
  {
    id: 'rec-2',
    track: 'creator',
    title: 'AgentMesh 开源分布式智能体协同协议',
    summary: '构建轻量、免许可的全球智能体协作总线，解决异构大模型间复杂交互标准，已完成核心设计。',
    neededRoles: ['Rust 高性能内核研发', 'AI 安全与对抗研究员', '技术布道师 / 文档'],
    skills: ['Rust', 'Libp2p', 'LLM Agent', 'Distributed Systems'],
    stage: 'demo',
    city: '北京 Beijing',
    isRemote: true,
    leader: {
      id: 'user-101',
      name: '李晨 Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      city: '深圳',
    },
    likes: 89,
    hasLiked: true,
    applicationsCount: 15,
    status: 'open',
    createdAt: '1天前',
  },
  {
    id: 'rec-3',
    track: 'industry',
    title: 'FinCognition 财报因果链推演引擎',
    summary: '让投资人与审计师能够穿透千页财报的因果关联。核心算法初见成效，急寻资深前端实现交互式因果图谱。',
    neededRoles: ['数据可视化专家 (D3/Canvas)', '金融行业分析师'],
    skills: ['D3.js', 'React', 'KG (知识图谱)', '财务分析'],
    stage: 'idea',
    city: '上海 Shanghai',
    isRemote: false,
    leader: {
      id: 'user-301',
      name: '孙博远 (David)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
      city: '上海',
    },
    likes: 31,
    hasLiked: false,
    applicationsCount: 5,
    status: 'open',
    createdAt: '4天前',
  },
  {
    id: 'rec-4',
    track: 'creator',
    title: 'MorphMind 桌面拟人情感陪伴具身小机体',
    summary: '结合微型电机表情机构与端侧轻量小模型，打造有呼吸感、有记忆的实体陪伴桌面创客设备。',
    neededRoles: ['精细机械结构工程师', '3D 结构打印 / 工业造型', '音效情感合成工程师'],
    skills: ['SolidWorks', 'ESP32 / RTOS', '端侧模型量化', '工业美学'],
    stage: 'prototype',
    city: '杭州 Hangzhou',
    isRemote: false,
    leader: {
      id: 'user-501',
      name: '林安娜 Anna Lin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
      city: '杭州',
    },
    likes: 67,
    hasLiked: false,
    applicationsCount: 12,
    status: 'open',
    createdAt: '2天前',
  },
];

const initialTalents: TalentProfile[] = [
  {
    id: 'tal-1',
    name: '王羽涵 Vivian Wang',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    skills: ['Agent 架构', '强化学习 RLHF', 'PyTorch', '长上下文模型'],
    city: '北京 Beijing',
    availableTime: '20 小时/周',
    roleIntent: '算法科学家 / 模型优化',
    bio: '清华大学计算机系在读，主攻大模型规划与具身决策。希望加入有突破性技术审美的极客队伍。',
    likes: 95,
    hasLiked: false,
    atomclubVerified: true,
    isPublic: true,
  },
  {
    id: 'tal-2',
    name: '陈昊 Mark Chen',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    skills: ['WebGL / Three.js', 'React', 'Node.js', '微前端架构'],
    city: '深圳 Shenzhen',
    availableTime: '15 小时/周 (周末全天)',
    roleIntent: '全栈主程 / 可视化架构',
    bio: '8 年全栈与图形学经验，曾主导亿级数据流实时可视化中台，擅长将复杂的 AI 推理链路包装成极简高级的交互产品。',
    likes: 82,
    hasLiked: true,
    atomclubVerified: true,
    isPublic: true,
  },
  {
    id: 'tal-3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    skills: ['ROS 2', 'SLAM', '具身控制', 'C++ / Rust'],
    city: '上海 (支持远程)',
    availableTime: '25 小时/周',
    roleIntent: '硬件与机器人控制',
    bio: 'Robotics Researcher focusing on multimodal tactile feedback. Seeking maker projects bridging digital brains with physical actuation.',
    likes: 64,
    hasLiked: false,
    atomclubVerified: true,
    isPublic: true,
  },
  {
    id: 'tal-4',
    name: '林小雅 Zoe Lin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    skills: ['AI 原生产品设计', '用户体验研究', '增长模型', 'Prompt 工程'],
    city: '杭州 Hangzhou',
    availableTime: '18 小时/周',
    roleIntent: '产品负责人 / 商业策略',
    bio: '前一线科技公司 AI Lab 资深产品经理，深度参与过 2 款百万级 MAU 原生 AI 应用孵化，精通产品逻辑、商业画布与路演表达。',
    likes: 110,
    hasLiked: false,
    atomclubVerified: true,
    isPublic: true,
  },
];

// The 18 sub-venues come straight from the plan's 分会场一览表. Speakers are
// intentionally unnamed: the plan lists 出席领导名单 as 待确认, so the site
// must not invent people.
const planForums: { name: string; nameEn: string; topic: string; host: string; place: string; when: string }[] = [
  { name: 'DOAI 人才引力场', nameEn: 'Talent Hub', topic: 'AI 人才趋势、组织变革、大学生求职', host: '招聘平台 / 人力资源咨询 / 大厂 HR', place: '1F 樊登书店联动区', when: '15 日上午' },
  { name: 'DOAI 创投引力场', nameEn: 'VC Gravity', topic: '融资策略、资本周期、投后陪跑', host: '投资机构 / 产业基金', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 设计涌现', nameEn: 'Design X', topic: 'AI-native 产品设计、交互范式', host: '设计机构 / 院校', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 新青年实验室', nameEn: 'Gen-Z Lab', topic: '大学生创新创业、青年创客扶持', host: '高校 / 青年组织', place: '3F 分论坛区', when: '15 日上午' },
  { name: 'DOAI 逐梦星河', nameEn: 'Orbit', topic: '商业航天、低空经济', host: '航天机构 / 科研院所', place: '2F 航天馆', when: '15 日全天' },
  { name: 'DOAI 涌现厅', nameEn: 'Emergence', topic: '大模型前沿、涌现能力', host: '实验室 / 高校', place: '3F 分论坛区', when: '15 日上午' },
  { name: 'DOAI 智能体动物园', nameEn: 'Agent Zoo', topic: 'Agent 编排、多智能体协作', host: '开源社区 / Agent 团队', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 造物车间', nameEn: 'Maker Lab', topic: '硬件创客、3D 打印、机器人组装', host: '创客空间 / 硬件厂商', place: '3F 游园会', when: '15 日全天' },
  { name: 'DOAI 开源星球', nameEn: 'Open Planet', topic: '开源生态、社区治理', host: '开源基金会 / 社区', place: '3F 分论坛区', when: '15 日上午' },
  { name: 'DOAI 代码之外', nameEn: 'Beyond Code', topic: 'AI 与非技术学科的交叉', host: '跨界机构 / 媒体', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 未来课堂', nameEn: 'Future Class', topic: 'AI 教育、人才培养', host: '教育机构', place: '3F 分论坛区', when: '15 日上午' },
  { name: 'DOAI 内容发电站', nameEn: 'Content Plant', topic: 'AIGC 内容生产、创作者经济', host: '内容平台 / MCN', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 出海罗盘', nameEn: 'Compass', topic: '全球化、出海合规、本地化', host: '出海服务商 / 律所', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 金融炼丹炉', nameEn: 'Fin Alchemy', topic: '金融 AI、风控、量化', host: '金融机构', place: '3F 分论坛区', when: '15 日上午' },
  { name: 'DOAI 健康急救站', nameEn: 'Medi Station', topic: '医疗 AI、生物医药', host: '医院 / 药企', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 安全结界', nameEn: 'Safe Zone', topic: '模型安全、隐私与合规', host: '安全厂商 / 监管', place: '3F 分论坛区', when: '15 日上午' },
  { name: 'DOAI 她力量', nameEn: 'She Power', topic: '女性创客与开发者', host: '女性组织 / 社群', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 合规灯塔', nameEn: 'Compliance', topic: 'AI 法规、伦理与治理', host: '律所 / 合规机构', place: '3F 分论坛区', when: '15 日上午' },
];

const initialForums: ForumSession[] = planForums.map((f, i) => ({
  id: `forum-${i + 1}`,
  title: `${f.name}：${f.topic}`,
  titleEn: `${f.nameEn}: ${f.topic}`,
  track: f.name,
  trackEn: f.nameEn,
  date: '2026-11-15',
  time: f.when.includes('下午') ? '14:00 - 17:00' : f.when.includes('全天') ? '10:00 - 17:00' : '10:00 - 12:00',
  venue: f.place,
  venueEn: f.place,
  capacity: 120,
  bookedCount: 0,
  isBooked: false,
  speakers: [],
  description: `${f.topic}。建议承办方：${f.host}。`,
  descriptionEn: `${f.topic}. Suggested host: ${f.host}.`,
  status: 'upcoming' as const,
}));

const initialTickets: DigitalTicket[] = [
  {
    id: 'tkt-001',
    title: 'DOAI 2026 赛事选手入场通行凭证',
    titleEn: 'DOAI 2026 Contestant Access Pass',
    type: 'maker',
    holderName: '李晨 Alex Chen',
    holderPhone: '138****8821',
    qrCode: 'DOAI-PASS-MAKER-8921-VERIFIED',
    status: 'claimed',
    sessionTime: '2026-11-15 ~ 11-17 全程通行',
    venue: '全场通行权限（选手区 / 路演区 / 公共展区）',
    issuedAt: '2026-09-18 14:32',
  },
  {
    id: 'tkt-002',
    title: '主论坛「AI Horizon 2026」专属预约席位',
    titleEn: 'Keynote Seat Reservation - AI Horizon',
    type: 'forum',
    holderName: '李晨 Alex Chen',
    holderPhone: '138****8821',
    qrCode: 'DOAI-PASS-FORUM-A01-RESERVED',
    status: 'claimed',
    sessionTime: '2026-11-15 09:30 - 12:00',
    venue: '大会主报告厅 · Hall A (名额制席位)',
    issuedAt: '2026-09-20 10:15',
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'review',
    title: '恭喜！参赛项目已通过初审并入围现场路演',
    titleEn: 'Congratulations! Project Shortlisted for Live Finals',
    content: '您的团队项目《NeuroFlow 自适应多智能体协作中枢》已通过技术与商业机审、专家人工审核，顺利入围 DOAI 2026 决赛！组委会工作人员将在 3 个工作日内对接现场布展物料。',
    contentEn: 'Your project "NeuroFlow" has passed review and entered the DOAI 2026 Finalist shortlist!',
    time: '2小时前',
    read: false,
    link: 'dashboard',
  },
  {
    id: 'notif-2',
    type: 'team',
    title: '组队广场收到新的申请消息',
    titleEn: 'New Team Application on Team Square',
    content: '创客 Vivian Wang (清华大学算法在读) 向您的招募《AgentMesh 开源分布式智能体协同协议》提交了加入申请。',
    contentEn: 'Vivian Wang submitted an application to join your recruitment post.',
    time: '5小时前',
    read: false,
    link: 'square',
  },
  {
    id: 'notif-3',
    type: 'forum',
    title: '分论坛席位预约成功通知',
    titleEn: 'Forum Seat Confirmed',
    content: '您已成功预约《AI Horizon 2026: 智能连接与全球创造力》席位，电子凭证已自动同步存入您的 DOAI Passport 数字身份卡中。',
    contentEn: 'Your seat for AI Horizon Keynote has been confirmed and synced to your DOAI Passport.',
    time: '1天前',
    read: true,
    link: 'dashboard',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: '【重要公约】关于防范以大会名义收取费用的反诈声明',
    titleEn: 'Official Notice: Contest 100% Free - Anti-Fraud Advisory',
    content: 'DOAI 2026 官方提醒：赛事报名、席位预约、奖项评定均全程免费。任何以“内部推荐、保进入围”等名义收取费用的行为均为诈骗，请创客朋友提高警惕。',
    contentEn: 'DOAI 2026 registration and attendance are strictly 100% free of charge. Please report any fraudulent third parties.',
    time: '2天前',
    read: true,
  },
];

const initialCards: ExchangeCard[] = [
  {
    id: 'card-1',
    name: '原子公社 · 组委会',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    phone: 'hello@atomclub.cn',
    org: '原子公社 AtomHub · DOAI 组委会',
    skills: ['赛事咨询', '组队撮合', '企业命题'],
    city: '上海',
    exchangedAt: '2026-09-24',
  },
  {
    id: 'card-2',
    name: '陈昊 Mark Chen',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    phone: '139****7788',
    org: 'Independent Creative Dev',
    skills: ['Three.js', 'React', 'WebGL'],
    city: '深圳',
    exchangedAt: '2026-09-28',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('doai_lang') as Language) || 'zh';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);

  // 加载后端保存的自定义资料覆盖（改名/换头像持久化）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetch(apiUrl(`/api/profile?userId=${initialUser.id}`))
      .then(r => r.json())
      .then(d => {
        if (d?.ok && d.profile && (d.profile.name || d.profile.avatar)) {
          setCurrentUser(prev =>
            prev ? { ...prev, name: d.profile.name || prev.name, avatar: d.profile.avatar || prev.avatar } : prev,
          );
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- URL 路由同步：/admin、/forum 等直链可直接打开对应页面 ----
  // 部署在子路径（如 /doai/）时，前端路由需要带上该前缀
  const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const KNOWN_ROUTE_BASES = [
    'home', 'conference', 'maker', 'register', 'square', 'forum', 'live',
    'dashboard', 'admin', 'rules', 'news', 'attend', 'track', 'module', 'detail',
  ];
  const routeFromLocation = (): string => {
    if (typeof window === 'undefined') return 'home';
    let p = window.location.pathname.replace(/\/+$/, '') || '/';
    if (BASE_PATH !== '/' && p.startsWith(BASE_PATH)) p = p.slice(BASE_PATH.length) || '/';
    if (p === '/') return 'home';
    const base = p.slice(1).split('/')[0];
    return KNOWN_ROUTE_BASES.includes(base) ? p.slice(1) : 'home';
  };
  const [activeRoute, setActiveRouteState] = useState<string>(routeFromLocation);
  const setActiveRoute = (route: string) => {
    setActiveRouteState(route);
    if (typeof window === 'undefined') return;
    const path = (route === 'home' ? '' : `/${route}`) || '';
    const full = (BASE_PATH === '/' ? '' : BASE_PATH) + (route === 'home' ? '/' : path);
    if (window.location.pathname !== full) {
      window.history.pushState({}, '', full);
    }
  };
  useEffect(() => {
    const onPop = () => setActiveRouteState(routeFromLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'terms' | 'privacy' | 'rules'>('terms');


  // ---- 后端同步（server.js :3001）：best-effort，失败不阻塞前端 ----
  // 子路径部署时 API 也带前缀（Nginx 把 /doai/api/ 转发到后端）
  const apiBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const apiPost = (url: string, body: unknown) => {
    if (typeof window === 'undefined') return;
    fetch(apiBase + url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {
      /* 后端不可用时静默降级为纯前端模式 */
    });
  };

  // 首次挂载：把演示数据同步到后端，管理后台可直接读到同一份报名/凭证
  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetch(apiUrl('/api/registrations'))
      .then(r => r.json())
      .then(d => {
        if (d?.ok && Array.isArray(d.registrations) && d.registrations.length === 0) {
          apiPost('/api/registrations/sync', { registrations: initialRegistrations });
        }
        fetch(apiUrl('/api/tickets'))
          .then(r => r.json())
          .then(dt => {
            if (dt?.ok && Array.isArray(dt.tickets) && dt.tickets.length === 0) {
              initialTickets.forEach(t => apiPost('/api/tickets', t));
            }
          })
          .catch(() => {});
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [recruitments, setRecruitments] = useState<RecruitmentPost[]>(initialRecruitments);
  const [talents, setTalents] = useState<TalentProfile[]>(initialTalents);
  const [forums, setForums] = useState<ForumSession[]>(initialForums);
  const [tickets, setTickets] = useState<DigitalTicket[]>(initialTickets);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [cmsData, setCmsData] = useState<CMSData>(initialCMS);
  const [exchangedCards, setExchangedCards] = useState<ExchangeCard[]>(initialCards);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('doai_lang', newLang);
    document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en';
  };

  const openPolicy = (type: 'terms' | 'privacy' | 'rules') => {
    setPolicyType(type);
    setPolicyModalOpen(true);
  };

  const updateCMSData = (data: Partial<CMSData>) => {
    setCmsData(prev => ({
      ...prev,
      ...data,
      stats: {
        ...prev.stats,
        ...(data.stats || {}),
      },
    }));
  };

  const addExchangedCard = (card: ExchangeCard) => {
    setExchangedCards(prev => [card, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };


  const submitWork = (
    id: string,
    submission: { videoUrl: string; demoUrl: string; githubUrl: string },
  ) => {
    setRegistrations(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              submission: {
                ...submission,
                submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              },
            }
          : r,
      ),
    );
    apiPost(`/api/registrations/${id}/work`, submission);
  };

  const submitRegistration = (data: Omit<Registration, 'id' | 'makerId' | 'status' | 'submittedAt' | 'inviteCode'>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newMakerId = `DOAI-2026-M${randomNum}`;
    const newRegId = `reg-${Date.now()}`;
    const inviteCode = `${data.teamName.slice(0, 2).toUpperCase()}${randomNum.toString().slice(-4)}`;

    const newReg: Registration = {
      ...data,
      id: newRegId,
      makerId: newMakerId,
      status: 'submitted',
      inviteCode,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setRegistrations(prev => [newReg, ...prev]);
    apiPost('/api/registrations', newReg);

    // Automatically issue Contestant Digital Ticket (选手票)
    const newTicket: DigitalTicket = {
      id: `tkt-${Date.now()}`,
      title: 'DOAI 2026 赛事选手入场通行凭证',
      titleEn: 'DOAI 2026 Contestant Access Pass',
      type: 'maker',
      holderName: currentUser?.name || data.members[0]?.name || '选手',
      holderPhone: currentUser?.phone || '138****0000',
      qrCode: `DOAI-PASS-MAKER-${randomNum}-SUBMITTED`,
      status: 'claimed',
      sessionTime: '2026-11-15 ~ 11-17 全程通行',
      venue: '全场通行权限（选手区 / 路演区 / 公共展区）',
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTickets(prev => [newTicket, ...prev]);
    apiPost('/api/tickets', newTicket);

    // Add confirmation notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'review',
      title: '报名提交成功，正在进行智能机审与资质核验',
      titleEn: 'Contest Registration Submitted Successfully',
      content: `您的项目《${data.projectName}》已成功申报，已为您生成 DOAI Maker ID: ${newMakerId}。系统将在 3 个工作日内完成专家审核。`,
      contentEn: `Project "${data.projectName}" has been registered. Maker ID: ${newMakerId}.`,
      time: '刚刚',
      read: false,
      link: 'dashboard',
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { id: newRegId, makerId: newMakerId };
  };

  const updateRegistrationStatus = (id: string, status: Registration['status'], feedback?: string) => {
    setRegistrations(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status,
            reviewFeedback: feedback || r.reviewFeedback,
            reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return r;
      })
    );
    // 管理后台审核动作同步到后端持久化
    apiPost(`/api/admin/registrations/${id}/status`, { status, feedback });
  };

  const toggleLikeRecruit = (id: string) => {
    setRecruitments(prev =>
      prev.map(item => {
        if (item.id === id) {
          const hasLiked = !item.hasLiked;
          return {
            ...item,
            hasLiked,
            likes: hasLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  const toggleLikeTalent = (id: string) => {
    setTalents(prev =>
      prev.map(item => {
        if (item.id === id) {
          const hasLiked = !item.hasLiked;
          return {
            ...item,
            hasLiked,
            likes: hasLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  const bookForum = (id: string): boolean => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return false;
    }

    const session = forums.find(f => f.id === id);
    if (!session || session.bookedCount >= session.capacity) return false;

    setForums(prev =>
      prev.map(f => {
        if (f.id === id) {
          return { ...f, bookedCount: f.bookedCount + 1, isBooked: true };
        }
        return f;
      })
    );

    // Issue Digital Ticket for the session
    const forumTicket: DigitalTicket = {
      id: `tkt-f-${Date.now()}`,
      title: `${session.title} 专属预约席位`,
      titleEn: `${session.titleEn} Reservation Pass`,
      type: 'forum',
      holderName: currentUser.name,
      holderPhone: currentUser.phone,
      qrCode: `DOAI-PASS-FORUM-${id}-RESERVED`,
      status: 'claimed',
      sessionTime: `${session.date} ${session.time}`,
      venue: `${session.venue} (名额制电子凭证)`,
      issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTickets(prev => [forumTicket, ...prev]);
    apiPost('/api/tickets', forumTicket);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'forum',
      title: '分论坛席位预约成功通知',
      titleEn: 'Forum Reservation Confirmed',
      content: `您已成功锁定《${session.title}》的现场名额，如行程有变可在开场前 48 小时取消释放名额。`,
      contentEn: `You have successfully reserved a seat for "${session.titleEn}".`,
      time: '刚刚',
      read: false,
      link: 'dashboard',
    };
    setNotifications(prev => [notif, ...prev]);

    return true;
  };

  const cancelForum = (id: string) => {
    setForums(prev =>
      prev.map(f => {
        if (f.id === id) {
          return { ...f, bookedCount: Math.max(0, f.bookedCount - 1), isBooked: false };
        }
        return f;
      })
    );
    // Remove ticket
    setTickets(prev => prev.filter(t => !t.qrCode.includes(id)));
  };

  const performCheckIn = (ticketId: string): boolean => {
    let success = false;
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId && t.status !== 'checked_in') {
          success = true;
          return {
            ...t,
            status: 'checked_in',
            checkedInAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return t;
      })
    );
    return success;
  };

  const saveProfile = (patch: { name?: string; avatar?: string }) => {
    setCurrentUser(prev => (prev ? { ...prev, ...patch } : prev));
    apiPost('/api/profile', { userId: initialUser.id, ...patch });
  };

  const tr = (zh: string, en?: string) => (lang === 'zh' ? zh : (en ?? zh));

  const quickSwitchRole = (role: 'visitor' | 'maker' | 'admin') => {
    if (role === 'visitor') {
      setCurrentUser(null);
    } else if (role === 'maker') {
      setCurrentUser(initialUser);
    } else if (role === 'admin') {
      setCurrentUser({
        id: 'admin-001',
        phone: '18600009999',
        name: '张敏 Min Zhang (组委会运营)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
        city: '北京 Beijing',
        bio: 'DOAI 2026 组委会执行秘书处 · 赛事运营总监',
        skills: ['赛事评审协调', '嘉宾统筹', '现场中控'],
        role: 'admin',
        atomclubBound: true,
        isPublicInSquare: false,
        allowCardExchange: true,
        notifySettings: { system: true, review: true, team: true, forum: true, live: true },
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang],
        currentUser,
        setCurrentUser,
        activeRoute,
        setActiveRoute,
        loginModalOpen,
        setLoginModalOpen,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        policyModalOpen,
        setPolicyModalOpen,
        policyType,
        openPolicy,
        registrations,
        setRegistrations,
        recruitments,
        setRecruitments,
        talents,
        setTalents,
        forums,
        setForums,
        tickets,
        setTickets,
        notifications,
        setNotifications,
        cmsData,
        updateCMSData,
        exchangedCards,
        addExchangedCard,
        unreadCount,
        markAllNotificationsRead,
        markNotificationRead,
        submitRegistration,
        updateRegistrationStatus,
        submitWork,
        toggleLikeRecruit,
        toggleLikeTalent,
        bookForum,
        cancelForum,
        quickSwitchRole,
        saveProfile,
        tr,
        performCheckIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
