import { observer } from 'mobx-react';
import * as React from 'react';
import { Control } from '.';
import SimulationStore from '../Simulation/Store';
import { ThemeName, ThemeOption } from '../ThemeStore/Types';

interface Props {
  store: SimulationStore;
  option: ThemeOption;
}

const setTheme = (store: SimulationStore, name: ThemeName) => () => store.themeStore.setTheme(name);

const ThemePicker: React.FC<Props> = ({ store, option: { name } }) => (
  <Control
    css={{height: 40}}
    key={name}
    onClick={setTheme(store, name)}
    onMouseEnter={setTheme(store, name)}
    onMouseLeave={store.themeStore.revert}
  >
    {name}
  </Control>
);

export default observer(ThemePicker);
