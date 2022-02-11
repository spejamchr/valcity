import { observer } from 'mobx-react';
import { styled, theme } from '../../stitches.config';

const topLeft = 0;
const margin = 10;
const paddingX = 30;
const paddingY = 10;
const borderWidth = 8;
const verticalSpace = topLeft + 2 * (margin + paddingY + borderWidth)

const Info = styled('div', {
  position: 'absolute',
  top: topLeft,
  left: topLeft,
  backgroundColor: theme.colors.base01,
  fontFamily: 'sans-serif',
  margin,
  color: theme.colors.base05,
  paddingX,
  paddingY,
  border: `solid ${theme.colors.base01} ${borderWidth}px`,
  maxHeight: `calc(100vh - ${verticalSpace}px)`,
  overflow: 'scroll',
  'a:link': { color: theme.colors.base0D },
  'a:visited': { color: theme.colors.base0E },
  'a:active': { color: theme.colors.base08 },
});

export default observer(Info);
