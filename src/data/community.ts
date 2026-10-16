/**
 * Data for three modules modelled on the GOAI reference site:
 *   1. 主席团 / 专家评委 / 生态伙伴   (homepage)
 *   2. 赛题与赛制                    (赛事中心)
 *   3. 活动动态                      (大会介绍)
 *
 * IMPORTANT — these are PLACEHOLDER entries written to demonstrate the module
 * design and business logic. The official plan lists 出席领导名单 as 待确认,
 * so no real person or company is asserted here. Replace with the confirmed
 * roster before publishing.
 */

export type PersonRole = 'presidium' | 'judge' | 'expert';

export interface Person {
  id: string;
  name: string;
  nameEn?: string;
  title: string;
  org: string;
  role: PersonRole;
  track?: string;      // judges/experts: which track they cover
  avatar: string;
  featured?: boolean;  // presidium members get the large card
}

export interface Partner {
  id: string;
  name: string;
  category: '主办' | '联合主办' | '支持' | '生态伙伴' | '承办方' | '海外分会场';
  desc: string;
}

/* ------------------------------------------------------------------ 人物 */

/** Placeholder portraits — neutral silhouettes until real headshots arrive. */
// Placeholder portraits: no external calls. The UI renders a monogram from
// `name` until real headshots arrive.
const avatar = (_seed: string) => '';

export const presidium: Person[] = [
  { id: 'p-1', name: '沈砚清', nameEn: 'Shen Yanqing', title: '大会主席', org: '原子公社 AtomHub', role: 'presidium', avatar: avatar('doai-chair-1'), featured: true },
  { id: 'p-2', name: '唐蔚然', nameEn: 'Tang Weiran', title: '大会联席主席', org: '德必集团', role: 'presidium', avatar: avatar('doai-chair-2'), featured: true },
  { id: 'p-3', name: '顾行舟', nameEn: 'Gu Xingzhou', title: '赛事总评审', org: '评审委员会', role: 'presidium', avatar: avatar('doai-chair-3'), featured: true },
  { id: 'p-4', name: '陆嘉铭', nameEn: 'Lu Jiaming', title: '产业顾问', org: '长宁区数字经济企业联合会', role: 'presidium', avatar: avatar('doai-chair-4') },
  { id: 'p-5', name: '宋雨桐', nameEn: 'Song Yutong', title: '学术顾问', org: '华东智能计算联合实验室', role: 'presidium', avatar: avatar('doai-chair-5') },
  { id: 'p-6', name: '林恩佑', nameEn: 'Lin Enyou', title: '海外学术顾问', org: 'APAC OPC · 中国香港', role: 'presidium', avatar: avatar('doai-chair-6') },
];

/**
 * 评审团构成 per the plan: 政府产业代表 2—3、产业企业代表 4、
 * 资深投资人 3—4、技术专家（含海外）2—3、主办方代表 2，合计 12—15 名。
 * Slots are generated per group so the page always shows the right totals.
 */
const judgeSeed: { title: string; org: string; track: string; n: number; names: string[] }[] = [
  { title: '政府产业代表', org: '长宁区产业主管部门', track: 'both', n: 3,
    names: ['何以群', '郑楚君', '万年青'] },
  { title: '产业企业代表', org: '长宁区龙头企业', track: 'industry', n: 4,
    names: ['秦沛杉', '华国维', '闵之桐', '池晓东'] },
  { title: '资深投资人', org: '投资机构 / 产业基金', track: 'both', n: 3,
    names: ['范立群', '贺兰亭', '裴之远'] },
  { title: '技术专家', org: '高校 / 科研院所 / 海外专家', track: 'creator', n: 3,
    names: ['钟砚秋', '史笛文 (Steven)', '欧凯琳 (Elena K.)'] },
  { title: '主办方代表', org: '原子公社 · 德必集团', track: 'both', n: 2,
    names: ['沈砚清', '唐蔚然'] },
];

