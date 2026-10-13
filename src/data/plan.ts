/**
 * Single source of truth for DOAI 2026 conference facts.
 *
 * Every value here is taken from the official 《Dobe AI 创客大会（DOAI）活动策划方案》
 * (v. 9/28). The site must not invent numbers that contradict this file — if a
 * figure changes in the plan, change it here and the whole site follows.
 */

/* ---------------------------------------------------------------- 基本信息 */
export const event = {
  nameZh: 'Dobe AI 创客大会',
  shortName: 'DOAI',
  fullNameEn: 'Dobe Open AI Makers Conference',
  slogan: '智汇长宁 · 创享全球',
  tagline: 'AI 造物，人人创客',
  taglineDesc: '让 AI 从屏幕走进现实，人人可逛、可玩、可学、可赛、可合作。',
  year: 2026,
  dateLabel: '11.14 — 11.15',
  dateRange: '2026 年 11 月 14 日（周六）—15 日（周日）',
  city: '上海 · 长宁',
  nature: '面向全球开发者、创业者、企业、大学生与公众的复合型 AI 创客大会',
  format: '线上官网 + 线下双会场',
  organizers: ['原子公社 AtomHub', '德必集团'],
  coOrganizers: ['上海市时代青年科创中心'],
  supporters: ['长宁区人民政府'],
  hostLine: '原子公社 × 德必 联合主办 · 长宁区人民政府支持',
} as const;

/* ---------------------------------------------------------------- 场地 */
export const venue = {
  walkingMinutes: '8—10 分钟',
  walkingDistance: '约 500m',
} as const;

export const venues = [
  {
    id: 'debei',
    name: '德必大虹桥园区',
    role: '开幕与社交主场',
    sessions: [
      { when: '11/14 下午—晚间', role: '开幕与社交主场',
        content: '开幕式论坛（领导致辞、主办方分享、圆桌、赛制发布 / 高校签约）、自由社交、After Party' },
      { when: '11/15 白天', role: '路演分会场 + 线上评审',
        content: '部分赛道决赛路演分会场、海外线上评审室（海外专家远程接入）、分会场直播' },
    ],
  },
  {
    id: 'ledong',
    name: '乐动虹桥',
    role: '路演 · 游园 · 市集主场',
    address: '长宁区娄山关路 445 弄',
    sessions: [
      { when: '11/15 全天', role: '路演 · 游园 · 市集主场',
        content: '决赛路演主会场、AI 创客游园会、长宁味道市集、AI 互动、求职招聘、展商、分论坛、航天馆论坛' },
    ],
  },
] as const;

/* ---------------------------------------------------------------- 规模 */
export const scale = [
  { label: '两天总人流', value: '2000—4000', unit: '人次（线下）', note: '线上辐射 10 万人次以上' },
  { label: '参赛规模', value: '700+', unit: '开发者 / 创客池', note: '入围路演 20—30 个项目（双赛道）' },
  { label: '分会场', value: '18', unit: '个', note: '两天合计 30—40 场' },
  { label: '展商 / 展位', value: '31—41', unit: '个', note: '小展位 15—20 免费 · 中展位 12—15 收费 · 大展位 4—6 收费' },
  { label: '长宁味道餐饮摊位', value: '8—12', unit: '家', note: '本地餐饮联动' },
  { label: 'AI 公司招聘展位', value: '8—12', unit: '家', note: '付费广告位 1999 元 / 天' },
  { label: '演讲嘉宾', value: '80—120', unit: '位', note: '含至少 1 位海外专家' },
] as const;

/** Headline figures for the hero and stat strips. */
export const headlineStats = [
  { label: '线下人流', value: '2000—4000', unit: '人次' },
  { label: '线上辐射', value: '10万+', unit: '人次' },
  { label: '分会场', value: '18', unit: '个' },
  { label: '演讲嘉宾', value: '80—120', unit: '位' },
] as const;

