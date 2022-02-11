import { observer } from 'mobx-react';
import * as React from 'react';
import Display from './Display';
import Simulation from './Simulation';
import { createStore } from './Simulation/CreateStore';
import ThemeStore from './ThemeStore';

interface Props {}

const App: React.FC<Props> = () => {
  const themeStore = new ThemeStore();
  const store = createStore(themeStore);

  return (
    <>
      <Simulation store={store} />
      <Display store={store} />
    </>
  );
};

export default observer(App);
