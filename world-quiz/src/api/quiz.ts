import { ExtendedFeature } from '@/types/ol-feature';

const STORAGE_KEY = 'world-quiz-stats';

export type Answer = {
  question: string;
  userAnswer: string;
  correct: boolean;
};

export type QuizStat = {
  id: string;
  total: number;
  correct: number;
  answers: Answer[];
  createdAt: string;
};

export const getStats = (): QuizStat[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuizStat[];
  } catch {
    return [];
  }
};

export const saveQuizResults = (
  features: ExtendedFeature[],
  countriesCount: number,
): boolean => {
  const results = features
    .filter((feature: ExtendedFeature) => feature.get('guessed') !== undefined)
    .map((feature: ExtendedFeature) => ({
      question: feature.get('name_ru'),
      userAnswer: feature.get('guessed') ? feature.get('adm0_a3') : '—',
      correct: Boolean(feature.get('guessed')),
    }));

  features.forEach((feature) => feature.set('guessed', undefined));

  const correct = results.filter((r) => r.correct).length;

  const entry: QuizStat = {
    id: crypto.randomUUID(),
    total: countriesCount,
    correct,
    answers: results,
    createdAt: new Date().toISOString(),
  };

  const prev = getStats();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev]));
  return true;
};
