'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Play, Clock, CheckCircle, Lock, Sparkles, ChevronRight } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  sessions: number;
  completedSessions: number;
  isLocked: boolean;
  color: string;
}

const programs: Program[] = [
  {
    id: 'stress',
    title: 'Антистресс',
    description: 'Снижение уровня кортизола за 7 дней',
    duration: '7 дней',
    sessions: 7,
    completedSessions: 0,
    isLocked: false,
    color: 'from-aura-mint to-aura-mint-dark',
  },
  {
    id: 'sleep',
    title: 'Здоровый сон',
    description: 'Улучшение качества сна',
    duration: '14 дней',
    sessions: 14,
    completedSessions: 0,
    isLocked: false,
    color: 'from-aura-lavender to-aura-lavender-dark',
  },
  {
    id: 'energy',
    title: 'Энергия на весь день',
    description: 'Утренние практики для бодрости',
    duration: '10 дней',
    sessions: 10,
    completedSessions: 0,
    isLocked: false,
    color: 'from-aura-peach to-aura-peach-dark',
  },
  {
    id: 'beauty',
    title: 'Антикортизоловая красота',
    description: 'Убираем отёки и улучшаем кожу',
    duration: '21 день',
    sessions: 21,
    completedSessions: 0,
    isLocked: true,
    color: 'from-pink-300 to-pink-400',
  },
  {
    id: 'hormones',
    title: 'Гормональный баланс',
    description: 'Синхронизация с циклом',
    duration: '28 дней',
    sessions: 28,
    completedSessions: 0,
    isLocked: true,
    color: 'from-purple-300 to-purple-400',
  },
];

interface QuickPractice {
  id: string;
  title: string;
  duration: string;
  emoji: string;
}

const quickPractices: QuickPractice[] = [
  { id: 'sos', title: 'SOS Дыхание', duration: '2 мин', emoji: '🆘' },
  { id: 'morning', title: 'Утренняя настройка', duration: '5 мин', emoji: '🌅' },
  { id: 'focus', title: 'Фокус и концентрация', duration: '7 мин', emoji: '🎯' },
  { id: 'relax', title: 'Быстрая релаксация', duration: '3 мин', emoji: '🧘' },
];

export default function ProgramPage() {
  const [activeTab, setActiveTab] = useState<'programs' | 'quick'>('programs');

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">Программа</h1>
            <p className="text-xs text-aura-slate/60">Практики и курсы</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-aura-slate/5 rounded-xl">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'programs'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-aura-slate/60'
            }`}
          >
            Курсы
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'quick'
                ? 'bg-white text-foreground shadow-sm'
                : 'text-aura-slate/60'
            }`}
          >
            Быстрые практики
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-5 py-4 space-y-4">
        {activeTab === 'programs' ? (
          <>
            {programs.map((program) => (
              <div
                key={program.id}
                className={`card overflow-hidden ${program.isLocked ? 'opacity-70' : ''}`}
              >
                <div className={`h-2 bg-gradient-to-r ${program.color}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{program.title}</h3>
                        {program.isLocked && <Lock size={14} className="text-aura-slate/40" />}
                      </div>
                      <p className="text-sm text-aura-slate/60 mt-1">{program.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs text-aura-slate/60">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {program.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle size={12} />
                        {program.completedSessions}/{program.sessions}
                      </span>
                    </div>

                    <button
                      disabled={program.isLocked}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        program.isLocked
                          ? 'bg-aura-slate/10 text-aura-slate/40'
                          : 'bg-gradient-to-r ' + program.color + ' text-white'
                      }`}
                    >
                      {program.isLocked ? (
                        'Скоро'
                      ) : (
                        <>
                          <Play size={14} />
                          Начать
                        </>
                      )}
                    </button>
                  </div>

                  {/* Progress bar */}
                  {!program.isLocked && program.completedSessions > 0 && (
                    <div className="mt-3">
                      <div className="progress-bar">
                        <div
                          className={`progress-bar-fill bg-gradient-to-r ${program.color}`}
                          style={{ width: `${(program.completedSessions / program.sessions) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {quickPractices.map((practice) => (
              <button
                key={practice.id}
                className="w-full card-soft p-4 flex items-center gap-4 transition-transform active:scale-[0.99]"
              >
                <div className="text-3xl">{practice.emoji}</div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-foreground">{practice.title}</h4>
                  <p className="text-sm text-aura-slate/60">{practice.duration}</p>
                </div>
                <ChevronRight size={20} className="text-aura-slate/40" />
              </button>
            ))}
          </>
        )}
      </main>

      <Navigation />
    </div>
  );
}
