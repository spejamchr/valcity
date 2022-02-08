import { when } from '@execonline-inc/maybe-adapter';
import { just, Maybe, nothing } from 'maybeasy';
import SimulationStore from '../App/Simulation/Store';
import { Entity, Shape, System } from '../App/Simulation/Types';
import Vector from '../Vector';

const g = new Vector(0, -9.8);

type HasPotentialEnergy = { mass: number; position: Vector; shape: Shape };

const entityPotentialEnergy = (entity: HasPotentialEnergy): number =>
  g.magnitude * entity.mass * (entity.position.y - entity.shape.radius);

type HasKineticEnergy = { mass: number; velocity: Vector };

const entityKineticEnergy = (entity: HasKineticEnergy): number =>
  0.5 * entity.mass * entity.velocity.magnitude ** 2;

const entityEnergy = (entity: HasPotentialEnergy & HasKineticEnergy) =>
  entityPotentialEnergy(entity) + entityKineticEnergy(entity);

export const newtonsFirstLaw = (entity: Entity, dt: number): Maybe<Entity> =>
  just({})
    .assign('position', entity.position)
    .assign('velocity', entity.velocity)
    .map(({ position, velocity }) => ({
      ...entity,
      position: just(position.plus(velocity.times(dt))),
    }));

export const gravity = (entity: Entity, dt: number): Maybe<Entity> =>
  just({})
    .assign('position', entity.position)
    .assign('velocity', entity.velocity)
    .map(({ position, velocity }) => ({
      ...entity,
      position: just(position.plus(g.times(dt ** 2).divideBy(2))),
      velocity: just(velocity.plus(g.times(dt))),
    }));

const flatInelasticCollision = (
  rc: number,
  position: Vector,
  velocity: Vector,
  shape: Shape
): Pick<Entity, 'position' | 'velocity'> => {
  // Reduce amount of conserved speed at higher speeds
  const conservedSpeed = rc - 0.2 + 0.2 / (1 + Math.exp(0.13 * Math.abs(velocity.magnitude) - 2));
  // TODO: Remove momentumCost? It reduces jittering when the ball is stopped.
  const momentumCost = 0.1; // m / s
  const energy = entityEnergy({ mass: 1, position, shape, velocity });
  position.y = shape.radius + conservedSpeed * (shape.radius - position.y);
  const potentialEnergy = entityPotentialEnergy({ mass: 1, position, shape });
  const kineticEnergy = energy - potentialEnergy;
  const speed = Math.sqrt(2 * kineticEnergy) || 0.001;
  velocity = velocity
    .withMagnitude(speed)
    .times(conservedSpeed)
    .minusMagnitude(momentumCost)
    .reflection(new Vector(0, 1));

  return {
    position: just(position),
    velocity: just(velocity),
  };
};

const flatElasticCollision = (
  position: Vector,
  velocity: Vector,
  shape: Shape
): Pick<Entity, 'position' | 'velocity'> => {
  const energy = entityEnergy({ mass: 1, position, shape, velocity });
  position.y = 2 * shape.radius - position.y;
  const potentialEnergy = entityPotentialEnergy({ mass: 1, position, shape });
  const kineticEnergy = energy - potentialEnergy;
  const speed = Math.sqrt(2 * kineticEnergy) || 0.001;
  velocity = velocity.withMagnitude(speed).reflection(new Vector(0, 1));

  return {
    position: just(position),
    velocity: just(velocity),
  };
};

export const flatCollision = (entity: Entity): Maybe<Entity> =>
  just({})
    .assign('position', entity.position)
    .assign('shape', entity.shape)
    .andThen((p) => when(p.position.y < p.shape.radius, p))
    .assign('velocity', entity.velocity)
    .map(({ position, velocity, shape }) =>
      entity.restitutionCoefficient
        .map((rc) => ({
          ...entity,
          ...flatInelasticCollision(rc, position, velocity, shape),
        }))
        .getOrElse(() => ({
          ...entity,
          ...flatElasticCollision(position, velocity, shape),
        }))
    );

export const airResistance = (entity: Entity, dt: number): Maybe<Entity> =>
  just({})
    .assign('velocity', entity.velocity)
    .assign('dragCoefficient', entity.dragCoefficient)
    .assign('shape', entity.shape)
    .assign('mass', entity.mass)
    .map(({ velocity, dragCoefficient, shape, mass }) => {
      const airDensity = 1.2041; // kg/m**3 at 20C https://en.wikipedia.org/wiki/Density_of_air
      const Fd = velocity
        .exp(2)
        .times(0.5 * airDensity * dragCoefficient * Math.PI * shape.radius ** 2);
      return {
        ...entity,
        velocity: just(velocity.minus(Fd.times(dt / mass))),
      };
    });

const addTrackingEntity = (store: SimulationStore, entity: Entity) =>
  store.addEntity({
    position: entity.position,
    shape: entity.shape,
    fillStyle: entity.fillStyle,
    velocity: nothing(),
    mass: nothing(),
    dragCoefficient: nothing(),
    restitutionCoefficient: nothing(),
    trackPosition: nothing(),
    name: nothing(),
    persistent: nothing(),
  });

export const physicsSystem: System = (store) => {
  store.contextVars.running.do(() => {
    store.entities.forEach((entity) =>
      entity.trackPosition.do(() => addTrackingEntity(store, entity))
    );

    store.withEntities((entity) => newtonsFirstLaw(entity, store.contextVars.dt));
    store.withEntities((entity) => gravity(entity, store.contextVars.dt));
    store.withEntities((entity) => flatCollision(entity));
    store.withEntities((entity) => airResistance(entity, store.contextVars.dt));
  });
};
