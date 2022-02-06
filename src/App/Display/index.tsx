import { observer } from 'mobx-react';
import * as React from 'react';
import Info from '../Info';
import SimulationStore from '../Simulation/Store';

interface Props {
  simulationStore: SimulationStore;
}

const Display: React.FC<Props> = ({ simulationStore }) => (
  <Info>
    <dl>
      <dt>Start At</dt>
      <dd>{Math.round(simulationStore.contextVars.frameStartAt / 1000)}</dd>
      <dt>minX - maxX</dt>
      <dd>
        {Math.round(simulationStore.minEntityX)} - {Math.round(simulationStore.maxEntityX)}
      </dd>
      <dt>minY - maxY</dt>
      <dd>
        {Math.round(simulationStore.minEntityY)} - {Math.round(simulationStore.maxEntityY)}
      </dd>
      <dt>scale</dt>
      <dd>{simulationStore.scale.map(Math.round).map(String).getOrElseValue('N/A')}</dd>
      <dt>FPS</dt>
      <dd>{Math.round(1 / simulationStore.contextVars.dt)}</dd>
    </dl>
  </Info>
);

export default observer(Display);
