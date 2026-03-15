'use client';

// Course data and types for the Library section

export type CourseId =
  | 'anti-anxiety'
  | 'identity-mirror'
  | 'metabolic-flow'
  | 'face-sculptor'
  | 'inner-energy'
  | 'sleep-intelligence'
  | 'social-detox'
  | 'deep-focus';

export interface Session {
  id: string;
  title: string;
  duration: string; // e.g., "10 min"
  durationSeconds: number;
  isLocked: boolean; // false for first 2 sessions
  audioSrc?: string;
  dailyTask?: string; // Daily habit task
}

export interface Course {
  id: CourseId;
  title: string;
  subtitle: string;
  problem: string;
  neuroEffect: string;
  outcome: string;
  duration: string; // e.g., "7 дней по 10 минут"
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  sessions: Session[];
  // Weighting for AuraMap axes
  weights: {
    cortisolResistance: number;
    neuroFocus: number;
    somaticCalm: number;
    regeneration: number;
    emotionalEQ: number;
  };
}

export const courses: Course[] = [
  {
    id: 'anti-anxiety',
    title: 'Анти-Тревога',
    subtitle: 'Программа нейтрализации стресса',
    problem: 'Фоновый стресс, суета',
    neuroEffect: 'Подавление активности амигдалы',
    outcome: 'Состояние «холодного спокойствия»',
    duration: '7 дней по 10 минут',
    color: '#B8E0D4',
    gradientFrom: '#B8E0D4',
    gradientTo: '#8BCFC0',
    icon: '🧘',
    weights: {
      cortisolResistance: 30,
      neuroFocus: 10,
      somaticCalm: 20,
      regeneration: 10,
      emotionalEQ: 30,
    },
    sessions: [
      { id: 'aa-1', title: 'Диафрагмальный сброс', duration: '10 мин', durationSeconds: 600, isLocked: false, dailyTask: 'Сделайте 5 глубоких вдохов перед каждым приёмом пищи' },
      { id: 'aa-2', title: 'Точка покоя', duration: '12 мин', durationSeconds: 720, isLocked: false, dailyTask: 'Найдите 2 минуты тишины в середине дня' },
      { id: 'aa-3', title: 'Освобождение плеч', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Расслабляйте плечи каждый час' },
      { id: 'aa-4', title: 'Волна безопасности', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Перед сном визуализируйте защитный кокон' },
      { id: 'aa-5', title: 'Нейтрализация триггеров', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Запишите один тревожный триггер и его антидот' },
      { id: 'aa-6', title: 'Внутренний наблюдатель', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Практикуйте отстранённое наблюдение за мыслями' },
      { id: 'aa-7', title: 'Интеграция покоя', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Создайте личный ритуал завершения дня' },
    ],
  },
  {
    id: 'identity-mirror',
    title: 'Зеркало Идентичности',
    subtitle: 'Реконструкция самооценки',
    problem: 'Низкая самооценка',
    neuroEffect: 'Реконструкция нейронных связей в ВМПК',
    outcome: 'Новое самоощущение и уверенность',
    duration: '7 дней по 12 минут',
    color: '#D4C5E2',
    gradientFrom: '#D4C5E2',
    gradientTo: '#B9A6CC',
    icon: '🪞',
    weights: {
      cortisolResistance: 10,
      neuroFocus: 15,
      somaticCalm: 10,
      regeneration: 5,
      emotionalEQ: 60,
    },
    sessions: [
      { id: 'im-1', title: 'Встреча с собой', duration: '12 мин', durationSeconds: 720, isLocked: false, dailyTask: 'Напишите 3 вещи, за которые вы благодарны себе' },
      { id: 'im-2', title: 'Голос критика', duration: '10 мин', durationSeconds: 600, isLocked: false, dailyTask: 'Отследите внутреннего критика и дайте ему имя' },
      { id: 'im-3', title: 'Переписывание истории', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Перепишите одну негативную историю о себе' },
      { id: 'im-4', title: 'Телесное присутствие', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Практикуйте уверенную позу 2 минуты утром' },
      { id: 'im-5', title: 'Границы силы', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Скажите "нет" одной незначительной просьбе' },
      { id: 'im-6', title: 'Архетип королевы', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Визуализируйте себя в состоянии полной силы' },
      { id: 'im-7', title: 'Новая идентичность', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Создайте аффирмацию вашей новой идентичности' },
    ],
  },
  {
    id: 'metabolic-flow',
    title: 'Метаболический поток',
    subtitle: 'Запуск естественного жиросжигания',
    problem: 'Лишний вес, отёки',
    neuroEffect: 'Настройка связи гипоталамус-надпочечники',
    outcome: 'Лёгкость в теле и запуск жиросжигания',
    duration: '7 дней по 10 минут',
    color: '#F5CEB8',
    gradientFrom: '#F5CEB8',
    gradientTo: '#E8B598',
    icon: '🔥',
    weights: {
      cortisolResistance: 20,
      neuroFocus: 5,
      somaticCalm: 15,
      regeneration: 50,
      emotionalEQ: 10,
    },
    sessions: [
      { id: 'mf-1', title: 'Пробуждение метаболизма', duration: '10 мин', durationSeconds: 600, isLocked: false, dailyTask: 'Выпейте стакан тёплой воды с лимоном натощак' },
      { id: 'mf-2', title: 'Лимфатическая волна', duration: '12 мин', durationSeconds: 720, isLocked: false, dailyTask: 'Сделайте 5 минут сухого массажа щёткой' },
      { id: 'mf-3', title: 'Гормональный баланс', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Откажитесь от сахара до обеда' },
      { id: 'mf-4', title: 'Детокс системы', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Добавьте зелёный смузи в рацион' },
      { id: 'mf-5', title: 'Активация бурого жира', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Примите контрастный душ утром' },
      { id: 'mf-6', title: 'Интуитивный голод', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Ешьте только при настоящем голоде' },
      { id: 'mf-7', title: 'Метаболическая свобода', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Создайте план питания на неделю' },
    ],
  },
  {
    id: 'face-sculptor',
    title: 'Скульптор лица',
    subtitle: 'Естественный лифтинг и чёткость овала',
    problem: 'Возрастные изменения',
    neuroEffect: 'Снятие спазмов и запуск лимфодренажа',
    outcome: 'Чёткий овал и свежий взгляд',
    duration: '7 дней по 8 минут',
    color: '#FFD93D',
    gradientFrom: '#FFE4D4',
    gradientTo: '#F5CEB8',
    icon: '✨',
    weights: {
      cortisolResistance: 10,
      neuroFocus: 5,
      somaticCalm: 35,
      regeneration: 45,
      emotionalEQ: 5,
    },
    sessions: [
      { id: 'fs-1', title: 'Освобождение челюсти', duration: '8 мин', durationSeconds: 480, isLocked: false, dailyTask: 'Расслабляйте челюсть каждые 2 часа' },
      { id: 'fs-2', title: 'Скулы и контур', duration: '10 мин', durationSeconds: 600, isLocked: false, dailyTask: 'Массируйте скулы после умывания' },
      { id: 'fs-3', title: 'Лимфодренаж шеи', duration: '8 мин', durationSeconds: 480, isLocked: true, dailyTask: 'Делайте наклоны головы каждое утро' },
      { id: 'fs-4', title: 'Зона вокруг глаз', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Откажитесь от телефона за час до сна' },
      { id: 'fs-5', title: 'Лоб без морщин', duration: '8 мин', durationSeconds: 480, isLocked: true, dailyTask: 'Отслеживайте напряжение во лбу' },
      { id: 'fs-6', title: 'Губы и носогубки', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Практикуйте артикуляционную гимнастику' },
      { id: 'fs-7', title: 'Сияние изнутри', duration: '8 мин', durationSeconds: 480, isLocked: true, dailyTask: 'Увеличьте потребление воды до 2 литров' },
    ],
  },
  {
    id: 'inner-energy',
    title: 'Энергия изнутри',
    subtitle: 'Реактивация жизненной силы',
    problem: 'Выгорание, апатия',
    neuroEffect: 'Реактивация дофаминовых рецепторов',
    outcome: 'Драйв без внешних стимуляторов',
    duration: '7 дней по 12 минут',
    color: '#FF6B6B',
    gradientFrom: '#FFE4D4',
    gradientTo: '#FFCBA4',
    icon: '⚡',
    weights: {
      cortisolResistance: 25,
      neuroFocus: 20,
      somaticCalm: 10,
      regeneration: 35,
      emotionalEQ: 10,
    },
    sessions: [
      { id: 'ie-1', title: 'Пробуждение тела', duration: '12 мин', durationSeconds: 720, isLocked: false, dailyTask: 'Начните день с 5 минут движения' },
      { id: 'ie-2', title: 'Дофаминовый детокс', duration: '10 мин', durationSeconds: 600, isLocked: false, dailyTask: 'Откажитесь от соцсетей до обеда' },
      { id: 'ie-3', title: 'Ресурс надпочечников', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Добавьте адаптогены в утренний напиток' },
      { id: 'ie-4', title: 'Митохондриальный буст', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Практикуйте холодовое воздействие' },
      { id: 'ie-5', title: 'Ритм активности', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Работайте циклами 52/17 минут' },
      { id: 'ie-6', title: 'Страсть и цель', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Запишите, что вас по-настоящему вдохновляет' },
      { id: 'ie-7', title: 'Устойчивая энергия', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Создайте энергетический ритуал на каждый день' },
    ],
  },
  {
    id: 'sleep-intelligence',
    title: 'Интеллект сна',
    subtitle: 'Глубокое восстановление',
    problem: 'Бессонница, разбитость',
    neuroEffect: 'Синхронизация циркадных ритмов',
    outcome: 'Пробуждение в состоянии «заряжена»',
    duration: '7 дней по 15 минут',
    color: '#6B5B95',
    gradientFrom: '#EBE4F2',
    gradientTo: '#D4C5E2',
    icon: '🌙',
    weights: {
      cortisolResistance: 20,
      neuroFocus: 15,
      somaticCalm: 25,
      regeneration: 35,
      emotionalEQ: 5,
    },
    sessions: [
      { id: 'si-1', title: 'Вечерний ритуал', duration: '15 мин', durationSeconds: 900, isLocked: false, dailyTask: 'Создайте световой режим: тёплый свет после 20:00' },
      { id: 'si-2', title: 'Освобождение дня', duration: '12 мин', durationSeconds: 720, isLocked: false, dailyTask: 'Запишите 3 благодарности перед сном' },
      { id: 'si-3', title: 'Глубокое расслабление', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Практикуйте прогрессивную релаксацию' },
      { id: 'si-4', title: 'Циркадная настройка', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Получите 10 минут утреннего света' },
      { id: 'si-5', title: 'Архитектура сна', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Оптимизируйте температуру спальни' },
      { id: 'si-6', title: 'Исцеление во сне', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Используйте white noise или бинауральные биты' },
      { id: 'si-7', title: 'Пробуждение силы', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Вставайте в одно время каждый день' },
    ],
  },
  {
    id: 'social-detox',
    title: 'Социальный детокс',
    subtitle: 'Иммунитет к мнению окружающих',
    problem: 'Страх критики, нарушенные границы',
    neuroEffect: 'Снижение социальной реактивности',
    outcome: 'Неуязвимость к мнению окружающих',
    duration: '7 дней по 10 минут',
    color: '#88D8B0',
    gradientFrom: '#C5D5CB',
    gradientTo: '#A8C5B5',
    icon: '🛡️',
    weights: {
      cortisolResistance: 25,
      neuroFocus: 10,
      somaticCalm: 15,
      regeneration: 5,
      emotionalEQ: 45,
    },
    sessions: [
      { id: 'sd-1', title: 'Энергетические границы', duration: '10 мин', durationSeconds: 600, isLocked: false, dailyTask: 'Визуализируйте защитное поле вокруг себя' },
      { id: 'sd-2', title: 'Детокс от одобрения', duration: '12 мин', durationSeconds: 720, isLocked: false, dailyTask: 'Сделайте что-то для себя, не для других' },
      { id: 'sd-3', title: 'Фильтр критики', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Отследите, чью критику вы принимаете близко' },
      { id: 'sd-4', title: 'Внутренняя опора', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Примите решение без чужого совета' },
      { id: 'sd-5', title: 'Токсичные связи', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Сократите контакт с одним энергетическим вампиром' },
      { id: 'sd-6', title: 'Аутентичность', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Выразите своё мнение, даже если оно непопулярно' },
      { id: 'sd-7', title: 'Суверенитет личности', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Создайте манифест ваших ценностей' },
    ],
  },
  {
    id: 'deep-focus',
    title: 'Глубокий Фокус',
    subtitle: 'Сверхпродуктивность без истощения',
    problem: 'Когнитивный туман',
    neuroEffect: 'Усиление когерентности полушарий',
    outcome: 'Сверхпродуктивность в делах',
    duration: '7 дней по 10 минут',
    color: '#4ECDC4',
    gradientFrom: '#D4EFE9',
    gradientTo: '#B8E0D4',
    icon: '🎯',
    weights: {
      cortisolResistance: 15,
      neuroFocus: 60,
      somaticCalm: 10,
      regeneration: 10,
      emotionalEQ: 5,
    },
    sessions: [
      { id: 'df-1', title: 'Очищение ума', duration: '10 мин', durationSeconds: 600, isLocked: false, dailyTask: 'Запишите все мысли на бумагу (brain dump)' },
      { id: 'df-2', title: 'Однозадачность', duration: '12 мин', durationSeconds: 720, isLocked: false, dailyTask: 'Работайте над одной задачей 25 минут без перерыва' },
      { id: 'df-3', title: 'Когнитивный прайминг', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Начните день с самой сложной задачи' },
      { id: 'df-4', title: 'Устранение отвлечений', duration: '15 мин', durationSeconds: 900, isLocked: true, dailyTask: 'Отключите уведомления на 2 часа' },
      { id: 'df-5', title: 'Поток сознания', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Найдите своё время пиковой продуктивности' },
      { id: 'df-6', title: 'Стратегические паузы', duration: '12 мин', durationSeconds: 720, isLocked: true, dailyTask: 'Делайте 5-минутные паузы каждые 90 минут' },
      { id: 'df-7', title: 'Мастерство фокуса', duration: '10 мин', durationSeconds: 600, isLocked: true, dailyTask: 'Создайте идеальную среду для концентрации' },
    ],
  },
];

// Neuro-status levels
export interface NeuroStatus {
  level: number;
  name: string;
  description: string;
  daysRequired: number;
}

export const neuroStatuses: NeuroStatus[] = [
  { level: 1, name: 'Стабилизация', description: 'Мозг учится выходить из режима тревоги', daysRequired: 3 },
  { level: 2, name: 'Пластичность', description: 'Начало формирования новых нейронных путей', daysRequired: 7 },
  { level: 3, name: 'Когерентность', description: 'Синхронизация работы полушарий и тела', daysRequired: 14 },
  { level: 4, name: 'Суверенитет', description: 'Новые привычки стали частью личности', daysRequired: 21 },
];

// Achievement popup types
export interface AchievementPopup {
  id: string;
  trigger: 'first_practice' | 'streak_3' | 'course_complete' | 'improvement';
  title: string;
  description: string;
  icon: string;
}

export const achievementPopups: AchievementPopup[] = [
  {
    id: 'first_practice',
    trigger: 'first_practice',
    title: 'Система синхронизирована',
    description: 'Вы только что совершили первый осознанный разрыв «кортизоловой петли». Гипоталамус получил сигнал безопасности. Начало положено.',
    icon: '🔗',
  },
  {
    id: 'streak_3',
    trigger: 'streak_3',
    title: 'Адаптация запущена',
    description: 'Три дня последовательной работы позволили вашей нервной системе снизить порог реактивности. Вы становитесь менее уязвимы к внешним раздражителям.',
    icon: '✨',
  },
  {
    id: 'course_complete',
    trigger: 'course_complete',
    title: 'Нейронный апгрейд завершён',
    description: 'Вы успешно деактивировали деструктивные паттерны. Этот ресурс теперь свободен для вашего творчества и роста. Вы — архитектор своего покоя.',
    icon: '🧠',
  },
  {
    id: 'improvement',
    trigger: 'improvement',
    title: 'Биологический триумф',
    description: 'Анализ данных показывает положительную динамику. Ваша структура становится чётче. Это результат вашей дисциплины.',
    icon: '📈',
  },
];

// Helper functions
export function getCourseById(id: CourseId): Course | undefined {
  return courses.find(course => course.id === id);
}

export function calculateNeuroStatus(totalDays: number): NeuroStatus {
  const sortedStatuses = [...neuroStatuses].sort((a, b) => b.daysRequired - a.daysRequired);
  return sortedStatuses.find(status => totalDays >= status.daysRequired) || neuroStatuses[0];
}

export function getUnlockedSessions(course: Course, isPremium: boolean): Session[] {
  if (isPremium) return course.sessions;
  return course.sessions.filter((_, index) => index < 2);
}
