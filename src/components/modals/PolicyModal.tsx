import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, FileText, Lock, Scale } from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { policyModalOpen, setPolicyModalOpen, policyType, lang } = useApp();

  if (!policyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-floating border border-[#E8EAED] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8EAED]">
          <div className="flex items-center gap-2.5">
            {policyType === 'terms' && <FileText className="w-5 h-5 text-[#165DFF]" />}
            {policyType === 'privacy' && <Lock className="w-5 h-5 text-[#00C48C]" />}
            {policyType === 'rules' && <Scale className="w-5 h-5 text-[#FF7D00]" />}
            <h3 className="text-lg font-bold text-[#111111]">
              {policyType === 'terms'
                ? lang === 'zh'
                  ? 'DOAI 平台用户服务协议'
                  : 'DOAI Platform Terms of Service'
                : policyType === 'privacy'
                ? lang === 'zh'
                  ? 'DOAI 平台个人信息保护与隐私政策'
                  : 'DOAI Privacy & Data Protection Policy'
                : lang === 'zh'
                ? 'DOAI 2026 赛事合规、知识产权与奖金兑付公约'
                : 'DOAI 2026 Contest Compliance & IP Policy'}
            </h3>
          </div>
          <button
            onClick={() => setPolicyModalOpen(false)}
            className="p-1.5 text-[#888888] hover:text-[#111111] hover:bg-[#F7F8FA] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-6 pr-2 text-xs leading-relaxed text-[#555555] space-y-4">
          {policyType === 'terms' && (
            <>
              <p className="font-semibold text-neutral-800">一、服务范围与账号统一</p>
              <p>
                DOAI 官网为 2026 AI 创客大会及创客生态平台，依托 atomclub.cn 统一账号体系构建。用户通过手机号验证码注册并登录，即可使用赛事申报、组队广场、分论坛预约、多路直播及数字身份（DOAI Passport）全站服务。
              </p>
              <p className="font-semibold text-neutral-800">二、全流程免费原则与防诈声明</p>
              <p className="p-3 bg-[#F7F8FA] rounded-xl border border-[#E8EAED] text-neutral-700">
                本届大会及创客大赛全程不收取任何报名费、评审费、会务费或展位费。组委会从未授权任何个人或第三方中介代办“保进入围”、“VIP推荐”名额，凡以此索取财物者均属诈骗行为。
              </p>
              <p className="font-semibold text-neutral-800">三、用户行为与内容规范</p>
              <p>
                用户在组队广场发布的招募信息、弹幕及个人资料，须严格遵守国家相关法律法规。禁止发布涉及恶意侵权、虚假宣传、骚扰或商业广告等违规内容。组委会有权下架违规内容并封禁违规账号。
              </p>
            </>
          )}

          {policyType === 'privacy' && (
            <>
              <p className="font-semibold text-neutral-800">一、个人信息收集与最小必要原则</p>
              <p>
                为向您提供赛事报名、组队匹配及线下通行电子凭证，DOAI 平台将在您授权的前提下收集必要的手机号码、昵称、常驻城市及技能特长标签。手机号等敏感信息在数据库中采用加密脱敏存储。
              </p>
              <p className="font-semibold text-neutral-800">二、广场公开展示与名片交换权限</p>
              <p>
                您可随时在「个人中心 - 隐私设置」中自主开启或关闭「在组队广场公开展示我」以及「允许名片交换」。关闭后，您的人才卡片将对外部创客即时隐藏。
              </p>
              <p className="font-semibold text-neutral-800">三、账号注销与数据删除</p>
              <p>
                用户可在个人中心申请注销 DOAI 平台账户，注销后 DOAI 侧留存的个人资料与报名历史将依法彻底物理删除，不影响您的 atomclub 主体账号。
              </p>
            </>
          )}

          {policyType === 'rules' && (
            <>
              <div className="p-3 bg-[#165DFF]/5 rounded-xl border border-[#165DFF]/20 text-[#165DFF]">
                <p className="font-semibold">核心知识产权保障：</p>
                <p className="mt-1">
                  所有参赛团队申报项目的技术方案、源代码、专利与全部知识产权均 100% 归参赛团队所有。组委会及评审专家仅在评审工作必要范围内调阅，未经团队书面授权，绝不用于任何对外公开传播或商业开发。
                </p>
              </div>
              <p className="font-semibold text-neutral-800">二、奖金合规与个人所得税代扣代缴</p>
              <p>
                DOAI 2026 大奖及双赛道奖金池合计人民币 20 万元整。所有公示奖金金额均为税前金额，组委会将依据《中华人民共和国个人所得税法》依法按“偶然所得”税目代扣代缴 20% 个人所得税。
              </p>
              <p className="font-semibold text-neutral-800">三、奖金发放周期与信息公示</p>
              <p>
                决赛获奖名单将在现场及官网公示 3 个工作日。公示期满无异议后，组委会在 30 个工作日内将税后奖金直接拨付至获奖团队负责人合法指定的银行账户中。
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E8EAED] flex justify-end">
          <button
            onClick={() => setPolicyModalOpen(false)}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#165DFF] hover:bg-[#1453E6] rounded-full transition-colors"
          >
            {lang === 'zh' ? '已知悉并关闭' : 'Acknowledged & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
