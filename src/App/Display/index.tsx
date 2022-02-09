import { mapMaybe } from '@execonline-inc/collections';
import { just, nothing } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { styled, theme } from '../../stitches.config';
import Vector from '../../Vector';
import ClickToShow from '../ClickToShow';
import Info from '../Info';
import SimulationStore from '../Simulation/Store';
import { circleShape, Entity } from '../Simulation/Types';
import ShowEntity from './ShowEntity';

interface Props {
  store: SimulationStore;
}

export const Control = styled('button', {
  margin: '5px',
  width: '5em',
  backgroundColor: theme.colors.base02,
  border: 'none',
  color: theme.colors.base04,
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  cursor: 'pointer',
});

const Display: React.FC<Props> = ({ store }) => (
  <Info>
    {store.contextVars.running
      .map(() => <Control onClick={store.pause}>Pause</Control>)
      .getOrElse(() => (
        <Control onClick={store.run}>Run</Control>
      ))}
    <Control onClick={store.restart}>Restart</Control>
    <ClickToShow title="State Info">
      <>
        {mapMaybe((e: Entity) => e.name.map(() => e), store.entities).map((e) => (
          <ShowEntity key={e.id} entityId={e.id} store={store} />
        ))}
        <Control
          onClick={() =>
            store.addEntity({
              position: just(new Vector(0, 0.121)),
              name: just('New Item'),
              velocity: just(new Vector(15, 15)),
              mass: just(0.6),
              shape: just(circleShape(0.121)),
              fillStyle: just(theme.colors.base0B.value),
              dragCoefficient: nothing(),
              restitutionCoefficient: nothing(),
              trackPosition: nothing(),
              persistent: just(null),
            })
          }
        >
          Add
        </Control>
      </>
    </ClickToShow>
    <ClickToShow title="About">
      <p>
        Made by <a href="https://github.com/spejamchr">Spencer Christiansen</a> on{' '}
        <a href="https://github.com/spejamchr/valcity">GitHub</a>.
      </p>
      <p>For fun :)</p>
    </ClickToShow>
  </Info>
);

export default observer(Display);
