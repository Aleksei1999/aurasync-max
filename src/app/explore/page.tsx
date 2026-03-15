'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useMax } from '@/components/MaxProvider';
import { Moon, Sun, Battery, Heart, Brain, Sparkles, Search } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  practices: number;
}

const categories: Category[] = [
  {
    id: 'sleep',
    title: 'Сон',
    subtitle: 'Легко засыпай',
    icon: Moon,
    gradient: 'from-aura-lavender to-aura-lavender-dark',
    practices: 12,
  },
  {
    id: 'anxiety',
    title: 'Тревога',
    subtitle: 'Успокой стресс и тревогу',
    icon: Heart,
    gradient: 'from-aura-peach to-aura-peach-dark',
    practices: 15,
  },
  {
    id: 'energy',
    title: 'Утренняя энергия',
    subtitle: 'Просыпайся с фокусом',
    icon: Sun,
    gradient: 'from-aura-mint to-aura-mint-dark',
    practices: 8,
  },
  {
    id: 'focus',
    title: 'Фокус',
    subtitle: 'Повысь концентрацию',
    icon: Brain,
    gradient: 'from-aura-sage to-aura-mint',
    practices: 10,
  },
  {
    id: 'beauty',
    title: 'Красота',
    subtitle: 'Убери кортизоловое лицо',
    icon: Sparkles,
    gradient: 'from-pink-200 to-aura-peach',
    practices: 7,
  },
  {
    id: 'recharge',
    title: 'Восстановление',
    subtitle: 'Верни свою энергию',
    icon: Battery,
    gradient: 'from-green-200 to-aura-mint',
    practices: 9,
  },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { hapticFeedback } = useMax();

  const handleCategoryClick = (categoryId: string) => {
    hapticFeedback('light');
    // TODO: Navigate to category
    console.log('Category clicked:', categoryId);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <h1 className="text-2xl font-bold text-foreground">Практики</h1>
        <p className="text-aura-slate/60">Найди практику для любого момента</p>
      </header>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-aura-slate/40" />
          <input
            type="text"
            placeholder="Поиск практик..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-aura-slate/10 text-foreground placeholder:text-aura-slate/40 focus:outline-none focus:border-aura-mint"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <main className="px-5 py-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="card p-4 text-left transition-transform active:scale-[0.98]"
              >
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-3`}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-foreground">{category.title}</h3>
                <p className="text-xs text-aura-slate/60 mt-1">{category.subtitle}</p>
                <p className="text-xs text-aura-mint-dark mt-2 font-medium">
                  {category.practices} практик
                </p>
              </button>
            );
          })}
        </div>

        {/* New Releases Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Новинки</h2>
            <button className="text-sm text-aura-mint-dark font-medium">Все</button>
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card-soft p-4 flex items-center gap-4"
              >
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-aura-mint-light to-aura-lavender-light flex items-center justify-center">
                  <Sparkles size={24} className="text-aura-slate" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Глубокое расслабление #{i}</h4>
                  <p className="text-xs text-aura-slate/60">10 мин • Снятие стресса</p>
                </div>
                <button className="h-10 w-10 rounded-full bg-aura-mint flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 2L14 8L4 14V2Z" fill="white" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
