import { porpleTheme, theme } from '../../stitches.config';

export type Theme = typeof theme;

export const themeOptions = [
  { name: 'Default Dark', theme: theme },
  { name: 'Porple', theme: porpleTheme },
] as const;

export type Options = typeof themeOptions;

export type ThemeName = Options[number]['name']

export interface NamedTheme {
  name: ThemeName;
  theme: Theme;
}

export interface State extends NamedTheme {
  options: Options;
}

export const makeState = (): State => ({ ...themeOptions[0], options: themeOptions });
