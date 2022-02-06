import { observer } from 'mobx-react';
import * as React from 'react';
import Display from './Display';
import Simulation from './Simulation';
import { createStore } from './Simulation/CreateStore';

interface Props {}

const App: React.FC<Props> = () => {
  const simulationStore = createStore();

  return (
    <>
      <Simulation simulationStore={simulationStore} />
      <Display simulationStore={simulationStore} />
    </>
  );
};

export default observer(App);
