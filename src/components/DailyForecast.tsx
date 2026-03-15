'use client';

import { useState, useEffect } from 'react';
import { Star, Moon, Sun, Sparkles } from 'lucide-react';

interface ForecastProps {
  birthDate?: string;
  birthTime?: string;
}

const zodiacSigns = [
  { name: 'Овен', symbol: '♈', dates: [321, 419], element: 'fire' },
  { name: 'Телец', symbol: '♉', dates: [420, 520], element: 'earth' },
  { name: 'Близнецы', symbol: '♊', dates: [521, 620], element: 'air' },
  { name: 'Рак', symbol: '♋', dates: [621, 722], element: 'water' },
  { name: 'Лев', symbol: '♌', dates: [723, 822], element: 'fire' },
  { name: 'Дева', symbol: '♍', dates: [823, 922], element: 'earth' },
  { name: 'Весы', symbol: '♎', dates: [923, 1022], element: 'air' },
  { name: 'Скорпион', symbol: '♏', dates: [1023, 1121], element: 'water' },
  { name: 'Стрелец', symbol: '♐', dates: [1122, 1221], element: 'fire' },
  { name: 'Козерог', symbol: '♑', dates: [1222, 119], element: 'earth' },
  { name: 'Водолей', symbol: '♒', dates: [120, 218], element: 'air' },
  { name: 'Рыбы', symbol: '♓', dates: [219, 320], element: 'water' },
];

const elementColors: Record<string, string> = {
  fire: 'from-orange-400 to-red-400',
  earth: 'from-green-400 to-emerald-500',
  air: 'from-sky-400 to-blue-400',
  water: 'from-blue-400 to-indigo-500',
};

const dailyForecasts = [
  {
    energy: 'Высокая энергия',
    advice: 'Отличный день для начала новых проектов. Твоя интуиция сегодня особенно сильна.',
    practice: 'Утренняя медитация усилит твой фокус',
    lucky: ['Зелёный', '7', 'Утро'],
  },
  {
    energy: 'Спокойная энергия',
    advice: 'День подходит для завершения начатых дел. Позаботься о себе и своём теле.',
    practice: 'Вечерняя релаксация поможет восстановиться',
    lucky: ['Голубой', '3', 'Вечер'],
  },
  {
    energy: 'Творческая энергия',
    advice: 'Креативность на пике! Используй это для решения сложных задач нестандартными способами.',
    practice: 'Дыхательная практика раскроет потенциал',
    lucky: ['Фиолетовый', '9', 'День'],
  },
  {
    energy: 'Рефлексивная энергия',
    advice: 'Хороший день для самоанализа и планирования. Прислушайся к внутреннему голосу.',
    practice: 'Журналирование прояснит мысли',
    lucky: ['Белый', '1', 'Утро'],
  },
  {
    energy: 'Социальная энергия',
    advice: 'Благоприятный день для общения и командной работы. Окружающие тебя поддержат.',
    practice: 'Практика благодарности укрепит связи',
    lucky: ['Розовый', '5', 'День'],
  },
];

const moonPhases = [
  { name: 'Новолуние', icon: '🌑', advice: 'Время для новых намерений' },
  { name: 'Растущая луна', icon: '🌒', advice: 'Время для роста и развития' },
  { name: 'Первая четверть', icon: '🌓', advice: 'Время для действий' },
  { name: 'Прибывающая луна', icon: '🌔', advice: 'Время для усиления практик' },
  { name: 'Полнолуние', icon: '🌕', advice: 'Время для завершения и отпускания' },
  { name: 'Убывающая луна', icon: '🌖', advice: 'Время для очищения' },
  { name: 'Последняя четверть', icon: '🌗', advice: 'Время для отдыха' },
  { name: 'Старая луна', icon: '🌘', advice: 'Время для подготовки к новому' },
];