/* ---------------------------------------------------------------- 赛事 */
export const contest = {
  tagline: '双赛道并行 · 线上初筛 + 线下路演 · 现场签约落地',
  format: '路演 8 分钟 + 答辩 5 分钟（决赛）',
  finalistCount: '20—30 个项目',
  judges: '12—15 名',
  dimensions: ['技术创新性', '商业可行性', '产业适配度', '团队与落地力', '需求匹配度'],
  judgeComposition: [
    { group: '政府产业代表', count: '2—3 名' },
    { group: '产业企业代表', count: '4 名' },
    { group: '资深投资人', count: '3—4 名' },
    { group: '技术专家（含海外）', count: '2—3 名' },
    { group: '主办方代表', count: '2 名' },
  ],
  awards: [
    {
      name: '赛道等级奖',
      amount: '¥120,000',
      note: '覆盖 20 支优胜团队，按各赛道决赛排名阶梯式发放，重点表彰技术落地、产品创新与商业变现能力。',
    },
    {
      name: '专项荣誉奖',
      amount: '¥50,000',
      note: '跨赛道独立评选，聚焦创新点、社会价值与未来商业潜力，可与等级奖兼得。',
    },
    {
      name: '普惠激励奖',
      amount: '¥30,000',
      note: '面向所有完成答辩的团队发放，致敬坚持与付出。',
    },
  ],
  timeline: [
    { date: '9/28 — 10/31', title: '报名', desc: '通过 DOAI 官网提交团队与项目资料，生成报名凭证。' },
    { date: '10 月中旬', title: '命题发布', desc: '产业赛道联合长宁区龙头企业发布真实业务命题。' },
    { date: '10 月中旬 — 11 月上旬', title: '线上组队', desc: '官网在线组队与招募队员，形成战队档案。' },
    { date: '11/3 — 11/7', title: '作品提交', desc: '提交项目说明、Demo 视频与团队信息。' },
    { date: '11/8 — 11/11', title: '线上初筛', desc: '专家评审团初评，含海外线上评审同步参与。' },
    { date: '11/12 前', title: '公布入围', desc: '公布 20—30 个入围路演项目。' },
    { date: '11/15', title: '线下路演', desc: '乐动虹桥主会场 + 德必园区分会场同步进行。' },
    { date: '11/15 闭幕式', title: '颁奖与落地', desc: '现场颁奖，并推动获奖项目与企业需求现场签约。' },
  ],
} as const;

export const tracks = [
  {
    id: 'industry',
    name: '产业赛道',
    nameEn: 'AI + Industry',
    audience: '面向长宁龙头企业真实命题解题的团队',
    directions: ['AI + 消费（电商、IP 类情绪消费、新消费）', 'AI + 专业服务（出海、法务、财税）'],
    rule: '联合长宁区龙头企业发布真实业务命题，定向解题；获奖项目优先对接企业采购订单与落地孵化。',
  },
  {
    id: 'creator',
    name: '自由赛道',
    nameEn: 'AI Creator',
    audience: '全球 AI 创业者、开发者、硬件工程师',
    directions: ['Agent 应用（多智能体协作、对话式应用、垂直 Agent）', 'AI Infra（模型训练、推理部署、算力调度）', '智能硬件（具身智能、可穿戴、边缘设备）'],
    rule: '不限产业方向，鼓励底层算法突破与商业模式创新；路演 + 评选 + 投资对接一站式完成。',
  },
] as const;

/* ---------------------------------------------------------------- 海外联动 */
export const overseas = [
  { city: '中国香港', role: '亚太 OPC 流量入口' },
  { city: '意大利佛罗伦萨', role: '欧洲设计力量' },
  { city: '美国硅谷', role: '全球技术高地' },
] as const;

