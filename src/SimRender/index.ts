import { CanvasAndContext } from '../CanvasHelpers';
import { BallState, Circle } from '../Physics';
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

export const renderLines = (ball: BallState, { canvas, context }: CanvasAndContext): void => {
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

export const renderBall = (ball: BallState, { canvas, context }: CanvasAndContext): void => {
  const scale = calcScale(ball, canvas);
  const yPix = canvas.height - scale * ball.p.y;

  context.beginPath();
  context.arc(canvas.width * 0.1, yPix, ball.r * scale, 0, 2 * Math.PI);
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
  const xPix = canvas.width * 0.1 + (circle.p.x - ball.p.x) * scale;

  return xPix > -circle.r * scale
    ? circle
    : randomCircle((canvas.width * 0.9) / scale + circle.r + ball.p.x);
};

export const renderCircle = (ball: BallState, { canvas, context }: CanvasAndContext) => (
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
