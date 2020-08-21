import { watch, reactive } from 'vue';
import { usePreferenceStore } from '../stores/preference';
import { preferenceKey } from './config';

const reactivePreferenceStore = reactive(usePreferenceStore());

// save preferences to localStorage if it's changed
watch(
  reactivePreferenceStore,
  () => {
    localStorage?.setItem(
      preferenceKey,
      JSON.stringify(reactivePreferenceStore)
    );
  },
  {
    deep: true,
    immediate: true,
  }
);