function getZodiacSign(birthDate: string) {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateNum = month * 100 + day;

  // Козерог — особый случай (переход через год)
  if (dateNum >= 1222 || dateNum <= 119) {
    return zodiacSigns.find(z => z.name === 'Козерог')!;
  }

  return zodiacSigns.find(z => dateNum >= z.dates[0] && dateNum <= z.dates[1]) || zodiacSigns[0];
}

function getMoonPhase() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return moonPhases[dayOfYear % 8];
}

function getDailyForecast(birthDate: string) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const birthSeed = birthDate ? new Date(birthDate).getTime() : 0;
  const index = (seed + birthSeed) % dailyForecasts.length;
  return dailyForecasts[index];
}

// Инициализируем прогноз сразу, чтобы не было белого экрана
function getInitialForecast() {
  return dailyForecasts[new Date().getDay() % dailyForecasts.length];
}

export function DailyForecast({ birthDate, birthTime }: ForecastProps) {
  const [zodiac, setZodiac] = useState<typeof zodiacSigns[0] | null>(null);
  const [forecast, setForecast] = useState<typeof dailyForecasts[0]>(getInitialForecast());
  const [moonPhase, setMoonPhase] = useState<typeof moonPhases[0]>(getMoonPhase());

  useEffect(() => {
    // Пробуем загрузить дату рождения из onboarding
    let date = birthDate;
    if (!date) {
      const savedOnboarding = localStorage.getItem('aura_onboarding_answers');
      if (savedOnboarding) {
        const answers = JSON.parse(savedOnboarding);
        date = answers.birth_date;
      }
    }

    if (date) {
      setZodiac(getZodiacSign(date));
      setForecast(getDailyForecast(date));
    }
  }, [birthDate]);

  return (
    <div className="space-y-4">
      {/* Main forecast card */}
      <div className={`rounded-3xl p-5 bg-gradient-to-br ${zodiac ? elementColors[zodiac.element] : 'from-aura-mint to-aura-lavender'} text-white shadow-lg`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={18} className="fill-white/50" />
              <span className="text-sm font-medium opacity-90">Прогноз дня</span>
            </div>
            <h3 className="text-xl font-bold">{forecast.energy}</h3>
          </div>
          {zodiac && (
            <div className="text-right">
              <div className="text-3xl">{zodiac.symbol}</div>
              <div className="text-sm opacity-80">{zodiac.name}</div>
            </div>
          )}
        </div>

        <p className="text-white/90 text-sm leading-relaxed mb-4">
          {forecast.advice}
        </p>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/20">
          <Sparkles size={18} />
          <span className="text-sm">{forecast.practice}</span>
        </div>
      </div>

      {/* Moon phase */}
      <div className="card-soft p-4 flex items-center gap-4">
        <div className="text-3xl">{moonPhase.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Moon size={14} className="text-aura-lavender-dark" />
            <span className="font-medium text-foreground">{moonPhase.name}</span>
          </div>
          <p className="text-sm text-aura-slate/60">{moonPhase.advice}</p>
        </div>
      </div>

      {/* Lucky indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-soft p-3 text-center">
          <div className="text-xs text-aura-slate/60 mb-1">Цвет дня</div>
          <div className="font-medium text-foreground">{forecast.lucky[0]}</div>
        </div>
        <div className="card-soft p-3 text-center">
          <div className="text-xs text-aura-slate/60 mb-1">Число дня</div>
          <div className="font-medium text-foreground">{forecast.lucky[1]}</div>
        </div>
        <div className="card-soft p-3 text-center">
          <div className="text-xs text-aura-slate/60 mb-1">Лучшее время</div>
          <div className="font-medium text-foreground">{forecast.lucky[2]}</div>
        </div>
      </div>

      {/* Time of birth bonus */}
      {birthTime && birthTime !== 'unknown' && (
        <div className="card-soft p-4 flex items-center gap-3">
          <Sun size={20} className="text-aura-peach" />
          <div>
            <div className="text-sm font-medium text-foreground">
              Время рождения учтено
            </div>
            <p className="text-xs text-aura-slate/60">
              Прогноз персонализирован по твоим данным
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
