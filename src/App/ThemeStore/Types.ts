import {
  cupcakeTheme,
  defaultLightTheme,
  eitghtiesTheme,
  mochaTheme,
  oceanTheme,
  porpleTheme,
  solarizedDarkTheme,
  solarizedLightTheme,
  theme,
} from '../../stitches.config';

export type Theme = typeof theme;

const themeOptions = [
  { name: 'Cupcake', theme: cupcakeTheme, dark: false },
  { name: 'Default Dark', theme: theme, dark: true },
  { name: 'Default Light', theme: defaultLightTheme, dark: false },
  { name: 'Eighties', theme: eitghtiesTheme, dark: true },
  { name: 'Mocha', theme: mochaTheme, dark: true },
  { name: 'Ocean', theme: oceanTheme, dark: true },
  { name: 'Porple', theme: porpleTheme, dark: true },
  { name: 'Solarized Dark', theme: solarizedDarkTheme, dark: true },
  { name: 'Solarized Light', theme: solarizedLightTheme, dark: false },
] as const;

export type Options = typeof themeOptions;

export type ThemeOption = Options[number];

export type ThemeName = ThemeOption['name'];

export interface NamedTheme {
  name: ThemeName;
  theme: Theme;
}

export interface State extends NamedTheme {
  options: Options;
  previousName: ThemeName;
}

export const makeState = (): State => ({
  ...themeOptions.filter(({dark}) => dark)[0],
  options: themeOptions,
  previousName: 'Default Dark',
});
