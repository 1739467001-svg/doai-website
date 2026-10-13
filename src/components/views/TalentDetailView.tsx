import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DetailShell, NotFound } from '../detail/DetailShell';
import {
  MapPin, Heart, Clock, BadgeCheck, MessageSquare, UserPlus, Check, Briefcase,
} from 'lucide-react';

export const TalentDetailView: React.FC<{ id?: string }> = ({ id }) => {
  const { talents, currentUser, setLoginModalOpen, setActiveRoute, toggleLikeTalent, addExchangedCard } = useApp();
  const [exchanged, setExchanged] = useState(false);

  const talent = talents.find(t => t.id === id);
  if (!talent) return <NotFound what="该人才档案" backRoute="square/talent" backLabel="返回人才市场" />;

  const alreadyHave = currentUser?.id === talent.id;

  const handleExchange = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    if (exchanged) return;
    addExchangedCard({
      id: `card-${Date.now()}`,
      name: talent.name,
      avatar: talent.avatar,
      phone: `${talent.city.split(' ')[0]}`,
      org: talent.roleIntent,
      skills: talent.skills.slice(0, 3),
      city: talent.city,
      exchangedAt: new Date().toISOString().slice(0, 10),
    });
    setExchanged(true);
  };

  return (
    <DetailShell
      backRoute="square/talent"
      backLabel="返回人才市场"
      eyebrow={talent.roleIntent}
      title={talent.name}
      subtitle={talent.bio}
      meta={[
        { label: '所在城市', value: talent.city },
        { label: '可投入时间', value: talent.availableTime },
        { label: '意向方向', value: talent.roleIntent },
        { label: '获赞', value: `${talent.likes}` },
      ]}
      actions={
        <>
          <button
            type="button"
            onClick={() => toggleLikeTalent(talent.id)}
            aria-pressed={talent.hasLiked}
            className="doa-btn doa-btn-ghost"
          >
            <Heart className={`w-4 h-4 ${talent.hasLiked ? 'fill-[#FF4D4F] text-[#FF4D4F]' : ''}`} />
            {talent.hasLiked ? '已点赞' : '点赞'} · {talent.likes}
          </button>
          <button
            type="button"
            onClick={handleExchange}
            disabled={exchanged || alreadyHave}
            className="doa-btn doa-btn-primary"
          >
            {alreadyHave ? (
              <>这是你自己</>
            ) : exchanged ? (
              <><Check className="w-4 h-4" /> 已交换名片</>
            ) : (
              <><UserPlus className="w-4 h-4" /> 交换数字名片</>
            )}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="doa-card p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={talent.avatar}
                alt={talent.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shrink-0 ring-4 ring-[#E4EFFF]"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-extrabold text-[#0B1B3A]">{talent.name}</h2>
                  {talent.atomclubVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#165DFF] bg-[#E4EFFF] px-2 py-0.5 rounded-full">
                      <BadgeCheck className="w-3.5 h-3.5" /> atomclub 已认证
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#48597A] leading-[1.8]">{talent.bio}</p>
              </div>
            </div>
          </section>

          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-4">技能标签</h2>
            <div className="flex flex-wrap gap-2">
              {talent.skills.map((s, i) => (
                <span key={i} className="doa-chip">{s}</span>
              ))}
            </div>
          </section>

          <section className="doa-card p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-5">合作意向</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Briefcase, label: '意向角色', value: talent.roleIntent },
                { icon: Clock, label: '可投入', value: talent.availableTime },
                { icon: MapPin, label: '所在城市', value: talent.city },
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-[#F7FAFF] border border-[#E3ECFA]">
                    <Icon className="w-4 h-4 text-[#165DFF] mb-2" />
                    <div className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">{row.label}</div>
                    <div className="text-[13px] font-semibold text-[#1A2B4D]">{row.value}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="doa-panel p-6 sm:p-7">
            <h2 className="text-lg font-bold text-[#0B1B3A] mb-3">如何与她/他协作</h2>
            <ol className="space-y-3 text-[13px] text-[#48597A] leading-relaxed">
              {[
                '先交换数字名片，双方在 DOAI Passport 中建立连接。',
                '在组队广场发布或申请一个明确目标的项目，而不是泛泛而谈。',
                '通过平台内消息约定一次 30 分钟的语音，确认节奏与分工。',
                '达成合作后可在「我的 DOAI」中标记为队友，享受项目路演优先推荐。',
              ].map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#165DFF] text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="doa-card p-6">
            <h3 className="font-bold text-[#0B1B3A] text-sm mb-4">名片信息</h3>
            <dl className="space-y-3.5 text-[13px]">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">姓名</dt>
                <dd className="text-[#1A2B4D] font-medium">{talent.name}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">意向方向</dt>
                <dd className="text-[#1A2B4D] font-medium">{talent.roleIntent}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-[#98A6BE] font-semibold mb-1">所在城市</dt>
                <dd className="text-[#1A2B4D] font-medium">{talent.city}</dd>
              </div>
            </dl>
            <button type="button" onClick={handleExchange} disabled={exchanged || alreadyHave} className="doa-btn doa-btn-secondary w-full mt-5">
              <UserPlus className="w-4 h-4" /> {exchanged ? '已交换' : '交换数字名片'}
            </button>
          </section>

          {exchanged && (
            <section className="doa-panel p-6 border-[#A9CCFF] bg-[#F2F7FF]">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-[#00B487]" />
                <h3 className="font-bold text-[#0B1B3A] text-sm">名片已存入通讯录</h3>
              </div>
              <p className="text-[13px] text-[#48597A] mb-4">可在「我的 DOAI · 数字名片」中查看与管理。</p>
              <button type="button" onClick={() => setActiveRoute('dashboard')} className="doa-btn doa-btn-ghost w-full">
                前往我的 DOAI
              </button>
            </section>
          )}

          <section className="doa-card p-6">
            <h3 className="font-bold text-[#0B1B3A] text-sm mb-3">隐私说明</h3>
            <p className="text-[13px] text-[#6B7C9B] leading-relaxed">
              联系方式仅在双方同意交换名片后可见。大会尊重创客隐私，不向任何第三方出售个人信息。
            </p>
          </section>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-bold text-[#0B1B3A] mb-5">相似人才</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {talents.filter(t => t.id !== talent.id).slice(0, 3).map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveRoute(`detail/talent/${t.id}`)}
              className="doa-card doa-card-hover p-5 text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={t.avatar} alt={t.name} referrerPolicy="no-referrer" className="w-11 h-11 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <div className="font-bold text-[#1A2B4D] text-sm truncate">{t.name}</div>
                  <div className="text-[12px] text-[#6B7C9B] truncate">{t.roleIntent}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-[#F2F7FF] text-[#165DFF] font-medium">{s}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>
    </DetailShell>
  );
};
