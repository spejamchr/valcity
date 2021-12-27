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

interface Circle {
  r: number; // m
  ph: number; // m
  pv: number; // m
}

interface BallState extends Circle {
  d: number; // kg/m^2 -- The ball is 2D, so density here is mass per area
  vh: number; // m/s
  vv: number; // m/s
}

const g = -9.8;

const calcNewPosVel = (
  ball: BallState,
  dt: number, // s
  canvas: HTMLCanvasElement
): BallState => {
  let newBallState: BallState = {
    ...ball,
    vh: ball.vh,
    vv: ball.vv + g * dt,
    ph: ball.ph + ball.vh * dt,
    pv: ball.pv + ((ball.vv + ball.vv + g * dt) / 2) * dt,
  };
  const conservedSpeed = 0.8; // percent
  const momentumCost = 1; // m / s
  if (newBallState.pv < ball.r) {
    newBallState.pv = ball.r + conservedSpeed * (ball.r - newBallState.pv);
    newBallState.vv = -newBallState.vv * conservedSpeed;
    newBallState.vv = Math.max(newBallState.vv - momentumCost, 0);
    newBallState.vh = newBallState.vh * 0.95;
  }
  return newBallState;
};

const calcScale = (ball: BallState, canvas: HTMLCanvasElement): number => {
  const maxPxHeight = canvas.height * 0.9; //+ Math.random() * 10 + Math.random() * Math.random() * 6 //canvas.height - ball.r * 4;
  const pv = (2 * maxPxHeight) / (1 + Math.exp((500 * ball.pv) / maxPxHeight));
  const scale = (maxPxHeight - pv) / ball.pv;
  return scale;
};

const renderBall = (ball: BallState, { canvas, context }: CanvasAndContext): void => {
  const scale = calcScale(ball, canvas);
  const pv = canvas.height - scale * ball.pv;

  context.beginPath();
  context.arc(canvas.width * 0.1, pv, ball.r * scale, 0, 2 * Math.PI);
  context.fillStyle = '#999999';
  context.fill();
};

const moveCircle = (ball: BallState, canvas: HTMLCanvasElement) => (circle: Circle): Circle => {
  const scale = calcScale(ball, canvas);
  const ph = canvas.width * 0.1 + (circle.ph - ball.ph) * scale;

  return ph > -circle.r * scale
    ? circle
    : { ...circle, ph: (canvas.width * 0.9) / scale + circle.r + ball.ph };
};

const renderCircle = (ball: BallState, { canvas, context }: CanvasAndContext) => (
  circle: Circle
): void => {
  const scale = calcScale(ball, canvas);
  const pv = canvas.height - scale * circle.pv;
  const ph = canvas.width * 0.1 + (circle.ph - ball.ph) * scale;

  context.beginPath();
  context.arc(ph, pv, circle.r * scale, 0, 2 * Math.PI);
  context.fillStyle = '#666666';
  context.fill();
};

const rc = (): Circle => ({
  r: Math.random(),
  ph: Math.random() * 800,
  pv: Math.random() * 20,
});

const App: React.FC = () => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    canvasAndContextFromRef(ref).do(({ canvas, context }) => {
      let requestId: Maybe<number> = nothing();

      let ball: BallState = {
        r: 0.3,
        d: 1,
        vh: 15,
        vv: 15,
        ph: 1,
        pv: 1,
      };

      let circles: Circle[] = [...Array(20)].map(rc);

      let previousTime = performance.now();
      const render = (time: number) => {
        const dt = (time - previousTime) / 1000;
        previousTime = time;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#333333';
        context.fill();

        circles = circles.map(moveCircle(ball, canvas));
        circles.forEach(renderCircle(ball, { canvas, context }));

        ball = calcNewPosVel(ball, dt, canvas);
        renderBall(ball, { canvas, context });

        const speed = Math.sqrt(ball.vv**2 + ball.vh**2)
        context.font = '30px sans-serif'
        context.fillText(`dist (m): ${Math.round(ball.ph)}`, 100, 100);
        context.fillText(`height (m): ${Math.round(ball.pv)}`, 100, 130);
        context.fillText(`speed (m/s): ${Math.round(speed)}`, 100, 160);
        context.fillText(`framerate (fps): ${Math.round(1/dt)}`, 100, 190);

        requestId = just(requestAnimationFrame(render));
      };

      render(performance.now());

      return () => requestId.do(cancelAnimationFrame);
    });
  });

  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />;
};

export default App;
