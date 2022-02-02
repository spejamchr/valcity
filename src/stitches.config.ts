import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      gray400: 'gainsboro',
      gray500: 'lightgray',
    },
  },
  media: {},
  utils: {
    marginX: (value: number) => ({ marginLeft: value, marginRight: value }),
    marginY: (value: number) => ({ marginTope: value, marginBottom: value }),
    paddingX: (value: number) => ({ paddingLeft: value, paddingRight: value }),
    paddingY: (value: number) => ({ paddingTope: value, paddingBottom: value }),
  },
});
