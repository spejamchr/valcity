import { fromNullable, just, Maybe, nothing } from 'maybeasy';
import React from 'react';

interface CanvasAndContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

const canvasAndContextFromRef = (
  ref: React.RefObject<HTMLCanvasElement>
): Maybe<CanvasAndContext> =>
  fromNullable(ref.current)
    .do(setCanvasScaling)
    .map((canvas) => ({ canvas }))
    .assign('context', ({ canvas }) => fromNullable(canvas.getContext('2d')));

const scaleCanvasDimension = (canvas: HTMLCanvasElement, property: 'height' | 'width'): void => {
  const size = getComputedStyle(canvas).getPropertyValue(property).slice(0, -2);

  canvas[property] = Number(size) * window.devicePixelRatio;
  canvas.style[property] = `${size}px`;
};

const setCanvasScaling = (canvas: HTMLCanvasElement): void => {
  scaleCanvasDimension(canvas, 'height');
  scaleCanvasDimension(canvas, 'width');
};

class Vector {
  constructor(public x: number, public y: number) {}

  magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);

  normalized = (): Vector => this.divideBy(this.magnitude);

  plus = (other: Vector): Vector => new Vector(this.x + other.x, this.y + other.y);
  minus = (other: Vector): Vector => new Vector(this.x - other.x, this.y - other.y);
  dot = (other: Vector): number => this.x * other.x + this.y * other.y;

  reflection = (normal: Vector): Vector =>
    this.minus(normal.times((2 * this.dot(normal)) / normal.magnitude ** 2));

  times = (scalar: number): Vector => new Vector(this.x * scalar, this.y * scalar);
  divideBy = (scalar: number): Vector => new Vector(this.x / scalar, this.y / scalar);
  minusMagnitude = (scalar: number): Vector =>
    scalar > this.magnitude
      ? new Vector(0, 0)
      : this.times((this.magnitude - scalar) / this.magnitude);
  withMagnitude = (scalar: number): Vector => this.normalized().times(scalar);
  exp = (scalar: number): Vector =>
    this.magnitude === 0 ? this : this.withMagnitude(this.magnitude ** scalar);

  toString = (): string => `[${this.x}, ${this.y}]`;
}

interface Circle {
  r: number; // m
  p: Vector;
}

interface BallState extends Circle {
  d: number; // kg/m^3
  v: Vector;
}

const g = new Vector(0, -9.8);

const ballMass = (ball: Readonly<BallState>): number => ((ball.d * 4) / 3) * Math.PI * ball.r ** 3;

const ballPotentialEnergy = (ball: Readonly<BallState>): number =>
  g.magnitude * ballMass(ball) * (ball.p.y - ball.r);

const ballKineticEnergy = (ball: Readonly<BallState>): number =>
  0.5 * ballMass(ball) * ball.v.magnitude ** 2;

const ballEnergy = (ball: Readonly<BallState>): number =>
  ballPotentialEnergy(ball) + ballKineticEnergy(ball);

const calcNewPosVel = (
  ball: Readonly<BallState>,
  dt: number, // s
  spacePressed: Maybe<number> // how long the space bar has been pressed, in s
): BallState => {
  const gg = spacePressed.map((sp) => g.times(10 * sp + 1)).getOrElseValue(g);
  const airDensity = 1.2041; // at 20C https://en.wikipedia.org/wiki/Density_of_air
  const Cd = 0.47; // https://en.wikipedia.org/wiki/Drag_coefficient
  const Fd = ball.v.exp(2).times(0.5 * airDensity * Cd * Math.PI * ball.r ** 2);
  let newBallState: BallState = {
    ...ball,
    v: ball.v.plus(gg.times(dt)).minus(Fd.times(dt / ballMass(ball))),
    p: ball.p.plus(ball.v.times(2).plus(gg.times(dt)).divideBy(2).times(dt)),
  };
  const conservedSpeed = 0.8 + 0.2 / (1 + Math.exp(0.13 * Math.abs(ball.v.magnitude) - 2));
  const momentumCost = 0.1; // m / s
  if (newBallState.p.y < ball.r) {
    const energy = ballEnergy(newBallState);
    newBallState.p.y = ball.r + conservedSpeed * (ball.r - newBallState.p.y);
    const potentialEnergy = ballPotentialEnergy(newBallState);
    const kineticEnergy = energy - potentialEnergy;
    const speed = Math.sqrt((2 * kineticEnergy) / ballMass(ball)) || 0.001;
    newBallState.v = newBallState.v.withMagnitude(speed);

    newBallState.v = newBallState.v
      .reflection(new Vector(0, 1))
      .times(conservedSpeed)
      .minusMagnitude(momentumCost);
  }
  return newBallState;
};

const calcScale = (ball: BallState, canvas: HTMLCanvasElement): number => {
  const maxPxHeight = canvas.height * 0.9; //+ Math.random() * 10 + Math.random() * Math.random() * 6 //canvas.height - ball.r * 4;
  const yPix = (2 * maxPxHeight) / (1 + Math.exp((500 * ball.p.y) / maxPxHeight));
  const scale = (maxPxHeight - yPix) / ball.p.y;
  return scale;
};

const calcLineWidth = (i: number): number => {
  if (i === 0) return 0.005 * 3**3;

  let eTry = 1;
  for (eTry = 1; i % 5 ** eTry === 0; eTry++) {}
  return 0.005 * 3 ** (eTry - 1);
};

const renderLines = (ball: BallState, { canvas, context }: CanvasAndContext): void => {
  const scale = calcScale(ball, canvas);
  const buffer = 10
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

const App: React.FC = () => {
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
        r: 0.12,
        d: 83,
        v: new Vector(0, 0),
        p: new Vector(0, 2**12),
      };

      let circles: Circle[] = [...Array(20)].fill(0).map(rc);

      let previousTime = performance.now();
      const render = (time: number) => {
        const dt = (time - previousTime) / 1000;
        previousTime = time;
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#333333';
        context.fill();

        const spacePressed = spacePressedAt.map((spa) => (time - spa) / 1000);
        ball = calcNewPosVel(ball, dt, spacePressed);
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
