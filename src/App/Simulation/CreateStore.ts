import { just, nothing } from 'maybeasy';
import { setCanvasScaling } from '../../CanvasHelpers';
import { physicsSystem } from '../../Physics';
import { renderSystem } from '../../SimRender';
import { theme } from '../../stitches.config';
import Vector from '../../Vector';
import SimulationStore from './Store';
import { circleShape } from './Types';

export const createStore = (): SimulationStore => {
  const store = new SimulationStore();

  store.addEntity({
    position: just(new Vector(0.0, 0)),
    velocity: nothing(),
    shape: just(circleShape(0.01)),
    fillStyle: just(theme.colors.base01.value),
    mass: nothing(),
    dragCoefficient: nothing(),
    restitutionCoefficient: nothing(),
    trackPosition: nothing(),
    name: nothing(),
    persistent: just(null),
  });

  store.addEntity({
    position: just(new Vector(0.0, 1)),
    velocity: just(new Vector(5, 5)),
    shape: just(circleShape(0.76 / (2 * Math.PI))),
    fillStyle: just(theme.colors.base08.value),
    mass: just(0.6),
    dragCoefficient: nothing(),
    restitutionCoefficient: just(0.77),
    trackPosition: nothing(),
    name: just('Realistic Bouncing'),
    persistent: just(null),
  });

  store.addEntity({
    position: just(new Vector(0.1, 1)),
    velocity: just(new Vector(5, 5)),
    shape: just(circleShape(0.76 / (2 * Math.PI))),
    fillStyle: just(theme.colors.base0D.value),
    mass: just(0.6),
    dragCoefficient: just(0.47),
    restitutionCoefficient: nothing(),
    trackPosition: nothing(),
    name: just('Realistic Drag'),
    persistent: just(null),
  });

  store.addEntity({
    position: just(new Vector(0.2, 1)),
    velocity: just(new Vector(5, 5)),
    shape: just(circleShape(0.76 / (2 * Math.PI))),
    fillStyle: just(theme.colors.base0B.value),
    mass: just(0.6),
    dragCoefficient: just(0.47),
    restitutionCoefficient: just(0.77),
    trackPosition: nothing(),
    name: just('Realistic Bouncing & Drag'),
    persistent: just(null),
  });

  store.addSystem(physicsSystem);
  store.addSystem(renderSystem);

  return store;
};

export const addWindowEventListeners = (
  store: SimulationStore,
  canvas: HTMLCanvasElement
): void => {
  window.addEventListener('resize', () => setCanvasScaling(canvas), true);
  window.addEventListener('keydown', store.recordSpacePressed, true);
  window.addEventListener('keyup', store.recordSpaceReleased, true);
};

export const removeWindowEventListeners = (
  store: SimulationStore,
  canvas: HTMLCanvasElement
): void => {
  window.removeEventListener('resize', () => setCanvasScaling(canvas), true);
  window.removeEventListener('keydown', store.recordSpacePressed, true);
  window.removeEventListener('keyup', store.recordSpaceReleased, true);
};
