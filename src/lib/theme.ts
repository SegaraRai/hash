export type SystemTheme = 'dark' | 'light' | null;
export type Theme = 'dark' | 'light' | 'auto';

export function resolveTheme(theme: Theme, systemTheme: SystemTheme): boolean {
  if (theme === 'auto') {
    theme = systemTheme || 'light';
  }
  return theme === 'dark';
}
