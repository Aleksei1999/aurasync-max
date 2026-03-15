'use client';

import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Sunrise, CloudSun, Headphones, Droplets, BookOpen, ChevronRight, X, Check, Play, Pause, Sparkles, Flame, Info } from 'lucide-react';

// Тултипы для элементов
interface Tooltip {
  id: string;
  title: string;
  description: string;
}

const tooltips: Record<string, Tooltip> = {
  streak: {
    id: 'streak',
    title: 'Серия дней',
    description: 'Количество дней подряд, когда вы заходите в приложение. После 7 дней начинается нейропластичность!',
  },
  checklist: {
    id: 'checklist',
    title: 'Быстрые отметки',
    description: 'Нажмите на квадрат, чтобы отметить выполнение. Не нужно открывать практику — просто тап!',
  },
};

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';
type RecommendationType = 'listen' | 'read' | 'checklist';

interface Recommendation {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  type: RecommendationType;
  hasVideo?: boolean;
  audioSrc?: string;
  content: {
    description: string;
    sections: {
      title: string;
      items: string[];
    }[];
    preparation?: string[];
    note?: string;
    buttonText: string;
  };
}

interface TimeConfig {
  greeting: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  suggestion: string;
}

const timeConfigs: Record<TimeOfDay, TimeConfig> = {
  morning: {
    greeting: 'Доброе утро',
    icon: Sunrise,
    gradient: 'bg-morning',
    suggestion: 'Начни день с намерением',
  },
  day: {
    greeting: 'Добрый день',
    icon: Sun,
    gradient: 'bg-day',
    suggestion: 'Сохраняй фокус и баланс',
  },
  evening: {
    greeting: 'Добрый вечер',
    icon: CloudSun,
    gradient: 'bg-evening',
    suggestion: 'Время расслабиться и отпустить день',
  },
  night: {
    greeting: 'Доброй ночи',
    icon: Moon,
    gradient: 'bg-evening',
    suggestion: 'Подготовься к глубокому сну',
  },
};

// Сообщения при выполнении задач
const completionMessages: Record<string, { title: string; message: string }> = {
  dopamine_code: {
    title: 'Практика завершена!',
    message: 'Ты запустила процесс перезагрузки нервной системы. Кортизол уже снижается.'
  },
  water_passport: {
    title: 'Отлично!',
    message: 'Каждый глоток воды — это шаг к ясной голове и свежему лицу.'
  },
  jaw_relaxation: {
    title: 'Челюсть расслаблена!',
    message: 'Ты только что разорвала нейронную петлю стресса. Лицо уже благодарит тебя.'
  },
  alpha_immersion: {
    title: 'Готова ко сну!',
    message: 'Альфа-волны активированы. Сегодня ночью твой мозг восстановится на 100%.'
  }
};

