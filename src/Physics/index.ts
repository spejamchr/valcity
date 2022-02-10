import { when } from '@execonline-inc/maybe-adapter';
import { just, Maybe } from 'maybeasy';
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

const flatElasticCollision = (
  position: Vector,
  velocity: Vector,
  shape: Shape
): Pick<Entity, 'position' | 'velocity'> => {
  const energy = entityEnergy({ mass: 1, position, shape, velocity });
  position = position.withY(shape.radius);
  const potentialEnergy = entityPotentialEnergy({ mass: 1, position, shape });
  const kineticEnergy = energy - potentialEnergy;
  const speedsqrd = 2 * kineticEnergy || 0.00001;
  const velocityY = Math.sqrt(Math.max(speedsqrd - velocity.x ** 2, 0));
  velocity = velocity.withY(velocityY);

  return {
    position: just(position),
    velocity: just(velocity),
  };
};

const applyRestitutionCoefficient = (entity: Entity, initVelocity: Vector): Entity =>
  just({})
    .assign('v', entity.velocity)
    .assign('rc', entity.restitutionCoefficient)
    .map(({ v, rc }) => {
      const conservedSpeed =
        rc - 0.2 + 0.2 / (1 + Math.exp(0.13 * Math.abs(initVelocity.magnitude) - 2));
      const velocity: Maybe<Vector> = just(v.times(conservedSpeed));
      return { ...entity, velocity };
    })
    .getOrElseValue(entity);

export const flatCollision = (entity: Entity): Maybe<Entity> =>
  just({})
    .assign('position', entity.position)
    .assign('shape', entity.shape)
    .andThen((p) => when(p.position.y < p.shape.radius, p))
    .assign('velocity', entity.velocity)
    .map(({ position, velocity, shape }) => {
      const afterCollision = { ...entity, ...flatElasticCollision(position, velocity, shape) };
      return applyRestitutionCoefficient(afterCollision, velocity);
    });

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
  just({id: entity.id})
    .assign('position', entity.position)
    .assign('fillStyle', entity.fillStyle)
    .do(store.addTrace);

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
