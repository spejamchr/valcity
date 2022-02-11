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
      //
      // https://github.com/chriskempson/base16-default-schemes/blob/master/default-dark.yaml
      scheme: 'Default Dark',
      author: 'Chris Kempson (http://chriskempson.com)',
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

// https://github.com/chriskempson/base16-default-schemes/blob/master/default-light.yaml
export const defaultLightTheme = createTheme({
  colors: {
    scheme: 'Default Light',
    author: 'Chris Kempson (http://chriskempson.com)',
    base00: '#f8f8f8',
    base01: '#e8e8e8',
    base02: '#d8d8d8',
    base03: '#b8b8b8',
    base04: '#585858',
    base05: '#383838',
    base06: '#282828',
    base07: '#181818',
    base08: '#ab4642',
    base09: '#dc9656',
    base0A: '#f7ca88',
    base0B: '#a1b56c',
    base0C: '#86c1b9',
    base0D: '#7cafc2',
    base0E: '#ba8baf',
    base0F: '#a16946',
  },
});

// https://github.com/chriskempson/base16-default-schemes/blob/master/eighties.yaml
export const eitghtiesTheme = createTheme({
  colors: {
    scheme: 'Eighties',
    author: 'Chris Kempson (http://chriskempson.com)',
    base00: '#2d2d2d',
    base01: '#393939',
    base02: '#515151',
    base03: '#747369',
    base04: '#a09f93',
    base05: '#d3d0c8',
    base06: '#e8e6df',
    base07: '#f2f0ec',
    base08: '#f2777a',
    base09: '#f99157',
    base0A: '#ffcc66',
    base0B: '#99cc99',
    base0C: '#66cccc',
    base0D: '#6699cc',
    base0E: '#cc99cc',
    base0F: '#d27b53',
  },
});

// https://github.com/chriskempson/base16-default-schemes/blob/master/mocha.yaml
export const mochaTheme = createTheme({
  colors: {
    scheme: 'Mocha',
    author: 'Chris Kempson (http://chriskempson.com)',
    base00: '#3B3228',
    base01: '#534636',
    base02: '#645240',
    base03: '#7e705a',
    base04: '#b8afad',
    base05: '#d0c8c6',
    base06: '#e9e1dd',
    base07: '#f5eeeb',
    base08: '#cb6077',
    base09: '#d28b71',
    base0A: '#f4bc87',
    base0B: '#beb55b',
    base0C: '#7bbda4',
    base0D: '#8ab3b5',
    base0E: '#a89bb9',
    base0F: '#bb9584',
  },
});

// https://github.com/chriskempson/base16-default-schemes/blob/master/ocean.yaml
export const oceanTheme = createTheme({
  colors: {
    scheme: 'Ocean',
    author: 'Chris Kempson (http://chriskempson.com)',
    base00: '#2b303b',
    base01: '#343d46',
    base02: '#4f5b66',
    base03: '#65737e',
    base04: '#a7adba',
    base05: '#c0c5ce',
    base06: '#dfe1e8',
    base07: '#eff1f5',
    base08: '#bf616a',
    base09: '#d08770',
    base0A: '#ebcb8b',
    base0B: '#a3be8c',
    base0C: '#96b5b4',
    base0D: '#8fa1b3',
    base0E: '#b48ead',
    base0F: '#ab7967',
  },
});

// https://github.com/chriskempson/base16-default-schemes/blob/master/ocean.yaml
export const cupcakeTheme = createTheme({
  colors: {
    scheme: 'Cupcake',
    author: 'Chris Kempson (http://chriskempson.com)',
    base00: '#fbf1f2',
    base01: '#f2f1f4',
    base02: '#d8d5dd',
    base03: '#bfb9c6',
    base04: '#a59daf',
    base05: '#8b8198',
    base06: '#72677E',
    base07: '#585062',
    base08: '#D57E85',
    base09: '#EBB790',
    base0A: '#DCB16C',
    base0B: '#A3B367',
    base0C: '#69A9A7',
    base0D: '#7297B9',
    base0E: '#BB99B4',
    base0F: '#BAA58C',
  },
});

// https://github.com/AuditeMarlow/base16-porple-scheme/blob/master/porple.yaml
// Copyright (c) 2017 Niek den Breeje, shared under the MIT license
export const porpleTheme = createTheme({
  colors: {
    scheme: 'Porple',
    author: 'Niek den Breeje (https://github.com/AuditeMarlow)',
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

// https://github.com/arzg/base16-solarized-scheme/blob/master/solarized-dark.yaml
export const solarizedDarkTheme = createTheme({
  colors: {
    scheme: 'Solarized Dark',
    author: 'Ethan Schoonover (modified by aramisgithub)',
    base00: '#002b36',
    base01: '#073642',
    base02: '#586e75',
    base03: '#657b83',
    base04: '#839496',
    base05: '#93a1a1',
    base06: '#eee8d5',
    base07: '#fdf6e3',
    base08: '#dc322f',
    base09: '#cb4b16',
    base0A: '#b58900',
    base0B: '#859900',
    base0C: '#2aa198',
    base0D: '#268bd2',
    base0E: '#6c71c4',
    base0F: '#d33682',
  },
});

// https://github.com/arzg/base16-solarized-scheme/blob/master/solarized-light.yaml
export const solarizedLightTheme = createTheme({
  colors: {
    scheme: 'Solarized Light',
    author: 'Ethan Schoonover (modified by aramisgithub)',
    base00: '#fdf6e3',
    base01: '#eee8d5',
    base02: '#93a1a1',
    base03: '#839496',
    base04: '#657b83',
    base05: '#586e75',
    base06: '#073642',
    base07: '#002b36',
    base08: '#dc322f',
    base09: '#cb4b16',
    base0A: '#b58900',
    base0B: '#859900',
    base0C: '#2aa198',
    base0D: '#268bd2',
    base0E: '#6c71c4',
    base0F: '#d33682',
  },
});
