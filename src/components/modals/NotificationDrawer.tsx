import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, Award, Users, Calendar, Radio } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    setActiveRoute,
    lang,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  if (!notificationDrawerOpen) return null;

  const filteredNotifications = notifications.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <Award className="w-4 h-4 text-[#165DFF]" />;
      case 'team':
        return <Users className="w-4 h-4 text-[#00C48C]" />;
      case 'forum':
        return <Calendar className="w-4 h-4 text-[#FF7D00]" />;
      case 'live':
        return <Radio className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-6 border-b border-[#E8EAED] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#165DFF]" />
            <h3 className="text-base font-bold text-[#111111]">
              {lang === 'zh' ? '站内消息通知' : 'Notifications'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-[#165DFF] hover:underline flex items-center gap-1 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{lang === 'zh' ? '全部已读' : 'Mark all read'}</span>
            </button>
            <button
              onClick={() => setNotificationDrawerOpen(false)}
              className="p-1.5 text-[#888888] hover:text-[#111111] hover:bg-[#F7F8FA] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar (Segmented Controls) */}
        <div className="px-6 py-3 border-b border-[#E8EAED] bg-[#F7F8FA] flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: lang === 'zh' ? '全部' : 'All' },
            { id: 'review', label: lang === 'zh' ? '审核' : 'Review' },
            { id: 'team', label: lang === 'zh' ? '组队' : 'Team' },
            { id: 'forum', label: lang === 'zh' ? '论坛' : 'Forum' },
            { id: 'system', label: lang === 'zh' ? '系统' : 'System' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors font-medium ${
                filterType === tab.id
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#888888]">
              {lang === 'zh' ? '暂无此类消息通知' : 'No notifications found'}
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.link) {
                    setActiveRoute(notif.link);
                    setNotificationDrawerOpen(false);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  notif.read
                    ? 'bg-white border-[#E8EAED] hover:border-neutral-300'
                    : 'bg-[#165DFF]/5 border-[#165DFF]/20 hover:border-[#165DFF]/40'
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#165DFF]" />
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-lg bg-neutral-100">{getIcon(notif.type)}</div>
                  <h4 className="text-xs font-semibold text-[#111111] pr-4">
                    {lang === 'zh' ? notif.title : notif.titleEn}
                  </h4>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">
                  {lang === 'zh' ? notif.content : notif.contentEn}
                </p>
                <div className="mt-2 text-[11px] text-[#999999] flex items-center justify-between">
                  <span>{notif.time}</span>
                  {notif.link && (
                    <span className="text-[#165DFF] font-medium hover:underline">
                      {lang === 'zh' ? '查看详情 →' : 'View →'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
