import { just } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { filterMap } from '../../MaybeHelpers';
import { styled, theme } from '../../stitches.config';
import ClickToShow from '../ClickToShow';
import Info from '../Info';
import SimulationStore from '../Simulation/Store';
import { Entity } from '../Simulation/Types';

interface Props {
  store: SimulationStore;
}

const SideBySide = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
});

const Control = styled('button', {
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
      {filterMap(
        (e: Entity) =>
          just({ id: e.id })
            .assign('name', e.name)
            .assign('color', e.fillStyle.map(String))
            .assign('position', e.position)
            .assign('velocity', e.velocity),
        store.entities
      ).map(({ id, name, color, position, velocity }) => (
        <ClickToShow key={id} title={name}>
          <SideBySide>
            <div>
              <p>
                Position: ({Math.trunc(position.x)}, {Math.trunc(position.y)})
              </p>
              <p>
                Velocity: ({Math.trunc(velocity.x)}, {Math.trunc(velocity.y)})
              </p>
              <p>Speed: {Math.trunc(velocity.magnitude)}</p>
            </div>
            <span style={{ color, fontSize: 'x-large' }}>⬤</span>
          </SideBySide>
        </ClickToShow>
      ))}
    </ClickToShow>
  </Info>
);

export default observer(Display);