export const judges: Person[] = judgeSeed.flatMap((g, gi) =>
  Array.from({ length: g.n }, (_, i) => ({
    id: `j-${gi}-${i}`,
    name: g.names[i] ?? '待公布',
    title: g.title,
    org: g.org,
    role: 'judge' as const,
    track: g.track,
    avatar: avatar(`doai-judge-${gi}-${i}`),
  }))
);

export const judgeGroups = judgeSeed.map((g) => ({ title: g.title, org: g.org, count: g.n }));

/* ------------------------------------------------------------------ 伙伴 */

export const partners: Partner[] = [
  { id: 'pt-1', name: '原子公社 AtomHub', category: '主办', desc: '创客社区与赛事发起方，组队广场与数字名片模块提供方。' },
  { id: 'pt-2', name: '德必集团', category: '主办', desc: '德必大虹桥园区运营方，提供开幕与社交主场。' },
  { id: 'pt-3', name: '上海市时代青年科创中心', category: '联合主办', desc: '青年科创力量联合发起。' },
  { id: 'pt-4', name: '长宁区人民政府', category: '支持', desc: '政策支持与区域产业资源协同。' },
  { id: 'pt-5', name: '乐动虹桥', category: '生态伙伴', desc: '路演、游园与市集主场运营方。' },
  { id: 'pt-6', name: '樊登书店', category: '生态伙伴', desc: '1F 人才引力场与求职功能区合作方。' },
  { id: 'pt-7', name: '原子之心', category: '生态伙伴', desc: '线上社区与内容运营。' },
  { id: 'pt-8', name: '商业航天馆', category: '生态伙伴', desc: '2F「逐梦星河」商业航天论坛场地。' },
  { id: 'pt-9', name: '中国香港 · APAC OPC', category: '海外分会场', desc: '亚太 OPC 流量入口。' },
  { id: 'pt-10', name: '意大利佛罗伦萨', category: '海外分会场', desc: '欧洲设计力量联动。' },
  { id: 'pt-11', name: '美国硅谷', category: '海外分会场', desc: '全球技术高地联动。' },
];

export const partnerCategories = ['主办', '联合主办', '支持', '生态伙伴', '海外分会场'] as const;

/* ------------------------------------------------------- 赛题与赛制 */

/** 赛题 — 产业赛道按方案为「龙头企业真实业务命题」，发布日 10 月中旬。 */
export interface ContestBrief {
  id: string;
  code: string;
  track: 'industry' | 'creator';
  title: string;
  sponsor: string;      // 命题发布方
  status: 'open' | 'upcoming' | 'closed';
  publishDate: string;
  summary: string;
  background: string;
  deliverables: string[];
  criteria: { name: string; weight: string; desc: string }[];
  resources: string[];
  deadline: string;
}

