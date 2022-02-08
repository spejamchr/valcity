import { mapMaybe } from '@execonline-inc/collections';
import { observer } from 'mobx-react';
import * as React from 'react';
import { styled, theme } from '../../stitches.config';
import ClickToShow from '../ClickToShow';
import Info from '../Info';
import SimulationStore from '../Simulation/Store';
import { Entity } from '../Simulation/Types';
import ShowEntity from './ShowEntity';

interface Props {
  store: SimulationStore;
}

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
      {mapMaybe((e: Entity) => e.name.map(() => e), store.entities).map((e) => (
        <ShowEntity key={e.id} entityId={e.id} store={store} />
      ))}
    </ClickToShow>
  </Info>
);

export default observer(Display);
