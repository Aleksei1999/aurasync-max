'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock, Clock, Sparkles } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useMax } from '@/components/MaxProvider';
import { courses, Course, calculateNeuroStatus } from '@/lib/courses';

interface CourseProgress {
  completedSessions: string[];
  currentSession?: string;
  lastPosition?: number;
}

export default function LibraryPage() {
  const router = useRouter();
  const { hapticFeedback } = useMax();
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    // Load course progress from localStorage
    const savedProgress = localStorage.getItem('aura_course_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    // Calculate total practice days
    const streak = localStorage.getItem('aura_streak');
    if (streak) {
      const streakData = JSON.parse(streak);
      setTotalDays(streakData.count || 0);
    }
  }, []);

  const handleCourseClick = (course: Course) => {
    hapticFeedback('light');
    router.push(`/library/${course.id}`);
  };

  const getCourseProgress = (courseId: string): number => {
    const courseProgress = progress[courseId];
    if (!courseProgress?.completedSessions) return 0;
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    return Math.round((courseProgress.completedSessions.length / course.sessions.length) * 100);
  };

  const neuroStatus = calculateNeuroStatus(totalDays);

  return (
    <div className="min-h-screen bg-background pb-tab-bar">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 safe-area-top">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
          >
            <ChevronLeft size={20} className="text-aura-slate" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Библиотека практик</h1>
            <p className="text-sm text-foreground-muted">Точечные решения для трансформации</p>
          </div>
        </div>

        {/* Neuro-status banner */}
        <div className="bg-gradient-to-r from-aura-lavender to-aura-lavender-light rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-aura-lavender-dark" />
                <span className="text-sm font-medium text-aura-lavender-dark">Уровень {neuroStatus.level}</span>
              </div>
              <h3 className="font-semibold text-foreground">{neuroStatus.name}</h3>
              <p className="text-xs text-foreground-muted mt-1">{neuroStatus.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{totalDays}</div>
              <div className="text-xs text-foreground-muted">дней практики</div>
            </div>
          </div>
        </div>
      </header>

      {/* Course Grid */}
      <main className="px-5 py-2">
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => {
            const progressPercent = getCourseProgress(course.id);
            const isStarted = progressPercent > 0;

            return (
              <button
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="bg-white rounded-2xl p-4 shadow-sm text-left transition-transform active:scale-[0.98]"
              >
                <div className="flex gap-4">
                  {/* Course icon */}
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${course.gradientFrom} 0%, ${course.gradientTo} 100%)`,
                    }}
                  >
                    <span className="text-2xl">{course.icon}</span>
                  </div>

                  {/* Course info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                      {isStarted ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-aura-mint-light text-aura-mint-dark flex-shrink-0">
                          {progressPercent}%
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-aura-peach-light text-aura-peach-dark flex-shrink-0">
                          Новый
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground-muted mb-2 line-clamp-1">{course.problem}</p>

                    <div className="flex items-center gap-3 text-xs text-foreground-muted">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Lock size={12} />
                        <span>2 бесплатно</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {isStarted && (
                      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${progressPercent}%`,
                            background: `linear-gradient(90deg, ${course.gradientFrom}, ${course.gradientTo})`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Outcome preview */}
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-foreground-muted">
                    <span className="font-medium text-foreground">Результат:</span> {course.outcome}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <Navigation />
    </div>
  );
}
