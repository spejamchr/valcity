import { observer } from 'mobx-react';
import * as React from 'react';
import { styled, theme } from '../../stitches.config';

interface Props {}

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

const ShowHide = styled('button', {
  margin: '5px',
  backgroundColor: theme.colors.base01,
  border: 'none',
  color: theme.colors.base05,
  textAlign: 'left',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  cursor: 'pointer',
});

const Children = styled('div', {
  paddingLeft: '5px',
  marginLeft: '0.5em',
  borderLeft: `3px solid ${theme.colors.base07}`,
});

interface Props {
  title: string;
}

const ClickToShow: React.FC<Props> = ({ title, children }) => {
  const [show, setShow] = React.useState(false);

  if (show) {
    return (
      <Container>
        <ShowHide onClick={() => setShow(false)}>{title} ▲</ShowHide>
        <Children>{children}</Children>
      </Container>
    );
  } else {
    return (
      <Container>
        <ShowHide onClick={() => setShow(true)}>{title} ▼</ShowHide>
        <Children css={{ display: 'none' }}>{children}</Children>
      </Container>
    );
  }
};

export default observer(ClickToShow);
