import { Maybe } from 'maybeasy';
import Vector from '../Vector';

export type SimKind =
  | 'static'
  | 'newtons-first-law'
  | 'gravity'
  | 'elastic-collision'
  | 'air-resistance'
  | 'inelastic-collision';

export interface Circle {
  r: number; // m
  p: Vector;
}

export interface Ball {
  r: number; // m
  d: number; // kg/m^3
  Cd: number; // Drag Coefficient, unitless
  COR: number; // Coefficient of Restitution (bounciness), unitless
}

export interface BallState extends Ball {
  p: Vector;
  v: Vector;
}

const g = new Vector(0, -9.8);

const ballMass = (ball: Readonly<BallState>): number => ((ball.d * 4) / 3) * Math.PI * ball.r ** 3;

const ballPotentialEnergy = (ball: Readonly<BallState>, gg: Vector): number =>
  gg.magnitude * ballMass(ball) * (ball.p.y - ball.r);

const ballKineticEnergy = (ball: Readonly<BallState>): number =>
  0.5 * ballMass(ball) * ball.v.magnitude ** 2;

const ballEnergy = (ball: Readonly<BallState>, gg: Vector): number =>
  ballPotentialEnergy(ball, gg) + ballKineticEnergy(ball);

export const calcNewPosVel = (
  ball: Readonly<BallState>,
  dt: number, // s
  spacePressed: Maybe<number>, // how long the space bar has been pressed, in s
  simKind: SimKind
): BallState => {
  const gg = spacePressed.map((sp) => g.times(10 * sp + 1)).getOrElseValue(g);
  switch (simKind) {
    case 'static': {
      return ball;
    }
    case 'newtons-first-law': {
      return {
        ...ball,
        v: ball.v,
        p: ball.p.plus(ball.v.times(dt)),
      };
    }
    case 'gravity': {
      return {
        ...ball,
        v: ball.v.plus(gg.times(dt)),
        p: ball.p.plus(ball.v.times(2).plus(gg.times(dt)).divideBy(2).times(dt)),
      };
    }
    case 'elastic-collision': {
      let newBallState: BallState = {
        ...ball,
        v: ball.v.plus(gg.times(dt)),
        p: ball.p.plus(ball.v.times(2).plus(gg.times(dt)).divideBy(2).times(dt)),
      };
      if (newBallState.p.y < ball.r) {
        const energy = ballEnergy(newBallState, gg);
        newBallState.p.y = 2 * ball.r - newBallState.p.y;
        const potentialEnergy = ballPotentialEnergy(newBallState, gg);
        const kineticEnergy = energy - potentialEnergy;
        const speed = Math.sqrt((2 * kineticEnergy) / ballMass(ball)) || 0.001;
        newBallState.v = newBallState.v.withMagnitude(speed);

        newBallState.v = newBallState.v.reflection(new Vector(0, 1));
      }
      return newBallState;
    }
    case 'air-resistance': {
      const airDensity = 1.2041; // at 20C https://en.wikipedia.org/wiki/Density_of_air
      const Fd = ball.v.exp(2).times(0.5 * airDensity * ball.Cd * Math.PI * ball.r ** 2);
      let newBallState: BallState = {
        ...ball,
        v: ball.v.plus(gg.times(dt)).minus(Fd.times(dt / ballMass(ball))),
        p: ball.p.plus(ball.v.times(2).plus(gg.times(dt)).divideBy(2).times(dt)),
      };
      if (newBallState.p.y < ball.r) {
        const energy = ballEnergy(newBallState, gg);
        newBallState.p.y = 2 * ball.r - newBallState.p.y;
        const potentialEnergy = ballPotentialEnergy(newBallState, gg);
        const kineticEnergy = energy - potentialEnergy;
        const speed = Math.sqrt((2 * kineticEnergy) / ballMass(ball)) || 0.001;
        newBallState.v = newBallState.v.withMagnitude(speed);

        newBallState.v = newBallState.v.reflection(new Vector(0, 1));
      }
      return newBallState;
    }
    case 'inelastic-collision': {
      const airDensity = 1.2041; // at 20C https://en.wikipedia.org/wiki/Density_of_air
      const Fd = ball.v.exp(2).times(0.5 * airDensity * ball.Cd * Math.PI * ball.r ** 2);
      let newBallState: BallState = {
        ...ball,
        v: ball.v.plus(gg.times(dt)).minus(Fd.times(dt / ballMass(ball))),
        p: ball.p.plus(ball.v.times(2).plus(gg.times(dt)).divideBy(2).times(dt)),
      };
      const conservedSpeed =
        ball.COR - 0.2 + 0.2 / (1 + Math.exp(0.13 * Math.abs(ball.v.magnitude) - 2));
      const momentumCost = 0.1; // m / s
      if (newBallState.p.y < ball.r) {
        const energy = ballEnergy(newBallState, gg);
        newBallState.p.y = ball.r + conservedSpeed * (ball.r - newBallState.p.y);
        const potentialEnergy = ballPotentialEnergy(newBallState, gg);
        const kineticEnergy = energy - potentialEnergy;
        const speed = Math.sqrt((2 * kineticEnergy) / ballMass(ball)) || 0.001;
        newBallState.v = newBallState.v.withMagnitude(speed);

        newBallState.v = newBallState.v
          .reflection(new Vector(0, 1))
          .times(conservedSpeed)
          .minusMagnitude(momentumCost);
      }
      return newBallState;
    }
  }
};

type BallType = 'basketball' | 'bowling-ball' | 'golf-ball' | 'ping-pong-ball';

const densityFromRadiusMass = (radius: number, mass: number): number =>
  mass / ((4 / 3) * Math.PI * radius ** 3);

const radiusMassToRadiusDensity = (radius: number, mass: number) => ({
  r: radius,
  d: densityFromRadiusMass(radius, mass),
});

export const makeBall = (type: BallType): Ball => {
  switch (type) {
    case 'basketball':
      return { ...radiusMassToRadiusDensity(0.76 / (2 * Math.PI), 0.6), Cd: 0.47, COR: 0.77 };
    case 'golf-ball':
      return { ...radiusMassToRadiusDensity(0.04267 / 2, 0.04593), Cd: 0.35, COR: 0.821 };
    case 'bowling-ball':
      return { ...radiusMassToRadiusDensity(0.2159 / 2, 7), Cd: 0.47, COR: 0.8 }; // Guessing the COR
    case 'ping-pong-ball':
      return { ...radiusMassToRadiusDensity(0.04 / 2, 0.0027), Cd: 0.47, COR: 0.905 };
  }
};

type Pair = [number, number];

export const makeBallState = (type: BallType, [vx, vy]: Pair, [px, py]: Pair): BallState => ({
  ...makeBall(type),
  v: new Vector(vx, vy),
  p: new Vector(px, py),
});
