import { Ref, ref } from 'vue';
import {
  getCurrentSystemThemePreference,
  systemThemePreferenceEventTarget,
} from '../lib/systemTheme';
import type { SystemTheme } from '../lib/theme';

export const systemTheme: Ref<SystemTheme> = ref(null);

const updateSystemTheme = () => {
  systemTheme.value = getCurrentSystemThemePreference();
};

systemThemePreferenceEventTarget.addEventListener('change', updateSystemTheme);

updateSystemTheme();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    systemThemePreferenceEventTarget.removeEventListener(
      'change',
      updateSystemTheme
    );
  });
}
