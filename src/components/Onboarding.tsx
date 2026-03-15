'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Brain, Heart, Target, Zap, Camera, X, Upload } from 'lucide-react';
import { useMax } from './MaxProvider';

// Типы профилей
type ProfileType = 'cortisol' | 'neuro' | 'burnout' | 'potential';

interface ProfileInfo {
  name: string;
  title: string;
  description: string;
  strategy: string;
  priorities: {
    morning: string;
    day: string;
    evening: string;
  };
  focusAreas: string[];
}

const profiles: Record<ProfileType, ProfileInfo> = {
  cortisol: {
    name: 'Кортизоловая ловушка',
    title: 'Профиль: Кортизоловая ловушка',
    description: 'Ваша симпатическая нервная система перегружена. Организм находится в состоянии «хронической обороны». Это приводит к спазму жевательных мышц и сосудов шеи, из-за чего нарушается отток лимфы. Ваше лицо буквально «хранит» старый стресс в виде отёков.',
    strategy: 'Снять «мышечный панцирь» и запустить лимфодренаж',
    priorities: {
      morning: 'Техники «Слив кортизола» (дыхание)',
      day: 'Расслабление челюсти и работа с осанкой',
      evening: 'Альфа-ритмы для глубокого отключения контроля'
    },
    focusAreas: ['осанка', 'лимфодренаж', 'расслабление']
  },
  neuro: {
    name: 'Нейро-истощение',
    title: 'Профиль: Нейро-истощение',
    description: 'Ваши дофаминовые рецепторы перегружены информационным шумом, а митохондрии (энергетические станции клеток) работают на минимуме. Мозг ввёл режим «энергосбережения», что ощущается как когнитивная вязкость и физическая слабость.',
    strategy: 'Восстановление нейронной проводимости и «информационный детокс»',
    priorities: {
      morning: 'Практика «Код Дофамина» (настройка на естественную радость)',
      day: 'Жёсткий водный протокол и белковое питание',
      evening: 'Ночное программирование на регенерацию клеток мозга'
    },
    focusAreas: ['фокус', 'энергия', 'детокс']
  },
  burnout: {
    name: 'Замкнутый цикл',
    title: 'Профиль: Замкнутый цикл (Режим выживания)',
    description: 'Вы находитесь в состоянии эмоционального выгорания. Ваша амигдала (центр страха) гиперактивна, что блокирует работу префронтальной коры (логика и планирование). Тело экономит ресурсы, блокируя эмоции и драйв.',
    strategy: 'Возвращение в состояние безопасности и глубокое восстановление сна',
    priorities: {
      morning: 'Мягкие практики «Исцеления» без надрыва',
      day: 'Короткие 3-минутные паузы тишины',
      evening: 'Техника «Сон Спецслужб» для гарантированного восстановления'
    },
    focusAreas: ['сон', 'восстановление', 'спокойствие']
  },
  potential: {
    name: 'Скрытый потенциал',
    title: 'Профиль: Скрытый потенциал',
    description: 'Ваша система стабильна, но работает на «базовых настройках». У вас есть избыток энергии, который не находит правильного русла. Ваше тело готово к трансформации, нужно лишь синхронизировать ритмы мозга для выхода на новый уровень.',
    strategy: 'Квантовое расширение и оттачивание фокуса',
    priorities: {
      morning: 'Практики «Манифестации» по Диспензе',
      day: 'Техники сверх-концентрации и «Flash-резонанс»',
      evening: 'Тета-медитации на масштаб и финансовые цели'
    },
    focusAreas: ['масштаб', 'продуктивность', 'манифестация']
  }
};

// Блоки вопросов
interface QuestionBlock {
  id: string;
  title: string;
  icon: typeof Brain;
}

const questionBlocks: QuestionBlock[] = [
  { id: 'body', title: 'Ваше тело и энергия', icon: Zap },
  { id: 'brain', title: 'Ваш мозг и фокус', icon: Brain },
  { id: 'mood', title: 'Ваше настроение', icon: Heart },
  { id: 'goal', title: 'Ваша главная цель', icon: Target },
];

interface OnboardingQuestion {
  id: string;
  blockId: string;
  question: string;
  options: { id: string; label: string; scores: Partial<Record<ProfileType, number>> }[];
}

