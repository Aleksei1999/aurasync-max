// Матрица Судьбы - 22 энергии (арканы)
// Основано на методе Наталии Ладини

export interface Arcana {
  number: number;
  name: string;
  symbol: string;
  planet: string;
  element: string;
  color: string;
  positive: string[];
  negative: string[];
  dayAdvice: string;
  keywords: string[];
}

export const arcanas: Arcana[] = [
  {
    number: 1,
    name: 'Маг',
    symbol: '🎭',
    planet: 'Меркурий',
    element: 'Воздух',
    color: 'from-yellow-400 to-orange-400',
    positive: ['Лидерство', 'Уверенность', 'Харизма', 'Новые начинания'],
    negative: ['Эгоизм', 'Упрямство', 'Агрессия'],
    dayAdvice: 'День для проявления инициативы. Начинай новые проекты, бери ответственность на себя.',
    keywords: ['воля', 'начало', 'мастерство'],
  },
  {
    number: 2,
    name: 'Верховная Жрица',
    symbol: '🌙',
    planet: 'Луна',
    element: 'Вода',
    color: 'from-indigo-400 to-purple-500',
    positive: ['Интуиция', 'Мудрость', 'Тайные знания', 'Женственность'],
    negative: ['Скрытность', 'Пассивность', 'Манипуляции'],
    dayAdvice: 'Прислушайся к интуиции. День благоприятен для медитации и самопознания.',
    keywords: ['интуиция', 'тайна', 'мудрость'],
  },
  {
    number: 3,
    name: 'Императрица',
    symbol: '👑',
    planet: 'Венера',
    element: 'Земля',
    color: 'from-green-400 to-emerald-500',
    positive: ['Изобилие', 'Творчество', 'Красота', 'Материнство'],
    negative: ['Лень', 'Расточительность', 'Чрезмерная чувственность'],
    dayAdvice: 'Создавай красоту вокруг себя. Благоприятный день для творчества и заботы о теле.',
    keywords: ['изобилие', 'красота', 'творение'],
  },
  {
    number: 4,
    name: 'Император',
    symbol: '🏛️',
    planet: 'Марс',
    element: 'Огонь',
    color: 'from-red-400 to-red-600',
    positive: ['Стабильность', 'Порядок', 'Власть', 'Защита'],
    negative: ['Жёсткость', 'Контроль', 'Авторитарность'],
    dayAdvice: 'День для наведения порядка в делах. Структурируй, планируй, организуй.',
    keywords: ['порядок', 'власть', 'стабильность'],
  },
  {
    number: 5,
    name: 'Иерофант',
    symbol: '📿',
    planet: 'Юпитер',
    element: 'Земля',
    color: 'from-purple-400 to-violet-600',
    positive: ['Духовность', 'Учительство', 'Традиции', 'Мораль'],
    negative: ['Догматизм', 'Консерватизм', 'Морализаторство'],
    dayAdvice: 'Изучай новое, делись знаниями. День для духовных практик и обучения.',
    keywords: ['вера', 'учение', 'традиция'],
  },
  {
    number: 6,
    name: 'Влюблённые',
    symbol: '💕',
    planet: 'Венера',
    element: 'Воздух',
    color: 'from-pink-400 to-rose-500',
    positive: ['Любовь', 'Выбор', 'Гармония', 'Партнёрство'],
    negative: ['Сомнения', 'Зависимость', 'Неверность'],
    dayAdvice: 'День отношений и выбора. Принимай решения сердцем, но с участием разума.',
    keywords: ['любовь', 'выбор', 'единство'],
  },
  {
    number: 7,
    name: 'Колесница',
    symbol: '🏆',
    planet: 'Луна',
    element: 'Вода',
    color: 'from-blue-400 to-cyan-500',
    positive: ['Победа', 'Движение', 'Воля', 'Триумф'],
    negative: ['Агрессия', 'Безрассудство', 'Конфликтность'],
    dayAdvice: 'Двигайся к цели уверенно. День для преодоления препятствий и достижений.',
    keywords: ['победа', 'движение', 'контроль'],
  },
  {
    number: 8,
    name: 'Справедливость',
    symbol: '⚖️',
    planet: 'Сатурн',
    element: 'Воздух',
    color: 'from-gray-400 to-slate-600',
    positive: ['Баланс', 'Честность', 'Карма', 'Ответственность'],
    negative: ['Осуждение', 'Холодность', 'Мстительность'],
    dayAdvice: 'День кармической справедливости. Веди себя честно, и вселенная ответит тем же.',
    keywords: ['справедливость', 'баланс', 'закон'],
  },
  {
    number: 9,
    name: 'Отшельник',
    symbol: '🏔️',
    planet: 'Нептун',
    element: 'Земля',
    color: 'from-slate-400 to-gray-600',
    positive: ['Мудрость', 'Уединение', 'Поиск истины', 'Наставничество'],
    negative: ['Одиночество', 'Замкнутость', 'Отстранённость'],
    dayAdvice: 'Найди время для себя. День для размышлений и поиска внутренних ответов.',
    keywords: ['мудрость', 'поиск', 'уединение'],
  },
  {
    number: 10,
    name: 'Колесо Фортуны',
    symbol: '🎡',
    planet: 'Юпитер',
    element: 'Огонь',
    color: 'from-amber-400 to-orange-500',
    positive: ['Удача', 'Перемены', 'Цикличность', 'Возможности'],
    negative: ['Нестабильность', 'Зависимость от удачи', 'Фатализм'],
    dayAdvice: 'Будь готов к переменам. День сюрпризов и новых возможностей.',
    keywords: ['судьба', 'цикл', 'удача'],
  },
  {
    number: 11,
    name: 'Сила',
    symbol: '🦁',
    planet: 'Солнце',
    element: 'Огонь',
    color: 'from-orange-400 to-red-500',
    positive: ['Внутренняя сила', 'Храбрость', 'Терпение', 'Самоконтроль'],
    negative: ['Гордыня', 'Подавление эмоций', 'Жёсткость'],
    dayAdvice: 'Проявляй мягкую силу. День для работы с эмоциями и страхами.',
    keywords: ['сила', 'мужество', 'терпение'],
  },
  {
    number: 12,
    name: 'Повешенный',
    symbol: '🔮',
    planet: 'Нептун',
    element: 'Вода',
    color: 'from-teal-400 to-cyan-600',
    positive: ['Жертвенность', 'Новый взгляд', 'Отпускание', 'Духовный рост'],
    negative: ['Жертвенность', 'Застой', 'Пассивность'],
    dayAdvice: 'Посмотри на ситуацию под другим углом. День для переосмысления.',
    keywords: ['жертва', 'пауза', 'прозрение'],
  },
  {
    number: 13,
    name: 'Смерть',
    symbol: '🦋',
    planet: 'Плутон',
    element: 'Вода',
    color: 'from-slate-600 to-gray-800',
    positive: ['Трансформация', 'Обновление', 'Освобождение', 'Перерождение'],
    negative: ['Страх перемен', 'Разрушение', 'Потери'],
    dayAdvice: 'Отпусти старое. День глубокой трансформации и завершения циклов.',
    keywords: ['трансформация', 'конец', 'обновление'],
  },
  {
    number: 14,
    name: 'Умеренность',
    symbol: '🌈',
    planet: 'Юпитер',
    element: 'Огонь',
    color: 'from-violet-400 to-purple-500',
    positive: ['Гармония', 'Терпение', 'Исцеление', 'Баланс'],
    negative: ['Инертность', 'Компромиссы', 'Нерешительность'],
    dayAdvice: 'Ищи золотую середину. День для гармонизации всех сфер жизни.',
    keywords: ['баланс', 'терпение', 'гармония'],
  },
  {
    number: 15,
    name: 'Дьявол',
    symbol: '🔥',
    planet: 'Сатурн',
    element: 'Земля',
    color: 'from-red-600 to-rose-800',
    positive: ['Страсть', 'Материальный успех', 'Сексуальность', 'Амбиции'],
    negative: ['Зависимости', 'Манипуляции', 'Одержимость'],
    dayAdvice: 'Осознавай свои привязанности. День для работы с теневыми сторонами.',
    keywords: ['страсть', 'материя', 'искушение'],
  },
  {
    number: 16,
    name: 'Башня',
    symbol: '⚡',
    planet: 'Марс',
    element: 'Огонь',
    color: 'from-red-500 to-orange-600',
    positive: ['Прорыв', 'Освобождение', 'Озарение', 'Разрушение иллюзий'],
    negative: ['Катастрофы', 'Шок', 'Разрушение'],
    dayAdvice: 'Будь готов к неожиданностям. День может принести резкие перемены.',
    keywords: ['разрушение', 'прорыв', 'освобождение'],
  },
  {
    number: 17,
    name: 'Звезда',
    symbol: '⭐',
    planet: 'Уран',
    element: 'Воздух',
    color: 'from-cyan-400 to-blue-500',
    positive: ['Надежда', 'Вдохновение', 'Духовность', 'Исцеление'],
    negative: ['Наивность', 'Оторванность от реальности', 'Мечтательность'],
    dayAdvice: 'Верь в лучшее. День для духовных практик и творческого вдохновения.',
    keywords: ['надежда', 'вдохновение', 'вера'],
  },
  {
    number: 18,
    name: 'Луна',
    symbol: '🌕',
    planet: 'Луна',
    element: 'Вода',
    color: 'from-indigo-400 to-violet-600',
    positive: ['Интуиция', 'Подсознание', 'Магия', 'Эмоции'],
    negative: ['Иллюзии', 'Страхи', 'Неясность', 'Обман'],
    dayAdvice: 'Доверяй интуиции, но проверяй факты. День для работы с подсознанием.',
    keywords: ['интуиция', 'иллюзия', 'подсознание'],
  },
  {
    number: 19,
    name: 'Солнце',
    symbol: '☀️',
    planet: 'Солнце',
    element: 'Огонь',
    color: 'from-yellow-400 to-amber-500',
    positive: ['Радость', 'Успех', 'Оптимизм', 'Витальность'],
    negative: ['Эгоцентризм', 'Поверхностность', 'Самодовольство'],
    dayAdvice: 'Сияй! День радости, успеха и позитивной энергии.',
    keywords: ['радость', 'успех', 'свет'],
  },
  {
    number: 20,
    name: 'Суд',
    symbol: '📯',
    planet: 'Плутон',
    element: 'Огонь',
    color: 'from-amber-500 to-orange-600',
    positive: ['Возрождение', 'Призвание', 'Кармическое освобождение', 'Пробуждение'],
    negative: ['Самоосуждение', 'Неспособность отпустить прошлое'],
    dayAdvice: 'Услышь свой внутренний зов. День для принятия важных решений.',
    keywords: ['суд', 'призвание', 'возрождение'],
  },
  {
    number: 21,
    name: 'Мир',
    symbol: '🌍',
    planet: 'Сатурн',
    element: 'Земля',
    color: 'from-emerald-400 to-teal-500',
    positive: ['Завершённость', 'Достижение', 'Гармония', 'Целостность'],
    negative: ['Застой', 'Страх перед новым циклом'],
    dayAdvice: 'Празднуй достижения. День завершения важных этапов и целостности.',
    keywords: ['завершение', 'целостность', 'гармония'],
  },
  {
    number: 22,
    name: 'Шут',
    symbol: '🃏',
    planet: 'Уран',
    element: 'Воздух',
    color: 'from-fuchsia-400 to-pink-500',
    positive: ['Свобода', 'Спонтанность', 'Новые возможности', 'Чистый потенциал'],
    negative: ['Безрассудство', 'Наивность', 'Безответственность'],
    dayAdvice: 'Будь открыт новому. День спонтанности и неожиданных возможностей.',
    keywords: ['свобода', 'начало', 'потенциал'],
  },
];

