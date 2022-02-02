import { nothing } from 'maybeasy';
import * as React from 'react';
import { canvasAndContextFromRef, setCanvasScaling } from '../../CanvasHelpers';
import { makeBallState, SimKind } from '../../Physics';
import {
  randomCircle,
  recordSpacePressed,
  recordSpaceReleased,
  renderSim,
  SimState,
} from '../../SimRender';

interface Props {
  simKind: SimKind;
}

const App: React.FC<Props> = ({ simKind }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    canvasAndContextFromRef(ref).do((canvasAndContext) => {
      window.addEventListener('resize', () => setCanvasScaling(canvasAndContext.canvas), true);

      let simState: SimState = {
        ...canvasAndContext,
        ball: makeBallState('basketball', [20, 20], [0, 1]),
        circles: [...Array(20)].fill(0).map(randomCircle),
        previousTime: performance.now(),
        spacePressedAt: nothing(),
        simKind,
      };

      window.onkeydown = recordSpacePressed(simState);
      window.onkeyup = recordSpaceReleased(simState);

      const render = (time: number) => {
        simState = renderSim(time, simState);
        const requestId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(requestId);
      };

      return render(performance.now());
    });
  });

  return <canvas ref={ref} style={{ width: '100vw', height: '100vh' }} />;
};

export default App;
