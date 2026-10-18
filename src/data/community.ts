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
  category: '指导单位' | '主办方' | '联合主办' | '战略合作方' | '内容平台' | '支持' | '生态伙伴' | '承办方' | '海外分会场';
  desc: string;
}

/* ------------------------------------------------------------------ 人物 */

/** Placeholder portraits — neutral silhouettes until real headshots arrive. */
// Placeholder portraits: no external calls. The UI renders a monogram from
// `name` until real headshots arrive.
const avatar = (_seed: string) => '';

export const presidium: Person[] = [
  { id: 'p-1', name: '待公布', nameEn: 'To be announced', title: '大会主席', org: '原子公社 AtomHub', role: 'presidium', avatar: avatar('doai-chair-1'), featured: true },
  { id: 'p-2', name: '待公布', nameEn: 'To be announced', title: '大会联席主席', org: '德必集团', role: 'presidium', avatar: avatar('doai-chair-2'), featured: true },
  { id: 'p-3', name: '待公布', nameEn: 'To be announced', title: '赛事总评审', org: '评审委员会', role: 'presidium', avatar: avatar('doai-chair-3'), featured: true },
  { id: 'p-4', name: '待公布', nameEn: 'To be announced', title: '产业顾问', org: '黄浦区数字经济企业联合会', role: 'presidium', avatar: avatar('doai-chair-4') },
  { id: 'p-5', name: '待公布', nameEn: 'To be announced', title: '学术顾问', org: '华东智能计算联合实验室', role: 'presidium', avatar: avatar('doai-chair-5') },
  { id: 'p-6', name: '待公布', nameEn: 'To be announced', title: '海外学术顾问', org: '海外学术机构', role: 'presidium', avatar: avatar('doai-chair-6') },
];

/**
 * 评审团构成 per the plan: 政府产业代表 2—3、产业企业代表 4、
 * 资深投资人 3—4、技术专家（含海外）2—3、主办方代表 2，合计 12—15 名。
 * Slots are generated per group so the page always shows the right totals.
 */
const judgeSeed: { title: string; org: string; track: string; n: number; label: string }[] = [
  { title: '政府产业代表', org: '黄浦区产业主管部门', track: 'both', n: 2, label: '2—3 名' },
  { title: '产业企业代表', org: '黄浦区龙头企业', track: 'industry', n: 4, label: '4 名' },
  { title: '资深投资人', org: '投资机构 / 产业基金', track: 'both', n: 3, label: '3—4 名' },
  { title: '技术专家', org: '高校 / 科研院所 / 海外专家', track: 'creator', n: 2, label: '2—3 名' },
  { title: '主办方代表', org: '德必集团 · Flowmind', track: 'both', n: 2, label: '2 名' },
];

export const judges: Person[] = judgeSeed.flatMap((g, gi) =>
  Array.from({ length: g.n }, (_, i) => ({
    id: `j-${gi}-${i}`,
    name: '待公布',
    title: g.title,
    org: g.org,
    role: 'judge' as const,
    track: g.track,
    avatar: avatar(`doai-judge-${gi}-${i}`),
  }))
);

export const judgeGroups = judgeSeed.map((g) => ({ title: g.title, org: g.org, count: g.n, label: g.label }));

/* ------------------------------------------------------------------ 伙伴 */

