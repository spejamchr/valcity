import { observer } from 'mobx-react';
import * as React from 'react';
import { canvasAndContextFromRef } from '../../CanvasHelpers';
import { addWindowEventListeners, removeWindowEventListeners } from './CreateStore';
import SimulationStore from './Store';

interface Props {
  simulationStore: SimulationStore;
}

const Simulation: React.FC<Props> = ({ simulationStore }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    canvasAndContextFromRef(ref).do(({ canvas, context }) => {
      simulationStore.setCanvasAndContext({ canvas, context });
      addWindowEventListeners(simulationStore, canvas);

      const render = (time: number) => {
        simulationStore.updateTime(time);

        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#333333';
        context.fill();

        simulationStore.runSystems();
        const requestId = requestAnimationFrame(render);
        return () => {
          cancelAnimationFrame(requestId);
          removeWindowEventListeners(simulationStore, canvas);
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
