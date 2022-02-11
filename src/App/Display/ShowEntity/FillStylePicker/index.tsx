import { just } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { styled, theme } from '../../../../stitches.config';
import SimulationStore from '../../../Simulation/Store';
import { FillStyle } from '../../../Simulation/Types';

interface Props {
  fillStyle: FillStyle;
  store: SimulationStore;
  entityId: number;
}

const spanBorder = 9;

const Span = styled('button', {
  height: 0,
  width: 0,
  padding: 0,
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  border: `solid ${spanBorder}px`,
  borderRadius: spanBorder,
  boxShadow: `0 0 0 7px ${theme.colors.base00}`,
  margin: 7,
  cursor: 'pointer',
});

const innerContainerSize = 84;
const containerPadding = 7;
const containerBorder = 3;
const containerSize = innerContainerSize + 2 * (containerPadding + containerBorder);
const containerOffset = containerSize / 2 + spanBorder;

const Container = styled('span', {
  display: 'flex',
  position: 'absolute',
  height: innerContainerSize,
  width: innerContainerSize,
  flexDirection: 'column',
  justifyContent: 'space-between',
  float: 'right',
  backgroundColor: theme.colors.base00,
  border: `${theme.colors.base02} solid ${containerBorder}px`,
  padding: containerPadding,
  borderRadius: 10,
});

const Blocker = styled('div', {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#00000055',
});

const Row = styled('span', {
  display: 'flex',
  justifyContent: 'space-between',
});

const FillStylePicker: React.FC<Props> = ({ fillStyle, store, entityId }) => {
  const [show, setShow] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);

  const hiding = () => setShow(false);
  const showing = () => setShow(true);

  const Picker: React.FC<{ fillStyle: FillStyle; main?: boolean }> = ({ fillStyle, main }) => (
    <Span
      aria-label="Pick color"
      tabIndex={0}
      css={{
        borderColor: theme.colors[fillStyle],
        margin: 5,
        ...(main ? { boxShadow: `0 0 0 7px ${theme.colors.base02}`, zIndex: 1 } : {}),
      }}
      onClick={() => {
        hiding();
        store.updateEntity(entityId, {
          fillStyle: just(fillStyle),
        });
      }}
    />
  );

  const anchor = (
    <Span
      ref={ref}
      aria-label="Change item's color"
      css={{ borderColor: theme.colors[fillStyle], float: 'right', marginRight: 40 }}
      onClick={showing}
    />
  );

  if (show && ref.current) {
    const rect = ref.current.getBoundingClientRect();
    return (
      <>
        {anchor}
        <Blocker onClick={hiding} />
        <Container css={{ left: rect.left - containerOffset, top: rect.top - containerOffset }}>
          <Row>
            <Picker fillStyle="base08" />
            <Picker fillStyle="base09" />
            <Picker fillStyle="base0A" />
          </Row>
          <Row>
            <Picker fillStyle="base0F" />
            <Picker main fillStyle={fillStyle} />
            <Picker fillStyle="base0B" />
          </Row>
          <Row>
            <Picker fillStyle="base0E" />
            <Picker fillStyle="base0D" />
            <Picker fillStyle="base0C" />
          </Row>
        </Container>
      </>
    );
  } else {
    return anchor;
  }
};

export default observer(FillStylePicker);