export const contestBriefs: ContestBrief[] = [
  /* ------------------------- 产业赛道（示例命题） ------------------------- */
  {
    id: 'b-ind-1',
    code: 'IND-CONSUMER-01',
    track: 'industry',
    title: 'AI 驱动的情绪消费与 IP 运营',
    sponsor: '长宁区龙头企业（拟）',
    status: 'upcoming',
    publishDate: '2026-10-15',
    summary: '面向新消费与 IP 情绪价值场景，用 AI 打通内容生产、用户洞察与转化链路。',
    background:
      '新消费品牌在 IP 运营中普遍面临内容生产成本高、用户洞察滞后、转化链路割裂三个问题。本赛题希望团队用可运行的 Demo 证明：同样的内容投入下，AI 能把「洞察—生成—分发—转化」串成闭环，并给出可衡量的指标提升。',
    deliverables: [
      '可运行 Demo 或线上访问地址',
      '3 分钟 Demo 视频（公开直链）',
      '项目说明文档（含架构与数据来源）',
      '指标提升的测算方式与基线数据',
    ],
    criteria: [
      { name: '真实场景价值', weight: '35%', desc: '是否解决命题方真实业务痛点，指标是否可验证。' },
      { name: '技术创新性', weight: '25%', desc: '技术选型是否合理，有无自研成分。' },
      { name: '工程完成度', weight: '25%', desc: '系统稳定性、边界情况处理、上线准备度。' },
      { name: '团队与落地力', weight: '15%', desc: '分工合理性与落地路径清晰度。' },
    ],
    resources: ['命题方业务数据与场景说明', '一对一产业导师辅导', '落地试点机会对接'],
    deadline: '2026-11-07',
  },
  {
    id: 'b-ind-2',
    code: 'IND-PROF-01',
    track: 'industry',
    title: 'AI 辅助的专业服务流程自动化',
    sponsor: '长宁区专业服务机构（拟）',
    status: 'upcoming',
    publishDate: '2026-10-15',
    summary: '围绕出海、法务、财税等高频文档与审核流程，用 Agent 降低重复人工成本。',
    background:
      '专业服务的核心人力大量消耗在资料检索、初步审核与多语言转写上。本赛题考察团队能否用 Agent 构建可靠的专业服务流水线，并在真实样本上验证准确率与人力节省幅度。',
    deliverables: [
      '可运行 Demo',
      '真实或脱敏样本上的准确率评估',
      '与现有流程的人力对比测算',
      '合规与数据安全说明',
    ],
    criteria: [
      { name: '真实场景价值', weight: '35%', desc: '是否显著降低真实专业服务的重复劳动。' },
      { name: '技术创新性', weight: '25%', desc: 'Agent 编排与可靠性设计。' },
      { name: '工程完成度', weight: '25%', desc: '容错、审计与回滚能力。' },
      { name: '团队与落地力', weight: '15%', desc: '对专业服务场景的理解深度。' },
    ],
    resources: ['脱敏行业样本', '律所 / 财税顾问评审', '合规专家答疑'],
    deadline: '2026-11-07',
  },

  /* ------------------------- 自由赛道（命题方向） ------------------------- */
  {
    id: 'b-cre-1',
    code: 'CRE-AGENT-01',
    track: 'creator',
    title: '多智能体协作与垂直 Agent 应用',
    sponsor: '原子公社 · 开放命题',
    status: 'open',
    publishDate: '2026-09-28',
    summary: '不限产业方向，用多智能体协作解决一个真实工作流问题。',
    background:
      '单 Agent 在复杂任务中容易失控。本赛题考察团队在多智能体分工、上下文共享与失败恢复上的工程能力，要求给出可运行系统而非概念演示。',
    deliverables: ['可运行 Demo', '系统架构图', '任务完成率与失败率评估', '3 分钟演示视频'],
    criteria: [
      { name: '技术创新性', weight: '35%', desc: '是否有未定义的探索或方法创新。' },
      { name: '工程完成度', weight: '30%', desc: 'Demo 是否真的能稳定跑通。' },
      { name: '真实场景价值', weight: '20%', desc: '即便面向未来，方案需自洽。' },
      { name: '团队与表达', weight: '15%', desc: '8 分钟内讲清最打动人的一点。' },
    ],
    resources: ['Token / 算力资源补助', '开源社区导师', '投资机构对接'],
    deadline: '2026-11-07',
  },
  {
    id: 'b-cre-2',
    code: 'CRE-INFRA-01',
    track: 'creator',
    title: '模型训练、推理部署与算力调度',
    sponsor: '原子公社 · 开放命题',
    status: 'open',
    publishDate: '2026-09-28',
    summary: '在成本、吞吐与延迟之间取得更好平衡的底层工程方案。',
    background:
      '模型落地的瓶颈往往不在效果而在成本。本赛题考察团队在推理优化、量化、批处理与调度上的真实工程能力。',
    deliverables: ['可运行代码或服务', '性能与成本基准测试报告', '复现说明', '3 分钟演示视频'],
    criteria: [
      { name: '技术创新性', weight: '35%', desc: '底层方法或工程取舍是否有新意。' },
      { name: '工程完成度', weight: '30%', desc: '基准测试是否完整可复现。' },
      { name: '真实场景价值', weight: '20%', desc: '对真实部署场景的参考价值。' },
      { name: '团队与表达', weight: '15%', desc: '技术表达清晰度。' },
    ],
    resources: ['算力资源支持', '技术专家评审', '落地场景推荐'],
    deadline: '2026-11-07',
  },
  {
    id: 'b-cre-3',
    code: 'CRE-HW-01',
    track: 'creator',
    title: '具身智能、可穿戴与边缘设备',
    sponsor: '原子公社 · 开放命题',
    status: 'open',
    publishDate: '2026-09-28',
    summary: '把 AI 放进物理世界：能跑起来、能摸得着的硬件作品。',
    background:
      '硬件赛道的门槛在于「真的能跑」。本赛题要求实物原型或可交互仿真，重点考察端侧推理、功耗与结构可靠性。',
    deliverables: ['实物原型或可交互仿真', '硬件规格说明', '端侧推理性能数据', '演示视频'],
    criteria: [
      { name: '技术创新性', weight: '35%', desc: '软硬件结合是否有新意。' },
      { name: '工程完成度', weight: '30%', desc: '原型可靠性与完成度。' },
      { name: '真实场景价值', weight: '20%', desc: '是否解决了具体的使用问题。' },
      { name: '团队与表达', weight: '15%', desc: '现场演示效果。' },
    ],
    resources: ['3F 造物车间工位', '硬件厂商器件支持', '创客空间导师'],
    deadline: '2026-11-07',
  },
];

