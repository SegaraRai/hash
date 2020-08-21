import { SystemTheme } from './theme';

let systemThemePreference: SystemTheme = null;

export function getCurrentSystemThemePreference(): SystemTheme {
  return systemThemePreference;
}

//

interface SystemThemeEventTarget extends EventTarget {
  addEventListener(
    type: 'change',
    listener: (ev: Event) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void;
}

export const systemThemePreferenceEventTarget = new EventTarget() as SystemThemeEventTarget;

//

if (typeof window.matchMedia === 'function') {
  const notifyChange = () => {
    systemThemePreferenceEventTarget.dispatchEvent(new Event('change'));
  };

  const preferences = ['dark', 'light'] as const;

  for (const preference of preferences) {
    const mediaQuery = window.matchMedia(
      `(prefers-color-scheme: ${preference})`
    );
    if (mediaQuery.matches) {
      systemThemePreference = preference;
    }

    const callback = (event) => {
      if (event.matches) {
        systemThemePreference = preference;
        notifyChange();
      }
    };

    mediaQuery.addEventListener('change', callback);

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        anyMediaQuery.removeEventListener('change', callback);
      });
    }
  }

  {
    const anyMediaQuery = window.matchMedia(
      preferences
        .map((preference) => `(prefers-color-scheme: ${preference})`)
        .join(', ')
    );

    const callback = (event) => {
      if (!event.matches) {
        systemThemePreference = null;
        notifyChange();
      }
    };

    anyMediaQuery.addEventListener('change', callback);

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        anyMediaQuery.removeEventListener('change', callback);
      });
    }
  }
}
