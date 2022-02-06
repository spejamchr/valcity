import { just, nothing } from 'maybeasy';
import { setCanvasScaling } from '../../CanvasHelpers';
import { physicsSystem } from '../../Physics';
import { normalizingRandom } from '../../RandomHelpers';
import { renderSystem } from '../../SimRender';
import Vector from '../../Vector';
import SimulationStore from './Store';
import { circleShape } from './Types';

export const createStore = (): SimulationStore => {
  const simulationStore = new SimulationStore();
  simulationStore.addEntity({
    position: just(new Vector(1, 1)),
    velocity: just(new Vector(20, 20)),
    shape: just(circleShape(0.76 / (2 * Math.PI))),
    fillStyle: just('#FF0000'),
    mass: just(0.6),
    dragCoefficient: just(0.47),
    restitutionCoefficient: just(0.77),
  });
  simulationStore.addEntity({
    position: just(new Vector(Math.random() * 100, normalizingRandom(4) * 0.2 + 1.3)),
    velocity: nothing(),
    shape: just(circleShape(normalizingRandom(4) * 0.05 + 0.2)),
    fillStyle: just('#0000FF'),
    mass: nothing(),
    dragCoefficient: nothing(),
    restitutionCoefficient: nothing(),
  });
  simulationStore.addSystem(physicsSystem);
  simulationStore.addSystem(renderSystem);

  return simulationStore;
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
