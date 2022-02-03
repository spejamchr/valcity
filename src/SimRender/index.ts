import { just, Maybe, nothing } from 'maybeasy';
import { CanvasAndContext } from '../CanvasHelpers';
import { BallState, calcNewPosVel, Circle, SimKind } from '../Physics';
import { normalizingRandom } from '../RandomHelpers';
import Vector from '../Vector';

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

const ballPixelPosition = 400; // How many pixels from the left to position the ball

export const renderLines = (ball: BallState, { canvas, context }: CanvasAndContext): void => {
  const scale = calcScale(ball, canvas);
  const buffer = 10;
  const xLeft = Math.round(ball.p.x - ballPixelPosition / scale) - buffer;
  const xRight = Math.round(ball.p.x + (canvas.width * 0.9) / scale) + buffer;
  for (let xi = xLeft; xi <= xRight; xi++) {
    const xPix = ballPixelPosition + (xi - ball.p.x) * scale;
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

export const renderBall = (ball: BallState, { canvas, context }: CanvasAndContext): void => {
  const scale = calcScale(ball, canvas);
  const yPix = canvas.height - scale * ball.p.y;

  context.beginPath();
  context.arc(ballPixelPosition, yPix, ball.r * scale, 0, 2 * Math.PI);
  context.fillStyle = '#999999';
  context.fill();
};

export const randomCircle = (xOffset: number): Circle => ({
  r: normalizingRandom(4) * 0.05 + 0.2,
  p: new Vector(xOffset + Math.random() * 100, normalizingRandom(4) * 0.2 + 1.3),
});

export const moveCircle = (ball: BallState, canvas: HTMLCanvasElement) => (
  circle: Circle
): Circle => {
  const scale = calcScale(ball, canvas);
  const xPix = ballPixelPosition + (circle.p.x - ball.p.x) * scale;

  return xPix > -circle.r * scale
    ? circle
    : randomCircle((canvas.width * 0.9) / scale + circle.r + ball.p.x);
};

export const renderCircle = (ball: BallState, { canvas, context }: CanvasAndContext) => (
  circle: Circle
): void => {
  const scale = calcScale(ball, canvas);
  const yPix = canvas.height - scale * circle.p.y;
  const xPix = ballPixelPosition + (circle.p.x - ball.p.x) * scale;

  context.beginPath();
  context.arc(xPix, yPix, circle.r * scale, 0, 2 * Math.PI);
  context.fillStyle = '#666666';
  context.fill();
};

export type SimState = {
  ball: BallState;
  circles: Circle[];
  previousTime: number;
  spacePressedAt: Maybe<number>;
  simKind: SimKind;
};

export const recordSpacePressed = (simState: SimState) => (e: KeyboardEvent) => {
  if (e.key === ' ' && !e.repeat) simState.spacePressedAt = just(performance.now());
};

export const recordSpaceReleased = (simState: SimState) => (e: KeyboardEvent) => {
  if (e.key === ' ') simState.spacePressedAt = nothing();
};

export const renderSim = (
  time: number,
  state: Readonly<SimState>,
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
): SimState => {
  // Don't advance the animation too far at once -- big timesteps break the simulation
  const dt = Math.min((time - state.previousTime) / 1000, 1 / 30);
  const previousTime = time;

  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#333333';
  context.fill();

  const secondsSpacePressed = state.spacePressedAt.map((spa) => (time - spa) / 1000);
  const ball = calcNewPosVel(state.ball, dt, secondsSpacePressed, state.simKind);
  const circles = state.circles.map(moveCircle(ball, canvas));

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

  return { ...state, ball, circles, previousTime };
};
