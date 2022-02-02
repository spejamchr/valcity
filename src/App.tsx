import { just, Maybe, nothing } from 'maybeasy';
import React from 'react';
import { CanvasAndContext, canvasAndContextFromRef } from './CanvasHelpers';
import Vector from './Vector';

interface Circle {
  r: number; // m
  p: Vector;
}

interface Ball {
  r: number; // m
  d: number; // kg/m^3
  Cd: number; // Drag Coefficient, unitless
  COR: number; // Coefficient of Restitution (bounciness), unitless
}

interface BallState extends Ball {
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

const calcNewPosVel = (
  ball: Readonly<BallState>,
  dt: number, // s
  spacePressed: Maybe<number>, // how long the space bar has been pressed, in s
  physics: Physics
): BallState => {
  const gg = spacePressed.map((sp) => g.times(10 * sp + 1)).getOrElseValue(g);
  switch (physics) {
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

const calcScale = (ball: BallState, canvas: HTMLCanvasElement): number => {
  const maxPxHeight = canvas.height * 0.9; //+ Math.random() * 10 + Math.random() * Math.random() * 6 //canvas.height - ball.r * 4;
  const yPix = (2 * maxPxHeight) / (1 + Math.exp((500 * ball.p.y) / maxPxHeight));
  const scale = (maxPxHeight - yPix) / ball.p.y;
  return scale;
};

const calcLineWidth = (i: number): number => {
  if (i === 0) return 0.005 * 3 ** 3;

  let eTry = 1;
  while (i % 5 ** eTry === 0) eTry++;
  return 0.005 * 3 ** (eTry - 1);
};

const renderLines = (ball: BallState, { canvas, context }: CanvasAndContext): void => {
  const scale = calcScale(ball, canvas);
  const buffer = 10;
  const xLeft = Math.round(ball.p.x - (canvas.width * 0.1) / scale) - buffer;
  const xRight = Math.round(ball.p.x + (canvas.width * 0.9) / scale) + buffer;
  for (let xi = xLeft; xi <= xRight; xi++) {
    const xPix = canvas.width * 0.1 + (xi - ball.p.x) * scale;
    const pxWidth = calcLineWidth(xi) * scale;
    context.fillStyle = '#000000';
    context.fillRect(xPix - pxWidth / 2, 0, pxWidth, canvas.height);
  }
  const xTop = Math.round(canvas.height / scale) + buffer;
  for (let yi = 1; yi <= xTop; yi++) {
    const yPix = canvas.height - scale * yi;
    const pxHeight = calcLineWidth(yi) * scale;
    context.fillStyle = '#000000';
    context.fillRect(0, yPix - pxHeight / 2, canvas.width, pxHeight);
  }
};

const renderBall = (ball: BallState, { canvas, context }: CanvasAndContext): void => {
  const scale = calcScale(ball, canvas);
  const yPix = canvas.height - scale * ball.p.y;

  context.beginPath();
  context.arc(canvas.width * 0.1, yPix, ball.r * scale, 0, 2 * Math.PI);
  context.fillStyle = '#999999';
  context.fill();
};

const moveCircle = (ball: BallState, canvas: HTMLCanvasElement) => (circle: Circle): Circle => {
  const scale = calcScale(ball, canvas);
  const xPix = canvas.width * 0.1 + (circle.p.x - ball.p.x) * scale;

  return xPix > -circle.r * scale ? circle : rc((canvas.width * 0.9) / scale + circle.r + ball.p.x);
};

const renderCircle = (ball: BallState, { canvas, context }: CanvasAndContext) => (
  circle: Circle
): void => {
  const scale = calcScale(ball, canvas);
  const yPix = canvas.height - scale * circle.p.y;
  const xPix = canvas.width * 0.1 + (circle.p.x - ball.p.x) * scale;

  context.beginPath();
  context.arc(xPix, yPix, circle.r * scale, 0, 2 * Math.PI);
  context.fillStyle = '#666666';
  context.fill();
};

const nr = () => [...Array(4)].map(Math.random).reduce((a, n) => a + n) / 4;

const rc = (xOffset: number): Circle => ({
  r: nr() * 0.05 + 0.2,
  p: new Vector(xOffset + Math.random() * 100, nr() * 0.2 + 1.3),
});

export const ballString = (ball: BallState): string =>
  `// <Ball r: ${ball.r}, d: ${ball.d}, p: ${ball.p}, v: ${ball.v} >`;

type BallType = 'basketball' | 'bowling-ball' | 'golf-ball' | 'ping-pong-ball';

const densityFromRadiusMass = (radius: number, mass: number): number =>
  mass / ((4 / 3) * Math.PI * radius ** 3);

const radiusMassToRadiusDensity = (radius: number, mass: number) => ({
  r: radius,
  d: densityFromRadiusMass(radius, mass),
});

const makeBall = (type: BallType): Ball => {
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

export type Physics =
  | 'static'
  | 'newtons-first-law'
  | 'gravity'
  | 'elastic-collision'
  | 'air-resistance'
  | 'inelastic-collision';

interface Props {
  physics: Physics;
}

const App: React.FC<Props> = ({ physics }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    canvasAndContextFromRef(ref).do(({ canvas, context }) => {
      let requestId: Maybe<number> = nothing();
      let spacePressedAt: Maybe<number> = nothing();
      window.onkeydown = (e) => {
        if (e.key === ' ' && !e.repeat) spacePressedAt = just(performance.now());
      };
      window.onkeyup = (e) => {
        if (e.key === ' ') spacePressedAt = nothing();
      };

      let ball: BallState = {
        ...makeBall('basketball'),
        v: new Vector(20, 20),
        p: new Vector(0, 1),
      };

      let circles: Circle[] = [...Array(20)].fill(0).map(rc);

      let previousTime = performance.now();
      const render = (time: number) => {
        // Don't advance the animation too far at once -- big timesteps break the simulation
        const dt = Math.min((time - previousTime) / 1000, 1 / 30);

        previousTime = time;
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#333333';
        context.fill();

        const secondsSpacePressed = spacePressedAt.map((spa) => (time - spa) / 1000);
        ball = calcNewPosVel(ball, dt, secondsSpacePressed, physics);
        circles = circles.map(moveCircle(ball, canvas));

        renderLines(ball, { canvas, context });
        circles.forEach(renderCircle(ball, { canvas, context }));
        renderBall(ball, { canvas, context });

        context.font = '30px sans-serif';
        context.fillText(`dist (m): ${Math.trunc(ball.p.x)}`, 100, 100);
        context.fillText(`height (m): ${Math.trunc(ball.p.y)}`, 100, 130);
        context.fillText(`speed (m/s): ${Math.trunc(ball.v.magnitude)}`, 100, 160);
        context.fillText(`vx (m/s): ${Math.trunc(ball.v.x)}`, 100, 190);
        context.fillText(`vy (m/s): ${Math.trunc(ball.v.y)}`, 100, 220);
        context.fillText(`framerate (fps): ${Math.round(1 / dt)}`, 100, 250);

        requestId = just(requestAnimationFrame(render));
      };

      render(performance.now());

      return () => requestId.do(cancelAnimationFrame);
    });
  });

  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />;
};

export default App;
