import { watchEffect } from 'vue';
import { usePreferenceStore } from '../stores/preference';
import { systemTheme } from '../stores/theme';
import { resolveTheme } from './theme';

const preferenceStore = usePreferenceStore();

watchEffect(() => {
  const isDark = resolveTheme(preferenceStore.theme.value, systemTheme.value);
  document.documentElement.classList.toggle('theme--dark', isDark);
  document.documentElement.classList.toggle('theme--light', !isDark);
});