/** 赛制规则——每条都可展开查看细则。 */
export interface ContestRule {
  id: string;
  title: string;
  summary: string;
  items: { q: string; a: string }[];
}

export const contestRules: ContestRule[] = [
  {
    id: 'r-eligibility',
    title: '参赛资格',
    summary: '谁能报名，以及需要准备什么。',
    items: [
      { q: '个人可以报名吗？', a: '可以。自由赛道支持个人或团队报名；产业赛道建议以团队形式承接企业命题。' },
      { q: '团队人数有限制吗？', a: '建议 2—5 人，评审会关注分工清晰度，人数本身不设硬性上限。' },
      { q: '有地区或国籍限制吗？', a: '无。面向全球开发者、创业者、企业、大学生与公众征集。' },
      { q: '往届获奖项目可以再报吗？', a: '项目须为原创且未在其他同级赛事获奖，往届获奖项目需有明确迭代。' },
    ],
  },
  {
    id: 'r-submit',
    title: '作品提交要求',
    summary: '提交什么、怎么提交、什么时候截止。',
    items: [
      { q: '提交截止时间？', a: '2026 年 11 月 3 日 — 11 月 7 日，逾期不予受理。' },
      { q: 'Demo 视频有什么要求？', a: '需为公开可访问的直链（支持 Bilibili、腾讯视频、YouTube），私有密码链接无法通过校验。' },
      { q: '需要提交哪些材料？', a: '项目说明文档、Demo 视频、团队信息与赛道选择；命题类赛题另需提交命题对应方案。' },
      { q: '可以修改已提交的版本吗？', a: '截止时间前可覆盖提交一次，以最后一次提交为准。' },
    ],
  },
  {
    id: 'r-review',
    title: '评审机制',
    summary: '谁评、怎么评、评什么。',
    items: [
      { q: '评审团有多少人？', a: '12—15 名，涵盖政府产业代表、产业企业代表、资深投资人、技术专家（含海外）与主办方代表。' },
      { q: '评审维度是什么？', a: '技术创新性、商业可行性、产业适配度、团队与落地力、需求匹配度五个维度。不同赛道权重不同。' },
      { q: '海外专家如何参与？', a: '经德必园区线上评审室远程接入，自由赛道在德必分会场路演时同步连线。' },
      { q: '结果什么时候公布？', a: '11 月 12 日前公布 20—30 个入围路演项目。' },
    ],
  },
  {
    id: 'r-roadshow',
    title: '决赛路演规则',
    summary: '线下决赛怎么比。',
    items: [
      { q: '路演赛制是什么？', a: '每个团队 8 分钟路演 + 5 分钟答辩，全程直播。' },
      { q: '在哪里路演？', a: '产业赛道在乐动虹桥 1F 路演厅主会场；自由赛道在德必园区分会场。' },
      { q: '入围多少个团队？', a: '20—30 个项目（双赛道合计）。' },
      { q: '现场需要准备什么？', a: '可运行的 Demo 演示环境、8 分钟讲解稿，以及产品文档与团队介绍材料。' },
    ],
  },
  {
    id: 'r-rights',
    title: '知识产权与诚信',
    summary: '作品归属、保密义务与违规处理。',
    items: [
      { q: '作品知识产权归谁？', a: '归参赛团队所有。组委会仅在大会宣传范围内使用作品信息与 Demo 片段。' },
      { q: '查重是怎么做的？', a: '提交后进行机审查重，与已提交项目重复度过高的申请可能被取消资格。' },
      { q: '会收费吗？', a: '全程免费。任何声称可代办入围或收取辅导费用的行为均为诈骗。' },
      { q: '奖金怎么发？', a: '税前金额，组委会依法代扣代缴个人所得税，赛后 30 个工作日内拨付。' },
    ],
  },
];

