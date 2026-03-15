'use client';

import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useMax } from './MaxProvider';

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

const moods: MoodOption[] = [
  { id: 'great', emoji: '😊', label: 'Отлично', color: 'bg-green-100' },
  { id: 'good', emoji: '🙂', label: 'Хорошо', color: 'bg-aura-mint-light' },
  { id: 'okay', emoji: '😐', label: 'Нормально', color: 'bg-aura-cream' },
  { id: 'tired', emoji: '😴', label: 'Устала', color: 'bg-aura-lavender-light' },
  { id: 'stressed', emoji: '😰', label: 'Стресс', color: 'bg-aura-peach-light' },
  { id: 'anxious', emoji: '😟', label: 'Тревожно', color: 'bg-orange-100' },
  { id: 'sad', emoji: '😢', label: 'Грустно', color: 'bg-blue-100' },
  { id: 'irritated', emoji: '😤', label: 'Раздражена', color: 'bg-red-100' },
];

const energyLevels = [
  { id: 'very_low', label: 'Очень низкая', value: 1 },
  { id: 'low', label: 'Низкая', value: 2 },
  { id: 'medium', label: 'Средняя', value: 3 },
  { id: 'high', label: 'Высокая', value: 4 },
  { id: 'very_high', label: 'Очень высокая', value: 5 },
];

const sleepQualities = [
  { id: 'terrible', emoji: '😫', label: 'Ужасно' },
  { id: 'poor', emoji: '😕', label: 'Плохо' },
  { id: 'okay', emoji: '😐', label: 'Нормально' },
  { id: 'good', emoji: '🙂', label: 'Хорошо' },
  { id: 'great', emoji: '😴', label: 'Отлично' },
];

interface DailyCheckinProps {
  onComplete: (data: {
    mood: string;
    energy: number;
    sleep: string;
  }) => void;
  onSkip: () => void;
}

export function DailyCheckin({ onComplete, onSkip }: DailyCheckinProps) {
  const [step, setStep] = useState<'mood' | 'energy' | 'sleep'>('mood');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedEnergy, setSelectedEnergy] = useState<number>(0);
  const [selectedSleep, setSelectedSleep] = useState<string>('');
  const { hapticFeedback } = useMax();

  const handleMoodSelect = (moodId: string) => {
    hapticFeedback('light');
    setSelectedMood(moodId);
  };

  const handleEnergySelect = (value: number) => {
    hapticFeedback('light');
    setSelectedEnergy(value);
  };

  const handleSleepSelect = (sleepId: string) => {
    hapticFeedback('light');
    setSelectedSleep(sleepId);
  };

  const handleNext = () => {
    hapticFeedback('light');
    if (step === 'mood' && selectedMood) {
      setStep('energy');
    } else if (step === 'energy' && selectedEnergy) {
      setStep('sleep');
    } else if (step === 'sleep' && selectedSleep) {
      onComplete({
        mood: selectedMood,
        energy: selectedEnergy,
        sleep: selectedSleep,
      });
    }
  };

  const canProceed =
    (step === 'mood' && selectedMood) ||
    (step === 'energy' && selectedEnergy) ||
    (step === 'sleep' && selectedSleep);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-aura-slate/10">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-aura-mint" />
            <span className="font-semibold text-foreground">Утренний чекин</span>
          </div>
          <button
            onClick={onSkip}
            className="h-8 w-8 rounded-full bg-aura-slate/10 flex items-center justify-center"
          >
            <X size={16} className="text-aura-slate" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[60vh]">
          {step === 'mood' && (
            <div className="fade-in">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Как ты себя чувствуешь сейчас?
              </h2>
              <p className="text-sm text-aura-slate/60 mb-6">
                Выбери эмоцию, которая лучше всего описывает твоё состояние
              </p>

              <div className="grid grid-cols-4 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                      selectedMood === mood.id
                        ? `${mood.color} scale-105 shadow-md`
                        : 'bg-aura-slate/5'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs font-medium text-aura-slate/70">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'energy' && (
            <div className="fade-in">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Какой у тебя уровень энергии?
              </h2>
              <p className="text-sm text-aura-slate/60 mb-6">
                Оцени свою энергию прямо сейчас
              </p>

              <div className="space-y-3">
                {energyLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleEnergySelect(level.value)}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center gap-4 ${
                      selectedEnergy === level.value
                        ? 'bg-aura-mint text-foreground shadow-md'
                        : 'bg-aura-slate/5 text-aura-slate/70'
                    }`}
                  >
                    <div className="flex-1">
                      <span>{level.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-2 w-6 rounded-full ${
                            i <= level.value
                              ? selectedEnergy === level.value
                                ? 'bg-white'
                                : 'bg-aura-mint'
                              : 'bg-aura-slate/20'
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'sleep' && (
            <div className="fade-in">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Как ты спала этой ночью?
              </h2>
              <p className="text-sm text-aura-slate/60 mb-6">
                Это поможет подобрать практики на день
              </p>

              <div className="flex justify-between gap-2">
                {sleepQualities.map((quality) => (
                  <button
                    key={quality.id}
                    onClick={() => handleSleepSelect(quality.id)}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                      selectedSleep === quality.id
                        ? 'bg-aura-lavender scale-105 shadow-md'
                        : 'bg-aura-slate/5'
                    }`}
                  >
                    <span className="text-2xl">{quality.emoji}</span>
                    <span className="text-xs font-medium text-aura-slate/70">
                      {quality.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress & Button */}
        <div className="p-5 border-t border-aura-slate/10 safe-area-bottom">
          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-4">
            {['mood', 'energy', 'sleep'].map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-aura-mint'
                    : i < ['mood', 'energy', 'sleep'].indexOf(step)
                    ? 'w-4 bg-aura-mint/50'
                    : 'w-4 bg-aura-slate/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`w-full btn-primary ${!canProceed ? 'opacity-50' : ''}`}
          >
            {step === 'sleep' ? 'Готово' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  );
}
