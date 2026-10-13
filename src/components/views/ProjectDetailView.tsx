import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DetailShell, NotFound } from '../detail/DetailShell';
import {
  Video, FileText, ExternalLink, Check, Clock, Users, Trophy, AlertCircle,
  Copy, CheckCircle2, XCircle, CircleDot,
} from 'lucide-react';

const statusMeta = {
  submitted: { label: '已提交', color: '#165DFF', desc: '材料已提交，等待机审与人工核验。', icon: CircleDot },
  reviewing: { label: '评审中', color: '#FF8A1F', desc: '专家正在评估技术完成度与落地价值。', icon: Clock },
  needs_info: { label: '待补充材料', color: '#FF8A1F', desc: '需要补充或更正材料后重新提交。', icon: AlertCircle },
  shortlisted: { label: '已入围决赛', color: '#00B487', desc: '恭喜！已入围现场路演决赛。', icon: CheckCircle2 },
  rejected: { label: '未通过', color: '#98A6BE', desc: '很遗憾，本次未能通过评审。', icon: XCircle },
} as const;

const PIPELINE = ['submitted', 'reviewing', 'shortlisted'] as const;

export const ProjectDetailView: React.FC<{ id?: string }> = ({ id }) => {
  const { registrations, setActiveRoute, currentUser } = useApp();
  const [copied, setCopied] = useState('');

  const reg = registrations.find(r => r.id === id || r.makerId === id);
  if (!reg) return <NotFound what="该参赛项目" backRoute="dashboard" backLabel="返回我的 DOAI" />;

  const meta = statusMeta[reg.status];
  const StatusIcon = meta.icon;
  const stageIndex = PIPELINE.indexOf(reg.status as (typeof PIPELINE)[number]);

  const handleCopy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  };

  return (
    <DetailShell
      backRoute="dashboard"
      backLabel="返回我的 DOAI"
      eyebrow={`${reg.track === 'industry' ? '产业赛道' : '自由赛道'} · ${reg.type === 'team' ? '团队参赛' : '个人参赛'}`}
      title={reg.projectName}
      subtitle={reg.projectSummary}
      meta={[
        { label: '团队名称', value: reg.teamName },
        { label: 'Maker ID', value: reg.makerId },
        { label: '邀请码', value: reg.inviteCode },
        { label: '提交时间', value: reg.submittedAt },
      ]}
      actions={
        <>
          <button
            type="button"
            onClick={() => handleCopy('code', reg.inviteCode)}
            className="doa-btn doa-btn-ghost"
          >
            {copied === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === 'code' ? '已复制' : '复制邀请码'}
          </button>
          <button type="button" onClick={() => setActiveRoute('register')} className="doa-btn doa-btn-primary">
            <FileText className="w-4 h-4" /> 修改申报信息
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Review status */}
          <section className="doa-card p-6 sm:p-7">
            <div className="flex items-start gap-4 mb-6">
              <span
                className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-white"
                style={{ background: meta.color }}
              >
                <StatusIcon className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-[#0B1B3A]">{meta.label}</h2>
                </div>
                <p className="text-[13px] text-[#6B7C9B]">{meta.desc}</p>
              </div>
            </div>

            {reg.status !== 'needs_info' && reg.status !== 'rejected' && (
              <ol className="flex items-center gap-2 sm:gap-4">
                {PIPELINE.map((s, i) => {
                  const m = statusMeta[s];
                  const done = stageIndex >= i && stageIndex !== -1;
                  const active = stageIndex === i;
                  return (
                    <li key={s} className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold transition-colors"
                          style={{ background: done ? m.color : '#E3ECFA' }}
                        >
                          {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </span>
                        <span className={`text-[11px] font-semibold whitespace-nowrap ${active ? 'text-[#0B1B3A]' : 'text-[#98A6BE]'}`}>
                          {m.label}
                        </span>
                      </div>
                      {i < PIPELINE.length - 1 && (
                        <span className="flex-1 h-0.5 rounded-full bg-[#E3ECFA] overflow-hidden">
                          <span
                            className="block h-full rounded-full transition-all"
                            style={{
                              width: stageIndex > i ? '100%' : '0%',
                              background: statusMeta[PIPELINE[i]].color,
                            }}
                          />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}

            {reg.reviewFeedback && (
              <div className="mt-6 pt-5 border-t border-[#E3ECFA]">
                <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-2">评审意见</div>
                <p className="text-[13px] text-[#48597A] leading-[1.8]">{reg.reviewFeedback}</p>
              </div>
            )}

            {reg.needsInfoDetails && (
              <div className="mt-5 rounded-2xl bg-[#FFF8EC] border border-[#FFD79A] p-4">
                <div className="text-[12px] font-bold text-[#B25E00] mb-1.5">需要补充</div>
                <p className="text-[13px] text-[#7A4A00] leading-relaxed">{reg.needsInfoDetails}</p>
              </div>
            )}
          </section>

          {/* Materials */}
          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-5">提交材料</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Video, label: 'Demo 视频', value: reg.videoUrl, href: reg.videoUrl },
                { icon: FileText, label: '项目文档', value: reg.docUrl, href: reg.docUrl },
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <a
                    key={i}
                    href={row.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-3 p-4 rounded-2xl border border-[#E3ECFA] bg-[#F7FAFF] hover:border-[#A9CCFF] hover:bg-[#F2F7FF] transition-colors"
                  >
                    <span className="w-9 h-9 rounded-xl bg-[#E4EFFF] text-[#165DFF] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">{row.label}</div>
                      <div className="text-[13px] text-[#1A2B4D] font-medium truncate">{row.value}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#98A6BE] group-hover:text-[#165DFF] shrink-0" />
                  </a>
                );
              })}
            </div>
          </section>

          {/* Team */}
          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-5 flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-[#165DFF]" /> 团队成员 ({reg.members.length})
            </h2>
            <div className="space-y-3">
              {reg.members.map((m, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-[#E3ECFA]">
                  <span className="w-10 h-10 rounded-2xl bg-[#E4EFFF] text-[#165DFF] flex items-center justify-center font-bold text-sm shrink-0">
                    {m.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#1A2B4D] text-sm flex items-center gap-2">
                      {m.name}
                      {m.isLeader && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#165DFF] text-white font-semibold">队长</span>}
                    </div>
                    <div className="text-[12px] text-[#6B7C9B] mt-0.5">{m.roleTitle} · {m.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="doa-card p-6">
            <h3 className="font-bold text-[#0B1B3A] text-sm mb-4">评审维度</h3>
            <div className="space-y-3.5">
              {[
                { label: '技术创新性', w: '30%' },
                { label: '工程完成度', w: '25%' },
                { label: '真实场景价值', w: '25%' },
                { label: '团队与表达', w: '20%' },
              ].map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[13px] mb-1.5">
                    <span className="text-[#48597A] font-medium">{d.label}</span>
                    <span className="text-[#165DFF] font-bold">{d.w}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EFF5FF] overflow-hidden">
                    <div className="h-full rounded-full bg-[#6FA8FF]" style={{ width: d.w }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {reg.status === 'shortlisted' && (
            <section className="doa-panel p-6 border-[#A9CCFF] bg-[#F2F7FF]">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-[#00B487]" />
                <h3 className="font-bold text-[#0B1B3A] text-sm">决赛准备</h3>
              </div>
              <p className="text-[13px] text-[#48597A] leading-relaxed mb-4">
                请在 11/10 前完成现场布展物料提交，决赛现场将进行 8 分钟 Demo 与 5 分钟答辩。
              </p>
              <button type="button" onClick={() => setActiveRoute('maker/schedule')} className="doa-btn doa-btn-secondary w-full">
                <Clock className="w-4 h-4" /> 查看决赛日程
              </button>
            </section>
          )}

          <section className="doa-card p-6">
            <h3 className="font-bold text-[#0B1B3A] text-sm mb-3">邀请队友</h3>
            <p className="text-[13px] text-[#6B7C9B] leading-relaxed mb-4">
              把邀请码发给伙伴，他们在报名时填写即可加入你的团队。
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-xl bg-[#F2F7FF] border border-[#E3ECFA] text-[#165DFF] font-bold text-sm tracking-wider">
                {reg.inviteCode}
              </code>
              <button
                type="button"
                onClick={() => handleCopy('code', reg.inviteCode)}
                aria-label="复制邀请码"
                className="shrink-0 w-10 h-10 rounded-xl border border-[#E3ECFA] flex items-center justify-center hover:bg-[#F2F7FF] transition-colors"
              >
                {copied === 'code' ? <Check className="w-4 h-4 text-[#00B487]" /> : <Copy className="w-4 h-4 text-[#165DFF]" />}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </DetailShell>
  );
};