export const partners: Partner[] = [
  { id: 'pt-gov', name: '黄浦区政府相关单位', category: '指导单位', desc: 'AI 产业专项扶持政策发布与区域产业资源协同。' },
  { id: 'pt-2', name: '德必集团', category: '主办方', desc: '外滩德必园区运营方，OPC 创新服务体系与 AI 产业加速计划发起方。' },
  { id: 'pt-fm', name: 'Flowmind', category: '主办方', desc: 'AI 产业大会联合发起方。' },
  { id: 'pt-1', name: '原子公社 AtomHub', category: '联合主办', desc: '创客社区与赛事发起方，组队广场与数字名片模块提供方。' },
  { id: 'pt-st', name: '香港高升', category: '战略合作方', desc: '战略合作签约伙伴。' },
  { id: 'pt-gc', name: 'Google Cloud', category: '战略合作方', desc: '云服务与算力战略合作伙伴。' },
  { id: 'pt-ty', name: '涂鸦智能', category: '战略合作方', desc: 'AI+IoT 战略合作伙伴。' },
  { id: 'pt-bb', name: '拓竹科技', category: '战略合作方', desc: '桌面 3D 打印与具身硬件战略合作伙伴。' },
  { id: 'pt-xhs', name: '小红书科技', category: '内容平台', desc: '社交平台话题运营与内容传播合作方。' },
];

