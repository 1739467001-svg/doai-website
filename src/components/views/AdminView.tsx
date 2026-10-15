import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Search,
  ExternalLink,
  Edit3,
  Send,
  Sliders,
  ShieldAlert,
  Database,
  Calendar,
  Ticket,
  FileSpreadsheet,
  ScanLine
} from 'lucide-react';
import { Registration, RegistrationStatus } from '../../types';

/* ------------------------------------------------------------------ 扫码核销 */
/* 会议结论 2026-10-13：运营后台对活动进行扫码，前台签到的人扫数字身份码核销。
 * 后端：server.js —— POST /api/admin/checkin（校验+去重+持久化）、
 * GET /api/admin/checkins（核销记录）。 */

interface CheckinRecord {
  code: string;
  gate: string;
  holder: string;
  time: string;
}

const CheckinPanel: React.FC = () => {
  const { tr } = useApp();
  const [code, setCode] = useState('');
  const [gate, setGate] = useState('主入口');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'dup' | 'err'; text: string } | null>(null);
  const [records, setRecords] = useState<CheckinRecord[]>([]);

  const loadRecords = () => {
    fetch('/api/admin/checkins')
      .then(r => r.json())
      .then(d => {
        if (d?.ok) setRecords(d.checkins);
      })
      .catch(() => setRecords([]));
  };

  React.useEffect(loadRecords, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || submitting) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), gate }),
      });
      const d = await res.json();
      if (res.ok && d.ok) {
        setFeedback({ kind: 'ok', text: `核销成功：${d.record.code}（${d.record.gate} · ${d.record.time}）` });
        setCode('');
        loadRecords();
      } else if (res.status === 409) {
        setFeedback({ kind: 'dup', text: `该凭证已核销过，请勿重复签到（${d.code}）` });
        setCode('');
      } else {
        setFeedback({ kind: 'err', text: d.message || '核销失败' });
      }
    } catch {
      setFeedback({ kind: 'err', text: '后端服务不可用，请确认 server.js 已启动（npm run server）' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-8 space-y-6 max-w-3xl">
      {/* 扫码输入区（模拟扫码枪：光标常驻输入框，回车即提交） */}
      <form onSubmit={submit} className="doa-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-[#165DFF]" />
          <h3 className="text-base font-bold text-[#0B1B3A]">{tr('现场扫码核销', 'Gate Check-in')}</h3>
          <span className="text-[11px] text-[#98A6BE]">{tr('扫描观众数字身份码后自动提交，也可手动输入凭证码', 'Scan a maker pass code, or type it manually')}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            autoFocus
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="DOAI-PASS-MAKER-8921-VERIFIED"
            className="flex-1 px-4 py-3 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm font-mono focus:outline-none focus:border-[#165DFF]"
          />
          <select
            value={gate}
            onChange={e => setGate(e.target.value)}
            className="px-4 py-3 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm"
          >
            <option value="主入口">主入口闸机</option>
            <option value="乐动虹桥">乐动虹桥分会场</option>
            <option value="德必大虹桥">德必大虹桥分会场</option>
          </select>
          <button
            type="submit"
            disabled={submitting || !code.trim()}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] disabled:opacity-40 rounded-xl transition-colors shrink-0"
          >
            {submitting ? tr('核销中…', 'Checking…') : tr('核销签到', 'Check In')}
          </button>
        </div>

        {feedback && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              feedback.kind === 'ok'
                ? 'bg-[#00C48C]/10 text-[#00876A]'
                : feedback.kind === 'dup'
                  ? 'bg-[#FF8A1F]/10 text-[#C06200]'
                  : 'bg-red-500/10 text-red-600'
            }`}
          >
            {feedback.kind === 'ok' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            {feedback.text}
          </div>
        )}
      </form>

      {/* 核销记录 */}
      <div className="doa-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8EAED] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0B1B3A]">{tr('核销记录', 'Records')}（{records.length}）</h3>
          <button onClick={loadRecords} className="text-xs text-[#165DFF] hover:underline">
            刷新
          </button>
        </div>
        {records.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#98A6BE]">{tr('暂无核销记录，扫描第一张数字身份码试试', 'No check-ins yet — scan the first pass to begin.')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-[#98A6BE] border-b border-[#E8EAED]">
                <th className="px-6 py-3 font-semibold">{tr('凭证码', 'Code')}</th>
                <th className="px-4 py-3 font-semibold">{tr('持票人', 'Holder')}</th>
                <th className="px-4 py-3 font-semibold">{tr('闸口', 'Gate')}</th>
                <th className="px-6 py-3 font-semibold">{tr('时间', 'Time')}</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.code + r.time} className="border-b border-[#F0F2F5] last:border-0">
                  <td className="px-6 py-3 font-mono text-[12px] text-[#0B1B3A]">{r.code}</td>
                  <td className="px-4 py-3 text-[#48597A]">{r.holder || '—'}</td>
                  <td className="px-4 py-3 text-[#48597A]">{r.gate}</td>
                  <td className="px-6 py-3 text-[#98A6BE] font-mono text-[12px]">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const AdminView: React.FC = () => {
  const {
    updateRegistrationStatus,
    cmsData,
    updateCMSData,
    recruitments,
    setRecruitments,
    forums,
    setNotifications,
    currentUser,
    setLoginModalOpen,
    quickSwitchRole,
    tr,
  } = useApp();

  // 报名数据以后端为准（前端提交实时入库）；后端不可用时回退本地演示数据
  const { registrations: localRegistrations } = useApp();
  const [backendRegistrations, setBackendRegistrations] = useState<Registration[] | null>(null);
  useEffect(() => {
    fetch('/api/registrations')
      .then(r => r.json())
      .then(d => {
        if (d?.ok && Array.isArray(d.registrations)) setBackendRegistrations(d.registrations);
      })
      .catch(() => {});
  }, []);
  const registrations = backendRegistrations ?? localRegistrations;

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'checkin' | 'submissions' | 'square' | 'forums' | 'tickets' | 'cms' | 'broadcast'
  >('overview');

  // Submissions search & filter
  const [submissionFilter, setSubmissionFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected submission modal / detail
  const [selectedSub, setSelectedSub] = useState<Registration | null>(null);
  const [customFeedback, setCustomFeedback] = useState('');

  // CMS state form
  const [cmsMakers, setCmsMakers] = useState(cmsData.stats.makers);
  const [cmsFinalists, setCmsFinalists] = useState(cmsData.stats.finalistProjects);
  const [cmsPrize, setCmsPrize] = useState(cmsData.stats.prizePool);
  const [cmsJudges, setCmsJudges] = useState(cmsData.stats.judges);
  const [cmsAnnouncement, setCmsAnnouncement] = useState(cmsData.announcement);
  const [cmsSaved, setCmsSaved] = useState(false);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const filteredSubmissions = registrations.filter(sub => {
    if (submissionFilter !== 'all' && sub.status !== submissionFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = sub.projectName.toLowerCase().includes(q);
      const matchTeam = sub.teamName.toLowerCase().includes(q);
      const matchMakerId = sub.makerId.toLowerCase().includes(q);
      if (!matchName && !matchTeam && !matchMakerId) return false;
    }
    return true;
  });

  const handleUpdateStatus = (status: RegistrationStatus) => {
    if (!selectedSub) return;
    updateRegistrationStatus(selectedSub.id, status, customFeedback || undefined);
    setSelectedSub(null);
    setCustomFeedback('');
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMSData({
      stats: {
        makers: Number(cmsMakers),
        finalistProjects: Number(cmsFinalists),
        prizePool: cmsPrize,
        prizePoolEn: '¥200,000',
        judges: Number(cmsJudges),
      },
      announcement: cmsAnnouncement,
    });
    setCmsSaved(true);
    setTimeout(() => setCmsSaved(false), 2000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'system',
        title: broadcastTitle,
        titleEn: broadcastTitle,
        content: broadcastContent,
        contentEn: broadcastContent,
        time: '刚刚',
        read: false,
      },
      ...prev,
    ]);

    setBroadcastSuccess(true);
    setBroadcastTitle('');
    setBroadcastContent('');
    setTimeout(() => setBroadcastSuccess(false), 2500);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['MakerID,项目名称,所属赛道,战队名,当前状态,视频链接,文档链接,申报时间']
        .concat(
          registrations.map(
            r =>
              `${r.makerId},"${r.projectName}",${r.track},"${r.teamName}",${r.status},"${r.videoUrl}","${r.docUrl}",${r.submittedAt}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'DOAI_2026_Contest_Submissions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelistRecruitment = (id: string) => {
    if (confirm('确定下架此条招募信息吗？下架后将在前台广场隐藏。')) {
      setRecruitments(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="pt-24 pb-24 max-w-[1200px] mx-auto px-6 sm:px-8">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8EAED]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#165DFF]/10 text-[#165DFF]">
              DOAI OPERATIONS CONSOLE
            </span>
            <span className="text-xs text-[#888888]">MVP 最小运营后台 · 浅色效率版</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B1B3A] mt-1">组委会管理中枢</h1>
        </div>

        {/* Quick Nav / Role Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-semibold text-[#0B1B3A] bg-white border border-[#E8EAED] hover:bg-[#F7F8FA] rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{tr('导出报名数据 (CSV)', 'Export CSV')}</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold border-b border-[#E8EAED]">
        {[
          { id: 'overview', label: '数据大盘与漏斗', labelEn: 'Overview' },
          { id: 'checkin', label: '扫码核销', labelEn: 'Check-in' },
          { id: 'submissions', label: `报名评审审核 (${registrations.length})`, labelEn: `Submissions (${registrations.length})` },
          { id: 'square', label: `广场内容治理 (${recruitments.length})`, labelEn: `Community (${recruitments.length})` },
          { id: 'forums', label: `论坛场次管理 (${forums.length})`, labelEn: `Forums (${forums.length})` },
          { id: 'cms', label: 'CMS 首页配置', labelEn: 'CMS' },
          { id: 'broadcast', label: '全员站内信推送', labelEn: 'Broadcast' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              activeAdminTab === tab.id
                ? 'bg-[#165DFF] text-white shadow-xs'
                : 'bg-[#F7F8FA] text-[#666666] hover:text-[#0B1B3A] border border-[#E8EAED]'
            }`}
          >
            {tr(tab.label, tab.labelEn)}
          </button>
        ))}
      </div>

      {/* 0. 扫码核销（会议结论 2026-10-13：后台对活动扫码签到） */}
      {activeAdminTab === 'checkin' && <CheckinPanel />}

      {/* 1. Overview & Conversion Funnel */}
      {activeAdminTab === 'overview' && (
        <div className="pt-8 space-y-8">
          {/* Funnel Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#E8EAED] shadow-xs">
              <div className="text-xs text-[#888888]">累计页面浏览 (PV)</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0B1B3A] mt-2 break-words">12,480</div>
              <div className="text-[11px] text-[#00C48C] mt-1 font-medium">↑ 18.4% 较上周</div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E8EAED] shadow-xs">
              <div className="text-xs text-[#888888]">报名发起中 (草稿)</div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0B1B3A] mt-2 break-words">1,210</div>
              <div className="text-[11px] text-[#888888] mt-1">转化率 9.7%</div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E8EAED] shadow-xs">
              <div className="text-xs text-[#888888]">正式提交申报</div>
              <div className="text-3xl font-bold font-mono text-[#165DFF] mt-2">
                {registrations.length * 185 + 2}
              </div>
              <div className="text-[11px] text-[#165DFF] mt-1">机审通过率 98.2%</div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E8EAED] shadow-xs">
              <div className="text-xs text-[#888888]">最终入围决赛名单</div>
              <div className="text-3xl font-bold font-mono text-[#00C48C] mt-2">
                {cmsData.stats.finalistProjects}
              </div>
              <div className="text-[11px] text-[#00C48C] mt-1">30+ 席位正在公示</div>
            </div>
          </div>

          {/* Dual track distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#E8EAED]">
              <h3 className="text-sm font-bold text-[#0B1B3A] mb-4">申报赛道分布比例</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>产业赛道 (AI + Industry)</span>
                    <span className="font-mono font-semibold">58% (430个团队)</span>
                  </div>
                  <div className="w-full bg-[#F7F8FA] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#165DFF] h-full rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>自由赛道 (AI Creator)</span>
                    <span className="font-mono font-semibold">42% (312个团队)</span>
                  </div>
                  <div className="w-full bg-[#F7F8FA] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#00C48C] h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E8EAED]">
              <h3 className="text-sm font-bold text-[#0B1B3A] mb-2">安全与机审规则说明</h3>
              <ul className="text-xs text-[#666666] space-y-2 list-disc list-inside leading-relaxed">
                <li>机审自动执行：必填项校验、Demo 视频链接 HEAD 可达性测试、查重检测。</li>
                <li>人工评审节点：材料不齐可一键驳回要求「补充材料」，选手可在 3 日内重新提交。</li>
                <li>严格保密原则：后台项目详情禁止对外转发，所有审核操作留有数字审计日志。</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. Submissions Review Management */}
      {activeAdminTab === 'submissions' && (
        <div className="pt-8 space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              {[
                { id: 'all', label: '全部状态' },
                { id: 'submitted', label: '已提交待审' },
                { id: 'reviewing', label: '审核中' },
                { id: 'shortlisted', label: '已入围决赛' },
                { id: 'needs_info', label: '待补充材料' },
                { id: 'rejected', label: '已淘汰驳回' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSubmissionFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    submissionFilter === f.id
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#F7F8FA] text-[#666666] border border-[#E8EAED]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="搜索项目、团队或 Maker ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white rounded-2xl border border-[#E8EAED] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8FA] border-b border-[#E8EAED] text-[#666666]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Maker ID</th>
                    <th className="px-5 py-3 font-semibold">申报项目与赛道</th>
                    <th className="px-5 py-3 font-semibold">战队与队长</th>
                    <th className="px-5 py-3 font-semibold">作品链接</th>
                    <th className="px-5 py-3 font-semibold">当前状态</th>
                    <th className="px-5 py-3 font-semibold text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAED]">
                  {filteredSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-[#F7F8FA]/60 transition-colors">
                      <td className="px-5 py-4 font-mono font-semibold text-[#165DFF]">
                        {sub.makerId}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#0B1B3A] max-w-xs truncate">
                          {sub.projectName}
                        </div>
                        <div className="text-[11px] text-[#888888]">
                          {sub.track === 'industry' ? '产业赛道' : '自由赛道'} · {sub.submittedAt}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#0B1B3A]">{sub.teamName}</div>
                        <div className="text-[11px] text-[#888888]">
                          {sub.members[0]?.name} ({sub.members[0]?.phone})
                        </div>
                      </td>
                      <td className="px-5 py-4 space-y-1">
                        <a
                          href={sub.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#165DFF] hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-[140px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Demo 视频</span>
                        </a>
                        <a
                          href={sub.docUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00C48C] hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-[140px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>项目文档</span>
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            sub.status === 'shortlisted'
                              ? 'bg-[#00C48C]/10 text-[#00C48C]'
                              : sub.status === 'reviewing'
                              ? 'bg-[#165DFF]/10 text-[#165DFF]'
                              : sub.status === 'needs_info'
                              ? 'bg-[#FF7D00]/10 text-[#FF7D00]'
                              : sub.status === 'submitted'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-red-50 text-red-500'
                          }`}
                        >
                          {sub.status === 'shortlisted'
                            ? '已入围'
                            : sub.status === 'reviewing'
                            ? '审核中'
                            : sub.status === 'needs_info'
                            ? '待补材料'
                            : sub.status === 'submitted'
                            ? '已提交'
                            : '已淘汰'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setCustomFeedback(sub.reviewFeedback || '');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-[#165DFF] hover:bg-[#165DFF]/10 rounded-lg transition-colors"
                        >
                          审核评决
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-floating border border-[#E8EAED]">
            <h3 className="text-base font-bold text-[#0B1B3A] mb-1">
              评审裁决：{selectedSub.projectName}
            </h3>
            <div className="text-xs text-[#888888] mb-4">
              Maker ID: {selectedSub.makerId} · 战队: {selectedSub.teamName}
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-xl text-xs space-y-2 mb-4">
              <div>
                <strong>项目介绍：</strong>
                <p className="text-[#555555] mt-0.5">{selectedSub.projectSummary}</p>
              </div>
              <div className="flex gap-4">
                <a
                  href={selectedSub.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#165DFF] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>查看 Demo 视频</span>
                </a>
                <a
                  href={selectedSub.docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00C48C] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>查看白皮书文档</span>
                </a>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#0B1B3A] mb-1">
                评委反馈意见 / 补充材料要求说明
              </label>
              <textarea
                rows={3}
                value={customFeedback}
                onChange={e => setCustomFeedback(e.target.value)}
                placeholder="请输入反馈说明（选手端将在个人中心实时可见并同步站内信）..."
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#E8EAED]">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 text-xs font-semibold text-[#666666]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('rejected')}
                className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl"
              >
                淘汰驳回
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('needs_info')}
                className="px-4 py-2 text-xs font-semibold text-[#FF7D00] bg-[#FF7D00]/10 hover:bg-[#FF7D00]/20 rounded-xl"
              >
                要求补材料
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('shortlisted')}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#00C48C] hover:bg-[#00B07E] rounded-xl"
              >
                初审通过 · 入围决赛
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Square Content Governance */}
      {activeAdminTab === 'square' && (
        <div className="pt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0B1B3A]">组队招募帖违规治理</h3>
            <span className="text-xs text-[#888888]">违规信息一键下架并通知发起人</span>
          </div>

          <div className="space-y-3">
            {recruitments.map(item => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-2xl border border-[#E8EAED] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#0B1B3A]">{item.title}</div>
                  <div className="text-[11px] text-[#666666] mt-0.5 line-clamp-1">
                    {item.summary}
                  </div>
                  <div className="text-[11px] text-[#888888] mt-1">
                    队长: {item.leader.name} · 发布于 {item.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#00C48C] font-semibold">状态: 正常展示</span>
                  <button
                    onClick={() => handleDelistRecruitment(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    违规下架
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Forums Management */}
      {activeAdminTab === 'forums' && (
        <div className="pt-8 space-y-6">
          <h3 className="text-base font-bold text-[#0B1B3A]">分论坛排期与席位监控</h3>

          <div className="space-y-4">
            {forums.map(f => (
              <div
                key={f.id}
                className="p-5 bg-white rounded-2xl border border-[#E8EAED] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-[#0B1B3A] text-sm">{f.title}</div>
                  <div className="text-[#666666] mt-1">{f.venue} · {f.date} {f.time}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[#888888]">名额预约情况：</span>
                    <span className="font-mono font-bold text-[#165DFF]">{f.bookedCount}</span> / {f.capacity}
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold text-[#00C48C] bg-[#00C48C]/10 rounded-full">
                    正常开放
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CMS Live Settings */}
      {activeAdminTab === 'cms' && (
        <div className="pt-8 max-w-xl space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8EAED] shadow-xs">
            <h3 className="text-base font-bold text-[#0B1B3A] pb-3 border-b border-[#E8EAED] mb-4">
              首页关键指标与公告即时配置
            </h3>

            {cmsSaved && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>首页数据已成功更新并生效！</span>
              </div>
            )}

            <form onSubmit={handleSaveCMS} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0B1B3A] mb-1">报名创客数</label>
                  <input
                    type="number"
                    value={cmsMakers}
                    onChange={e => setCmsMakers(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0B1B3A] mb-1">决赛项目数</label>
                  <input
                    type="number"
                    value={cmsFinalists}
                    onChange={e => setCmsFinalists(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0B1B3A] mb-1">奖金池文案</label>
                  <input
                    type="text"
                    value={cmsPrize}
                    onChange={e => setCmsPrize(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0B1B3A] mb-1">专家评委数</label>
                  <input
                    type="number"
                    value={cmsJudges}
                    onChange={e => setCmsJudges(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1B3A] mb-1">全站滚动公告</label>
                <textarea
                  rows={2}
                  value={cmsAnnouncement}
                  onChange={e => setCmsAnnouncement(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-xl transition-all"
              >
                保存并即时发布到前台
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Broadcast System Notification */}
      {activeAdminTab === 'broadcast' && (
        <div className="pt-8 max-w-xl space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8EAED] shadow-xs">
            <h3 className="text-base font-bold text-[#0B1B3A] pb-3 border-b border-[#E8EAED] mb-4">
              向全站注册创客推送站内信
            </h3>

            {broadcastSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>站内信已下发，所有用户右上角消息铃铛将显示红点提醒！</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1B3A] mb-1">通知标题</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  placeholder="例如: 【重要】关于现场路演硬件布展规范的通知"
                  className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1B3A] mb-1">通知详情内容</label>
                <textarea
                  rows={4}
                  required
                  value={broadcastContent}
                  onChange={e => setBroadcastContent(e.target.value)}
                  placeholder="请输入通知详细文本..."
                  className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>立即群发站内信</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
