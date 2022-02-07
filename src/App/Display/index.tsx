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
  simulationStore: SimulationStore;
}

const SideBySide = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
});

const Display: React.FC<Props> = ({ simulationStore }) => (
  <Info>
    <ClickToShow title="State Info">
      {filterMap(
        (e: Entity) =>
          just({ id: e.id })
            .assign('name', e.name)
            .assign('color', e.fillStyle.map(String))
            .assign('position', e.position)
            .assign('velocity', e.velocity),
        simulationStore.entities
      ).map(({ id, name, color, position, velocity }) => (
        <ClickToShow key={id} title={name}>
          <SideBySide>
            <dl>
              <dt>Position</dt>
              <dd>
                ({Math.trunc(position.x)}, {Math.trunc(position.y)})
              </dd>
              <dt>Velocity</dt>
              <dd>
                ({Math.trunc(velocity.x)}, {Math.trunc(velocity.y)})
              </dd>
              <dt>Speed</dt>
              <dd>{Math.trunc(velocity.magnitude)}</dd>
            </dl>
            <span style={{ color, fontSize: 'xxx-large' }}>&#9679;</span>
          </SideBySide>
        </ClickToShow>
      ))}
    </ClickToShow>
  </Info>
);

export default observer(Display);
