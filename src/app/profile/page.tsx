'use client';

import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/components/AuthProvider';
import { useMax } from '@/components/MaxProvider';
import {
  User,
  Crown,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  Star,
  Calendar,
  Target,
  RefreshCw,
} from 'lucide-react';

export default function ProfilePage() {
  const { profile } = useAuth();
  const { user, hapticFeedback } = useMax();

  const userName = profile?.first_name || user?.first_name || 'User';
  const username = profile?.username || user?.username;

  const stats = [
    { label: 'Сессий', value: '0', icon: Target },
    { label: 'Минут', value: '0', icon: Calendar },
    { label: 'Дней подряд', value: '0', icon: Star },
  ];

  const handleResetOnboarding = () => {
    if (confirm('Сбросить данные и пройти онбординг заново?')) {
      localStorage.removeItem('aura_onboarding_answers');
      localStorage.removeItem('aura_onboarding_completed');
      localStorage.removeItem('aura_today_checkin');
      localStorage.removeItem('aura_program_start');
      localStorage.removeItem('aura_daily_progress');
      localStorage.removeItem('aura_streak');
      window.location.href = '/';
    }
  };

  const menuItems = [
    { icon: Crown, label: 'Подписка', value: 'Бесплатно', action: () => {} },
    { icon: Bell, label: 'Уведомления', value: 'Вкл', action: () => {} },
    { icon: Settings, label: 'Настройки', action: () => {} },
    { icon: HelpCircle, label: 'Помощь', action: () => {} },
    { icon: RefreshCw, label: 'Сбросить онбординг', action: handleResetOnboarding, danger: true },
  ];

  const handleMenuClick = (action: () => void) => {
    hapticFeedback('light');
    action();
  };

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-6 safe-area-top">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
            {profile?.photo_url || user?.photo_url ? (
              <img
                src={profile?.photo_url || user?.photo_url}
                alt="Profile"
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <User size={32} className="text-white" />
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-xl font-bold text-foreground">{userName}</h1>
            {username && (
              <p className="text-aura-slate/60">@{username}</p>
            )}
            <div className="flex items-center gap-1 mt-1">
              <Crown size={14} className="text-aura-peach" />
              <span className="text-sm text-aura-peach font-medium">Бесплатный план</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-5 pb-6">
        <div className="card p-4">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="h-12 w-12 mx-auto rounded-xl bg-aura-mint-light flex items-center justify-center mb-2">
                    <Icon size={20} className="text-aura-mint-dark" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-aura-slate/60">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscription Banner */}
      <div className="px-5 pb-6">
        <div className="card p-5 bg-gradient-to-br from-aura-peach-light to-aura-lavender-light">
          <div className="flex items-center gap-3 mb-3">
            <Crown size={24} className="text-aura-slate" />
            <div>
              <h3 className="font-semibold text-foreground">Открой Premium</h3>
              <p className="text-sm text-aura-slate/70">Получи безлимитный доступ ко всем функциям</p>
            </div>
          </div>
          <button className="w-full btn-primary">
            Попробовать 7 дней бесплатно
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5">
        <div className="card overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isDanger = 'danger' in item && item.danger;
            return (
              <button
                key={item.label}
                onClick={() => handleMenuClick(item.action)}
                className={`w-full flex items-center gap-4 p-4 transition-colors active:bg-aura-cream ${
                  index !== menuItems.length - 1 ? 'border-b border-aura-slate/5' : ''
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  isDanger ? 'bg-red-100' : 'bg-aura-mint-light'
                }`}>
                  <Icon size={20} className={isDanger ? 'text-red-500' : 'text-aura-mint-dark'} />
                </div>
                <span className={`flex-1 text-left font-medium ${
                  isDanger ? 'text-red-500' : 'text-foreground'
                }`}>
                  {item.label}
                </span>
                {item.value && (
                  <span className="text-sm text-aura-slate/60">{item.value}</span>
                )}
                <ChevronRight size={18} className="text-aura-slate/30" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Version */}
      <div className="px-5 py-6 text-center">
        <p className="text-xs text-aura-slate/40">AuraSync v1.0.0</p>
      </div>

      <Navigation />
    </div>
  );
}
