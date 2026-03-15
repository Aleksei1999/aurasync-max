'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Play, Pause, Lock, Check, Share2, X, Brain } from 'lucide-react';
import { useMax } from '@/components/MaxProvider';
import { courses, Course, Session, getCourseById, CourseId, achievementPopups } from '@/lib/courses';

interface CourseProgress {
  completedSessions: string[];
  currentSession?: string;
  lastPosition?: number;
  sessionPositions?: Record<string, number>;
}

interface SessionRating {
  sessionId: string;
  preRating: number;
  postRating: number;
  date: string;
}

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as CourseId;
  const { hapticFeedback } = useMax();

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress>({ completedSessions: [] });
  const [playingSession, setPlayingSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPreRating, setShowPreRating] = useState(false);
  const [showPostRating, setShowPostRating] = useState(false);
  const [preRating, setPreRating] = useState(5);
  const [postRating, setPostRating] = useState(5);
  const [pendingSession, setPendingSession] = useState<Session | null>(null);
  const [showAchievement, setShowAchievement] = useState<typeof achievementPopups[0] | null>(null);
  const [isPremium] = useState(false); // In real app, get from user subscription status

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const foundCourse = getCourseById(courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    }

    // Load progress
    const savedProgress = localStorage.getItem('aura_course_progress');
    if (savedProgress) {
      const allProgress = JSON.parse(savedProgress);
      if (allProgress[courseId]) {
        setProgress(allProgress[courseId]);
      }
    }
  }, [courseId]);

  const saveProgress = useCallback((newProgress: CourseProgress) => {
    const savedProgress = localStorage.getItem('aura_course_progress');
    const allProgress = savedProgress ? JSON.parse(savedProgress) : {};
    allProgress[courseId] = newProgress;
    localStorage.setItem('aura_course_progress', JSON.stringify(allProgress));
    setProgress(newProgress);
  }, [courseId]);

  const fadeAudio = useCallback((direction: 'in' | 'out', callback?: () => void) => {
    if (!audioRef.current) return;

    const fadeTime = 5000; // 5 seconds
    const steps = 50;
    const stepTime = fadeTime / steps;
    let currentStep = direction === 'in' ? 0 : steps;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        return;
      }

      if (direction === 'in') {
        currentStep++;
        audioRef.current.volume = Math.min(1, currentStep / steps);
        if (currentStep >= steps) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          callback?.();
        }
      } else {
        currentStep--;
        audioRef.current.volume = Math.max(0, currentStep / steps);
        if (currentStep <= 0) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          callback?.();
        }
      }
    }, stepTime);
  }, []);

  const handleSessionClick = (session: Session) => {
    // Check if locked
    if (session.isLocked && !isPremium) {
      hapticFeedback('heavy');
      // Show premium modal in future
      return;
    }

    hapticFeedback('light');
    setPendingSession(session);
    setShowPreRating(true);
  };

  const handlePreRatingSubmit = () => {
    setShowPreRating(false);
    if (pendingSession) {
      startSession(pendingSession);
    }
  };

  const startSession = (session: Session) => {
    setPlayingSession(session);

    // Restore position if available
    const savedPosition = progress.sessionPositions?.[session.id] || 0;
    setCurrentTime(savedPosition);
    setDuration(session.durationSeconds);

    // Create and play audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // For demo, use a placeholder or existing audio
    const audio = new Audio(session.audioSrc || '/audio/dopamine-code.wav');
    audio.volume = 0;
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      audio.currentTime = savedPosition;
      setDuration(audio.duration || session.durationSeconds);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);

      // Save position periodically
      const newPositions = { ...progress.sessionPositions, [session.id]: audio.currentTime };
      saveProgress({ ...progress, sessionPositions: newPositions, currentSession: session.id });
    });

    audio.addEventListener('ended', () => {
      handleSessionComplete(session);
    });

    audio.play().then(() => {
      setIsPlaying(true);
      fadeAudio('in');
    }).catch(console.error);

    // Check if first practice ever
    const allProgress = localStorage.getItem('aura_course_progress');
    const parsedProgress = allProgress ? JSON.parse(allProgress) : {};
    const totalCompleted = Object.values(parsedProgress).reduce((acc: number, p: unknown) => {
      const courseProgress = p as CourseProgress;
      return acc + (courseProgress.completedSessions?.length || 0);
    }, 0);

    if (totalCompleted === 0 && progress.completedSessions.length === 0) {
      // First practice - show achievement after a delay
      setTimeout(() => {
        setShowAchievement(achievementPopups.find(a => a.trigger === 'first_practice') || null);
      }, 3000);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    hapticFeedback('light');

    if (isPlaying) {
      fadeAudio('out', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      fadeAudio('in');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const handleSessionComplete = (session: Session) => {
    setIsPlaying(false);
    setShowPostRating(true);

    // Double haptic feedback for dopamine reinforcement
    hapticFeedback('heavy');
    setTimeout(() => hapticFeedback('light'), 100);
  };

  const handlePostRatingSubmit = () => {
    if (!playingSession || !course) return;

    // Save session rating
    const ratings = localStorage.getItem('aura_session_ratings');
    const allRatings: SessionRating[] = ratings ? JSON.parse(ratings) : [];
    allRatings.push({
      sessionId: playingSession.id,
      preRating,
      postRating,
      date: new Date().toISOString(),
    });
    localStorage.setItem('aura_session_ratings', JSON.stringify(allRatings));

    // Mark session as completed
    const newCompleted = [...progress.completedSessions];
    if (!newCompleted.includes(playingSession.id)) {
      newCompleted.push(playingSession.id);
    }

    // Clear position for completed session
    const newPositions = { ...progress.sessionPositions };
    delete newPositions[playingSession.id];

    saveProgress({
      ...progress,
      completedSessions: newCompleted,
      sessionPositions: newPositions,
      currentSession: undefined,
    });

    // Update AuraMap scores based on course weights
    updateAuraMapScores(course, postRating - preRating);

    // Check for achievements
    checkAchievements(newCompleted.length);

    setShowPostRating(false);
    setPlayingSession(null);
    setPreRating(5);
    setPostRating(5);

    // Show improvement achievement if significant delta
    if (postRating - preRating >= 3) {
      setTimeout(() => {
        setShowAchievement(achievementPopups.find(a => a.trigger === 'improvement') || null);
      }, 500);
    }
  };

  const updateAuraMapScores = (course: Course, efficiency: number) => {
    const savedScores = localStorage.getItem('aura_map_scores');
    const scores = savedScores ? JSON.parse(savedScores) : {
      cortisolResistance: 20,
      neuroFocus: 20,
      somaticCalm: 20,
      regeneration: 20,
      emotionalEQ: 20,
    };

    // Apply weights with efficiency multiplier
    const multiplier = Math.max(0.5, 1 + efficiency * 0.1);
    scores.cortisolResistance = Math.min(100, scores.cortisolResistance + (course.weights.cortisolResistance * 0.1 * multiplier));
    scores.neuroFocus = Math.min(100, scores.neuroFocus + (course.weights.neuroFocus * 0.1 * multiplier));
    scores.somaticCalm = Math.min(100, scores.somaticCalm + (course.weights.somaticCalm * 0.1 * multiplier));
    scores.regeneration = Math.min(100, scores.regeneration + (course.weights.regeneration * 0.1 * multiplier));
    scores.emotionalEQ = Math.min(100, scores.emotionalEQ + (course.weights.emotionalEQ * 0.1 * multiplier));

    localStorage.setItem('aura_map_scores', JSON.stringify(scores));
  };

  const checkAchievements = (completedCount: number) => {
    // Check for course completion
    if (course && completedCount === course.sessions.length) {
      setTimeout(() => {
        setShowAchievement(achievementPopups.find(a => a.trigger === 'course_complete') || null);
      }, 1000);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      fadeAudio('out', () => {
        audioRef.current?.pause();
        audioRef.current = null;
      });
    }
    setPlayingSession(null);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const goToDiary = () => {
    hapticFeedback('light');
    router.push('/diary');
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground-muted">Загрузка...</div>
      </div>
    );
  }

  const completedCount = progress.completedSessions.length;
  const progressPercent = Math.round((completedCount / course.sessions.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient */}
      <div
        className="pt-4 pb-6 px-5 safe-area-top"
        style={{
          background: `linear-gradient(135deg, ${course.gradientFrom} 0%, ${course.gradientTo} 100%)`,
        }}
      >
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm mb-4"
        >
          <ChevronLeft size={20} className="text-aura-slate" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-white/40 flex items-center justify-center">
            <span className="text-3xl">{course.icon}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
            <p className="text-sm text-foreground/70">{course.subtitle}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/40 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Прогресс</span>
            <span className="text-sm font-bold text-foreground">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-foreground/60 mt-2">
            {completedCount} из {course.sessions.length} сессий завершено
          </p>
        </div>
      </div>

      {/* Course Info */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-semibold text-foreground mb-2">О курсе</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-foreground-muted">Проблема:</span> <span className="text-foreground">{course.problem}</span></p>
            <p><span className="text-foreground-muted">Нейроэффект:</span> <span className="text-foreground">{course.neuroEffect}</span></p>
            <p><span className="text-foreground-muted">Результат:</span> <span className="text-foreground font-medium">{course.outcome}</span></p>
          </div>
        </div>

        {/* Sessions List */}
        <h3 className="font-semibold text-foreground mb-3">Сессии</h3>
        <div className="space-y-3 pb-24">
          {course.sessions.map((session, index) => {
            const isCompleted = progress.completedSessions.includes(session.id);
            const isLocked = session.isLocked && !isPremium;
            const hasPosition = (progress.sessionPositions?.[session.id] || 0) > 0;

            return (
              <button
                key={session.id}
                onClick={() => handleSessionClick(session)}
                disabled={isLocked}
                className={`w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 transition-all ${
                  isLocked ? 'opacity-60' : 'active:scale-[0.98]'
                }`}
              >
                {/* Session number / status */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-aura-mint text-white'
                      : isLocked
                      ? 'bg-gray-200 text-gray-400'
                      : 'bg-aura-mint-light text-aura-mint-dark'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} />
                  ) : isLocked ? (
                    <Lock size={16} />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Session info */}
                <div className="flex-1 text-left">
                  <h4 className="font-medium text-foreground">{session.title}</h4>
                  <p className="text-xs text-foreground-muted">{session.duration}</p>
                  {hasPosition && !isCompleted && (
                    <p className="text-xs text-aura-mint-dark">Продолжить с {formatTime(progress.sessionPositions?.[session.id] || 0)}</p>
                  )}
                </div>

                {/* Play button */}
                {!isLocked && !isCompleted && (
                  <div className="w-10 h-10 rounded-full bg-aura-mint flex items-center justify-center">
                    <Play size={18} className="text-white ml-0.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pre-Rating Modal */}
      {showPreRating && pendingSession && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground text-center mb-2">
              Оцените ваше состояние
            </h3>
            <p className="text-sm text-foreground-muted text-center mb-6">
              Как вы чувствуете себя прямо сейчас?
            </p>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground-muted">Напряжённо</span>
                <span className="text-sm text-foreground-muted">Спокойно</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => setPreRating(value)}
                    className={`flex-1 h-10 rounded-lg font-medium transition-all ${
                      preRating === value
                        ? 'bg-aura-lavender text-white'
                        : 'bg-gray-100 text-foreground-muted hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePreRatingSubmit}
              className="w-full py-4 bg-gradient-to-r from-aura-mint to-aura-mint-dark text-white font-semibold rounded-xl"
            >
              Начать практику
            </button>
          </div>
        </div>
      )}

      {/* Audio Player */}
      {playingSession && (
        <div className="fixed inset-0 bg-black/90 flex flex-col z-50">
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Close button */}
            <button
              onClick={closePlayer}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Session info */}
            <div
              className="w-32 h-32 rounded-3xl flex items-center justify-center mb-8"
              style={{
                background: `linear-gradient(135deg, ${course.gradientFrom} 0%, ${course.gradientTo} 100%)`,
              }}
            >
              <span className="text-5xl">{course.icon}</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{playingSession.title}</h2>
            <p className="text-white/60 mb-8">{course.title}</p>

            {/* Progress bar */}
            <div className="w-full max-w-sm mb-4">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-white/60">{formatTime(currentTime)}</span>
                <span className="text-sm text-white/60">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause size={32} className="text-foreground" />
              ) : (
                <Play size={32} className="text-foreground ml-1" />
              )}
            </button>

            {/* Daily task */}
            {playingSession.dailyTask && (
              <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-sm">
                <h4 className="text-sm font-medium text-white mb-1">Задание дня</h4>
                <p className="text-sm text-white/70">{playingSession.dailyTask}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post-Rating Modal */}
      {showPostRating && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-aura-mint-light flex items-center justify-center">
                <Check size={32} className="text-aura-mint-dark" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground text-center mb-2">
              Практика завершена!
            </h3>
            <p className="text-sm text-foreground-muted text-center mb-2">
              Дофаминовый закрепитель активен
            </p>
            <p className="text-sm text-foreground-muted text-center mb-6">
              Как вы чувствуете себя сейчас?
            </p>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-foreground-muted">Без изменений</span>
                <span className="text-sm text-foreground-muted">Намного лучше</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <button
                    key={value}
                    onClick={() => setPostRating(value)}
                    className={`flex-1 h-10 rounded-lg font-medium transition-all ${
                      postRating === value
                        ? 'bg-aura-mint text-white'
                        : 'bg-gray-100 text-foreground-muted hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            {/* Efficiency indicator */}
            {postRating > preRating && (
              <div className="bg-aura-mint-light rounded-xl p-3 mb-4 text-center">
                <p className="text-sm text-aura-mint-dark font-medium">
                  +{postRating - preRating} к индексу управления состоянием
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={goToDiary}
                className="flex-1 py-4 bg-gray-100 text-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                В дневник
              </button>
              <button
                onClick={handlePostRatingSubmit}
                className="flex-1 py-4 bg-gradient-to-r from-aura-mint to-aura-mint-dark text-white font-semibold rounded-xl"
              >
                Готово
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-scale-in text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-aura-lavender to-aura-lavender-dark flex items-center justify-center">
              <span className="text-4xl">{showAchievement.icon}</span>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2">{showAchievement.title}</h3>
            <p className="text-sm text-foreground-muted mb-6">{showAchievement.description}</p>

            <div className="flex items-center justify-center gap-2 text-xs text-foreground-muted mb-4">
              <Brain size={14} />
              <span>Нейробиологическое обоснование</span>
            </div>

            <button
              onClick={() => {
                hapticFeedback('light');
                setShowAchievement(null);
              }}
              className="w-full py-4 bg-gradient-to-r from-aura-lavender to-aura-lavender-dark text-white font-semibold rounded-xl"
            >
              Принять результат
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
