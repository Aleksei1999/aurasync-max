'use client';

import { Zap, Wind, Heart, Brain } from 'lucide-react';
import { useMax } from './MaxProvider';

interface QuickAction {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  duration: string;
  gradient: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'sos',
    icon: Zap,
    label: 'SOS Баланс',
    duration: '2 мин',
    gradient: 'from-aura-peach to-aura-peach-dark',
  },
  {
    id: 'breathe',
    icon: Wind,
    label: 'Быстрое дыхание',
    duration: '1 мин',
    gradient: 'from-aura-mint to-aura-mint-dark',
  },
  {
    id: 'calm',
    icon: Heart,
    label: 'Успокоиться',
    duration: '3 мин',
    gradient: 'from-aura-lavender to-aura-lavender-dark',
  },
  {
    id: 'focus',
    icon: Brain,
    label: 'Фокус',
    duration: '5 мин',
    gradient: 'from-aura-sage to-aura-mint',
  },
];

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const { hapticFeedback } = useMax();

  const handleClick = (actionId: string) => {
    hapticFeedback('medium');
    onActionClick?.(actionId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-foreground">Быстрые действия</h3>
        <span className="text-sm text-aura-slate/60">Мгновенная помощь</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleClick(action.id)}
              className={`card-soft p-4 text-left transition-transform active:scale-[0.98] ${
                action.id === 'sos' ? 'pulse-soft' : ''
              }`}
            >
              <div
                className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3`}
              >
                <Icon size={20} className="text-white" />
              </div>
              <h4 className="font-medium text-foreground">{action.label}</h4>
              <p className="text-xs text-aura-slate/60">{action.duration}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
