import { just, nothing } from 'maybeasy';
import { setCanvasScaling } from '../../CanvasHelpers';
import { physicsSystem } from '../../Physics';
import { renderSystem } from '../../SimRender';
import Vector from '../../Vector';
import ThemeStore from '../ThemeStore';
import SimulationStore from './Store';

export const createStore = (themeStore: ThemeStore): SimulationStore => {
  const store = new SimulationStore(themeStore);

  store.addEntity({
    position: just(new Vector(0.0, 0.12)),
    velocity: nothing(),
    shape: nothing(),
    fillStyle: nothing(),
    mass: nothing(),
    dragCoefficient: nothing(),
    restitutionCoefficient: nothing(),
    trackPosition: nothing(),
    name: nothing(),
    persistent: just(null),
  });

  store.addSystem(physicsSystem);
  store.addSystem(renderSystem);

  return store;
};

export const addSimulationEventListeners = (canvas: HTMLCanvasElement): void => {
  window.addEventListener('resize', () => setCanvasScaling(canvas), true);
};

export const removeSimulationEventListeners = (canvas: HTMLCanvasElement): void => {
  window.removeEventListener('resize', () => setCanvasScaling(canvas), true);
};
