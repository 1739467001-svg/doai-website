import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Smartphone, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, setCurrentUser, openPolicy, lang } = useApp();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState<'input' | 'complete_profile'>('input');
  const [errorMsg, setErrorMsg] = useState('');

  // Profile completion fields for first-time login
  const [nickname, setNickname] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState<string[]>(['Agent架构', 'PyTorch']);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  if (!loginModalOpen) return null;

  const handleSendCode = () => {
    if (!phone || phone.length < 11) {
      setErrorMsg(lang === 'zh' ? '请输入有效的 11 位手机号码' : 'Please enter a valid 11-digit mobile number');
      return;
    }
    setErrorMsg('');
    setCountdown(60);
    // Autofill demo code
    setCode('8826');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      setErrorMsg(lang === 'zh' ? '请输入有效的手机号' : 'Invalid mobile number');
      return;
    }
    if (!code || code.length < 4) {
      setErrorMsg(lang === 'zh' ? '请输入短信验证码' : 'Enter 4-digit SMS verification code');
      return;
    }
    if (!agreed) {
      setErrorMsg(lang === 'zh' ? '请先阅读并勾选同意用户协议与隐私政策' : 'Please accept the Terms & Privacy Policy');
      return;
    }

    // Check if demo user exists or needs profile completion
    if (phone.endsWith('8821')) {
      // Direct login as Alex Chen
      loginAsMockUser(phone, '李晨 Alex Chen', '深圳 Shenzhen', ['Agent架构', 'PyTorch', 'LangChain']);
    } else {
      // First-time login -> move to profile completion
      setStep('complete_profile');
    }
  };

  const loginAsMockUser = (userPhone: string, userName: string, userCity: string, userSkills: string[]) => {
    setCurrentUser({
      id: `user-${Date.now()}`,
      phone: userPhone,
      name: userName || 'DOAI Maker',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      city: userCity || '北京',
      bio: '新加入 DOAI 2026 AI 创客网络，期待在组队广场连接同行者。',
      skills: userSkills.length > 0 ? userSkills : ['AI应用', 'Python'],
      role: 'maker',
      atomclubBound: true,
      isPublicInSquare: true,
      allowCardExchange: true,
      notifySettings: { system: true, review: true, team: true, forum: true, live: true },
    });
    setLoginModalOpen(false);
    resetForm();
  };

  const handleFinishProfile = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsMockUser(phone, nickname || '新创客', city || '北京', skills);
  };

  const resetForm = () => {
    setPhone('');
    setCode('');
    setAgreed(false);
    setStep('input');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-floating border border-[#E8EAED]">
        <button
          onClick={() => {
            setLoginModalOpen(false);
            resetForm();
          }}
          className="absolute top-6 right-6 p-2 text-[#888888] hover:text-[#111111] hover:bg-[#F7F8FA] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'input' ? (
          <div>
            <div className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#165DFF]/10 text-[#165DFF] mb-3">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#111111]">
                {lang === 'zh' ? '登录 DOAI 创客平台' : 'Sign in to DOAI Platform'}
              </h3>
              <p className="text-xs text-[#666666] mt-1.5 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C48C]" />
                <span>
                  {lang === 'zh'
                    ? '手机号验证码极速登录 · 与 atomclub.cn 账号统一互通'
                    : 'Instant SMS sign-in · Synced with atomclub.cn account'}
                </span>
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs flex items-center gap-2">
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  {lang === 'zh' ? '手机号码' : 'Mobile Phone'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#888888]">
                    +86
                  </span>
                  <input
                    type="tel"
                    maxLength={11}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="请输入11位中国大陆手机号"
                    className="w-full pl-14 pr-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] focus:border-[#165DFF] focus:bg-white rounded-xl text-sm transition-all focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  {lang === 'zh' ? '短信验证码' : 'SMS Code'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="请输入验证码 (示例: 8826)"
                    className="flex-1 px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] focus:border-[#165DFF] focus:bg-white rounded-xl text-sm transition-all focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={handleSendCode}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                      countdown > 0
                        ? 'bg-neutral-100 text-neutral-400'
                        : 'bg-[#F7F8FA] hover:bg-[#EEF0F4] text-[#165DFF] border border-[#E8EAED]'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s` : lang === 'zh' ? '获取验证码' : 'Get Code'}
                  </button>
                </div>
              </div>

              {/* Fast autofill quick testing helper */}
              <div className="flex items-center justify-between text-[11px] text-[#888888] pt-1">
                <span>快速体验演示号：</span>
                <button
                  type="button"
                  onClick={() => {
                    setPhone('13800138821');
                    setCode('8826');
                    setAgreed(true);
                  }}
                  className="text-[#165DFF] hover:underline"
                >
                  一键填入 (已报名创客)
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-[#666666] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-[#E8EAED] text-[#165DFF] focus:ring-0"
                  />
                  <span>
                    {lang === 'zh' ? '我已阅读并同意 ' : 'I have read and agreed to '}
                    <button
                      type="button"
                      onClick={() => openPolicy('terms')}
                      className="text-[#165DFF] hover:underline"
                    >
                      《用户协议》
                    </button>
                    {lang === 'zh' ? ' 与 ' : ' & '}
                    <button
                      type="button"
                      onClick={() => openPolicy('privacy')}
                      className="text-[#165DFF] hover:underline"
                    >
                      《隐私政策》
                    </button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreed}
                className={`w-full py-3 mt-4 text-sm font-semibold rounded-full transition-all shadow-sm ${
                  agreed
                    ? 'bg-[#165DFF] text-white hover:bg-[#1453E6]'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {lang === 'zh' ? '立即登录 / 自动建号' : 'Sign In / Create ID'}
              </button>
            </form>
          </div>
        ) : (
          /* Profile Completion Step */
          <div className="space-y-4">
            <div className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#00C48C]/10 text-[#00C48C] mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#111111]">
                {lang === 'zh' ? '首次登录：完善创客资料' : 'Complete Creator Profile'}
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                {lang === 'zh'
                  ? '资料将用于生成您的 DOAI Passport 与组队人才卡'
                  : 'Used for your DOAI Passport & Team Square Card'}
              </p>
            </div>

            <form onSubmit={handleFinishProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  创客昵称
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="例如: 林晨 Alan"
                  className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  常驻城市
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="例如: 深圳 / 北京 / 上海"
                  className="w-full px-4 py-2.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl text-sm focus:outline-none focus:border-[#165DFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">
                  技术与能力标签 (组队匹配依据)
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Agent架构', '大模型微调', 'PyTorch', '全栈前端', '硬件嵌入式', '产品商业化'].map(tag => {
                    const selected = skills.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          setSkills(prev =>
                            selected ? prev.filter(s => s !== tag) : [...prev, tag]
                          );
                        }}
                        className={`px-3 py-1 text-xs rounded-lg transition-all ${
                          selected
                            ? 'bg-[#165DFF] text-white font-medium'
                            : 'bg-[#F7F8FA] text-[#666666] border border-[#E8EAED]'
                        }`}
                      >
                        {tag} {selected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 text-sm font-semibold rounded-full bg-[#165DFF] text-white hover:bg-[#1453E6] transition-all"
              >
                完成并进入 DOAI 平台
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
