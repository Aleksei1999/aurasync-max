'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import {
  TrendingUp,
  Flame,
  Droplets,
  Brain,
  Heart,
  Moon,
  Shield,
  ChevronRight,
  Award,
  Zap,
  Target,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

// Типы профилей из онбординга
type ProfileType = 'cortisol' | 'neuro' | 'burnout' | 'potential';

interface ProfileAnalysis {
  title: string;
  analysis: string;
  recommendation: string;
  icon: typeof Brain;
  color: string;
  bgColor: string;
}

const profileAnalyses: Record<ProfileType, ProfileAnalysis> = {
  cortisol: {
    title: 'Кортизоловая ловушка',
    analysis: 'Ваша симпатическая нервная система перегружена. Организм находится в состоянии «хронической обороны». Это приводит к спазму жевательных мышц и сосудов шеи, из-за чего нарушается отток лимфы. Ваше лицо буквально «хранит» старый стресс в виде отёков.',
    recommendation: 'Фокус на курсах: Анти-Тревога, Скульптор лица',
    icon: Shield,
    color: 'text-aura-mint-dark',
    bgColor: 'bg-aura-mint/20',
  },
  neuro: {
    title: 'Нейро-истощение',
    analysis: 'Ваши дофаминовые рецепторы перегружены информационным шумом, а митохондрии (энергетические станции клеток) работают на минимуме. Мозг ввёл режим «энергосбережения», что ощущается как когнитивная вязкость и физическая слабость.',
    recommendation: 'Фокус на курсах: Глубокий Фокус, Энергия изнутри',
    icon: Brain,
    color: 'text-aura-lavender-dark',
    bgColor: 'bg-aura-lavender/20',
  },
  burnout: {
    title: 'Замкнутый цикл',
    analysis: 'Вы находитесь в состоянии эмоционального выгорания. Ваша амигдала (центр страха) гиперактивна, что блокирует работу префронтальной коры (логика и планирование). Тело экономит ресурсы, блокируя эмоции и драйв.',
    recommendation: 'Фокус на курсах: Интеллект сна, Анти-Тревога',
    icon: Moon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  potential: {
    title: 'Скрытый потенциал',
    analysis: 'Ваша система стабильна, но работает на «базовых настройках». У вас есть избыток энергии, который не находит правильного русла. Ваше тело готово к трансформации, нужно лишь синхронизировать ритмы мозга для выхода на новый уровень.',
    recommendation: 'Фокус на курсах: Глубокий Фокус, Метаболический поток',
    icon: Sparkles,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
};

// Типы для Aura-Map
interface AuraAxis {
  id: string;
  name: string;
  shortName: string;
  value: number;
  previousValue: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  colorClass: string;
  bgClass: string;
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  progress: number;
  target: number;
  isUnlocked: boolean;
  triggerType: 'streak' | 'tasks' | 'water' | 'practice';
}

// Расчёт баллов из localStorage
function calculateAuraScores(): AuraAxis[] {
  const completedTasks = JSON.parse(localStorage.getItem('aura_completed_tasks') || '{"tasks": []}');
  const streakData = JSON.parse(localStorage.getItem('aura_streak') || '{"streak": 0}');
  const savedScores = localStorage.getItem('aura_map_scores');
  const tasks = completedTasks.tasks || [];
  const streak = streakData.streak || 0;

  // Если есть сохранённые баллы из курсов, используем их
  if (savedScores) {
    const scores = JSON.parse(savedScores);
    const cortisolResistance = Math.round(scores.cortisolResistance || 20);
    const neuroFocus = Math.round(scores.neuroFocus || 20);
    const somaticCalm = Math.round(scores.somaticCalm || 20);
    const regeneration = Math.round(scores.regeneration || 20);
    const emotionalEQ = Math.round(scores.emotionalEQ || 20);

    // Добавляем бонус за streak
    const streakBonus = streak * 2;

    return buildAxesArray(
      Math.min(100, cortisolResistance + streakBonus),
      Math.min(100, neuroFocus + streakBonus),
      Math.min(100, somaticCalm + streakBonus),
      Math.min(100, regeneration + streakBonus),
      Math.min(100, emotionalEQ + streakBonus)
    );
  }

  // Базовые значения (будут расти с активностью) - fallback
  const hasDopamine = tasks.includes('dopamine_code');
  const hasJaw = tasks.includes('jaw_relaxation');
  const hasAlpha = tasks.includes('alpha_immersion');

  // Расчёт значений (0-100)
  const cortisolResistance = Math.min(100, 20 + (hasDopamine ? 25 : 0) + (hasJaw ? 20 : 0) + (streak * 3));
  const neuroFocus = Math.min(100, 15 + (hasDopamine ? 30 : 0) + (streak * 4));
  const somaticCalm = Math.min(100, 10 + (hasJaw ? 35 : 0) + (hasAlpha ? 20 : 0) + (streak * 2));
  const regeneration = Math.min(100, 15 + (hasAlpha ? 40 : 0) + (streak * 3));
  const emotionalEQ = Math.min(100, 20 + (tasks.length * 10) + (streak * 2));

  return buildAxesArray(cortisolResistance, neuroFocus, somaticCalm, regeneration, emotionalEQ);
}

// Вспомогательная функция для построения массива осей
function buildAxesArray(
  cortisolResistance: number,
  neuroFocus: number,
  somaticCalm: number,
  regeneration: number,
  emotionalEQ: number
): AuraAxis[] {
  return [
    {
      id: 'cortisol',
      name: 'Кортизоловая резистентность',
      shortName: 'Стресс',
      value: cortisolResistance,
      previousValue: Math.max(0, cortisolResistance - 10),
      icon: Shield,
      color: '#8BCFC0',
      colorClass: 'text-aura-mint',
      bgClass: 'bg-aura-mint/20',
      description: 'Умение системы сбрасывать стресс'
    },
    {
      id: 'neuro',
      name: 'Нейро-фокус',
      shortName: 'Фокус',
      value: neuroFocus,
      previousValue: Math.max(0, neuroFocus - 8),
      icon: Brain,
      color: '#B8A9C9',
      colorClass: 'text-aura-lavender',
      bgClass: 'bg-aura-lavender/20',
      description: 'Скорость входа в состояние потока'
    },
    {
      id: 'somatic',
      name: 'Соматический покой',
      shortName: 'Тело',
      value: somaticCalm,
      previousValue: Math.max(0, somaticCalm - 12),
      icon: Heart,
      color: '#F5CEB8',
      colorClass: 'text-aura-peach',
      bgClass: 'bg-aura-peach/20',
      description: 'Отсутствие физических зажимов'
    },
    {
      id: 'regeneration',
      name: 'Глубина регенерации',
      shortName: 'Сон',
      value: regeneration,
      previousValue: Math.max(0, regeneration - 15),
      icon: Moon,
      color: '#7B68EE',
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-100',
      description: 'Качество восстановления'
    },
    {
      id: 'emotional',
      name: 'Эмоциональный интеллект',
      shortName: 'Эмоции',
      value: emotionalEQ,
      previousValue: Math.max(0, emotionalEQ - 5),
      icon: Sparkles,
      color: '#FFB366',
      colorClass: 'text-orange-400',
      bgClass: 'bg-orange-100',
      description: 'Гибкость эмоциональных реакций'
    }
  ];
}

// Расчёт достижений из курсов
function calculateCourseAchievements(): { completedCourses: number; totalSessions: number } {
  const savedProgress = localStorage.getItem('aura_course_progress');
  if (!savedProgress) {
    return { completedCourses: 0, totalSessions: 0 };
  }

  const allProgress = JSON.parse(savedProgress);
  let completedCourses = 0;
  let totalSessions = 0;

  Object.values(allProgress).forEach((progress: unknown) => {
    const courseProgress = progress as { completedSessions?: string[] };
    const completed = courseProgress.completedSessions?.length || 0;
    totalSessions += completed;
    if (completed >= 7) {
      completedCourses++;
    }
  });

  return { completedCourses, totalSessions };
}

// Расчёт достижений
function calculateAchievements(): Achievement[] {
  const streakData = JSON.parse(localStorage.getItem('aura_streak') || '{"streak": 0, "longestStreak": 0}');
  const completedTasks = JSON.parse(localStorage.getItem('aura_completed_tasks') || '{"tasks": []}');
  const tasks = completedTasks.tasks || [];
  const streak = streakData.streak || 0;
  const { completedCourses, totalSessions } = calculateCourseAchievements();

  return [
    {
      id: 'streak_3',
      title: 'Стабилизация',
      description: '3 дня практик — адаптация запущена',
      icon: Flame,
      progress: Math.min(streak, 3),
      target: 3,
      isUnlocked: streak >= 3,
      triggerType: 'streak'
    },
    {
      id: 'streak_7',
      title: 'Пластичность',
      description: '7 дней — новые нейронные пути',
      icon: Brain,
      progress: Math.min(streak, 7),
      target: 7,
      isUnlocked: streak >= 7,
      triggerType: 'streak'
    },
    {
      id: 'sessions_10',
      title: 'Первые победы',
      description: 'Завершить 10 сессий практик',
      icon: Zap,
      progress: Math.min(totalSessions, 10),
      target: 10,
      isUnlocked: totalSessions >= 10,
      triggerType: 'practice'
    },
    {
      id: 'course_complete',
      title: 'Нейронный апгрейд',
      description: 'Полностью пройти один курс',
      icon: Target,
      progress: Math.min(completedCourses, 1),
      target: 1,
      isUnlocked: completedCourses >= 1,
      triggerType: 'practice'
    },
    {
      id: 'streak_21',
      title: 'Суверенитет',
      description: '21 день — привычка стала частью вас',
      icon: Shield,
      progress: Math.min(streak, 21),
      target: 21,
      isUnlocked: streak >= 21,
      triggerType: 'streak'
    },
    {
      id: 'tasks_complete',
      title: 'Ритуал дня',
      description: 'Выполни все 4 задания дня',
      icon: Droplets,
      progress: tasks.length,
      target: 4,
      isUnlocked: tasks.length >= 4,
      triggerType: 'tasks'
    }
  ];
}

// Компонент радарной диаграммы
function AuraRadarChart({ axes }: { axes: AuraAxis[] }) {
  const size = 220;
  const center = size / 2;
  const maxRadius = 80;
  const levels = 5;

  // Функция для расчёта координат точки
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  // Создаём путь для текущих значений
  const currentPath = axes.map((axis, i) => {
    const point = getPoint(i, axis.value);
    return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ') + ' Z';

  // Создаём путь для предыдущих значений
  const previousPath = axes.map((axis, i) => {
    const point = getPoint(i, axis.previousValue);
    return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ') + ' Z';

  // Размер контейнера для подписей
  const containerSize = size + 120;

  return (
    <div className="relative flex items-center justify-center" style={{ width: containerSize, height: containerSize }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        {/* Фоновые круги */}
        {[...Array(levels)].map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={((i + 1) / levels) * maxRadius}
            fill="none"
            stroke="rgba(139, 207, 192, 0.15)"
            strokeWidth="1"
          />
        ))}

        {/* Оси */}
        {axes.map((_, i) => {
          const point = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(139, 207, 192, 0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* Предыдущие значения (полупрозрачный) */}
        <path
          d={previousPath}
          fill="rgba(184, 169, 201, 0.2)"
          stroke="rgba(184, 169, 201, 0.4)"
          strokeWidth="2"
        />

        {/* Текущие значения */}
        <path
          d={currentPath}
          fill="rgba(139, 207, 192, 0.3)"
          stroke="#8BCFC0"
          strokeWidth="2.5"
        />

        {/* Точки на текущих значениях */}
        {axes.map((axis, i) => {
          const point = getPoint(i, axis.value);
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill={axis.color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Подписи осей */}
      {axes.map((axis, i) => {
        const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
        const labelRadius = maxRadius + 50;
        const containerCenter = containerSize / 2;
        const x = containerCenter + labelRadius * Math.cos(angle);
        const y = containerCenter + labelRadius * Math.sin(angle);
        const Icon = axis.icon;

        return (
          <div
            key={i}
            className="absolute flex flex-col items-center pointer-events-none"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${axis.bgClass}`}>
              <Icon size={14} className={axis.colorClass} />
            </div>
            <span className="text-[10px] text-aura-slate/70 text-center whitespace-nowrap mt-0.5">
              {axis.shortName}
            </span>
            <span className="text-xs font-semibold text-foreground">{axis.value}%</span>
          </div>
        );
      })}
    </div>
  );
}

export default function MapPage() {
  const [axes, setAxes] = useState<AuraAxis[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAxis, setSelectedAxis] = useState<AuraAxis | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [userProfile, setUserProfile] = useState<ProfileType | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const calculatedAxes = calculateAuraScores();
    setAxes(calculatedAxes);
    setAchievements(calculateAchievements());

    const streakData = JSON.parse(localStorage.getItem('aura_streak') || '{"streak": 0}');
    setStreak(streakData.streak || 0);

    // Получаем профиль пользователя из онбординга
    const savedProfile = localStorage.getItem('aura_user_profile') as ProfileType | null;
    if (savedProfile && profileAnalyses[savedProfile]) {
      setUserProfile(savedProfile);
    }

    // Общий балл — среднее всех осей
    const avg = Math.round(calculatedAxes.reduce((sum, a) => sum + a.value, 0) / calculatedAxes.length);
    setTotalScore(avg);
  }, []);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-foreground">Aura-Map</h1>
            <p className="text-sm text-aura-slate/60">Твоя биометрия баланса</p>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1 bg-aura-peach/20 rounded-full px-3 py-1">
                <Flame size={14} className="text-aura-peach" />
                <span className="text-sm font-semibold text-aura-peach">{streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1 bg-aura-mint/20 rounded-full px-3 py-1">
              <TrendingUp size={14} className="text-aura-mint" />
              <span className="text-sm font-semibold text-aura-mint">{totalScore}%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 py-4 space-y-6">
        {/* Персональный анализ на основе профиля */}
        {userProfile && (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="w-full p-5 flex items-center gap-4"
            >
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${profileAnalyses[userProfile].bgColor}`}>
                {(() => {
                  const ProfileIcon = profileAnalyses[userProfile].icon;
                  return <ProfileIcon size={24} className={profileAnalyses[userProfile].color} />;
                })()}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={14} className="text-aura-slate/50" />
                  <span className="text-xs text-aura-slate/60">Анализ состояния</span>
                </div>
                <h3 className="font-semibold text-foreground">{profileAnalyses[userProfile].title}</h3>
              </div>
              <ChevronRight
                size={20}
                className={`text-aura-slate/30 transition-transform ${showAnalysis ? 'rotate-90' : ''}`}
              />
            </button>

            {showAnalysis && (
              <div className="px-5 pb-5 space-y-4 animate-fade-in">
                <div className="bg-aura-slate/5 rounded-2xl p-4">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {profileAnalyses[userProfile].analysis}
                  </p>
                </div>
                <div className={`rounded-2xl p-4 ${profileAnalyses[userProfile].bgColor}`}>
                  <p className={`text-sm font-medium ${profileAnalyses[userProfile].color}`}>
                    {profileAnalyses[userProfile].recommendation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Radar Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="text-center mb-2">
            <h2 className="font-semibold text-foreground">Баланс систем</h2>
            <p className="text-xs text-aura-slate/60">Обновляется при выполнении практик</p>
          </div>
          <AuraRadarChart axes={axes} />
          <p className="text-center text-xs text-aura-slate/50 mt-4">
            Полупрозрачная зона — предыдущие значения
          </p>
        </div>

        {/* Axis Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground px-1">Параметры системы</h3>
          {axes.map((axis) => {
            const Icon = axis.icon;
            const delta = axis.value - axis.previousValue;
            return (
              <button
                key={axis.id}
                onClick={() => setSelectedAxis(axis)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.99] transition-transform"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${axis.bgClass}`}>
                  <Icon size={20} className={axis.colorClass} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-foreground text-sm">{axis.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-aura-slate/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${axis.value}%`, backgroundColor: axis.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{axis.value}%</span>
                  </div>
                </div>
                {delta > 0 && (
                  <div className="flex items-center gap-0.5 text-aura-mint">
                    <TrendingUp size={14} />
                    <span className="text-xs font-medium">+{delta}</span>
                  </div>
                )}
                <ChevronRight size={16} className="text-aura-slate/30" />
              </button>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-semibold text-foreground">Достижения</h3>
            <span className="text-xs text-aura-slate/60">{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progress = (achievement.progress / achievement.target) * 100;
              return (
                <div
                  key={achievement.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm ${
                    achievement.isUnlocked ? 'ring-2 ring-aura-mint' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      achievement.isUnlocked ? 'bg-aura-mint' : 'bg-aura-slate/10'
                    }`}>
                      {achievement.isUnlocked ? (
                        <Check size={16} className="text-white" />
                      ) : (
                        <Icon size={16} className="text-aura-slate/50" />
                      )}
                    </div>
                    {achievement.isUnlocked && (
                      <Award size={16} className="text-aura-mint" />
                    )}
                  </div>
                  <h4 className="font-medium text-foreground text-sm mb-1">{achievement.title}</h4>
                  <p className="text-[10px] text-aura-slate/60 mb-2">{achievement.description}</p>
                  <div className="h-1.5 bg-aura-slate/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        achievement.isUnlocked ? 'bg-aura-mint' : 'bg-aura-lavender'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-aura-slate/50 mt-1 text-right">
                    {achievement.progress}/{achievement.target}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="bg-gradient-to-br from-aura-mint/10 to-aura-lavender/10 rounded-3xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Капитал состояний</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-aura-mint">{streak}</p>
              <p className="text-xs text-aura-slate/60">дней подряд</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-aura-lavender">{totalScore}%</p>
              <p className="text-xs text-aura-slate/60">общий баланс</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-aura-peach">{unlockedCount}</p>
              <p className="text-xs text-aura-slate/60">достижений</p>
            </div>
          </div>
        </div>
      </main>

      {/* Axis Detail Modal */}
      {selectedAxis && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedAxis(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-5 animate-scale-in">
            <div className="flex items-start gap-4 mb-4">
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${selectedAxis.bgClass}`}>
                <selectedAxis.icon size={28} className={selectedAxis.colorClass} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-foreground">{selectedAxis.name}</h3>
                <p className="text-sm text-aura-slate/60">{selectedAxis.description}</p>
              </div>
            </div>

            <div className="bg-aura-slate/5 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-aura-slate/70">Текущий уровень</span>
                <span className="font-bold text-foreground">{selectedAxis.value}%</span>
              </div>
              <div className="h-3 bg-aura-slate/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${selectedAxis.value}%`, backgroundColor: selectedAxis.color }}
                />
              </div>
              {selectedAxis.value - selectedAxis.previousValue > 0 && (
                <p className="text-xs text-aura-mint mt-2 flex items-center gap-1">
                  <TrendingUp size={12} />
                  +{selectedAxis.value - selectedAxis.previousValue}% за неделю
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedAxis(null)}
              className="w-full btn-primary"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}
