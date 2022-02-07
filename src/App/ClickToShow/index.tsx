import { observer } from 'mobx-react';
import * as React from 'react';
import { styled } from '../../stitches.config';

interface Props {}

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const ShowHide = styled('span', {
  alignSelf: 'flex-end',
  cursor: 'pointer',
  padding: '5px',
});

const Children = styled('div', {
  padding: '5px',
  paddingTop: 0,
  marginTop: '-5px',
  borderRight: '3px solid $base07',
});

interface Props {
  title: string;
}

const ClickToShow: React.FC<Props> = ({ title, children }) => {
  const [show, setShow] = React.useState(false);

  if (show) {
    return (
      <Container>
        <ShowHide onClick={() => setShow(false)}>{title} &#9650;</ShowHide>
        <Children>{children}</Children>
      </Container>
    );
  } else {
    return (
      <Container>
        <ShowHide onClick={() => setShow(true)}>{title} &#9660;</ShowHide>
      </Container>
    );
  }
};

export default observer(ClickToShow);