export const partnerCategories = ['指导单位', '主办方', '联合主办', '战略合作方', '内容平台'] as const;

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
  {
    id: 'b-prop-1',
    code: 'IND-PROP-01',
    track: 'industry',
    title: '金融科技命题',
    sponsor: '命题企业待官宣',
    status: 'upcoming',
    publishDate: '2026-11-13',
    deadline: '2026-11-14',
    summary: '面向金融科技真实业务场景的定向命题，获奖团队优先获得企业 POC 合作与采购订单。',
    background: '联合黄浦区金融产业企业发布真实业务需求，参赛团队定向解题。命题详情与企业信息将于开幕盛典公布。',
    deliverables: ['可运行 Demo 或线上访问地址', '3 分钟 Demo 视频（公开直链）', '项目说明文档（含架构与数据来源）'],
    criteria: [{ name: '需求匹配度', weight: '待公布', desc: '与命题需求的匹配程度综合评定' }],
    resources: ['企业导师驻场辅导', '命题数据与接口支持（以企业公布为准）'],
  },
  {
    id: 'b-prop-2',
    code: 'IND-PROP-02',
    track: 'industry',
    title: '商贸零售命题',
    sponsor: '命题企业待官宣',
    status: 'upcoming',
    publishDate: '2026-11-13',
    deadline: '2026-11-14',
    summary: '面向商贸零售场景的 AI 命题，深度贴合黄浦商贸产业基础。',
    background: '命题详情与企业信息将于开幕盛典公布。',
    deliverables: ['可运行 Demo 或线上访问地址', '3 分钟 Demo 视频（公开直链）', '项目说明文档'],
    criteria: [{ name: '需求匹配度', weight: '待公布', desc: '与命题需求的匹配程度综合评定' }],
    resources: ['企业导师驻场辅导', '命题数据与接口支持（以企业公布为准）'],
  },
  {
    id: 'b-prop-3',
    code: 'IND-PROP-03',
    track: 'industry',
    title: '文旅服务命题',
    sponsor: '命题企业待官宣',
    status: 'upcoming',
    publishDate: '2026-11-13',
    deadline: '2026-11-14',
    summary: '适配外滩商圈与文旅景区真实落地场景的 AI 命题。',
    background: '命题详情与企业信息将于开幕盛典公布。',
    deliverables: ['可运行 Demo 或线上访问地址', '3 分钟 Demo 视频（公开直链）', '项目说明文档'],
    criteria: [{ name: '需求匹配度', weight: '待公布', desc: '与命题需求的匹配程度综合评定' }],
    resources: ['企业导师驻场辅导', '命题数据与接口支持（以企业公布为准）'],
  },
  {
    id: 'b-prop-4',
    code: 'IND-PROP-04',
    track: 'industry',
    title: 'AIGC 宣传视频命题',
    sponsor: '命题企业待官宣',
    status: 'upcoming',
    publishDate: '2026-11-13',
    deadline: '2026-11-14',
    summary: '基于企业场景和素材定制 AIGC 宣传视频。',
    background: '命题详情与企业信息将于开幕盛典公布。',
    deliverables: ['AIGC 宣传视频成片', '制作说明文档（工作流与工具链）'],
    criteria: [{ name: '创意呈现', weight: '待公布', desc: '视频创意与技术实现综合评定' }],
    resources: ['企业素材与场景支持（以企业公布为准）'],
  },
  {
    id: 'b-cre-open',
    code: 'CRE-OPEN-01',
    track: 'creator',
    title: '自由创意赛道 · 开放命题',
    sponsor: '不设命题方（开放申报）',
    status: 'open',
    publishDate: '2026-09-28',
    deadline: '2026-11-14',
    summary: '不限业务场景，鼓励底层技术突破与商业模式创新；AI+软件与 AI+硬件两大子赛道独立评奖。',
    background: 'AI+软件赛道：行业大模型解决方案、AI SaaS 工具、智能决策系统、AIGC 内容生产工具、AI 企业服务、金融科技算法、智慧城市软件平台等方向。AI+硬件赛道：AI 智能终端、嵌入式 AI 设备、服务机器人、可穿戴 AI 设备、AIoT 感知设备、商业场景智能硬件、文旅数字硬件等方向。',
    deliverables: ['可运行 Demo 或线上访问地址', '3 分钟 Demo 视频（公开直链）', '项目说明文档（含架构与数据来源）'],
    criteria: [{ name: '技术创新性', weight: '待公布', desc: '底层技术突破与商业模式创新' }],
    resources: ['德必园区落地权益 · 算力与工具支持（以组委会公布为准）'],
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
      { q: '在哪里路演？', a: '产业赛道在外滩德必园区 · 主会场。' },
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
      '11 月 14 日晚，外滩德必园区 2F 空中花园。生成式光影系统将把现场声浪实时转为粒子视觉，DJ 与 AI 同台演出。',
      '凭全程通票或 After Party 席位预约入场，名额 300 人。',
    ],
  },
  {
    id: 'n-103',
    category: '合作',
    pinned: false,
    date: '2026-10-11',
    title: '战略合作方确认：香港高升、Google Cloud、涂鸦智能、拓竹科技',
    summary: '海外分会场评审与路演连线方案落定，自由赛道决赛将实现跨时区实时评审。',
    body: [
      '香港高升、Google Cloud、涂鸦智能、拓竹科技四家战略合作方确认参与；赛事评审团构成（12—15 名，五类代表）将于开幕盛典正式公布。',
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
      '本届赛事设置产业赛道与自由赛道。产业赛道联合黄浦区龙头产业企业发布真实业务命题，面向解题团队定向开放；自由赛道不限产业方向，鼓励底层算法突破与商业模式创新。',
      '完成线上组队后，战队档案将同步沉淀至原子公社名片模块，便于后续对接产业导师。',
    ],
    pinned: true,
  },
  {
    id: 'n-3',
    date: '2026-09-28',
    category: '大会',
    title: '双会场确定：外滩德必园区',
    summary: '11/14 开幕与社交在德必，11/15 路演游园市集在乐动，两场地步行 8—10 分钟。',
    body: [
      '经组委会确认，本届大会采用双会场布局。',
      '11 月 14 日下午至晚间，外滩德必园区作为三天赛事唯一主场：开幕盛典与 After Party（Day 1）、封闭开发与作品提交（Day 2）、决赛路演、AI 创客游园会与市集（Day 3）。',
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
    title: '战略合作方确认：香港高升、Google Cloud、涂鸦智能、拓竹科技',
    summary: '海外分会场承担报名招募、初筛联动与路演连线观摩。',
    body: [
      '为呼应「智汇外滩 · 创享黄浦」的定位，本届大会设立 3 个海外线上分会场。',
      '四家战略合作方确认参与：香港高升、Google Cloud、涂鸦智能、拓竹科技；战略合作签约仪式将于 Day 1 开幕盛典举行。',
      '海外分会场与黄浦主会场同频，承担报名招募、线上初筛联动、路演连线观摩与传播扩散。',
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
