import { describe, it, expect, beforeEach } from 'vitest';
import { getStats, saveQuizResults } from './quiz';
import type { ExtendedFeature } from '@/types/ol-feature';

const mockFeatures = (): ExtendedFeature[] => {
  const f = {
    get(key: string) {
      if (key === 'name_ru') return 'Тест';
      if (key === 'adm0_a3') return 'TST';
      if (key === 'guessed') return true;
      return undefined;
    },
    set() {},
  };
  return [f as unknown as ExtendedFeature];
};

describe('локальная статистика квиза', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getStats возвращает пустой массив изначально', () => {
    expect(getStats()).toEqual([]);
  });

  it('saveQuizResults добавляет запись в localStorage', () => {
    saveQuizResults(mockFeatures(), 1);
    const stats = getStats();
    expect(stats).toHaveLength(1);
    expect(stats[0].total).toBe(1);
    expect(stats[0].correct).toBe(1);
  });
});
