import { just, Maybe, nothing } from 'maybeasy';
import { CanvasAndContext } from '../../CanvasHelpers';
import Vector from '../../Vector';
import SimulationStore from './Store';

export type FillStyle = CanvasRenderingContext2D['fillStyle'];

export interface RectangleShape {
  kind: 'rectangle-shape';
  height: number;
  width: number;
}

export interface CircleShape {
  kind: 'circle-shape';
  radius: number;
}

// The height of the ground at some horizontal distance from the position of the Ground
export type GroundFn = (x: number) => number;

export interface GroundShape {
  kind: 'ground-shape';
  max: number;
  fn: GroundFn;
}

export type Shape = CircleShape;

export const rectangleAppearance = (height: number, width: number): RectangleShape => ({
  kind: 'rectangle-shape',
  height,
  width,
});

export const circleShape = (radius: number): CircleShape => ({
  kind: 'circle-shape',
  radius,
});

export const groundAppearance = (max: number, fn: GroundFn): GroundShape => ({
  kind: 'ground-shape',
  max,
  fn,
});

export type Components = {
  position: Vector;
  shape: Shape;
  fillStyle: FillStyle;
  velocity: Vector;
  mass: number;
  dragCoefficient: number;
  restitutionCoefficient: number; // Bounciness
  trackPosition: null;
  name: string;
  persistent: null; // Persists through restarts
};

export type Entity = {
  [K in keyof Components]: Maybe<Components[K]>;
} & { id: number };

export type Internals = {
  startingPosition: Entity['position'];
  startingVelocity: Entity['velocity'];
};

export type EntityWithInternals = Entity & Internals;

export const entityWithInternals = (entity: Entity): EntityWithInternals => ({
  ...entity,
  startingPosition: entity.position,
  startingVelocity: entity.velocity,
});

export interface ContextVars {
  frameStartAt: number;
  dt: number;
  spacePressedAt: Maybe<number>;
  canvasAndContext: Maybe<CanvasAndContext>;
  running: Maybe<null>;
}

export const makeContextVars = (): ContextVars => ({
  frameStartAt: performance.now(),
  dt: 0.001,
  spacePressedAt: nothing(),
  canvasAndContext: nothing(),
  running: nothing(),
});

// A System runs any action with the whole store
export type System = (store: SimulationStore) => void;

export interface State {
  entities: ReadonlyArray<EntityWithInternals>;
  contextVars: ContextVars;
  systems: ReadonlyArray<System>;
}

export const makeState = (): State => ({
  entities: [],
  contextVars: makeContextVars(),
  systems: [],
});
