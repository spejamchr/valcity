import { nothing } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { makeBallState } from '../Physics';
import { randomCircle, SimState } from '../SimRender';
import Info from './Info';
import Simulation from './Simulation';

interface Props {}

const App: React.FC<Props> = () => {
  const simState: SimState = {
    ball: makeBallState('basketball', [20, 20], [0, 1]),
    circles: [...Array(20)].fill(0).map(randomCircle),
    previousTime: performance.now(),
    spacePressedAt: nothing(),
    simKind: 'inelastic-collision',
  };

  return (
    <>
      <Simulation simState={simState} />
      <Info>
        <p>Here's a paragraph</p>
      </Info>
    </>
  );
};

export default observer(App);
