import { observer } from 'mobx-react';
import * as React from 'react';
import { canvasAndContextFromRef, setCanvasScaling } from '../../CanvasHelpers';
import { recordSpacePressed, recordSpaceReleased, renderSim, SimState } from '../../SimRender';

interface Props {
  simState: SimState;
}

const Simulation: React.FC<Props> = ({ simState }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    canvasAndContextFromRef(ref).do(({ canvas, context }) => {
      window.addEventListener('resize', () => setCanvasScaling(canvas), true);

      window.onkeydown = recordSpacePressed(simState);
      window.onkeyup = recordSpaceReleased(simState);

      const render = (time: number) => {
        simState = renderSim(time, simState, canvas, context);
        const requestId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(requestId);
      };

      return render(performance.now());
    });
  });

  return <canvas ref={ref} style={{ width: '100vw', height: '100vh' }} />;
};

export default observer(Simulation);
