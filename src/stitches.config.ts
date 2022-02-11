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
      // Use a base16 color scheme. See list of all schemes:
      // https://github.com/chriskempson/base16-schemes-source/blob/master/list.yaml
      //
      // Default Dark: https://github.com/chriskempson/base16-default-schemes
      base00: '#181818',
      base01: '#282828',
      base02: '#383838',
      base03: '#585858',
      base04: '#b8b8b8',
      base05: '#d8d8d8',
      base06: '#e8e8e8',
      base07: '#f8f8f8',
      base08: '#ab4642',
      base09: '#dc9656',
      base0A: '#f7ca88',
      base0B: '#a1b56c',
      base0C: '#86c1b9',
      base0D: '#7cafc2',
      base0E: '#ba8baf',
      base0F: '#a16946',
      //
      // Key:
      // base00 - Default Background
      // base01 - Lighter Background (Used for status bars, line number and folding marks)
      // base02 - Selection Background
      // base03 - Comments, Invisibles, Line Highlighting
      // base04 - Dark Foreground (Used for status bars)
      // base05 - Default Foreground, Caret, Delimiters, Operators
      // base06 - Light Foreground (Not often used)
      // base07 - Light Background (Not often used)
      // base08 - (Red) Variables, XML Tags, Markup Link Text, Markup Lists, Diff Deleted
      // base09 - (Orange) Integers, Boolean, Constants, XML Attributes, Markup Link Url
      // base0A - (Yellow) Classes, Markup Bold, Search Text Background
      // base0B - (Green) Strings, Inherited Class, Markup Code, Diff Inserted
      // base0C - (Cyan) Support, Regular Expressions, Escape Characters, Markup Quotes
      // base0D - (Blue) Functions, Methods, Attribute IDs, Headings
      // base0E - (Magenta) Keywords, Storage, Selector, Markup Italic, Diff Changed
      // base0F - (Brown) Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
    },
  },
  media: {},
  utils: {
    marginX: (value: number) => ({ marginLeft: value, marginRight: value }),
    marginY: (value: number) => ({ marginTop: value, marginBottom: value }),
    paddingX: (value: number) => ({ paddingLeft: value, paddingRight: value }),
    paddingY: (value: number) => ({ paddingTop: value, paddingBottom: value }),
  },
});

// Porple: https://github.com/AuditeMarlow/base16-porple-scheme
export const porpleTheme = createTheme({
  colors: {
      base00: '#292c36',
      base01: '#333344',
      base02: '#474160',
      base03: '#65568a',
      base04: '#b8b8b8',
      base05: '#d8d8d8',
      base06: '#e8e8e8',
      base07: '#f8f8f8',
      base08: '#f84547',
      base09: '#d28e5d',
      base0A: '#efa16b',
      base0B: '#95c76f',
      base0C: '#64878f',
      base0D: '#8485ce',
      base0E: '#b74989',
      base0F: '#986841',
  },
});
