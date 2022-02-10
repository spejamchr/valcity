import { observer } from 'mobx-react';
import * as React from 'react';
import { canvasAndContextFromRef } from '../../CanvasHelpers';
import { addSimulationEventListeners, removeSimulationEventListeners } from './CreateStore';
import SimulationStore from './Store';

interface Props {
  store: SimulationStore;
}

const Simulation: React.FC<Props> = ({ store }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    canvasAndContextFromRef(ref).do(({ canvas, context }) => {
      store.setCanvasAndContext({ canvas, context });
      addSimulationEventListeners(canvas);

      const render = (time: number) => {
        store.updateTime(time);
        store.runSystems();

        const requestId = requestAnimationFrame(render);

        return () => {
          cancelAnimationFrame(requestId);
          removeSimulationEventListeners(canvas);
        };
      };

      return render(performance.now());
    });
  });

  return (
    <canvas
      ref={ref}
      style={{ width: '100vw', height: '100vh' }}
      role="img"
      aria-label="Physics simulation of bouncing balls"
    />
  );
};

export default observer(Simulation);
