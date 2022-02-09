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

const Span = styled('button', {
  height: 0,
  width: 0,
  padding: 0,
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  border: 'solid 9px',
  borderRadius: 9,
  boxShadow: `0 0 0 7px ${theme.colors.base00}`,
  margin: 7,
  cursor: 'pointer',
});

const innerContainerSize = 84;
const containerPadding = 7;
const containerBorder = 3;
const containerSize = innerContainerSize + 2 * (containerPadding + containerBorder);

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

const Row = styled('span', {
  display: 'flex',
  justifyContent: 'space-between',
});

type Token =
  | typeof theme.colors.base08
  | typeof theme.colors.base09
  | typeof theme.colors.base0A
  | typeof theme.colors.base0B
  | typeof theme.colors.base0C
  | typeof theme.colors.base0D
  | typeof theme.colors.base0E
  | typeof theme.colors.base0F;

const FillStylePicker: React.FC<Props> = ({ fillStyle, store, entityId }) => {
  const [show, setShow] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);

  const hiding = () => setShow(false);
  const showing = () => setShow(true);

  const Picker: React.FC<{ color: Token | string; main?: boolean }> = ({ color, main }) => (
    <Span
      aria-label="Pick color"
      tabIndex={0}
      css={{
        borderColor: color,
        margin: 5,
        ...(main ? { boxShadow: `0 0 0 7px ${theme.colors.base02}`, zIndex:1 } : {}),
      }}
      onClick={() => {
        hiding();
        store.updateEntity(entityId, {
          fillStyle: just(typeof color === 'string' ? color : color.value),
        });
      }}
    />
  );

  const anchor = (
    <Span
      ref={ref}
      aria-label="Change item's color"
      css={{ borderColor: fillStyle.toString(), float: 'right' }}
      onClick={showing}
    />
  );

  if (show && ref.current) {
    const rect = ref.current.getBoundingClientRect();
    return (
      <>
        {anchor}
        <Container
          css={{ left: rect.left - containerSize / 2 - 1, top: rect.top - containerSize / 2 - 1 }}
        >
          <Row>
            <Picker color={theme.colors.base08} />
            <Picker color={theme.colors.base09} />
            <Picker color={theme.colors.base0A} />
          </Row>
          <Row>
            <Picker color={theme.colors.base0F} />
            <Picker main color={fillStyle.toString()} />
            <Picker color={theme.colors.base0B} />
          </Row>
          <Row>
            <Picker color={theme.colors.base0E} />
            <Picker color={theme.colors.base0D} />
            <Picker color={theme.colors.base0C} />
          </Row>
        </Container>
      </>
    );
  } else {
    return anchor;
  }
};

export default observer(FillStylePicker);
