'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Star, Sparkles, Heart, Wallet, Target, X, Calendar } from 'lucide-react';
import { useMax } from './MaxProvider';
import {
  calculateDestinyMatrix,
  getDailyForecast,
  getArcana,
  DestinyMatrixData,
  Arcana,
} from '@/lib/destinyMatrix';

interface DestinyMatrixProps {
  birthDate?: string;
  onBirthDateUpdate?: (date: string) => void;
}

const compatibilityColors: Record<string, string> = {
  'отличный': 'bg-green-100 text-green-700',
  'хороший': 'bg-aura-mint-light text-aura-mint-dark',
  'нейтральный': 'bg-aura-cream text-aura-slate',
  'сложный': 'bg-orange-100 text-orange-700',
};

const compatibilityEmoji: Record<string, string> = {
  'отличный': '🌟',
  'хороший': '✨',
  'нейтральный': '🌤️',
  'сложный': '⚡',
};

export function DestinyMatrix({ birthDate, onBirthDateUpdate }: DestinyMatrixProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [matrix, setMatrix] = useState<DestinyMatrixData | null>(null);
  const [forecast, setForecast] = useState<ReturnType<typeof getDailyForecast> | null>(null);
  const { hapticFeedback } = useMax();

  const [hasBirthDate, setHasBirthDate] = useState(false);

  useEffect(() => {
    let date = birthDate;

    // Пробуем получить дату из localStorage
    if (!date) {
      const savedOnboarding = localStorage.getItem('aura_onboarding_answers');
      if (savedOnboarding) {
        const answers = JSON.parse(savedOnboarding);
        date = answers.birth_date;
      }
    }

    if (date) {
      setHasBirthDate(true);
      const birthDateObj = new Date(date);
      const today = new Date();

      const matrixData = calculateDestinyMatrix(birthDateObj, today);
      setMatrix(matrixData);
      setForecast(getDailyForecast(matrixData));
    } else {
      setHasBirthDate(false);
    }
  }, [birthDate]);

  const toggleExpanded = () => {
    hapticFeedback('light');
    setIsExpanded(!isExpanded);
  };

  const handleSaveBirthDate = () => {
    if (!selectedDate) return;

    hapticFeedback('medium');

    // Сохраняем в localStorage
    const savedOnboarding = localStorage.getItem('aura_onboarding_answers');
    const answers = savedOnboarding ? JSON.parse(savedOnboarding) : {};
    answers.birth_date = selectedDate;
    localStorage.setItem('aura_onboarding_answers', JSON.stringify(answers));

    // Обновляем состояние
    setHasBirthDate(true);
    const birthDateObj = new Date(selectedDate);
    const today = new Date();
    const matrixData = calculateDestinyMatrix(birthDateObj, today);
    setMatrix(matrixData);
    setForecast(getDailyForecast(matrixData));

    setShowDatePicker(false);

    // Уведомляем родителя если есть callback
    if (onBirthDateUpdate) {
      onBirthDateUpdate(selectedDate);
    }
  };

  // Модальное окно для ввода даты
  if (showDatePicker) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Дата рождения</h3>
            <button
              onClick={() => setShowDatePicker(false)}
              className="h-8 w-8 rounded-full bg-aura-slate/10 flex items-center justify-center"
            >
              <X size={18} className="text-aura-slate" />
            </button>
          </div>

          <p className="text-sm text-aura-slate/70 mb-4">
            Укажи свою дату рождения для расчёта персональной матрицы судьбы
          </p>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-4 rounded-2xl bg-aura-slate/5 text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-aura-mint mb-4"
          />

          <button
            onClick={handleSaveBirthDate}
            disabled={!selectedDate}
            className={`w-full py-4 rounded-2xl font-semibold text-white transition-all ${
              selectedDate
                ? 'bg-gradient-to-r from-aura-mint to-aura-lavender'
                : 'bg-aura-slate/30'
            }`}
          >
            Рассчитать матрицу
          </button>
        </div>
      </div>
    );
  }

  // Если нет даты рождения — показываем приглашение
  if (!hasBirthDate) {
    return (
      <button
        onClick={() => {
          hapticFeedback('light');
          setShowDatePicker(true);
        }}
        className="w-full rounded-3xl p-5 bg-gradient-to-br from-aura-lavender to-aura-mint shadow-lg text-left transition-transform active:scale-[0.99]"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl">🔮</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">Матрица судьбы</h3>
            <p className="text-white/80 text-sm mb-3">
              Укажи дату рождения, чтобы рассчитать твою персональную матрицу и получать ежедневные прогнозы
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 text-white text-sm font-medium">
              <Calendar size={16} />
              Указать дату рождения
            </div>
          </div>
        </div>
      </button>
    );
  }

  if (!matrix || !forecast) {
    return (
      <div className="rounded-3xl p-5 bg-gradient-to-br from-aura-lavender to-aura-mint shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-white/30 rounded mb-2" />
          <div className="h-4 w-48 bg-white/20 rounded" />
        </div>
      </div>
    );
  }

  const mainArcana = forecast.mainEnergy;
  const dayArcana = forecast.dayEnergy;

  // Свёрнутый вид
  if (!isExpanded) {
    return (
      <button
        onClick={toggleExpanded}
        className={`w-full rounded-3xl p-5 bg-gradient-to-br ${mainArcana.color} shadow-lg text-left transition-transform active:scale-[0.99]`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={16} className="text-white/80" />
              <span className="text-sm font-medium text-white/90">Матрица судьбы</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {mainArcana.symbol} {mainArcana.name}
            </h3>
            <p className="text-sm text-white/80 mt-1">Личная энергия дня</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${compatibilityColors[matrix.dayCompatibility]}`}>
              {compatibilityEmoji[matrix.dayCompatibility]} {matrix.dayCompatibility}
            </span>
            <ChevronDown size={20} className="text-white/60" />
          </div>
        </div>

        <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
          {mainArcana.dayAdvice}
        </p>

        <div className="mt-3 flex gap-2">
          {forecast.focus.map((item, i) => (
            <span key={i} className="px-2 py-1 rounded-full bg-white/20 text-white text-xs">
              {item}
            </span>
          ))}
        </div>
      </button>
    );
  }

  // Развёрнутый вид (модальное окно)
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up safe-area-bottom">
        {/* Header */}
        <div className={`p-5 bg-gradient-to-br ${mainArcana.color} text-white sticky top-0`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={16} className="text-white/80" />
                <span className="text-sm font-medium text-white/90">Матрица судьбы на сегодня</span>
              </div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">{mainArcana.symbol}</span>
                {mainArcana.name}
              </h2>
            </div>
            <button
              onClick={toggleExpanded}
              className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${compatibilityColors[matrix.dayCompatibility]}`}>
              {compatibilityEmoji[matrix.dayCompatibility]} День: {matrix.dayCompatibility}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-sm">
              {mainArcana.planet} • {mainArcana.element}
            </span>
          </div>

          <p className="text-white/90 text-sm leading-relaxed">
            {forecast.advice}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Числа дня */}
          <div className="grid grid-cols-3 gap-3">
            <div className="card-soft p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{matrix.personalDay}</div>
              <div className="text-xs text-aura-slate/60">Личный день</div>
            </div>
            <div className="card-soft p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{matrix.dayEnergy}</div>
              <div className="text-xs text-aura-slate/60">Энергия дня</div>
            </div>
            <div className="card-soft p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{matrix.center}</div>
              <div className="text-xs text-aura-slate/60">Центр</div>
            </div>
          </div>

          {/* Энергия дня */}
          <div className="card-soft p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${dayArcana.color} flex items-center justify-center text-2xl`}>
                {dayArcana.symbol}
              </div>
              <div>
                <div className="text-xs text-aura-slate/60">Универсальная энергия дня</div>
                <div className="font-semibold text-foreground">{dayArcana.name}</div>
              </div>
            </div>
            <p className="text-sm text-aura-slate/80">{dayArcana.dayAdvice}</p>
          </div>

          {/* Фокус и избегать */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-soft p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-aura-mint" />
                <span className="font-medium text-foreground text-sm">Фокус</span>
              </div>
              <div className="space-y-2">
                {forecast.focus.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-aura-slate/80">
                    <span className="text-aura-mint">+</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="card-soft p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-400">⚠️</span>
                <span className="font-medium text-foreground text-sm">Избегать</span>
              </div>
              <div className="space-y-2">
                {forecast.avoid.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-aura-slate/80">
                    <span className="text-orange-400">−</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Линии матрицы */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Твоя матрица</h4>

            {/* Линия любви */}
            <div className="card-soft p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={16} className="text-pink-400" />
                <span className="font-medium text-foreground text-sm">Линия любви</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                {matrix.loveLine.map((num, i) => {
                  const arcana = getArcana(num);
                  return (
                    <div key={i} className="text-center">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${arcana.color} flex items-center justify-center text-xl mx-auto mb-1`}>
                        {arcana.symbol}
                      </div>
                      <div className="text-xs text-aura-slate/60">{num}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Линия денег */}
            <div className="card-soft p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={16} className="text-green-500" />
                <span className="font-medium text-foreground text-sm">Линия денег</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                {matrix.moneyLine.map((num, i) => {
                  const arcana = getArcana(num);
                  return (
                    <div key={i} className="text-center">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${arcana.color} flex items-center justify-center text-xl mx-auto mb-1`}>
                        {arcana.symbol}
                      </div>
                      <div className="text-xs text-aura-slate/60">{num}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Линия предназначения */}
            <div className="card-soft p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-purple-500" />
                <span className="font-medium text-foreground text-sm">Линия предназначения</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                {matrix.purposeLine.map((num, i) => {
                  const arcana = getArcana(num);
                  return (
                    <div key={i} className="text-center">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${arcana.color} flex items-center justify-center text-xl mx-auto mb-1`}>
                        {arcana.symbol}
                      </div>
                      <div className="text-xs text-aura-slate/60">{num}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Основные точки */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Ключевые энергии</h4>
            <div className="grid grid-cols-2 gap-3">
              <MatrixPoint label="Личность" number={matrix.personality} />
              <MatrixPoint label="Таланты" number={matrix.talents} />
              <MatrixPoint label="Карма" number={matrix.karma} />
              <MatrixPoint label="Духовность" number={matrix.spirituality} />
            </div>
          </div>

          {/* Хвост кармы */}
          <div className="card-soft p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔗</span>
              <span className="font-medium text-foreground text-sm">Хвост кармы</span>
              <span className="text-xs text-aura-slate/60 ml-auto">Задачи прошлых жизней</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              {matrix.karmicTail.map((num, i) => {
                const arcana = getArcana(num);
                return (
                  <div key={i} className="text-center">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${arcana.color} flex items-center justify-center text-lg mx-auto mb-1`}>
                      {arcana.symbol}
                    </div>
                    <div className="text-xs text-aura-slate/60">{arcana.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Текущий цикл */}
          <div className="card-soft p-4">
            <h4 className="font-medium text-foreground mb-3">Текущий цикл</h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-foreground">{matrix.personalYear}</div>
                <div className="text-xs text-aura-slate/60">Личный год</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{matrix.personalMonth}</div>
                <div className="text-xs text-aura-slate/60">Личный месяц</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{matrix.personalDay}</div>
                <div className="text-xs text-aura-slate/60">Личный день</div>
              </div>
            </div>
          </div>

          {/* Ключевые слова */}
          <div className="pb-4">
            <h4 className="font-medium text-foreground mb-3">Ключевые слова дня</h4>
            <div className="flex flex-wrap gap-2">
              {mainArcana.keywords.map((keyword, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-full bg-gradient-to-br ${mainArcana.color} text-white text-sm`}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Компонент точки матрицы
function MatrixPoint({ label, number }: { label: string; number: number }) {
  const arcana = getArcana(number);

  return (
    <div className="card-soft p-3 flex items-center gap-3">
      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${arcana.color} flex items-center justify-center text-lg`}>
        {arcana.symbol}
      </div>
      <div>
        <div className="text-xs text-aura-slate/60">{label}</div>
        <div className="font-medium text-foreground text-sm">{arcana.name}</div>
      </div>
    </div>
  );
}
