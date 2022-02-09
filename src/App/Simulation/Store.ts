import { mapMaybe } from '@execonline-inc/collections';
import { just, Maybe, nothing } from 'maybeasy';
import { action, computed, observable } from 'mobx';
import { CanvasAndContext } from '../../CanvasHelpers';
import fullyAnnotatedObservable from '../../FullyAnnotatedObservable';
import {
  Components,
  ContextVars,
  Entity,
  entityWithInternals,
  makeState,
  State,
  System,
  Trace,
} from './Types';

class SimulationStore {
  public state: State;
  constructor() {
    this.state = makeState();

    fullyAnnotatedObservable<SimulationStore>(this, {
      state: observable,
      addEntity: action,
      addSystem: action,
      addTrace: action,
      runSystems: action,
      withEntities: action,
      filterEntities: action,
      recordSpacePressed: action,
      recordSpaceReleased: action,
      updateTime: action,
      setCanvasAndContext: action,
      pause: action,
      run: action,
      restart: action,
      updateEntity: action,
      entities: computed,
      contextVars: computed,
      minEntityX: computed,
      maxEntityX: computed,
      minEntityY: computed,
      maxEntityY: computed,
      minViewX: computed,
      maxViewX: computed,
      minViewY: computed,
      maxViewY: computed,
      sideMarginPx: computed,
      scale: computed,
    });
  }

  addEntity = (entity: Omit<Entity, 'id'>): void => {
    const id = this.state.entities.reduce((maxId, { id }) => (id > maxId ? id : maxId), 0) + 1;
    this.state.entities = [...this.state.entities, entityWithInternals({ ...entity, id })];
  };

  addSystem = (system: System): void => {
    this.state.systems = [...this.state.systems, system];
  };

  addTrace = (trace: Trace): void => {
    this.state.traces.push(trace)
  }

  runSystems = (): void => {
    this.state.systems.forEach((system) => system(this));
  };

  withEntities = (fn: (entity: Entity) => Entity | void | Maybe<Entity>): void => {
    this.state.entities = this.state.entities.map((entity) => {
      const temp = fn(entity);
      const ret = temp instanceof Maybe ? temp.getOrElseValue(entity) : temp || entity;
      return { ...entity, ...ret };
    });
  };

  filterEntities = (pred: (entity: Entity) => boolean): void => {
    this.state.entities = this.state.entities.filter(pred);
  };

  recordSpacePressed = (e: KeyboardEvent): void => {
    if (e.key === ' ' && !e.repeat) this.state.contextVars.spacePressedAt = just(performance.now());
  };

  recordSpaceReleased = (e: KeyboardEvent): void => {
    if (e.key === ' ') this.state.contextVars.spacePressedAt = nothing();
  };

  updateTime = (time: number): void => {
    // Don't advance the animation too far at once -- big timesteps break the simulation
    this.state.contextVars.dt = Math.min(
      (time - this.state.contextVars.frameStartAt) / 1000,
      1 / 30
    );
    this.state.contextVars.frameStartAt = time;
  };

  setCanvasAndContext = (canvasAndContext: CanvasAndContext): void => {
    this.state.contextVars.canvasAndContext = just(canvasAndContext);
  };

  pause = (): void => {
    this.state.contextVars.running = nothing();
  };

  run = (): void => {
    this.state.contextVars.running = just(null);
  };

  restart = (): void => {
    this.state.entities = mapMaybe(
      (e) =>
        e.persistent.map(() => ({
          ...e,
          position: e.startingPosition,
          velocity: e.startingVelocity,
        })),
      this.state.entities
    );
    this.state.traces = [];
  };

  updateEntity = (entityId: number, entity: Partial<Pick<Entity, keyof Components>>): void => {
    this.withEntities((e) => (e.id === entityId ? { ...e, ...entity } : e));
  };

  get entities(): ReadonlyArray<Entity> {
    return this.state.entities;
  }

  get contextVars(): Readonly<ContextVars> {
    return this.state.contextVars;
  }

  get minEntityX(): number {
    return this.entities.reduce(
      (min, entity) => entity.position.map((a) => (a.x < min ? a.x : min)).getOrElseValue(min),
      Number.POSITIVE_INFINITY
    );
  }

  get maxEntityX(): number {
    return this.entities.reduce(
      (max, entity) => entity.position.map((a) => (a.x > max ? a.x : max)).getOrElseValue(max),
      Number.NEGATIVE_INFINITY
    );
  }

  get maxEntityY(): number {
    return this.entities.reduce(
      (max, entity) => entity.position.map((a) => (a.y > max ? a.y : max)).getOrElseValue(max),
      Number.NEGATIVE_INFINITY
    );
  }

  get minEntityY(): number {
    return this.entities.reduce(
      (min, entity) => entity.position.map((a) => (a.y < min ? a.y : min)).getOrElseValue(min),
      Number.POSITIVE_INFINITY
    );
  }

  get minViewX(): Maybe<number> {
    return this.scale.map((scale) => this.minEntityX - this.sideMarginPx / scale);
  }

  get maxViewX(): Maybe<number> {
    return this.scale.map((scale) => this.maxEntityX + this.sideMarginPx / scale);
  }

  get minViewY(): number {
    return 0;
  }

  get maxViewY(): Maybe<number> {
    return just({})
      .assign('scale', this.scale)
      .assign('cc', this.contextVars.canvasAndContext)
      .map(({ scale, cc: { canvas } }) => this.maxEntityY + (canvas.height * 0.1) / scale);
  }

  private heightScale = (canvas: HTMLCanvasElement): number => {
    const height = this.maxEntityY - this.minViewY;

    const maxPxHeight = canvas.height * 0.9;
    const yPix = (2 * maxPxHeight) / (1 + Math.exp((500 * height) / maxPxHeight));
    return (maxPxHeight - yPix) / height;
  };

  private widthScale = (canvas: HTMLCanvasElement): number => {
    const width = this.maxEntityX - this.minEntityX;

    return (canvas.width - 2 * this.sideMarginPx) / width;
  };

  get sideMarginPx(): number {
    return 100;
  }

  get scale(): Maybe<number> {
    return this.contextVars.canvasAndContext.map(({ canvas }) =>
      Math.min(this.heightScale(canvas), this.widthScale(canvas))
    );
  }
}

export default SimulationStore;
