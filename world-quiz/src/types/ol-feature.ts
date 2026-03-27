import type { Feature } from 'ol';

export interface ExtendedFeatureKeyMap {
  name: string;
  name_ru: string;
  used: boolean | undefined;
  country_index: number;
  adm0_a3: string;
  guessed?: boolean;
}

export interface ExtendedFeature extends Feature {
  get<K extends keyof ExtendedFeatureKeyMap>(key: K): ExtendedFeatureKeyMap[K];
  set(key: string, value: unknown): void;
}
