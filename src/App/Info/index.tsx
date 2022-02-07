import { observer } from 'mobx-react';
import { styled } from '../../stitches.config';

const Info = styled('div', {
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: '$base01',
  fontFamily: 'sans-serif',
  margin: 10,
  color: '$base05',
  paddingX: 30,
  paddingY: 10,
});

export default observer(Info);
