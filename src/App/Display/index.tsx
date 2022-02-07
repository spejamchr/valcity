import { just } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { filterMap } from '../../MaybeHelpers';
import { styled } from '../../stitches.config';
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

const Display: React.FC<Props> = ({ store }) => (
  <Info>
    <ClickToShow title="Controls">
      <button onClick={store.pause}>Pause</button>
      <button onClick={store.run}>run</button>
      <button onClick={store.restart}>Restart</button>
      </ClickToShow>
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
