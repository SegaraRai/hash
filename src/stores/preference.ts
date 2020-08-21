import { ToRefs, reactive, toRefs } from 'vue';
import { preferenceKey } from '../lib/config';
import type { DigestAlgorithm } from '../lib/hash';
import type { Theme } from '../lib/theme';

export interface Preference {
  version: number;
  algorithm: DigestAlgorithm;
  upperCase: boolean;
  theme: Theme;
}

const defaultPreference: Preference = {
  version: 2,
  algorithm: 'SHA-256',
  upperCase: false,
  theme: 'auto',
};

const preference = reactive({
  ...defaultPreference,
});

// load preference from LocalStorage
try {
  const savedPreference = JSON.parse(
    localStorage.getItem(preferenceKey)
  ) as Preference;
  if (savedPreference?.version !== defaultPreference.version) {
    throw 0;
  }
  Object.assign(preference, savedPreference);
} catch (_error) {}

export function usePreferenceStore(): ToRefs<Preference> {
  return toRefs(preference);
}