const recommendations: Recommendation[] = [
  {
    id: 'dopamine_code',
    title: 'Код Дофамина',
    subtitle: 'Утренняя прошивка',
    duration: '7 мин',
    type: 'listen',
    audioSrc: '/audio/dopamine-code.wav',
    content: {
      description: '7 минут, чтобы перехватить управление своей биохимией и выйти из режима «выживания».',
      sections: [
        {
          title: 'Что внутри',
          items: [
            'Сброс стресса: Дыхательный ритм 4-2-6 для принудительного снижения кортизола',
            'Нейро-апгрейд: Активация центров радости и фокуса через визуализацию',
            'Эстетика: Снятие мышечных зажимов лица — естественный лифтинг'
          ]
        }
      ],
      preparation: [
        'Наушники (обязательно для бинауральных ритмов)',
        'Прямая спина (сигнал мозгу о вашей уверенности)'
      ],
      note: 'Результат накопительный. Сегодня вы создаёте нейронную связь, через 21 день она станет вашей новой чертой характера.',
      buttonText: 'Начать практику'
    }
  },
  {
    id: 'water_passport',
    title: 'Водный паспорт',
    subtitle: 'Персональный лимит',
    duration: '1 мин',
    type: 'read',
    content: {
      description: 'Настройка биологического растворителя. Твоя норма: 30 мл на 1 кг веса.',
      sections: [
        {
          title: 'Зачем это нужно',
          items: [
            'Молекулярный клининг: Кортизол и продукты его распада — это токсичный «мусор». Чтобы вымыть его из тканей и убрать «кортизоловое лицо», организму нужен растворитель.',
            'Проводимость мозга: Твои нейроны погружены в спинномозговую жидкость. При обезвоживании она становится вязкой, что замедляет передачу импульсов.',
            'Запуск лимфодренажа: Лимфа не имеет насоса. Чтобы она не превращалась в «болото», нужен объём жидкости.'
          ]
        },
        {
          title: 'Инструкция',
          items: [
            'Метод: Пей порциями по 200 мл каждые 1.5–2 часа',
            'Визуализация: Представь, что каждый глоток очищает твою систему'
          ]
        }
      ],
      note: 'Твой результат: Устранение «когнитивного тумана» и возвращение острых скул уже через 24 часа.',
      buttonText: 'Отметить в чек-листе'
    }
  },
  {
    id: 'jaw_relaxation',
    title: 'Маска спокойствия',
    subtitle: 'Расслабление жевательных',
    duration: '2 мин',
    type: 'read',
    hasVideo: true,
    content: {
      description: 'Твоё лицо — это не просто зеркало души, это биометрический терминал твоей нервной системы. Жевательные мышцы (masseters) — самые сильные мышцы в теле относительно своего размера и главные «депозитарии» твоего социального стресса.',
      sections: [
        {
          title: 'Зачем тебе это нужно',
          items: [
            'Разрыв нейронной петли страха: Когда ты злишься, терпишь или сверх-концентрируешься, ты сжимаешь челюсть. Это посылает мгновенный сигнал в амигдалу (центр страха): «Мы в опасности!». Разомкнув зубы, ты физически обрываешь этот сигнал.',
            'Ликвидация «кортизолового лица»: Хронический спазм жевательных мышц блокирует лимфоток и кровообращение в нижней трети лица. Снижение тонуса в этой зоне — самый быстрый способ вернуть лицу «скулы топ-модели» без филлеров.',
            'Выход из DMN: Расслабленная челюсть останавливает бесконечную «жвачку» тревожных мыслей в голове.'
          ]
        },
        {
          title: 'Инструкция',
          items: [
            'Зубы: Всегда разомкнуты (расстояние 3-5 мм)',
            'Губы: Мягко сомкнуты',
            'Язык: Кончик слегка касается верхнего нёба сразу за передними зубами (позиция «М-н»)',
            'Когда: Всегда, когда ты за экраном, в пробке или читаешь этот текст'
          ]
        }
      ],
      note: 'Соматический хак для обнуления стресса и лифтинга лица.',
      buttonText: 'Отметить в чек-листе'
    }
  },
  {
    id: 'alpha_immersion',
    title: 'Альфа-погружение',
    subtitle: 'Ночной ремонт',
    duration: '5 мин',
    type: 'listen',
    audioSrc: '/audio/alpha-immersion.wav',
    content: {
      description: '5 минут, чтобы переключить мозг с частоты дневного хаоса на волну глубокой регенерации.',
      sections: [
        {
          title: 'Зачем это нужно',
          items: [
            'Очистка «кэша»: Мы принудительно выключаем режим фоновой «мыслежвачки» (DMN), останавливая тревожные диалоги и списки дел',
            'Синхронизация нейронов: Альфа-ритмы готовят систему к фазе глубокого сна — именно в ней происходит реальный ремонт тканей и «лифтинг» лица',
            'Гормональный мост: Финальное подавление остаточного кортизола, чтобы дать дорогу мелатонину — вашему главному антиоксиданту'
          ]
        }
      ],
      preparation: [
        'Наушники (необходимы для работы частот)',
        'Горизонтальное положение и полная темнота'
      ],
      note: 'Ваш результат: Быстрое «проваливание» в сон и пробуждение с абсолютно ясным умом, без чувства разбитости.',
      buttonText: 'Слушать практику'
    }
  }
];

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getRecommendationIcon(type: RecommendationType) {
  switch (type) {
    case 'listen':
      return Headphones;
    case 'read':
      return BookOpen;
    case 'checklist':
      return Check;
    default:
      return Droplets;
  }
}

function getRecommendationLabel(type: RecommendationType) {
  switch (type) {
    case 'listen':
      return 'Слушать';
    case 'read':
      return 'Читать';
    case 'checklist':
      return 'Чек-лист';
    default:
      return '';
  }
}

interface BioClockProps {
  userName?: string;
  onStartPractice?: () => void;
}

