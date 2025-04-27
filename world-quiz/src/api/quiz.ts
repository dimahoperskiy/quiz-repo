import { config } from '@/config';
import { ExtendedFeature } from '@components/InteractiveMap';

export type Answer = {
  question: string;
  userAnswer: string;
  correct: boolean;
};

export type QuizStat = {
  _id: string;
  userId: string;
  total: number;
  correct: number;
  answers: Answer[];
  createdAt: string;
};

export const submitQuizResults = async (
  features: ExtendedFeature[],
  countriesCount: number,
): Promise<boolean> => {
  const token = localStorage.getItem('quiz-token');

  const results = features
    .filter((feature: ExtendedFeature) => feature.get('guessed') !== undefined)
    .map((feature: ExtendedFeature) => ({
      question: feature.get('name_ru'),
      userAnswer: feature.get('guessed') ? feature.get('adm0_a3') : '—',
      correct: feature.get('guessed'),
    }));

  // уборка
  features.forEach((feature) => feature.set('guessed', undefined));

  const correct = results.filter((r) => r.correct).length;

  const res = await fetch(`${config.quizServiceUrl}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ total: countriesCount, correct, answers: results }),
  });

  return res.ok;
};

export const getStats = async (): Promise<QuizStat[] | null> => {
  const token = localStorage.getItem('quiz-token');
  if (!token) return null;

  const res = await fetch(`${config.quizServiceUrl}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;

  return (await res.json()) as QuizStat[];
};