/* ---------------------------------------------------------------- 日程 */
export const agenda = [
  {
    id: 'day1',
    day: 'Day 1',
    date: '11 月 14 日（周六）',
    venue: '德必大虹桥园区',
    positioning: '开幕与社交',
    summary: '下午开幕式（领导讲话、主办方分享、圆桌、赛制发布与高校签约），晚间 After Party 深度社交。',
    items: [
      { time: '09:00—12:30', place: '德必园区 · 签到区', title: '报到签到', desc: '领取物料包与嘉宾证；参赛团队报到、媒体采访、自由交流。' },
      { time: '13:00—13:30', place: '主会场', title: '入场就座、暖场视频', desc: '' },
      { time: '13:30—14:00', place: '主会场', title: '开场：领导致辞', desc: '政府领导、主办方致辞。' },
      { time: '14:00—14:40', place: '主会场', title: '主办方分享', desc: '原子公社、德必集团战略发布与大会愿景（直播）。' },
      { time: '14:40—15:40', place: '主会场', title: '圆桌论坛：全球 AI 创客生态', desc: '海外专家连线 + 投资人 + 创客代表。' },
      { time: '16:00—16:40', place: '主会场', title: '赛制发布与高校签约', desc: '双赛道赛制正式发布，现场签署高校合作协议。' },
      { time: '18:30—21:30', place: '德必园区', title: 'After Party', desc: '创客社交之夜，自由交流与合作对接。' },
    ],
  },
  {
    id: 'day2',
    day: 'Day 2',
    date: '11 月 15 日（周日）',
    venue: '乐动虹桥 + 德必园区',
    positioning: '赛果绽放',
    summary: '乐动虹桥承担决赛路演主会场、游园会、市集、互动、求职、展商与分论坛；德必园区承担部分赛道路演分会场与海外线上评审室。',
    items: [
      { time: '09:30 起', place: '乐动虹桥 1F', title: '展区开市', desc: '长宁味道市集开市、AI 互动区开放、樊登书店求职区开放、展商开馆、游园护照发放。' },
      { time: '09:30—12:00', place: '乐动虹桥 1F 路演厅', title: '决赛路演第一场：产业赛道', desc: '8+5 分钟制，直播。' },
      { time: '09:30—12:00', place: '德必园区', title: '自由赛道分会场路演', desc: '海外线上评审室启用，海外专家远程接入。' },
      { time: '09:30—12:00', place: '乐动虹桥 2F', title: '「逐梦星河」商业航天论坛（上午场）', desc: '' },
      { time: '13:30—16:00', place: '乐动虹桥 1F 路演厅', title: '决赛路演第二场：自由赛道', desc: '8+5 分钟制，直播。' },
      { time: '13:30—17:00', place: '乐动虹桥 3F', title: '分论坛（7—8 场并行）', desc: '详见分会场一览。' },
      { time: '16:30—17:30', place: '主会场', title: '闭幕式：颁奖与项目落地签约', desc: '公布获奖名单，现场推动项目与企业需求签约。' },
    ],
  },
] as const;

/* ---------------------------------------------------------------- 分会场 */
export const forums = [
  { name: 'DOAI 人才引力场', nameEn: 'Talent Hub', topic: 'AI 人才趋势、组织变革、大学生求职', host: '招聘平台 / 人力资源咨询 / 大厂 HR', place: '1F 樊登书店联动区', when: '15 日上午' },
  { name: 'DOAI 创投引力场', nameEn: 'VC Gravity', topic: '融资策略、资本周期、投后陪跑', host: '投资机构 / 产业基金', place: '3F 分论坛区', when: '15 日下午' },
  { name: 'DOAI 设计涌现', nameEn: 'Design X', topic: 'AI -native 产品设计、交互范式', host: '设计机构 / 院校', place: '3F 分论坛区', when: '15 日下午' },
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
] as const;

/* ---------------------------------------------------------------- 官网模块 */
export const siteModules = [
  { name: '赛事报名', action: '报名参赛（团队 / 个人）', desc: '双赛道选择、提交项目资料与团队信息，生成报名凭证。' },
  { name: '赛事组队', action: '在线组队 / 招募队员', desc: '发布项目简介、技能标签，开发者匹配组队，形成战队档案（打通原子公社名片模块）。' },
  { name: '论坛报名', action: '观众报名分论坛', desc: '按分会场与场次选座预约，生成入场凭证。' },
  { name: '发起论坛', action: '社区申请发起论坛', desc: '个人 / 机构提交论坛主题、嘉宾与时间，主办方审核后排期上架。' },
  { name: '项目展示', action: '入围项目线上展示', desc: '作品详情、DEMO 视频、观众投票（人气奖）。' },
  { name: '直播中心', action: '全程直播入口', desc: '开幕式、决赛路演、分会场巡播、海外分会场连线。' },
  { name: '票务预约', action: '分论坛与通票预约', desc: '按场次预约席位，生成电子入场凭证。' },
  { name: '创客社区', action: '组队广场与人才市场', desc: '招募与求职撮合，数字名片交换。' },
] as const;
