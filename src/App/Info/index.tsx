import { observer } from 'mobx-react';
import { styled, theme } from '../../stitches.config';

const Info = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: theme.colors.base01,
  fontFamily: 'sans-serif',
  margin: 10,
  color: theme.colors.base05,
  paddingX: 30,
  paddingY: 10,
});

export default observer(Info);
