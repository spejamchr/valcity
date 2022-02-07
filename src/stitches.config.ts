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
      // Porple: https://github.com/AuditeMarlow/base16-porple-scheme
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
      //
      // Atelier cave: https://github.com/atelierbram/base16-atelier-schemes
      // base00: '#19171c',
      // base01: '#26232a',
      // base02: '#585260',
      // base03: '#655f6d',
      // base04: '#7e7887',
      // base05: '#8b8792',
      // base06: '#e2dfe7',
      // base07: '#efecf4',
      // base08: '#be4678',
      // base09: '#aa573c',
      // base0A: '#a06e3b',
      // base0B: '#2a9292',
      // base0C: '#398bc6',
      // base0D: '#576ddb',
      // base0E: '#955ae7',
      // base0F: '#bf40bf',
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
      // base09 - Integers, Boolean, Constants, XML Attributes, Markup Link Url
      // base0A - (Yellow) Classes, Markup Bold, Search Text Background
      // base0B - (Green) Strings, Inherited Class, Markup Code, Diff Inserted
      // base0C - (Cyan) Support, Regular Expressions, Escape Characters, Markup Quotes
      // base0D - (Blue) Functions, Methods, Attribute IDs, Headings
      // base0E - (Magenta) Keywords, Storage, Selector, Markup Italic, Diff Changed
      // base0F - Deprecated, Opening/Closing Embedded Language Tags, e.g. <?php ?>
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