const questions: OnboardingQuestion[] = [
  // Блок 1: Тело и энергия
  {
    id: 'morning_energy',
    blockId: 'body',
    question: 'Как вы чувствуете себя через час после пробуждения?',
    options: [
      { id: 'great', label: 'Полна сил и готова к делам', scores: { potential: 2 } },
      { id: 'coffee', label: 'Вроде нормально, но нужен кофе, чтобы «включиться»', scores: { neuro: 1 } },
      { id: 'tired', label: 'Всё ещё чувствую усталость, хочу обратно в кровать', scores: { burnout: 2, neuro: 1 } },
    ]
  },
  {
    id: 'face_swelling',
    blockId: 'body',
    question: 'Бывают ли у вас отёки на лице по утрам?',
    options: [
      { id: 'never', label: 'Нет, лицо всегда выглядит свежим', scores: { potential: 2 } },
      { id: 'sometimes', label: 'Иногда замечаю, но они быстро проходят', scores: { cortisol: 1 } },
      { id: 'always', label: 'Да, это происходит почти каждое утро', scores: { cortisol: 2 } },
    ]
  },
  {
    id: 'head_heaviness',
    blockId: 'body',
    question: 'Чувствуете ли вы тяжесть в голове или желание сгорбиться?',
    options: [
      { id: 'no', label: 'Нет, держу спину ровно и чувствую лёгкость', scores: { potential: 2 } },
      { id: 'evening', label: 'Бывает к вечеру, когда сильно устаю', scores: { neuro: 1 } },
      { id: 'constant', label: 'Да, это постоянное чувство, шея и плечи часто зажаты', scores: { cortisol: 2 } },
    ]
  },
  {
    id: 'body_tension',
    blockId: 'body',
    question: 'Замечаете ли вы зажимы в теле в течение дня?',
    options: [
      { id: 'relaxed', label: 'Нет, я чувствую себя расслабленно', scores: { potential: 2 } },
      { id: 'sometimes', label: 'Иногда сжимаю челюсть или поднимаю плечи к ушам', scores: { cortisol: 1 } },
      { id: 'always', label: 'Постоянно чувствую себя как «натянутая струна»', scores: { cortisol: 2, burnout: 1 } },
    ]
  },
  // Блок 2: Мозг и фокус
  {
    id: 'focus',
    blockId: 'brain',
    question: 'Легко ли вам сосредоточиться на одной задаче?',
    options: [
      { id: 'easy', label: 'Да, глубоко погружаюсь и не отвлекаюсь', scores: { potential: 2 } },
      { id: 'need_time', label: 'Нужно время, чтобы настроиться', scores: { neuro: 1 } },
      { id: 'hard', label: 'Сложно, постоянно тянет проверить телефон или новости', scores: { neuro: 2 } },
    ]
  },
  {
    id: 'brain_fog',
    blockId: 'brain',
    question: 'Бывает ли у вас «туман в голове» или забывчивость?',
    options: [
      { id: 'clear', label: 'Нет, голова работает чётко и быстро', scores: { potential: 2 } },
      { id: 'rarely', label: 'Редко, если только очень много дел сразу', scores: { neuro: 1 } },
      { id: 'often', label: 'Часто, сложно подбирать слова или быстро соображать', scores: { neuro: 2, burnout: 1 } },
    ]
  },
  {
    id: 'info_overload',
    blockId: 'brain',
    question: 'Как вы справляетесь с потоком информации?',
    options: [
      { id: 'easy', label: 'Легко выделяю главное и не устаю', scores: { potential: 2 } },
      { id: 'tired', label: 'К середине дня начинаю раздражаться от сообщений', scores: { neuro: 1, cortisol: 1 } },
      { id: 'overload', label: 'Чувствую полный перегруз и хочу «выключить» весь мир', scores: { neuro: 2, burnout: 1 } },
    ]
  },
  // Блок 3: Настроение
  {
    id: 'criticism_reaction',
    blockId: 'mood',
    question: 'Как вы реагируете на свои ошибки или критику?',
    options: [
      { id: 'calm', label: 'Спокойно делаю выводы и иду дальше', scores: { potential: 2 } },
      { id: 'upset', label: 'Могу вспылить или расстроиться, но быстро отхожу', scores: { cortisol: 1 } },
      { id: 'ruminate', label: 'Долго «прокручиваю» это в голове и виню себя', scores: { burnout: 2, cortisol: 1 } },
    ]
  },
  {
    id: 'anxiety',
    blockId: 'mood',
    question: 'Бывает ли у вас тревога без видимой причины?',
    options: [
      { id: 'never', label: 'Почти никогда', scores: { potential: 2 } },
      { id: 'sometimes', label: 'Иногда, когда наваливается много задач', scores: { cortisol: 1 } },
      { id: 'constant', label: 'Это моё привычное состояние, которое мешает жить', scores: { cortisol: 2, burnout: 1 } },
    ]
  },
  {
    id: 'energy_for_life',
    blockId: 'mood',
    question: 'Хватает ли вам сил на что-то, кроме работы и быта?',
    options: [
      { id: 'plenty', label: 'Да, полна идей и энергии для роста', scores: { potential: 2 } },
      { id: 'routine', label: 'Сил хватает только на привычный ритм', scores: { neuro: 1, burnout: 1 } },
      { id: 'survival', label: 'Живу в режиме «выживания», сил ни на что нет', scores: { burnout: 2 } },
    ]
  },
  // Блок 4: Главная цель
  {
    id: 'main_goal',
    blockId: 'goal',
    question: 'Какой результат через месяц для вас важнее всего?',
    options: [
      { id: 'face', label: 'Свежее лицо: убрать отёки и вернуть чёткие скулы', scores: { cortisol: 1 } },
      { id: 'clarity', label: 'Ясная голова: работать эффективно и без «тумана»', scores: { neuro: 1 } },
      { id: 'sleep', label: 'Глубокий сон: быстро засыпать и легко вставать', scores: { burnout: 1 } },
      { id: 'calm', label: 'Спокойствие: перестать тревожиться и нервничать', scores: { cortisol: 1, burnout: 1 } },
      { id: 'body', label: 'Лёгкое тело: убрать зажимы, расправить плечи и шею', scores: { cortisol: 1 } },
    ]
  },
];