/* ------------------------------------------------------------ 活动动态 */

export interface NewsItem {
  id: string;
  date: string;
  category: '赛事' | '大会' | '分会场' | '合作' | '公告';
  title: string;
  summary: string;
  body: string[];
  pinned?: boolean;
}

export const news: NewsItem[] = [
  {
    id: 'n-101',
    category: '赛事',
    pinned: false,
    date: '2026-10-13',
    title: '双赛道赛题卡上线：产业 2 题开放申报，自由赛道即日可报',
    summary: '产业赛道两支龙头企业命题正式对外发布，自由赛道开放命题同步开启；报名截止 10/31。',
    body: [
      '产业赛道首批两支命题（AI 驱动的精密质检、AI 辅助专业服务流程自动化）即日起接受申报，由命题企业导师全程陪跑。',
      '自由赛道保持开放命题，鼓励 Agent 应用、AI Infra 与智能硬件方向的极客作品。报名截止 10 月 31 日，作品提交窗口 11 月 3 日—7 日。',
    ],
  },
  {
    id: 'n-102',
    category: '大会',
    pinned: false,
    date: '2026-10-12',
    title: 'After Party 阵容预告：电子音乐 × 生成式光影',
    summary: '创意技术团队与电子音乐人联袂打造闭幕之夜，全场视觉随声浪实时生成。',
    body: [
      '11 月 14 日晚，德必大虹桥园区 2F 空中花园。生成式光影系统将把现场声浪实时转为粒子视觉，DJ 与 AI 同台演出。',
      '凭全程通票或 After Party 席位预约入场，名额 300 人。',
    ],
  },
  {
    id: 'n-103',
    category: '合作',
    pinned: false,
    date: '2026-10-11',
    title: '三支海外评审团确认：硅谷、佛罗伦萨、香港同步连线',
    summary: '海外分会场评审与路演连线方案落定，自由赛道决赛将实现跨时区实时评审。',
    body: [
      '美国硅谷、意大利佛罗伦萨与中国香港三地评审团确认参与。自由赛道决赛路演期间，海外评审将通过德必园区国际研讨室实时连线打分。',
    ],
  },
  {
    id: 'n-1',
    date: '2026-10-04',
    category: '公告',
    title: 'Dobe AI 创客大会（DOAI）官方网站正式上线',
    summary: '报名、组队、论坛预约与项目展示四大能力开放，线上线下正式打通。',
    body: [
      'Dobe AI 创客大会（DOAI）官方网站今日正式上线。',
      '本次上线同步开放赛事报名、在线组队、分论坛预约与项目展示四个核心模块，创客可完整走通「线上报名 → 组队 → 提交 → 评审 → 线下路演」全链路。',
      '线上官网定位为大会的前置与放大器：所有报名、组队、初筛评审与论坛发起均在官网完成，线下仅对筛选后的项目与议程进行路演与落地。',
    ],
    pinned: true,
  },
  {
    id: 'n-2',
    date: '2026-10-01',
    category: '赛事',
    title: '赛事报名通道开启：9/28 — 10/31 接受申报',
    summary: '双赛道同步开放，产业赛道将于 10 月中旬发布龙头企业真实命题。',
    body: [
      'Dobe AI 创客大赛报名通道现已开启，报名截止时间为 10 月 31 日 24:00。',
      '本届赛事设置产业赛道与自由赛道。产业赛道联合长宁区龙头企业发布真实业务命题，面向解题团队定向开放；自由赛道不限产业方向，鼓励底层算法突破与商业模式创新。',
      '完成线上组队后，战队档案将同步沉淀至原子公社名片模块，便于后续对接产业导师。',
    ],
    pinned: true,
  },
  {
    id: 'n-3',
    date: '2026-09-28',
    category: '大会',
    title: '双会场确定：德必大虹桥园区 × 乐动虹桥',
    summary: '11/14 开幕与社交在德必，11/15 路演游园市集在乐动，两场地步行 8—10 分钟。',
    body: [
      '经组委会确认，本届大会采用双会场布局。',
      '11 月 14 日下午至晚间，德必大虹桥园区作为开幕与社交主场，承载开幕式论坛与 After Party；11 月 15 日，乐动虹桥作为路演、游园与市集主场，承载决赛路演主会场、AI 创客游园会、长宁味道市集、AI 互动、求职招聘、展商与分论坛。',
      '两场地相距约 500 米，步行 8—10 分钟可达，现场安排接驳与引导。',
    ],
  },
  {
    id: 'n-4',
    date: '2026-09-26',
    category: '分会场',
    title: '18 个分会场命名揭晓：涌现厅、智能体动物园、逐梦星河…',
    summary: '统一采用「DOAI · 中文意象名（English）—— 主题副题」命名体系。',
    body: [
      '本届大会共规划 18 个分会场，全部采用统一命名格式「DOAI · 中文意象名（English）—— 主题副题」。',
      '名单涵盖人才引力场、创投引力场、设计涌现、新青年实验室、逐梦星河、涌现厅、智能体动物园、造物车间、开源星球、代码之外、未来课堂、内容发电站、出海罗盘、金融炼丹炉、健康急救站、安全结界、她力量与合规灯塔。',
      '分会场由承办方「占场」合作，主题方向与建议承办方类型已在官网公布。',
    ],
  },
  {
    id: 'n-5',
    date: '2026-09-24',
    category: '合作',
    title: '3 个海外线上分会场确定：中国香港、佛罗伦萨、硅谷',
    summary: '海外分会场承担报名招募、初筛联动与路演连线观摩。',
    body: [
      '为呼应「智汇长宁 · 创享全球」的定位，本届大会设立 3 个海外线上分会场。',
      '中国香港作为亚太 OPC 流量入口，意大利佛罗伦萨代表欧洲设计力量，美国硅谷定位全球技术高地。',
      '海外分会场与长宁主会场同频，承担报名招募、线上初筛联动、路演连线观摩与传播扩散。',
    ],
  },
  {
    id: 'n-6',
    date: '2026-09-22',
    category: '赛事',
    title: '评审团构成公布：12—15 名五类代表构成',
    summary: '政府产业代表、产业企业代表、资深投资人、技术专家与主办方代表共同组成。',
    body: [
      '组委会公布本届评审团构成，合计 12—15 名。',
      '具体包括：政府产业代表 2—3 名、产业企业代表 4 名、资深投资人 3—4 名、技术专家（含海外专家）2—3 名、主办方代表 2 名。',
      '核心评审维度为技术创新性、商业可行性、产业适配度、团队与落地力与需求匹配度五个维度。',
    ],
  },
  {
    id: 'n-7',
    date: '2026-09-20',
    category: '公告',
    title: '关于防范以大会名义收取费用的说明',
    summary: '报名、评审、参会全程免费，任何收费行为均为诈骗。',
    body: [
      'Dobe AI 创客大会（DOAI）报名、评审与参会全程免费，不设任何付费通道。',
      '任何以「内部推荐」「保进入围」「辅导加速」等名义收取费用的行为均与组委会无关，请创客朋友提高警惕。',
      '如遇可疑情况，请通过官网公布的官方渠道核实。',
    ],
  },
];

export const newsCategories = ['全部', '赛事', '大会', '分会场', '合作', '公告'] as const;