export function BioClock({ userName }: BioClockProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [currentTime, setCurrentTime] = useState('');
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [streak, setStreak] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [dismissedTooltips, setDismissedTooltips] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Загрузка скрытых тултипов
  useEffect(() => {
    const saved = localStorage.getItem('aura_dismissed_tooltips');
    if (saved) {
      setDismissedTooltips(JSON.parse(saved));
    }
  }, []);

  // Показываем тултип для новых пользователей
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('aura_tooltips_seen');
    if (isFirstVisit && !dismissedTooltips.includes('first_visit')) {
      setTimeout(() => {
        setActiveTooltip('first_visit');
      }, 1500);
    }
  }, [dismissedTooltips]);

  const dismissTooltip = (tooltipId: string, permanent = false) => {
    setActiveTooltip(null);
    if (permanent) {
      const newDismissed = [...dismissedTooltips, tooltipId];
      setDismissedTooltips(newDismissed);
      localStorage.setItem('aura_dismissed_tooltips', JSON.stringify(newDismissed));

      // Отмечаем что тултипы были показаны
      if (tooltipId === 'first_visit') {
        localStorage.setItem('aura_tooltips_seen', 'true');
      }
    }
  };

  const showTooltip = (tooltipId: string) => {
    if (!dismissedTooltips.includes(tooltipId)) {
      setActiveTooltip(tooltipId);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      setTimeOfDay(getTimeOfDay());
      setCurrentTime(new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('aura_completed_tasks');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) {
        setCompletedTasks(data.tasks);
      }
    }
  }, []);

  // Streak tracking
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toDateString();

    const savedStreak = localStorage.getItem('aura_streak');
    if (savedStreak) {
      const data = JSON.parse(savedStreak);
      const lastDate = new Date(data.lastVisit);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (data.lastVisit === todayStr) {
        // Already visited today
        setStreak(data.streak);
      } else if (diffDays === 1) {
        // Visited yesterday - continue streak
        const newStreak = data.streak + 1;
        setStreak(newStreak);
        localStorage.setItem('aura_streak', JSON.stringify({
          streak: newStreak,
          lastVisit: todayStr,
          longestStreak: Math.max(data.longestStreak || 0, newStreak)
        }));
      } else if (diffDays > 1) {
        // Missed a day - reset streak
        setStreak(1);
        localStorage.setItem('aura_streak', JSON.stringify({
          streak: 1,
          lastVisit: todayStr,
          longestStreak: data.longestStreak || data.streak
        }));
      }
    } else {
      // First visit ever
      setStreak(1);
      localStorage.setItem('aura_streak', JSON.stringify({
        streak: 1,
        lastVisit: todayStr,
        longestStreak: 1
      }));
    }
  }, []);

  const handleComplete = (id: string, showToast = true) => {
    const wasCompleted = completedTasks.includes(id);
    const newTasks = wasCompleted
      ? completedTasks.filter(t => t !== id)
      : [...completedTasks, id];

    setCompletedTasks(newTasks);
    localStorage.setItem('aura_completed_tasks', JSON.stringify({
      date: new Date().toDateString(),
      tasks: newTasks
    }));

    // Show toast only when completing (not uncompleting)
    if (!wasCompleted && showToast && completionMessages[id]) {
      setToast(completionMessages[id]);
      setTimeout(() => setToast(null), 3000);
    }

    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setSelectedRec(null);
  };

  const handleCloseModal = () => {
    // Stop audio when closing modal
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
    setSelectedRec(null);
  };

  const togglePlayPause = () => {
    if (!selectedRec?.audioSrc) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(selectedRec.audioSrc);
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setAudioProgress(progress);
          setAudioCurrentTime(audioRef.current.currentTime);
        }
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setAudioDuration(audioRef.current.duration);
        }
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioProgress(0);
        setAudioCurrentTime(0);
        // Mark as completed when audio ends
        if (selectedRec) {
          handleComplete(selectedRec.id);
        }
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * audioDuration;
  };

  const config = timeConfigs[timeOfDay];

  // Компонент тултипа
  const TooltipBubble = ({ tooltip, onDismiss, position = 'bottom' }: { tooltip: Tooltip; onDismiss: () => void; position?: 'top' | 'bottom' }) => (
    <div className={`absolute z-50 w-64 animate-fade-in ${position === 'top' ? 'bottom-full mb-2 right-0' : 'top-full mt-2 right-0'}`}>
      <div className="bg-foreground text-white rounded-2xl p-4 shadow-xl">
        <h4 className="font-semibold text-sm mb-1">{tooltip.title}</h4>
        <p className="text-xs text-white/80 leading-relaxed">{tooltip.description}</p>
        <button
          onClick={onDismiss}
          className="mt-3 w-full py-2 bg-white/20 rounded-xl text-xs font-medium text-white"
        >
          Понятно
        </button>
      </div>
      {/* Arrow */}
      <div className={`absolute right-4 w-0 h-0 border-8 border-transparent ${position === 'top' ? 'top-full border-t-foreground' : 'bottom-full border-b-foreground'}`} />
    </div>
  );

  return (
    <>
      {/* First Visit Tooltip - Fixed overlay */}
      {activeTooltip === 'first_visit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="mx-6 max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center mb-4">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Добро пожаловать!</h3>
              <p className="text-sm text-aura-slate/70 leading-relaxed mb-6">
                Нажмите на любую практику, чтобы узнать подробности и начать трансформацию
              </p>
              <button
                onClick={() => dismissTooltip('first_visit', true)}
                className="w-full py-3 bg-gradient-to-r from-aura-mint to-aura-mint-dark text-white font-semibold rounded-xl"
              >
                Начать
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${config.gradient} rounded-3xl p-6 animated-gradient`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-aura-slate/70 font-medium">{currentTime}</p>
            <h2 className="text-2xl font-semibold text-foreground">
              {config.greeting}{userName ? `, ${userName}` : ''}
            </h2>
          </div>
          {/* Streak Badge with Tooltip */}
          {streak > 0 && (
            <div className="relative">
              <button
                onClick={() => showTooltip('streak')}
                className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 transition-transform active:scale-95"
              >
                <Flame size={16} className={streak >= 7 ? 'text-orange-500' : 'text-aura-mint'} />
                <span className={`text-sm font-semibold ${streak >= 7 ? 'text-orange-500' : 'text-foreground'}`}>
                  {streak}
                </span>
                <span className="text-xs text-aura-slate/60">
                  {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}
                </span>
              </button>
              {activeTooltip === 'streak' && (
                <TooltipBubble
                  tooltip={tooltips.streak}
                  onDismiss={() => dismissTooltip('streak', false)}
                  position="bottom"
                />
              )}
            </div>
          )}
        </div>

        {/* Suggestion */}
        <p className="text-aura-slate/80 mb-4">{config.suggestion}</p>

        {/* 4 Recommendations */}
        <div className="space-y-2">
          <p className="text-xs text-aura-slate/60 uppercase tracking-wide">
            Твоя программа на сегодня
          </p>
          {recommendations.map((rec) => {
            const Icon = getRecommendationIcon(rec.type);
            const isCompleted = completedTasks.includes(rec.id);

            return (
              <button
                key={rec.id}
                onClick={() => setSelectedRec(rec)}
                className={`w-full glass rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.99] ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-aura-mint/30'
                    : 'bg-gradient-to-br from-aura-mint/20 to-aura-lavender/20'
                }`}>
                  {isCompleted ? (
                    <Check size={20} className="text-aura-mint" />
                  ) : (
                    <Icon size={20} className="text-aura-mint" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`font-medium text-foreground ${isCompleted ? 'line-through' : ''}`}>
                    {rec.title}
                  </h3>
                  <p className="text-xs text-aura-slate/70">
                    {rec.subtitle} · {rec.duration} · {getRecommendationLabel(rec.type)}
                  </p>
                </div>
                <ChevronRight size={18} className="text-aura-slate/40" />
              </button>
            );
          })}
        </div>

        {/* Quick Checklist */}
        <div className="mt-4 pt-4 border-t border-white/20 relative">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-aura-slate/60 uppercase tracking-wide">
              Быстрый чек-лист
            </p>
            <button
              onClick={() => showTooltip('checklist')}
              className="h-6 w-6 rounded-full bg-white/30 flex items-center justify-center transition-transform active:scale-90"
            >
              <Info size={12} className="text-aura-slate/50" />
            </button>
          </div>
          {/* Checklist Tooltip */}
          {activeTooltip === 'checklist' && (
            <TooltipBubble
              tooltip={tooltips.checklist}
              onDismiss={() => dismissTooltip('checklist', false)}
              position="top"
            />
          )}
          <div className="flex gap-2">
            {recommendations.map((rec) => {
              const isCompleted = completedTasks.includes(rec.id);
              const Icon = getRecommendationIcon(rec.type);

              return (
                <button
                  key={rec.id}
                  onClick={() => handleComplete(rec.id, true)}
                  className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    isCompleted
                      ? 'bg-aura-mint/30 scale-95'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-aura-mint' : 'bg-white/70'
                  }`}>
                    {isCompleted ? (
                      <Check size={16} className="text-white" />
                    ) : (
                      <Icon size={16} className="text-aura-slate/60" />
                    )}
                  </div>
                  <span className={`text-[10px] text-center leading-tight ${
                    isCompleted ? 'text-aura-mint font-medium' : 'text-aura-slate/60'
                  }`}>
                    {rec.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-xs text-aura-slate/50 mt-2">
            {completedTasks.length}/{recommendations.length} выполнено
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedRec && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-aura-slate/10 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
                  {(() => {
                    const Icon = getRecommendationIcon(selectedRec.type);
                    return <Icon size={20} className="text-white" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedRec.title}</h3>
                  <p className="text-xs text-aura-slate/60">{selectedRec.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="h-8 w-8 rounded-full bg-aura-slate/10 flex items-center justify-center"
              >
                <X size={18} className="text-aura-slate" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-5 py-6 overflow-auto max-h-[calc(85vh-140px)]">
              {/* Description */}
              <p className="text-aura-slate/80 leading-relaxed mb-6">
                {selectedRec.content.description}
              </p>

              {/* Sections */}
              {selectedRec.content.sections.map((section, idx) => (
                <div key={idx} className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">{section.title}</h4>
                  <div className="space-y-3">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="h-2 w-2 rounded-full bg-aura-mint mt-2 flex-shrink-0" />
                        <p className="text-sm text-aura-slate/80 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Audio Player */}
              {selectedRec.audioSrc && (
                <div className="mb-6 bg-gradient-to-br from-aura-mint/10 to-aura-lavender/10 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlayPause}
                      className="h-14 w-14 rounded-full bg-gradient-to-br from-aura-mint to-aura-mint-dark flex items-center justify-center flex-shrink-0 shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause size={24} className="text-white" />
                      ) : (
                        <Play size={24} className="text-white ml-1" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div
                        className="h-2 bg-aura-slate/20 rounded-full overflow-hidden cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-aura-mint to-aura-lavender transition-all duration-100"
                          style={{ width: `${audioProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-aura-slate/60">
                        <span>{formatTime(audioCurrentTime)}</span>
                        <span>{audioDuration ? formatTime(audioDuration) : selectedRec.duration}</span>
                      </div>
                    </div>
                  </div>
                  {isPlaying && (
                    <p className="text-center text-xs text-aura-mint mt-3 animate-pulse">
                      Воспроизведение...
                    </p>
                  )}
                </div>
              )}

              {/* Preparation */}
              {selectedRec.content.preparation && (
                <div className="mb-6 bg-aura-mint/10 rounded-2xl p-4">
                  <h4 className="font-semibold text-foreground mb-3">Подготовка</h4>
                  <div className="space-y-2">
                    {selectedRec.content.preparation.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check size={16} className="text-aura-mint flex-shrink-0" />
                        <p className="text-sm text-aura-slate/80">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Placeholder */}
              {selectedRec.hasVideo && (
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Видео-инструкция</h4>
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-aura-slate/10 to-aura-slate/5 flex flex-col items-center justify-center border-2 border-dashed border-aura-slate/20">
                    <div className="h-14 w-14 rounded-full bg-aura-slate/10 flex items-center justify-center mb-3">
                      <Play size={24} className="text-aura-slate/40 ml-1" />
                    </div>
                    <p className="text-sm text-aura-slate/50">Видео скоро появится</p>
                  </div>
                </div>
              )}

              {/* Note */}
              {selectedRec.content.note && (
                <div className="bg-aura-lavender/10 rounded-2xl p-4 mb-6">
                  <p className="text-sm text-aura-slate/80 leading-relaxed italic">
                    {selectedRec.content.note}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-aura-slate/10 px-5 py-4 safe-area-bottom">
              <button
                onClick={() => handleComplete(selectedRec.id)}
                className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 ${
                  completedTasks.includes(selectedRec.id)
                    ? 'bg-aura-slate/50'
                    : 'bg-gradient-to-r from-aura-mint to-aura-mint-dark'
                }`}
              >
                {completedTasks.includes(selectedRec.id) ? (
                  <>
                    <Check size={20} />
                    Выполнено
                  </>
                ) : (
                  selectedRec.content.buttonText
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-aura-mint to-aura-lavender rounded-2xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{toast.title}</h4>
                <p className="text-sm text-white/90 mt-0.5">{toast.message}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-white/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
