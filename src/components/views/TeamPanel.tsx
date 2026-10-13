/**
 * 战队管理面板（会议 2026-10-13 组队协作优化）：
 * - 队长可创建战队、移出队员（队长离开即解散）
 * - 组队申请需双方互相关注后才能发送（后端强校验）
 * - 成员上限 5 人
 * 数据全部来自简单后端（server.js :3001，JSON 持久化）。
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  UserMinus,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  UserPlus,
  HeartHandshake,
  Inbox,
  Send,
  Settings2,
} from 'lucide-react';
import { TrackType } from '../../types';

interface TeamMember {
  id: string;
  name: string;
  roleTitle: string;
  isLeader: boolean;
}

interface Team {
  id: string;
  name: string;
  track: TrackType;
  inviteCode: string;
  leaderId: string;
  createdAt: string;
  members: TeamMember[];
  mark?: string;
  desc?: string;
}

interface DirectoryUser {
  id: string;
  name: string;
  roleTitle: string;
}

interface TeamApplication {
  id: string;
  teamId: string;
  teamName: string;
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

const api = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const d = await res.json();
  if (!res.ok || !d.ok) throw new Error(d.message || `请求失败 (${res.status})`);
  return d as T;
};

export const TeamPanel: React.FC = () => {
  const { currentUser, setNotificationDrawerOpen } = useApp();
  const me = currentUser!;
  const isLeader = (t: Team | null) => !!t && t.leaderId === me.id;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // 创建战队表单
  const [creating, setCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTrack, setNewTeamTrack] = useState<TrackType>('creator');

  // 目录 / 关注 / 申请
  const [directory, setDirectory] = useState<DirectoryUser[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [mutual, setMutual] = useState<string[]>([]);
  const [received, setReceived] = useState<TeamApplication[]>([]);
  const [sent, setSent] = useState<TeamApplication[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2600);
  };

  const refresh = useCallback(async () => {
    if (!me) return;
    try {
      const [teamRes, followsRes, appsRes, usersRes] = await Promise.all([
        api<{ team: Team | null }>(`/api/teams/mine?userId=${me.id}`),
        api<{ following: string[]; mutual: string[] }>(`/api/follows?userId=${me.id}`),
        api<{ received: TeamApplication[]; sent: TeamApplication[] }>(`/api/team-applications?userId=${me.id}`),
        api<{ users: DirectoryUser[] }>('/api/users'),
      ]);
      setTeam(teamRes.team);
      setFollowing(followsRes.following);
      setMutual(followsRes.mutual);
      setReceived(appsRes.received);
      setSent(appsRes.sent);
      setDirectory(usersRes.users.filter((u: DirectoryUser) => u.id !== me.id));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '后端不可用');
    } finally {
      setLoading(false);
    }
  }, [me]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    try {
      setBusyId('create');
      await api('/api/teams', {
        method: 'POST',
        body: JSON.stringify({
          name: newTeamName.trim(),
          track: newTeamTrack,
          leaderId: me.id,
          leaderName: me.name,
        }),
      });
      setCreating(false);
      setNewTeamName('');
      flash('战队创建成功，可以邀请互相关注的创客加入了');
      refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : '创建失败');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!team) return;
    try {
      setBusyId(memberId);
      await api(`/api/teams/${team.id}/remove-member`, {
        method: 'POST',
        body: JSON.stringify({ memberId, byUserId: me.id }),
      });
      flash(`已将 ${memberName} 移出战队`);
      refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : '操作失败');
    } finally {
      setBusyId(null);
    }
  };

  /* ---- 队长编辑战队：改队名 / 简介 / 队伍标识（会议结论：改队名、改头像、可编辑） ---- */
  const TEAM_MARKS = ['⚡', '🚀', '🧠', '🛠️', '🎯', '🔥', '💎', '🤖'];
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMark, setEditMark] = useState('⚡');

  const startEdit = () => {
    if (!team) return;
    setEditName(team.name);
    setEditDesc(team.desc || '');
    setEditMark(team.mark || '⚡');
    setEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !editName.trim()) return;
    try {
      setBusyId('save-edit');
      await api(`/api/teams/${team.id}/update`, {
        method: 'POST',
        body: JSON.stringify({ byUserId: me.id, name: editName, desc: editDesc, mark: editMark }),
      });
      setEditing(false);
      flash('战队信息已更新');
      refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : '保存失败');
    } finally {
      setBusyId(null);
    }
  };

  const handleLeave = async () => {
    if (!team) return;
    const leader = isLeader(team);
    if (leader && !confirm('队长离开将解散战队并撤回待处理申请，确认解散？')) return;
    if (!leader && !confirm('确认退出战队？')) return;
    try {
      setBusyId('leave');
      await api(`/api/teams/${team.id}/leave`, {
        method: 'POST',
        body: JSON.stringify({ userId: me.id }),
      });
      flash(leader ? '战队已解散' : '已退出战队');
      refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : '操作失败');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFollow = async (target: DirectoryUser) => {
    const isFollowing = following.includes(target.id);
    try {
      setBusyId(target.id);
      if (isFollowing) {
        await api('/api/follows', {
          method: 'DELETE',
          body: JSON.stringify({ from: me.id, to: target.id }),
        });
        flash(`已取消关注 ${target.name}`);
      } else {
        await api('/api/follows', {
          method: 'POST',
          body: JSON.stringify({ from: me.id, to: target.id }),
        });
        flash(following.includes(target.id) || mutual.includes(target.id)
          ? `与 ${target.name} 互相关注，可以发送组队申请了`
          : `已关注 ${target.name}，对方回关后即可发送组队申请`);
      }
      refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : '操作失败');
    } finally {
      setBusyId(null);
    }
  };

  const handleSendApplication = async (target: DirectoryUser) => {
    if (!team) return;
    try {
      setBusyId(target.id);
      await api('/api/team-applications', {
        method: 'POST',
        body: JSON.stringify({
          fromUserId: me.id,
          fromName: me.name,
          toUserId: target.id,
          toName: target.name,
          teamId: team.id,
          message: `${me.name} 邀请你加入战队「${team.name}」`,
        }),
      });
      flash(`已向 ${target.name} 发送组队申请`);
      refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : '发送失败');
    } finally {
      setBusyId(null);
    }
  };

  const handleApplication = async (appId: string, action: 'accept' | 'decline') => {
    try {
      setBusyId(appId);
      await api(`/api/team-applications/${appId}/${action}`, {
        method: 'POST',
        body: JSON.stringify({ byUserId: me.id }),
      });
      flash(action === 'accept' ? '已同意入队，成员已更新' : '已拒绝申请');
      refresh();
    } catch (err) {
      flash(err instanceof Error ? err.message : '操作失败');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 flex items-center justify-center gap-2 text-sm text-[#888888]">
        <Loader2 className="w-4 h-4 animate-spin" />
        正在同步战队数据…
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-8 doa-panel p-8 text-center text-sm text-[#6B7C9B]">
        战队服务暂不可用：{error}
        <div className="text-[11px] text-[#98A6BE] mt-1">请确认后端已启动（npm run server）</div>
      </div>
    );
  }

  return (
    <div className="pt-8 space-y-6">
      {notice && (
        <div className="p-3 rounded-xl bg-[#00C48C]/10 text-[#00876A] text-xs font-medium">{notice}</div>
      )}

      {/* ---- 没有战队：创建 ---- */}
      {!team ? (
        <div className="doa-card p-8 space-y-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#165DFF]" />
            <h3 className="text-lg font-bold text-[#0B1B3A]">创建我的战队</h3>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">
            还没有战队。创建后你将成为队长：可以邀请成员、移出队员；队员上限 5 人。
          </p>
          {creating ? (
            <form onSubmit={handleCreateTeam} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                    战队名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={newTeamName}
                    onChange={e => setNewTeamName(e.target.value)}
                    placeholder="例如: Synapse Core"
                    className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">参赛赛道</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['creator', 'industry'] as TrackType[]).map(tr => (
                      <button
                        key={tr}
                        type="button"
                        onClick={() => setNewTeamTrack(tr)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          newTeamTrack === tr
                            ? 'border-[#165DFF] bg-[#165DFF]/5 text-[#165DFF]'
                            : 'border-[#E8EAED] bg-[#F7F8FA] text-[#666666]'
                        }`}
                      >
                        {tr === 'creator' ? '自由赛道' : '产业赛道'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={busyId === 'create'}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full disabled:opacity-50"
                >
                  创建战队
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-6 py-2.5 text-xs font-semibold text-[#666666]"
                >
                  取消
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="px-6 py-3 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              创建战队
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ---- 战队信息 ---- */}
          <div className="doa-card p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8EAED]">
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-[#0B1B3A] flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-[#165DFF]/10 flex items-center justify-center text-lg shrink-0">
                    {team.mark || '⚡'}
                  </span>
                  <span className="truncate">战队管理：{team.name}</span>
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  {team.track === 'creator' ? '自由赛道' : '产业赛道'} · 成员 {team.members.length}/5 ·
                  组队申请需双方互相关注
                </p>
                {team.desc && (
                  <p className="text-xs text-[#98A6BE] mt-1">{team.desc}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isLeader(team) && !editing && (
                  <button
                    onClick={startEdit}
                    className="px-3 py-1.5 text-xs font-semibold text-[#165DFF] hover:bg-[#165DFF]/10 border border-[#165DFF]/30 rounded-full transition-colors flex items-center gap-1"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    编辑战队
                  </button>
                )}
                <span className="text-xs text-[#888888]">邀请码：</span>
                <span className="px-3 py-1 bg-[#165DFF]/10 text-[#165DFF] font-mono font-bold text-xs rounded-lg">
                  {team.inviteCode}
                </span>
              </div>
            </div>

            {/* 编辑战队表单（队长） */}
            {editing && (
              <form onSubmit={handleSaveEdit} className="p-5 doa-panel space-y-4">
                <div className="text-xs font-bold text-[#0B1B3A]">编辑战队信息</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                      战队名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      maxLength={24}
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                      队伍标识（头像）
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TEAM_MARKS.map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setEditMark(m)}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${
                            editMark === m
                              ? 'border-[#165DFF] bg-[#165DFF]/10 scale-110'
                              : 'border-[#E8EAED] bg-white hover:border-[#A9CCFF]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1B3A] mb-1.5">
                    战队简介 <span className="text-[#98A6BE] font-normal">（展示在名片与邀请中，120 字内）</span>
                  </label>
                  <textarea
                    rows={2}
                    maxLength={120}
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    placeholder="一句话介绍你们的战队方向与目标…"
                    className="w-full px-4 py-2.5 bg-white border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={busyId === 'save-edit'}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full disabled:opacity-50"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-2.5 text-xs font-semibold text-[#666666]"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}

            {/* 成员列表 */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#0B1B3A]">现有成员名单</div>
              {team.members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 doa-panel text-xs">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-[#0B1B3A]">{member.name}</span>
                    <span className="px-2.5 py-0.5 bg-white border border-[#E8EAED] rounded-full text-[11px] text-[#555555]">
                      {member.roleTitle}
                    </span>
                    {member.isLeader ? (
                      <span className="text-[10px] font-bold text-[#165DFF] bg-[#165DFF]/10 px-2 py-0.5 rounded-full">
                        战队队长
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#98A6BE]">队员</span>
                    )}
                  </div>
                  {isLeader(team) && !member.isLeader && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      disabled={busyId === member.id}
                      className="flex items-center gap-1 text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      移出
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E8EAED]">
              <span className="text-[11px] text-[#98A6BE]">
                {isLeader(team) ? '队长离开将解散战队' : '退出后可加入其他战队'}
              </span>
              <button
                onClick={handleLeave}
                disabled={busyId === 'leave'}
                className="px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-full transition-colors disabled:opacity-40"
              >
                {isLeader(team) ? '解散战队' : '退出战队'}
              </button>
            </div>
          </div>

          {/* ---- 收到的组队申请（我是被邀请人，或队长代审） ---- */}
          {received.length > 0 && (
            <div className="doa-card p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-[#FF8A1F]" />
                <h3 className="text-base font-bold text-[#0B1B3A]">收到的组队申请（{received.length}）</h3>
              </div>
              {received.map(app_ => (
                <div key={app_.id} className="p-4 doa-panel text-xs space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-[#0B1B3A]">{app_.fromName}</span>
                      <span className="text-[#888888]"> 邀请你加入 </span>
                      <span className="font-bold text-[#165DFF]">{app_.teamName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApplication(app_.id, 'accept')}
                        disabled={busyId === app_.id}
                        className="px-3 py-1.5 font-semibold text-white bg-[#00C48C] hover:bg-[#009B71] rounded-full disabled:opacity-40 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> 同意入队
                      </button>
                      <button
                        onClick={() => handleApplication(app_.id, 'decline')}
                        disabled={busyId === app_.id}
                        className="px-3 py-1.5 font-semibold text-[#666666] hover:text-red-500 border border-[#E8EAED] rounded-full disabled:opacity-40 flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> 拒绝
                      </button>
                    </div>
                  </div>
                  {app_.message && <div className="text-[#666666]">“{app_.message}”</div>}
                </div>
              ))}
            </div>
          )}

          {/* ---- 创客目录：关注 + 邀请（互相关注才能发申请） ---- */}
          <div className="doa-card p-8 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-[#165DFF]" />
                <h3 className="text-base font-bold text-[#0B1B3A]">邀请创客加入战队</h3>
              </div>
              <span className="text-[11px] text-[#98A6BE]">
                <HeartHandshake className="w-3 h-3 inline mr-1" />
                互相关注后才能发送组队申请
              </span>
            </div>

            <div className="space-y-2">
              {directory.map(user => {
                const iFollow = following.includes(user.id);
                const weAreMutual = mutual.includes(user.id);
                const inMyTeam = team.members.some(m => m.id === user.id);
                const pendingApp = sent.find(a => a.toUserId === user.id && a.status === 'pending');
                const canInvite = isLeader(team) && weAreMutual && !inMyTeam && !pendingApp && team.members.length < 5;
                return (
                  <div key={user.id} className="flex items-center justify-between p-3.5 doa-panel text-xs gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0B1B3A] truncate">{user.name}</span>
                        {inMyTeam && (
                          <span className="text-[10px] font-bold text-[#00C48C] bg-[#00C48C]/10 px-2 py-0.5 rounded-full shrink-0">
                            队内成员
                          </span>
                        )}
                        {weAreMutual && !inMyTeam && (
                          <span className="text-[10px] font-bold text-[#165DFF] bg-[#165DFF]/10 px-2 py-0.5 rounded-full shrink-0">
                            互相关注
                          </span>
                        )}
                      </div>
                      <div className="text-[#888888] mt-0.5 truncate">{user.roleTitle}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleFollow(user)}
                        disabled={busyId === user.id || inMyTeam}
                        className={`px-3 py-1.5 rounded-full font-semibold border transition-colors disabled:opacity-40 ${
                          iFollow
                            ? 'text-[#666666] border-[#E8EAED] hover:text-red-500 hover:border-red-200'
                            : 'text-[#165DFF] border-[#165DFF]/40 hover:bg-[#165DFF]/5'
                        }`}
                      >
                        {iFollow ? '取消关注' : '关注'}
                      </button>
                      {pendingApp ? (
                        <span className="px-3 py-1.5 rounded-full font-semibold bg-[#FF8A1F]/10 text-[#C06200] flex items-center gap-1">
                          <Send className="w-3 h-3" /> 待对方处理
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendApplication(user)}
                          disabled={!canInvite || busyId === user.id}
                          title={
                            !isLeader(team)
                              ? '只有队长可以发送组队申请'
                              : !weAreMutual
                                ? '需要双方互相关注后才能发送'
                                : inMyTeam
                                  ? '已在队内'
                                  : undefined
                          }
                          className="px-3 py-1.5 rounded-full font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> 邀请入队
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---- 我发出的申请 ---- */}
          {sent.length > 0 && (
            <div className="doa-card p-8 space-y-3">
              <h3 className="text-base font-bold text-[#0B1B3A]">我发出的组队申请（{sent.length}）</h3>
              {sent.map(app_ => (
                <div key={app_.id} className="flex items-center justify-between p-3.5 doa-panel text-xs">
                  <span>
                    <span className="font-bold text-[#0B1B3A]">{app_.toName}</span>
                    <span className="text-[#888888]"> · {app_.teamName}</span>
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full font-semibold ${
                      app_.status === 'accepted'
                        ? 'bg-[#00C48C]/10 text-[#00876A]'
                        : app_.status === 'declined'
                          ? 'bg-red-50 text-red-500'
                          : 'bg-[#FF8A1F]/10 text-[#C06200]'
                    }`}
                  >
                    {app_.status === 'accepted' ? '已同意' : app_.status === 'declined' ? '已拒绝' : '待处理'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 收到的申请提醒入口 */}
      {received.length > 0 && (
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="text-xs font-semibold text-[#165DFF] hover:underline flex items-center gap-1"
        >
          同步查看站内通知 <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
