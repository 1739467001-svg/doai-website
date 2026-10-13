import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Cpu,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Award,
  AlertTriangle
} from 'lucide-react';

export const MakerView: React.FC = () => {
  const { lang, setActiveRoute, openPolicy } = useApp();


  // The plan's 赛事流程, with each phase's status derived from today's date so
  // the site never claims a stage is still open once it has closed.
  const PHASES = [
    { key: '报名', start: '2026-09-28', end: '2026-10-31', desc: '通过 DOAI 官网提交团队与项目资料，生成报名凭证。' },
    { key: '命题发布', start: '2026-10-15', end: '2026-10-20', desc: '产业赛道联合长宁区龙头企业发布真实业务命题。' },
    { key: '线上组队', start: '2026-10-15', end: '2026-11-05', desc: '官网在线组队与招募队员，形成战队档案。' },
    { key: '作品提交', start: '2026-11-03', end: '2026-11-07', desc: '提交项目说明、Demo 视频与团队信息。' },
    { key: '线上初筛', start: '2026-11-08', end: '2026-11-11', desc: '专家评审团初评，含海外线上评审同步参与。' },
    { key: '公布入围', start: '2026-11-12', end: '2026-11-12', desc: '公布 20—30 个入围路演项目。' },
    { key: '线下路演', start: '2026-11-15', end: '2026-11-15', desc: '乐动虹桥主会场 + 德必园区分会场同步进行。' },
    { key: '颁奖与落地', start: '2026-11-15', end: '2026-11-15', desc: '现场颁奖，并推动获奖项目与企业需求签约。' },
  ] as const;

  const TODAY = new Date('2026-10-04T00:00:00');
  const phaseState = (start: string, end: string) => {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T23:59:59');
    if (TODAY < s) return 'upcoming';
    if (TODAY > e) return 'done';
    return 'active';
  };

  const timelineSteps = PHASES.map((p, i) => ({
    step: String(i + 1).padStart(2, '0'),
    title: p.key,
    date: p.start === p.end ? p.start.slice(5).replace('-', '/') : `${p.start.slice(5).replace('-', '/')} — ${p.end.slice(5).replace('-', '/')}`,
    desc: p.desc,
    active: phaseState(p.start, p.end) === 'active',
    done: phaseState(p.start, p.end) === 'done',
  }));

  return (
    <div className="pt-24 pb-24">
      {/* 1. Header Banner */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#165DFF] tracking-wider uppercase">
            <span>DOAI 2026 AI MAKER CONTEST</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0B1B3A] tracking-tight leading-tight">
            {lang === 'zh'
              ? 'AI 创客大赛：探索下一代智能应用'
              : 'AI Maker Contest: Forging Next-Gen Intelligent Applications'}
          </h1>
          <p className="text-base text-[#666666] leading-relaxed">
            {lang === 'zh'
              ? '面向全球极客与商业探索者的全开放式 AI 赛事。设置「产业赛道」与「自由赛道」，20 万元总奖金池，全链路免费参赛。以真实代码与产品说话，让最顶尖的创造力破土而出。'
              : 'An open global AI maker competition featuring dual tracks and a ¥200,000 cash pool. 100% free participation with independent peer reviews.'}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={() => setActiveRoute('register')}
              className="px-8 py-3.5 text-sm font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>立即免费报名参赛</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveRoute('square')}
              className="px-6 py-3.5 text-sm font-semibold text-[#0B1B3A] hover:text-[#165DFF] bg-white border border-[#E8EAED] rounded-full transition-all"
            >
              去组队广场找队友
            </button>
          </div>
        </div>
      </section>

      {/* 2. Dual Tracks Deep Dive */}
      <section id="maker-tracks" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#0B1B3A]">赛事双赛道设置</h2>
          <p className="text-xs text-[#666666] mt-1">
            参赛项目申报时须选择其中一个主赛道方向，评审维度将根据赛道特性差异化考量
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Industry Track Card */}
          <div id="maker-industry" className="bg-[#F7F8FA] rounded-3xl p-8 sm:p-10 border border-[#E8EAED] flex flex-col justify-between scroll-mt-28">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#165DFF]/10 text-[#165DFF] flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B1B3A]">
                产业赛道 · AI + Industry
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                联合长宁区龙头企业发布真实业务命题，定向解题；获奖项目优先对接企业采购订单与落地孵化。
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-[#0B1B3A]">命题方向：</div>
                <ul className="text-xs text-[#555555] space-y-1.5 list-disc list-inside">
                  <li>AI + 消费：电商、IP 类情绪消费、新消费</li>
                  <li>AI + 专业服务：出海、法务、财税</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-[#E8EAED] mt-6">
              <span className="text-xs text-[#888888]">重点考量：商业可行性与商业落地闭环</span>
              <button
                onClick={() => setActiveRoute('track/industry')}
                className="px-4 py-2 text-xs font-semibold text-[#165DFF] bg-[#165DFF]/5 hover:bg-[#165DFF]/10 rounded-full transition-colors"
              >
                申报赛道 · 查看详情 →
              </button>
            </div>
          </div>

          {/* Creator Track Card */}
          <div id="maker-creator" className="bg-[#F7F8FA] rounded-3xl p-8 sm:p-10 border border-[#E8EAED] flex flex-col justify-between scroll-mt-28">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00C48C]/10 text-[#00C48C] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0B1B3A]">
                自由赛道 · AI Creator
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                不限产业方向，鼓励底层算法突破与商业模式创新；路演 + 评选 + 投资对接一站式完成。
              </p>

              <div className="pt-2 space-y-2">
                <div className="text-xs font-semibold text-[#0B1B3A]">命题方向：</div>
                <ul className="text-xs text-[#555555] space-y-1.5 list-disc list-inside">
                  <li>Agent 应用：多智能体协作、对话式应用、垂直 Agent</li>
                  <li>AI Infra：模型训练、推理部署、算力调度</li>
                  <li>智能硬件：具身智能、可穿戴、边缘设备</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-[#E8EAED] mt-6">
              <span className="text-xs text-[#888888]">重点考量：突破性技术创新与极客精神</span>
              <button
                onClick={() => setActiveRoute('track/creator')}
                className="px-4 py-2 text-xs font-semibold text-[#00C48C] bg-[#00C48C]/5 hover:bg-[#00C48C]/10 rounded-full transition-colors"
              >
                申报赛道 · 查看详情 →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Timeline (Apple Design style) */}
      <section id="maker-timeline" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#0B1B3A]">赛事流程与关键节点</h2>
          <p className="text-xs text-[#666666] mt-1">
            从线上报名到线下颁奖共 8 个节点，当前阶段自动高亮
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {timelineSteps.map((step, idx) => (
            <div
              key={step.step}
              className={`p-6 rounded-2xl border transition-all ${
                step.done
                  ? 'bg-white border-[#165DFF]/40 shadow-xs'
                  : step.active
                  ? 'bg-[#165DFF]/5 border-[#165DFF] shadow-sm'
                  : 'bg-[#F7F8FA] border-[#E8EAED] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#165DFF]">{step.step}</span>
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00C48C]" />
                ) : (
                  <Clock className="w-4 h-4 text-[#888888]" />
                )}
              </div>
              <h4 className="text-sm font-bold text-[#0B1B3A] mb-1">{step.title}</h4>
              <div className="text-[11px] font-semibold text-[#165DFF] mb-2">{step.date}</div>
              <p className="text-[11px] text-[#666666] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Scoring Criteria (4 Dimensions) */}
      <section id="maker-scoring" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0B1B3A]">评审维度与权重</h2>
          <p className="text-xs text-[#666666] mt-1">
            严格执行评审规范，综合衡量代码工程度与真实落地成效
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-[#E8EAED]">
            <div className="text-2xl font-bold font-mono text-[#165DFF] mb-2">30%</div>
            <h4 className="text-sm font-bold text-[#0B1B3A] mb-1">创新能力</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              方案的新颖性、独创性，是否突破传统范式或带来全新交互范式。
            </p>
          </div>

          <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-[#E8EAED]">
            <div className="text-2xl font-bold font-mono text-[#00C48C] mb-2">30%</div>
            <h4 className="text-sm font-bold text-[#0B1B3A] mb-1">技术能力</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              系统工程架构成熟度、推理效率、端侧优化以及抗异常鲁棒性。
            </p>
          </div>

          <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-[#E8EAED]">
            <div className="text-2xl font-bold font-mono text-[#FF7D00] mb-2">20%</div>
            <h4 className="text-sm font-bold text-[#0B1B3A] mb-1">商业价值</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              市场空间真实性、商业模式逻辑闭环、可量化的投入产出回报比。
            </p>
          </div>

          <div className="bg-[#F7F8FA] p-6 rounded-2xl border border-[#E8EAED]">
            <div className="text-2xl font-bold font-mono text-purple-600 mb-2">20%</div>
            <h4 className="text-sm font-bold text-[#0B1B3A] mb-1">现场表现</h4>
            <p className="text-xs text-[#666666] leading-relaxed">
              现场真实产品 Demo 运行稳定性、团队答辩与技术深度问答表现。
            </p>
          </div>
        </div>
      </section>

      {/* 5. Award Showcase (Apple Design Award style) */}
      <section id="maker-awards" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 py-16">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0B1B3A]">奖项体系</h2>
          <p className="text-xs text-[#666666] mt-2">
            总奖金池 20 万元整 · 赛道等级奖 12 万 + 专项荣誉奖 5 万 + 普惠激励奖 3 万
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              name: '赛道等级奖',
              amount: '¥120,000',
              tag: '20 支优胜团队',
              desc: '覆盖 20 支优胜团队，按各赛道决赛排名阶梯式发放，重点表彰技术落地、产品创新与商业变现能力。',
              icon: Trophy,
              color: '#165DFF',
            },
            {
              name: '专项荣誉奖',
              amount: '¥50,000',
              tag: '跨赛道独立评选',
              desc: '跨赛道独立评选，聚焦创新点、社会价值与未来商业潜力，可与等级奖兼得。',
              icon: Award,
              color: '#FF7D00',
            },
            {
              name: '普惠激励奖',
              amount: '¥30,000',
              tag: '全体答辩团队',
              desc: '面向所有完成答辩的团队发放，致敬坚持与付出。',
              icon: ShieldCheck,
              color: '#00C48C',
            },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <div
                key={i}
                className="doa-card p-7 flex flex-col"
                style={{ borderTop: `3px solid ${a.color}` }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${a.color}14`, color: a.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0B1B3A]">{a.name}</h3>
                <div className="text-3xl font-extrabold font-mono mt-2" style={{ color: a.color }}>
                  {a.amount}
                </div>
                <span className="doa-chip mt-3 self-start">{a.tag}</span>
                <p className="text-[13px] text-[#48597A] leading-relaxed mt-4">{a.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="doa-panel p-7 mt-6">
          <h3 className="font-bold text-[#0B1B3A] text-base mb-4">评审机制</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-2.5">
                评审团构成（12—15 名）
              </div>
              <ul className="space-y-2">
                {[
                  { g: '政府产业代表', c: '2—3 名' },
                  { g: '产业企业代表', c: '4 名' },
                  { g: '资深投资人', c: '3—4 名' },
                  { g: '技术专家（含海外）', c: '2—3 名' },
                  { g: '主办方代表', c: '2 名' },
                ].map((row, i) => (
                  <li key={i} className="flex items-center justify-between text-[13px] py-1.5 border-b border-[#E3ECFA] last:border-0">
                    <span className="text-[#48597A]">{row.g}</span>
                    <span className="font-semibold text-[#1A2B4D]">{row.c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-2.5">
                核心评审维度（五维一体）
              </div>
              <div className="flex flex-wrap gap-2">
                {['技术创新性', '商业可行性', '产业适配度', '团队与落地力', '需求匹配度'].map((d, i) => (
                  <span key={i} className="doa-chip">{d}</span>
                ))}
              </div>
              <p className="text-[12px] text-[#6B7C9B] leading-relaxed mt-4">
                海外专家经德必园区线上评审室远程参与评审，自由赛道在德必园区分会场路演时同步连线。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Rules & Integrity Box */}
      <section id="maker-rules" className="scroll-mt-24 max-w-[1200px] mx-auto px-6 sm:px-8 pt-8">
        <div className="bg-[#F7F8FA] rounded-2xl p-6 sm:p-8 border border-[#E8EAED] text-xs text-[#666666] space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B1B3A]">
            <ShieldCheck className="w-4 h-4 text-[#00C48C]" />
            <span>赛事诚信公约与法律声明</span>
          </div>
          <p>
            1. <strong className="text-[#0B1B3A]">全程免费</strong>：报名及评审不收取任何费用。任何声称可代办入围或收取辅导费用的行为均为诈骗，请创客提高警惕。
          </p>
          <p>
            2. <strong className="text-[#0B1B3A]">知识产权归属</strong>：所有参赛项目的完整知识产权严格属于参赛者个人或团队所有，未经团队书面授权，组委会绝不公开发布或商用。
          </p>
          <p>
            3. <strong className="text-[#0B1B3A]">个税代扣代缴与兑付</strong>：所有奖金均为税前金额，组委会将依据相关税法代扣代缴 20% 偶然所得个人所得税，赛后 30 个工作日内拨付至获奖人账户。
          </p>
        </div>
      </section>
    </div>
  );
};
