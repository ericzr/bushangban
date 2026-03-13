import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Bell, Moon, Globe, Shield, LogOut, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('zh-CN');

  const sections = [
    {
      title: '通知设置',
      items: [
        {
          icon: Bell,
          label: '消息通知',
          desc: notifications ? '已开启' : '已关闭',
          color: 'text-info',
          bg: 'bg-info-light',
          toggle: true,
          value: notifications,
          onToggle: () => setNotifications(!notifications),
        },
      ],
    },
    {
      title: '显示',
      items: [
        {
          icon: Moon,
          label: '深色模式',
          desc: darkMode ? '已开启' : '已关闭',
          color: 'text-purple',
          bg: 'bg-purple-light',
          toggle: true,
          value: darkMode,
          onToggle: () => setDarkMode(!darkMode),
        },
        {
          icon: Globe,
          label: '语言',
          desc: '简体中文',
          color: 'text-success',
          bg: 'bg-success-light',
        },
      ],
    },
    {
      title: '安全',
      items: [
        {
          icon: Shield,
          label: '隐私设置',
          desc: '管理你的隐私偏好',
          color: 'text-warning',
          bg: 'bg-warning-light',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col pb-4" style={{ paddingTop: "calc(var(--safe-top) + 49px)" }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-border" style={{ paddingTop: "var(--safe-top)" }}>
        <Link to="/profile" className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-sm text-foreground">设置</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {sections.map(section => (
          <div key={section.title}>
            <h3 className="text-xs text-muted-foreground mb-2 px-1">{section.title}</h3>
            <div className="rounded-2xl bg-white border border-border overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.onToggle}
                  className={cn(
                    'flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors',
                    i < section.items.length - 1 && 'border-b border-border'
                  )}
                >
                  <div className={cn('rounded-xl p-2', item.bg)}>
                    <item.icon className={cn('h-4 w-4', item.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  {item.toggle ? (
                    item.value
                      ? <ToggleRight className="h-6 w-6 text-primary" />
                      : <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button className="flex items-center justify-center gap-2 w-full rounded-2xl border border-coral/20 bg-coral-light py-3 text-sm text-coral hover:bg-coral/10 transition-colors">
          <LogOut className="h-4 w-4" /> 退出登录
        </button>
      </div>
    </div>
  );
}
