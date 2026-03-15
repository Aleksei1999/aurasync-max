'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Droplets } from 'lucide-react';
import { useMax } from './MaxProvider';

interface DayData {
  date: string;
  mood?: string;
  energy?: number;
  sleep?: string;
  period?: boolean;
}

interface CalendarProps {
  onDaySelect?: (date: string, data: DayData | null) => void;
}

const moodEmojis: Record<string, string> = {
  great: '😊',
  good: '🙂',
  okay: '😐',
  tired: '😴',
  stressed: '😰',
  anxious: '😟',
  sad: '😢',
  irritated: '😤',
};

const moodColors: Record<string, string> = {
  great: 'bg-green-100',
  good: 'bg-aura-mint-light',
  okay: 'bg-aura-cream',
  tired: 'bg-aura-lavender-light',
  stressed: 'bg-aura-peach-light',
  anxious: 'bg-orange-100',
  sad: 'bg-blue-100',
  irritated: 'bg-red-100',
};

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export function Calendar({ onDaySelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [daysData, setDaysData] = useState<Record<string, DayData>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const { hapticFeedback } = useMax();

  useEffect(() => {
    const savedData = localStorage.getItem('aura_calendar_data');
    if (savedData) {
      setDaysData(JSON.parse(savedData));
    }

    const checkinData = localStorage.getItem('aura_today_checkin');
    if (checkinData) {
      const checkin = JSON.parse(checkinData);
      if (checkin.date) {
        const dateKey = new Date(checkin.date).toISOString().split('T')[0];
        setDaysData(prev => ({
          ...prev,
          [dateKey]: {
            date: dateKey,
            mood: checkin.mood,
            energy: checkin.energy,
            sleep: checkin.sleep,
            period: prev[dateKey]?.period,
          }
        }));
      }
    }
  }, []);

  const saveData = (newData: Record<string, DayData>) => {
    localStorage.setItem('aura_calendar_data', JSON.stringify(newData));
    setDaysData(newData);
  };

  // Получаем текущую неделю (для свёрнутого вида)
  const getCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (number | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateKeyFromDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const handlePrevMonth = () => {
    hapticFeedback('light');
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    hapticFeedback('light');
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDayClick = (dateKey: string, isFutureDay: boolean) => {
    if (isFutureDay) return;
    hapticFeedback('light');
    setSelectedDate(selectedDate === dateKey ? null : dateKey);
    if (onDaySelect) {
      onDaySelect(dateKey, daysData[dateKey] || null);
    }
  };

  const togglePeriod = (dateKey: string) => {
    hapticFeedback('medium');
    const newData = { ...daysData };

    if (newData[dateKey]) {
      newData[dateKey] = { ...newData[dateKey], period: !newData[dateKey].period };
    } else {
      newData[dateKey] = { date: dateKey, period: true };
    }

    saveData(newData);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const toggleExpanded = () => {
    hapticFeedback('light');
    setIsExpanded(!isExpanded);
  };

  const currentWeek = getCurrentWeek();
  const days = getDaysInMonth(currentDate);

  // Свёрнутый вид — одна строка текущей недели
  if (!isExpanded) {
    return (
      <div className="card-soft p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">
            {MONTHS[new Date().getMonth()]} {new Date().getFullYear()}
          </span>
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-1 text-sm text-aura-mint-dark"
          >
            <span>Развернуть</span>
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-[10px] font-medium text-aura-slate/60 pb-1">
              {day}
            </div>
          ))}
          {currentWeek.map((date) => {
            const dateKey = formatDateKey(date);
            const dayData = daysData[dateKey];
            const hasMood = dayData?.mood;
            const hasPeriod = dayData?.period;
            const today = isToday(date);
            const future = isFuture(date);
            const selected = selectedDate === dateKey;

            return (
              <button
                key={dateKey}
                onClick={() => handleDayClick(dateKey, future)}
                disabled={future}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                  selected ? 'ring-2 ring-aura-mint' : ''
                } ${
                  hasMood
                    ? moodColors[dayData.mood!]
                    : today
                    ? 'bg-aura-mint-light'
                    : future
                    ? 'bg-aura-slate/5 opacity-50'
                    : 'bg-aura-slate/5'
                }`}
              >
                <span className={`text-xs font-medium ${today ? 'text-aura-mint-dark' : 'text-foreground'}`}>
                  {date.getDate()}
                </span>
                {hasMood && (
                  <span className="text-[10px]">{moodEmojis[dayData.mood!]}</span>
                )}
                {hasPeriod && (
                  <div className="absolute top-0.5 right-0.5">
                    <Droplets size={8} className="text-red-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day details (compact) */}
        {selectedDate && (
          <div className="mt-3 p-3 rounded-lg bg-aura-slate/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {daysData[selectedDate]?.mood && (
                <span className="text-lg">{moodEmojis[daysData[selectedDate].mood!]}</span>
              )}
              <span className="text-sm text-foreground">
                {new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <button
              onClick={() => togglePeriod(selectedDate)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                daysData[selectedDate]?.period
                  ? 'bg-red-100 text-red-600'
                  : 'bg-aura-slate/10 text-aura-slate'
              }`}
            >
              <Droplets size={12} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Развёрнутый вид — полный календарь
  return (
    <div className="card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="h-8 w-8 rounded-lg bg-aura-slate/5 flex items-center justify-center"
        >
          <ChevronLeft size={18} className="text-aura-slate" />
        </button>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={toggleExpanded}
            className="h-6 w-6 rounded-full bg-aura-slate/10 flex items-center justify-center"
          >
            <ChevronUp size={14} className="text-aura-slate" />
          </button>
        </div>
        <button
          onClick={handleNextMonth}
          className="h-8 w-8 rounded-lg bg-aura-slate/5 flex items-center justify-center"
        >
          <ChevronRight size={18} className="text-aura-slate" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-aura-slate/60 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateKey = formatDateKeyFromDay(day);
          const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayData = daysData[dateKey];
          const hasMood = dayData?.mood;
          const hasPeriod = dayData?.period;
          const selected = selectedDate === dateKey;
          const today = isToday(checkDate);
          const future = isFuture(checkDate);

          return (
            <button
              key={dateKey}
              onClick={() => handleDayClick(dateKey, future)}
              disabled={future}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                selected ? 'ring-2 ring-aura-mint ring-offset-1' : ''
              } ${
                hasMood
                  ? moodColors[dayData.mood!]
                  : today
                  ? 'bg-aura-mint-light'
                  : future
                  ? 'bg-aura-slate/5 opacity-50'
                  : 'bg-aura-slate/5'
              }`}
            >
              <span className={`text-xs font-medium ${today ? 'text-aura-mint-dark' : 'text-foreground'}`}>
                {day}
              </span>
              {hasMood && (
                <span className="text-[10px]">{moodEmojis[dayData.mood!]}</span>
              )}
              {hasPeriod && (
                <div className="absolute top-0.5 right-0.5">
                  <Droplets size={8} className="text-red-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day details */}
      {selectedDate && (
        <div className="mt-4 p-3 rounded-xl bg-aura-slate/5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-foreground text-sm">
              {new Date(selectedDate).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
              })}
            </span>
            <button
              onClick={() => togglePeriod(selectedDate)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors ${
                daysData[selectedDate]?.period
                  ? 'bg-red-100 text-red-600'
                  : 'bg-aura-slate/10 text-aura-slate'
              }`}
            >
              <Droplets size={12} />
              <span>{daysData[selectedDate]?.period ? 'Месячные' : 'Отметить'}</span>
            </button>
          </div>

          {daysData[selectedDate]?.mood ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{moodEmojis[daysData[selectedDate].mood!]}</span>
              <div>
                <div className="text-xs font-medium text-foreground">Настроение</div>
                <div className="text-[10px] text-aura-slate/60">
                  Энергия: {daysData[selectedDate].energy}/5
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-aura-slate/60">Нет данных</p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex gap-3">
        <div className="flex items-center gap-1 text-[10px] text-aura-slate/60">
          <Droplets size={10} className="text-red-400" />
          <span>Месячные</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-aura-slate/60">
          <span>😊</span>
          <span>Настроение</span>
        </div>
      </div>
    </div>
  );
}
