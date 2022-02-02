import { just, Maybe, nothing } from 'maybeasy';
import * as React from 'react';
import { CanvasAndContext, canvasAndContextFromRef } from './CanvasHelpers';
import { BallState, calcNewPosVel, Circle, makeBallState } from './Physics';
import { normalizingRandom } from './RandomHelpers';
import Vector from './Vector';

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

  return xPix > -circle.r * scale
    ? circle
    : randomCircle((canvas.width * 0.9) / scale + circle.r + ball.p.x);
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

const randomCircle = (xOffset: number): Circle => ({
  r: normalizingRandom(4) * 0.05 + 0.2,
  p: new Vector(xOffset + Math.random() * 100, normalizingRandom(4) * 0.2 + 1.3),
});

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

      let ball = makeBallState('basketball', [20, 20], [0, 1]);

      let circles: Circle[] = [...Array(20)].fill(0).map(randomCircle);

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
