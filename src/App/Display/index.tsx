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
import ThemePicker from './ThemePicker';

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

const Themes = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
});

const Display: React.FC<Props> = ({ store }) => (
  <Info className={store.themeStore.theme}>
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
              fillStyle: just('base0B'),
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
    <ClickToShow title="Change Theme">
      <p>Dark</p>
      <Themes>
        {store.themeStore.options
          .filter(({ dark }) => dark)
          .map((option) => (
            <ThemePicker key={option.name} store={store} option={option} />
          ))}
      </Themes>
      <p>Light</p>
      <Themes>
        {store.themeStore.options
          .filter(({ dark }) => !dark)
          .map((option) => (
            <ThemePicker key={option.name} store={store} option={option} />
          ))}
      </Themes>
    </ClickToShow>
    <ClickToShow title="About">
      <p>
        Made by <a href="https://github.com/spejamchr">Spencer Christiansen</a>; code on{' '}
        <a href="https://github.com/spejamchr/valcity">GitHub</a>.
      </p>
      <p>For fun :)</p>
    </ClickToShow>
  </Info>
);

export default observer(Display);
