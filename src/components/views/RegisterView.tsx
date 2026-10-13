import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  AlertCircle,
  Users,
  User,
  Video,
  FileText,
  Link as LinkIcon,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { TrackType, TeamMember } from '../../types';

export const RegisterView: React.FC = () => {
  const { lang, currentUser, setLoginModalOpen, submitRegistration, setActiveRoute } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Form State
  const [personalName, setPersonalName] = useState(currentUser?.name || '李晨 Alex Chen');
  const [personalCity, setPersonalCity] = useState(currentUser?.city || '深圳');
  const [personalSkills, setPersonalSkills] = useState(currentUser?.skills?.join('、') || 'Agent架构、PyTorch、微调');

  // Step 2: Team State
  const [regType, setRegType] = useState<'individual' | 'team'>('team');
  const [teamName, setTeamName] = useState('Synapse Core');
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: currentUser?.name || '李晨 Alex Chen', phone: currentUser?.phone || '138****8821', roleTitle: '项目负责人 / 算法架构', isLeader: true },
    { id: '2', name: '王嘉敏 (Jasmine)', phone: '139****1920', roleTitle: '全栈开发', isLeader: false },
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  // Step 3: Project State
  const [projectName, setProjectName] = useState('NeuroFlow 自适应多智能体协作中枢');
  const [track, setTrack] = useState<TrackType>('creator');
  const [projectSummary, setProjectSummary] = useState(
    '基于动态拓扑与共识算法的分布式自主智能体协作协议，显著降低复杂多任务下的 LLM 通信损耗与幻觉。'
  );
  const [videoUrl, setVideoUrl] = useState('https://www.bilibili.com/video/BV1xx411c7XN');
  const [docUrl, setDocUrl] = useState('https://docs.neuroflow.ai/whitepaper-v1');

  // Step 4: Submission result
  const [submittedMakerId, setSubmittedMakerId] = useState('');
  const [validationError, setValidationError] = useState('');

  // Add Member
  const handleAddMember = () => {
    if (members.length >= 5) {
      alert('团队最多支持 5 名成员');
      return;
    }
    if (!newMemberName || !newMemberPhone) {
      alert('请填写队员姓名与手机号');
      return;
    }
    setMembers([
      ...members,
      {
        id: `m-${Date.now()}`,
        name: newMemberName,
        phone: newMemberPhone,
        roleTitle: newMemberRole || '研发工程师',
        isLeader: false,
      },
    ]);
    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberRole('');
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return;
    setMembers(members.filter(m => m.id !== id));
  };

  // URL Validation rule from PRD: Only external URLs (Bilibili/Tencent/YouTube/direct URL), NO file upload
  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (currentStep === 1) {
      if (!currentUser) {
        setLoginModalOpen(true);
        return;
      }
      if (!personalName.trim() || !personalCity.trim()) {
        setValidationError('请完整填写个人姓名与城市');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (regType === 'team' && !teamName.trim()) {
        setValidationError('请填写团队名称');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!projectName.trim() || !projectSummary.trim()) {
        setValidationError('请完整填写项目名称与项目介绍');
        return;
      }
      if (!isValidUrl(videoUrl)) {
        setValidationError('Demo 视频仅支持合法的外部公开直链（如 Bilibili、腾讯视频或 YouTube 链接）');
        return;
      }
      if (!isValidUrl(docUrl)) {
        setValidationError('项目文档仅支持在线链接（如飞书文档、Notion 或 GitHub 链接），不接收本地文件上传');
        return;
      }

      // Submit registration
      const result = submitRegistration({
        type: regType,
        track,
        teamName: regType === 'team' ? teamName : personalName,
        projectName,
        projectSummary,
        videoUrl,
        docUrl,
        members: regType === 'team' ? members : [{
          id: currentUser?.id || '1',
          name: personalName,
          phone: currentUser?.phone || '13800000000',
          roleTitle: '个人独立开发者',
          isLeader: true,
        }],
      });

      setSubmittedMakerId(result.makerId);
      setCurrentStep(4);
    }
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(`https://doai2026.org/join?code=NF8921`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 pb-24 max-w-[880px] mx-auto px-6 sm:px-8">
      {/* Wizard Steps Header */}
      <div className="mb-10 text-center">
        <div className="text-xs font-semibold text-[#165DFF] tracking-wider uppercase mb-1">
          DOAI 2026 OFFICIAL REGISTRATION
        </div>
        <h1 className="text-3xl font-bold text-[#0B1B3A]">赛事项目申报通道</h1>
        <p className="text-xs text-[#666666] mt-1.5 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00C48C]" />
          <span>全程免费申报 · 截止时间前支持无限次编辑保存 · 知识产权 100% 归团队所有</span>
        </p>

        {/* Steps Breadcrumbs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 text-xs font-semibold">
          {[
            { num: 1, label: '01 申报人信息' },
            { num: 2, label: '02 参赛模式' },
            { num: 3, label: '03 项目与作品' },
            { num: 4, label: '04 完成与凭证' },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                  currentStep === s.num
                    ? 'bg-[#165DFF] text-white shadow-xs'
                    : currentStep > s.num
                    ? 'bg-[#00C48C] text-white'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </span>
              <span
                className={`hidden sm:inline ${
                  currentStep === s.num ? 'text-[#0B1B3A]' : 'text-neutral-400'
                }`}
              >
                {s.label}
              </span>
              {s.num < 4 && <span className="text-neutral-300 mx-1">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8EAED] shadow-floating">
        {validationError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-xs flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleStepSubmit} className="space-y-6">
          {/* STEP 1: Basic Person Info */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#0B1B3A] pb-2 border-b border-[#E8EAED]">
                01. 申报人基础信息
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                    真实姓名 / 常用昵称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={personalName}
                    onChange={e => setPersonalName(e.target.value)}
                    placeholder="请输入姓名"
                    className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                    联系电话 (取自登录账户，不可更改)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.phone || '13800138821'}
                    className="w-full px-4 py-2.5 bg-neutral-100 border border-[#E8EAED] rounded-xl text-sm text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                    常驻城市 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={personalCity}
                    onChange={e => setPersonalCity(e.target.value)}
                    placeholder="例如: 深圳 / 北京 / 上海"
                    className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                    特长技能标签
                  </label>
                  <input
                    type="text"
                    value={personalSkills}
                    onChange={e => setPersonalSkills(e.target.value)}
                    placeholder="以顿号分隔，例如: Agent架构、PyTorch"
                    className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>下一步：参赛模式</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Team / Individual Info */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#0B1B3A] pb-2 border-b border-[#E8EAED]">
                02. 参赛模式与团队成员 (2–5人)
              </h3>

              {/* Individual or Team Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRegType('team')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    regType === 'team'
                      ? 'border-[#165DFF] bg-[#165DFF]/5 shadow-xs'
                      : 'border-[#E8EAED] bg-[#F7F8FA] hover:border-neutral-300'
                  }`}
                >
                  <Users className="w-5 h-5 text-[#165DFF] mb-2" />
                  <div className="text-sm font-bold text-[#0B1B3A]">战队联合参赛 (推荐)</div>
                  <div className="text-xs text-[#666666] mt-0.5">2-5 人组队，角色互补优势更明显</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegType('individual')}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    regType === 'individual'
                      ? 'border-[#165DFF] bg-[#165DFF]/5 shadow-xs'
                      : 'border-[#E8EAED] bg-[#F7F8FA] hover:border-neutral-300'
                  }`}
                >
                  <User className="w-5 h-5 text-[#00C48C] mb-2" />
                  <div className="text-sm font-bold text-[#0B1B3A]">个人独立参赛</div>
                  <div className="text-xs text-[#666666] mt-0.5">一人全栈冲刺，独立扛鼎</div>
                </button>
              </div>

              {regType === 'team' && (
                <div className="space-y-5 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                      战队名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      placeholder="例如: Synapse Core"
                      className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                    />
                  </div>

                  {/* Team Members List */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#0B1B3A] mb-2">
                      <span>已添加队员 ({members.length}/5)</span>
                      <span className="text-[#888888] font-normal">队长可生成邀请码让队友免审加入</span>
                    </div>

                    <div className="space-y-2">
                      {members.map(m => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-3.5 doa-panel text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-[#0B1B3A]">{m.name}</span>
                            <span className="text-[#888888]">{m.phone}</span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] bg-white border border-[#E8EAED] text-[#555555]">
                              {m.roleTitle}
                            </span>
                            {m.isLeader && (
                              <span className="text-[10px] font-bold text-[#165DFF] bg-[#165DFF]/10 px-2 py-0.5 rounded-full">
                                项目队长
                              </span>
                            )}
                          </div>

                          {!m.isLeader && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(m.id)}
                              className="text-neutral-400 hover:text-red-500 transition-colors"
                            >
                              移除
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Member inputs */}
                    {members.length < 5 && (
                      <div className="mt-3 p-4 bg-white border border-dashed border-[#E8EAED] rounded-xl space-y-3">
                        <div className="text-xs font-semibold text-[#666666]">
                          + 快速添加队友信息
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={newMemberName}
                            onChange={e => setNewMemberName(e.target.value)}
                            placeholder="队员姓名"
                            className="px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-lg text-xs"
                          />
                          <input
                            type="tel"
                            value={newMemberPhone}
                            onChange={e => setNewMemberPhone(e.target.value)}
                            placeholder="队员手机号"
                            className="px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            value={newMemberRole}
                            onChange={e => setNewMemberRole(e.target.value)}
                            placeholder="分工角色 (如: 嵌入式)"
                            className="px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-lg text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddMember}
                          className="px-4 py-1.5 text-xs font-semibold text-[#165DFF] bg-[#165DFF]/10 rounded-lg hover:bg-[#165DFF]/15 transition-colors"
                        >
                          确认加入队员
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2.5 text-xs font-semibold text-[#666666] hover:text-[#0B1B3A] transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回上一步</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>下一步：项目与作品</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Project Information */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-[#0B1B3A] pb-2 border-b border-[#E8EAED]">
                03. 申报项目与作品成果 (仅支持链接提交)
              </h3>

              {/* Track Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1B3A] mb-2">
                  申报赛道 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTrack('industry')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      track === 'industry'
                        ? 'border-[#165DFF] bg-[#165DFF]/5'
                        : 'border-[#E8EAED] bg-[#F7F8FA]'
                    }`}
                  >
                    <div className="text-sm font-bold text-[#0B1B3A]">产业赛道 (AI + Industry)</div>
                    <div className="text-[11px] text-[#666666] mt-0.5">落地真实商业场景与企业生产力</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTrack('creator')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      track === 'creator'
                        ? 'border-[#00C48C] bg-[#00C48C]/5'
                        : 'border-[#E8EAED] bg-[#F7F8FA]'
                    }`}
                  >
                    <div className="text-sm font-bold text-[#0B1B3A]">自由赛道 (AI Creator)</div>
                    <div className="text-[11px] text-[#666666] mt-0.5">原生 Agent、开源基础设施与智能硬件</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                  项目名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="例如: NeuroFlow 自适应多智能体协作中枢"
                  className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                  一句话介绍与核心技术方案 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={projectSummary}
                  onChange={e => setProjectSummary(e.target.value)}
                  placeholder="请用 100-200 字阐明项目的核心痛点、技术突破点与实际落地价值..."
                  className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                />
              </div>

              {/* Demo Video URL (PRD: Strict Link Rule, no file upload) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#0B1B3A] flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[#165DFF]" />
                    <span>Demo 视频链接 (仅接受外部公开直链)</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#888888]">支持 Bilibili / 腾讯视频 / YouTube</span>
                </div>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.bilibili.com/video/BV..."
                  className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                />
                <p className="text-[11px] text-[#888888] mt-1">
                  ※ 系统将实时校验 URL 可达性，不可访问会导致机审无法通过。
                </p>
              </div>

              {/* Doc URL (PRD: Strict Link Rule, no file upload) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#0B1B3A] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#00C48C]" />
                    <span>项目文档 / 白皮书在线链接</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#888888]">支持飞书文档 / Notion / GitHub</span>
                </div>
                <input
                  type="url"
                  required
                  value={docUrl}
                  onChange={e => setDocUrl(e.target.value)}
                  placeholder="https://docs.yourproject.ai/overview"
                  className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                />
              </div>

              {/* Privacy Reassurance Note */}
              <div className="p-4 doa-panel text-xs text-[#666666] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#00C48C] shrink-0 mt-0.5" />
                <span>
                  <strong>项目保密承诺</strong>：本表单提交的项目方案与视频仅限 DOAI 评委会保密评阅，官网广场绝不公开展示项目细节与商业机密。
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 text-xs font-semibold text-[#666666] hover:text-[#0B1B3A] transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回上一步</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>立即提交申报 · 生成 Maker ID</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Credentials Generation */}
          {currentStep === 4 && (
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-250">
              <div className="w-16 h-16 rounded-full bg-[#00C48C]/10 text-[#00C48C] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0B1B3A]">赛事申报提交成功！</h3>
                <p className="text-xs text-[#666666] mt-1">
                  您的项目已进入机审通道，系统将在 3 个工作日内完成专家初审
                </p>
              </div>

              {/* Maker ID Voucher Box */}
              <div className="max-w-md mx-auto p-6 doa-panel text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#888888]">专属创客标识</span>
                  <span className="text-xs font-bold text-[#00C48C] bg-[#00C48C]/10 px-2.5 py-0.5 rounded-full">
                    机审通过
                  </span>
                </div>
                <div className="text-2xl font-extrabold font-mono text-[#165DFF]">
                  {submittedMakerId || 'DOAI-2026-M8921'}
                </div>
                <div className="text-xs text-[#666666] space-y-1 pt-2 border-t border-[#E8EAED]">
                  <div>项目名称：{projectName}</div>
                  <div>申报赛道：{track === 'industry' ? '产业赛道' : '自由赛道'}</div>
                  <div>电子票券：已自动存入 DOAI Passport 数字身份卡</div>
                </div>

                {/* Team Invite Link Generator */}
                {regType === 'team' && (
                  <div className="pt-3 border-t border-[#E8EAED]">
                    <div className="text-xs font-semibold text-[#0B1B3A] mb-1.5">
                      专属队员邀请链接 (6位邀请码: NF8921)
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://doai2026.org/join?code=NF8921"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#E8EAED] rounded-lg text-xs font-mono text-[#666666]"
                      />
                      <button
                        type="button"
                        onClick={handleCopyInvite}
                        className="px-3 py-1.5 text-xs font-semibold text-[#165DFF] bg-white border border-[#E8EAED] hover:bg-[#F7F8FA] rounded-lg transition-colors flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#00C48C]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? '已复制' : '复制'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveRoute('dashboard')}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-all shadow-sm"
                >
                  前往个人中心查看审核进度与 Passport →
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoute('square')}
                  className="px-6 py-2.5 text-xs font-semibold text-[#0B1B3A] hover:text-[#165DFF] bg-white border border-[#E8EAED] rounded-full transition-colors"
                >
                  去组队广场招募更多伙伴
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