// Функция приведения числа к аркану (1-22)
export function reduceToArcana(num: number): number {
  if (num <= 22) return num;
  if (num === 0) return 22; // 0 = Шут = 22

  // Редуцируем: складываем цифры
  let result = num;
  while (result > 22) {
    result = String(result).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return result || 22;
}

// Расчёт числа даты
export function calculateDateNumber(date: Date): number {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const sum = day + month + year.toString().split('').reduce((s, d) => s + parseInt(d), 0);
  return reduceToArcana(sum);
}

// Расчёт личного числа дня
export function calculatePersonalDayNumber(birthDate: Date, currentDate: Date): number {
  const birthDay = birthDate.getDate();
  const birthMonth = birthDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Личный год
  const personalYear = reduceToArcana(birthDay + birthMonth + currentYear);

  // Личный месяц
  const personalMonth = reduceToArcana(personalYear + currentMonth);

  // Личный день
  const personalDay = reduceToArcana(personalMonth + currentDay);

  return personalDay;
}

// Интерфейс матрицы
export interface DestinyMatrixData {
  // Центр (личность)
  center: number;

  // Основные точки
  personality: number;      // Кто я
  talents: number;          // Таланты
  karma: number;            // Кармическая задача
  spirituality: number;     // Духовность

  // Линии
  loveLine: number[];       // Линия любви
  moneyLine: number[];      // Линия денег
  purposeLine: number[];    // Линия предназначения

  // Хвост кармы
  karmicTail: number[];

  // Текущие энергии
  personalDay: number;
  personalMonth: number;
  personalYear: number;

  // Совместимость энергий дня
  dayEnergy: number;
  dayCompatibility: 'отличный' | 'хороший' | 'нейтральный' | 'сложный';
}

// Полный расчёт матрицы судьбы
export function calculateDestinyMatrix(birthDate: Date, currentDate: Date = new Date()): DestinyMatrixData {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  // Редуцированные значения
  const dayNum = reduceToArcana(day);
  const monthNum = reduceToArcana(month);
  const yearNum = reduceToArcana(year.toString().split('').reduce((s, d) => s + parseInt(d), 0));

  // Центр (сумма дня, месяца, года)
  const center = reduceToArcana(dayNum + monthNum + yearNum);

  // Личность (день рождения)
  const personality = dayNum;

  // Таланты
  const talents = reduceToArcana(dayNum + monthNum);

  // Кармическая задача
  const karma = reduceToArcana(monthNum + yearNum);

  // Духовность
  const spirituality = reduceToArcana(dayNum + yearNum);

  // Линия любви
  const loveLine = [
    reduceToArcana(personality + center),
    center,
    reduceToArcana(karma + center),
  ];

  // Линия денег
  const moneyLine = [
    reduceToArcana(talents + center),
    center,
    reduceToArcana(spirituality + center),
  ];

  // Линия предназначения (диагонали)
  const purposeLine = [
    reduceToArcana(personality + talents),
    center,
    reduceToArcana(karma + spirituality),
  ];

  // Хвост кармы (три нижние точки)
  const karmicTail = [
    reduceToArcana(personality + karma),
    reduceToArcana(center + reduceToArcana(personality + karma)),
    reduceToArcana(talents + spirituality),
  ];

  // Текущие энергии
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const personalYear = reduceToArcana(day + month + currentYear);
  const personalMonth = reduceToArcana(personalYear + currentMonth);
  const personalDay = reduceToArcana(personalMonth + currentDay);

  // Энергия текущего дня
  const dayEnergy = calculateDateNumber(currentDate);

  // Совместимость личного дня с энергией дня
  const compatibility = calculateCompatibility(personalDay, dayEnergy, center);

  return {
    center,
    personality,
    talents,
    karma,
    spirituality,
    loveLine,
    moneyLine,
    purposeLine,
    karmicTail,
    personalDay,
    personalMonth,
    personalYear,
    dayEnergy,
    dayCompatibility: compatibility,
  };
}

// Расчёт совместимости энергий
function calculateCompatibility(
  personalDay: number,
  dayEnergy: number,
  center: number
): 'отличный' | 'хороший' | 'нейтральный' | 'сложный' {
  // Если энергии совпадают или дополняют
  if (personalDay === dayEnergy) return 'отличный';
  if (personalDay === center || dayEnergy === center) return 'отличный';

  // Гармоничные пары (одна стихия)
  const fireNumbers = [1, 4, 7, 10, 11, 14, 16, 19, 20];
  const waterNumbers = [2, 7, 12, 13, 18];
  const airNumbers = [1, 6, 8, 17, 22];
  const earthNumbers = [3, 4, 5, 9, 15, 21];

  const sameElement = (
    (fireNumbers.includes(personalDay) && fireNumbers.includes(dayEnergy)) ||
    (waterNumbers.includes(personalDay) && waterNumbers.includes(dayEnergy)) ||
    (airNumbers.includes(personalDay) && airNumbers.includes(dayEnergy)) ||
    (earthNumbers.includes(personalDay) && earthNumbers.includes(dayEnergy))
  );

  if (sameElement) return 'хороший';

  // Сложные комбинации
  const difference = Math.abs(personalDay - dayEnergy);
  if (difference === 11 || difference === 13) return 'сложный';

  return 'нейтральный';
}

// Получить аркан по номеру
export function getArcana(number: number): Arcana {
  const index = number <= 0 ? 21 : (number > 22 ? reduceToArcana(number) - 1 : number - 1);
  return arcanas[index];
}

// Получить прогноз на день
export function getDailyForecast(matrix: DestinyMatrixData): {
  mainEnergy: Arcana;
  dayEnergy: Arcana;
  advice: string;
  focus: string[];
  avoid: string[];
} {
  const mainEnergy = getArcana(matrix.personalDay);
  const dayEnergy = getArcana(matrix.dayEnergy);

  let advice = mainEnergy.dayAdvice;

  // Дополнительный совет на основе совместимости
  switch (matrix.dayCompatibility) {
    case 'отличный':
      advice += ' Энергии дня поддерживают тебя — действуй смело!';
      break;
    case 'хороший':
      advice += ' День благоприятный для большинства начинаний.';
      break;
    case 'нейтральный':
      advice += ' Сохраняй баланс и внимательность.';
      break;
    case 'сложный':
      advice += ' Будь внимательнее к деталям и избегай конфликтов.';
      break;
  }

  return {
    mainEnergy,
    dayEnergy,
    advice,
    focus: mainEnergy.positive.slice(0, 3),
    avoid: mainEnergy.negative.slice(0, 2),
  };
}
