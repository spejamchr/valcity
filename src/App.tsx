import { just, Maybe, nothing } from 'maybeasy';
import * as React from 'react';
import { canvasAndContextFromRef } from './CanvasHelpers';
import { calcNewPosVel, Circle, makeBallState } from './Physics';
import { moveCircle, randomCircle, renderBall, renderCircle, renderLines } from './SimRender';

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