interface OnboardingProps {
  onComplete: (answers: Record<string, string | string[]>, profile?: ProfileType) => void;
}

type ScreenType = 'welcome' | 'questions' | 'analyzing' | 'result' | 'photo';

export function Onboarding({ onComplete }: OnboardingProps) {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [calculatedProfile, setCalculatedProfile] = useState<ProfileType | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { hapticFeedback } = useMax();

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  // Получаем текущий блок
  const currentBlock = questionBlocks.find(b => b.id === question?.blockId);
  const questionsInBlock = questions.filter(q => q.blockId === question?.blockId);
  const questionIndexInBlock = questionsInBlock.findIndex(q => q.id === question?.id) + 1;

  // Расчёт профиля
  const calculateProfile = (): ProfileType => {
    const scores: Record<ProfileType, number> = {
      cortisol: 0,
      neuro: 0,
      burnout: 0,
      potential: 0,
    };

    Object.entries(answers).forEach(([questionId, answerId]) => {
      const q = questions.find(q => q.id === questionId);
      if (!q) return;
      const option = q.options.find(o => o.id === answerId);
      if (!option) return;

      Object.entries(option.scores).forEach(([profile, score]) => {
        scores[profile as ProfileType] += score as number;
      });
    });

    // Находим профиль с максимальным счётом
    let maxProfile: ProfileType = 'potential';
    let maxScore = scores.potential;

    (Object.entries(scores) as [ProfileType, number][]).forEach(([profile, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxProfile = profile;
      }
    });

    return maxProfile;
  };

  // Анимация анализа
  useEffect(() => {
    if (screen === 'analyzing') {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            const profile = calculateProfile();
            setCalculatedProfile(profile);
            setTimeout(() => setScreen('result'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [screen]);

  const handleStartAudit = () => {
    hapticFeedback('light');
    setScreen('questions');
  };

  const handleSelectOption = (optionId: string) => {
    hapticFeedback('light');
    setAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleNext = () => {
    hapticFeedback('light');
    if (isLastQuestion) {
      setScreen('analyzing');
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    hapticFeedback('light');
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      setScreen('welcome');
    }
  };

  const handleComplete = () => {
    hapticFeedback('medium');
    onComplete(answers, calculatedProfile || undefined);
  };

  const currentAnswer = answers[question?.id];
  const hasAnswer = !!currentAnswer;

  // Экран приветствия
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center mb-8">
            <Sparkles size={48} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-foreground text-center mb-4">
            Давайте настроим вашу систему
          </h1>

          <p className="text-aura-slate/70 text-center leading-relaxed mb-8 max-w-sm">
            Мы проведём краткий аудит вашего состояния, чтобы программа работала на ваш результат. Пожалуйста, отвечайте искренне.
          </p>

          <div className="flex items-center gap-3 text-sm text-aura-slate/60 mb-8">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-aura-mint"></div>
              <span>11 вопросов</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-aura-slate/30"></div>
            <span>~2 минуты</span>
          </div>
        </div>

        <div className="px-5 pb-8 safe-area-bottom">
          <button
            onClick={handleStartAudit}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            Начать аудит
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Экран анализа
  if (screen === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          <div className="h-32 w-32 rounded-full border-4 border-aura-slate/10 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-4 border-aura-mint transition-all duration-300"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(analysisProgress * 3.6 * Math.PI / 180)}% ${50 - 50 * Math.cos(analysisProgress * 3.6 * Math.PI / 180)}%, 50% 50%)`,
                transform: 'rotate(-90deg)'
              }}
            />
            <Brain size={48} className="text-aura-mint animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">Анализируем ваши ответы</h2>
        <p className="text-aura-slate/60 mb-6">Подбираем персональную программу...</p>

        <div className="w-48 h-2 bg-aura-slate/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-aura-mint to-aura-lavender transition-all duration-100"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
        <span className="text-sm text-aura-slate/50 mt-2">{analysisProgress}%</span>
      </div>
    );
  }

  // Экран результата
  if (screen === 'result' && calculatedProfile) {
    const profile = profiles[calculatedProfile];
    const BlockIcon = questionBlocks.find(b => b.id === 'goal')?.icon || Target;

    return (
      <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col">
        <header className="px-5 pt-4 pb-2 safe-area-top">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-aura-mint" />
            <span className="font-semibold text-foreground">AuraSync</span>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 overflow-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aura-mint/20 text-aura-mint mb-4">
              <BlockIcon size={18} />
              <span className="text-sm font-medium">Анализ завершён</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">{profile.title}</h1>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
            <h3 className="font-semibold text-foreground mb-3">Анализ состояния</h3>
            <p className="text-aura-slate/70 text-sm leading-relaxed">{profile.description}</p>
          </div>

          <div className="bg-gradient-to-br from-aura-mint/10 to-aura-lavender/10 rounded-3xl p-5 mb-4">
            <h3 className="font-semibold text-foreground mb-3">Главная цель на месяц</h3>
            <p className="text-foreground">{profile.strategy}</p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm mb-4">
            <h3 className="font-semibold text-foreground mb-4">Приоритет в программе</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🌅</span>
                </div>
                <div>
                  <div className="text-xs text-aura-slate/50 mb-0.5">Утро</div>
                  <div className="text-sm text-foreground">{profile.priorities.morning}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">☀️</span>
                </div>
                <div>
                  <div className="text-xs text-aura-slate/50 mb-0.5">День</div>
                  <div className="text-sm text-foreground">{profile.priorities.day}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🌙</span>
                </div>
                <div>
                  <div className="text-xs text-aura-slate/50 mb-0.5">Вечер</div>
                  <div className="text-sm text-foreground">{profile.priorities.evening}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-aura-slate/5 rounded-2xl p-4 text-center">
            <p className="text-sm text-aura-slate/70">
              На основе вашего профиля <span className="font-medium text-foreground">«{profile.name}»</span>, мы скорректировали программу на первый месяц. Мы добавили больше техник для <span className="text-aura-mint font-medium">{profile.focusAreas.join(', ')}</span>.
            </p>
          </div>
        </main>

        <div className="px-5 pb-8 safe-area-bottom">
          <button
            onClick={() => {
              hapticFeedback('light');
              setScreen('photo');
            }}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            Далее
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Экран загрузки фото "До"
  if (screen === 'photo') {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setBeforePhoto(base64);
          // Сохраняем фото в localStorage
          localStorage.setItem('aura_before_photo', JSON.stringify({
            photo: base64,
            date: new Date().toISOString()
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    const handleTakePhoto = () => {
      hapticFeedback('light');
      fileInputRef.current?.click();
    };

    const handleRemovePhoto = () => {
      hapticFeedback('light');
      setBeforePhoto(null);
      localStorage.removeItem('aura_before_photo');
    };

    const handleFinish = () => {
      hapticFeedback('medium');
      handleComplete();
    };

    const handleSkip = () => {
      hapticFeedback('light');
      handleComplete();
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col">
        <header className="px-5 pt-4 pb-2 safe-area-top">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-aura-mint" />
            <span className="font-semibold text-foreground">AuraSync</span>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 flex flex-col">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aura-lavender/20 text-aura-lavender-dark mb-4">
              <Camera size={18} />
              <span className="text-sm font-medium">Фото «До»</span>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Зафиксируйте точку старта</h1>
            <p className="text-sm text-aura-slate/70">
              Через 4 недели вы сравните результат. Это фото видите только вы.
            </p>
          </div>

          {/* Photo upload area */}
          <div className="flex-1 flex items-center justify-center">
            {beforePhoto ? (
              <div className="relative">
                <img
                  src={beforePhoto}
                  alt="Before photo"
                  className="w-64 h-80 object-cover rounded-3xl shadow-lg"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 h-8 w-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <X size={16} className="text-white" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-xs text-aura-slate/70">Фото сохранено</p>
                  <p className="text-xs font-medium text-foreground">
                    {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleTakePhoto}
                className="w-64 h-80 rounded-3xl border-2 border-dashed border-aura-slate/20 flex flex-col items-center justify-center gap-4 bg-white/50 transition-all active:scale-[0.98]"
              >
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-aura-mint to-aura-lavender flex items-center justify-center">
                  <Camera size={36} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground mb-1">Сделать фото</p>
                  <p className="text-xs text-aura-slate/60">или выбрать из галереи</p>
                </div>
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Tips */}
          <div className="bg-aura-mint/10 rounded-2xl p-4 mt-4">
            <p className="text-xs text-aura-slate/70 text-center">
              <span className="font-medium text-foreground">Совет:</span> Сфотографируйте лицо при естественном освещении, без макияжа, с нейтральным выражением.
            </p>
          </div>
        </main>

        <div className="px-5 pb-8 safe-area-bottom space-y-3">
          <button
            onClick={handleFinish}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {beforePhoto ? 'Начать программу' : 'Добавить позже'}
            <ChevronRight size={20} />
          </button>
          {!beforePhoto && (
            <button
              onClick={handleSkip}
              className="w-full py-3 text-sm text-aura-slate/60"
            >
              Пропустить
            </button>
          )}
        </div>
      </div>
    );
  }

  // Экран вопросов
  return (
    <div className="min-h-screen bg-gradient-to-b from-aura-cream to-white flex flex-col">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="h-10 w-10 rounded-xl bg-white/50 flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-aura-slate" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-aura-mint" />
            <span className="font-semibold text-foreground">AuraSync</span>
          </div>
          <div className="w-10 text-right text-sm text-aura-slate/60">
            {currentQuestion + 1}/{totalQuestions}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-aura-slate/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-aura-mint to-aura-lavender transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Block indicator */}
      {currentBlock && (
        <div className="px-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-aura-slate/5">
            <currentBlock.icon size={14} className="text-aura-mint" />
            <span className="text-xs text-aura-slate/70">{currentBlock.title} • {questionIndexInBlock}/{questionsInBlock.length}</span>
          </div>
        </div>
      )}

      {/* Question */}
      <main className="flex-1 px-5 py-6 flex flex-col">
        <h1 className="text-xl font-bold text-foreground mb-6">
          {question.question}
        </h1>

        {/* Options */}
        <div className="flex-1 space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              className={`w-full p-4 rounded-2xl text-left transition-all ${
                currentAnswer === option.id
                  ? 'bg-aura-mint text-foreground shadow-md scale-[1.02]'
                  : 'bg-white text-aura-slate/80 shadow-sm'
              }`}
            >
              <span className="text-sm leading-relaxed">{option.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Bottom */}
      <div className="px-5 pb-8 safe-area-bottom">
        <button
          onClick={handleNext}
          disabled={!hasAnswer}
          className={`w-full btn-primary flex items-center justify-center gap-2 ${
            !hasAnswer ? 'opacity-50' : ''
          }`}
        >
          {isLastQuestion ? 'Завершить' : 'Далее'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
