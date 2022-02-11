import { just } from 'maybeasy';
import { System } from '../App/Simulation/Types';

const backgroundRenderSystem: System = (store) => {
  store.contextVars.canvasAndContext.do(({ canvas, context }) => {
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = store.themeStore.theme.colors.base00.value;
    context.fill();
  });
};

const traceRenderSystem: System = (store) => {
  just({})
    .assign('scale', store.scale)
    .assign('minViewX', store.minViewX)
    .assign('cc', store.contextVars.canvasAndContext)
    .do(({ scale, minViewX, cc: { canvas, context } }) => {
      const ids = store.state.traces.reduce(
        (ids: number[], trace) => (ids.indexOf(trace.id) === -1 ? ids.concat(trace.id) : ids),
        []
      );
      ids.forEach((id) => {
        store.state.traces
          .filter((trace) => trace.id === id)
          .forEach((trace, i, a) => {
            if (i + 1 < a.length) {
              const xPixStart = (trace.position.x - minViewX) * scale;
              const yPixStart = canvas.height - (trace.position.y - store.minViewY) * scale;
              const xPixEnd = (a[i + 1].position.x - minViewX) * scale;
              const yPixEnd = canvas.height - (a[i + 1].position.y - store.minViewY) * scale;

              context.beginPath();
              context.moveTo(xPixStart, yPixStart);
              context.lineTo(xPixEnd, yPixEnd);
              context.closePath();
              context.strokeStyle = store.themeStore.theme.colors[trace.fillStyle].value;
              context.stroke();
            }
          });
      });
    });
};

const velocityRenderSystem: System = (store) => {
  just({})
    .assign('scale', store.scale)
    .assign('minViewX', store.minViewX)
    .do(({ scale, minViewX }) =>
      store.entities.forEach((entity) =>
        just({})
          .assign('start', entity.position)
          .assign('velocity', entity.velocity)
          .assign('fillStyle', entity.fillStyle)
          .assign('canvasAndContext', store.contextVars.canvasAndContext)
          .do(({ start, velocity, fillStyle, canvasAndContext: { canvas, context } }) => {
            const point = start.plus(velocity.divideBy(10));
            const xPixStart = (start.x - minViewX) * scale;
            const yPixStart = canvas.height - (start.y - store.minViewY) * scale;
            const xPixPoint = (point.x - minViewX) * scale;
            const yPixPoint = canvas.height - (point.y - store.minViewY) * scale;

            context.beginPath();
            context.moveTo(xPixStart, yPixStart);
            context.lineTo(xPixPoint, yPixPoint);
            context.closePath();
            context.strokeStyle = store.themeStore.theme.colors[fillStyle].value;
            context.stroke();
          })
      )
    );
};

const entityRenderSystem: System = (store) => {
  just({})
    .assign('scale', store.scale)
    .assign('minViewX', store.minViewX)
    .do(({ scale, minViewX }) =>
      store.entities.forEach((entity) =>
        just({})
          .assign('position', entity.position)
          .assign('shape', entity.shape)
          .assign('fillStyle', entity.fillStyle)
          .assign('canvasAndContext', store.contextVars.canvasAndContext)
          .do(({ position, shape, fillStyle, canvasAndContext: { canvas, context } }) => {
            const xPix = (position.x - minViewX) * scale;
            const yPix = canvas.height - (position.y - store.minViewY) * scale;

            context.beginPath();
            context.arc(xPix, yPix, shape.radius * scale, 0, 2 * Math.PI);
            context.fillStyle = store.themeStore.theme.colors[fillStyle].value;
            context.fill();
          })
      )
    );
};

const lineRenderSystem: System = (store) => {
  just({})
    .assign('scale', store.scale)
    .assign('cc', store.contextVars.canvasAndContext)
    .assign('minViewX', store.minViewX)
    .assign('maxViewX', store.maxViewX)
    .do(({ scale, cc: { canvas, context }, minViewX, maxViewX }) => {
      const buffer = 20;

      const xLeft = Math.round(minViewX) - buffer;
      const xRight = Math.round(maxViewX) + buffer;
      for (let xi = xLeft; xi <= xRight; xi++) {
        const xPix = (xi - minViewX) * scale;
        const pxWidth = calcLineWidth(xi) * scale;
        context.fillStyle = store.themeStore.theme.colors.base03.value;
        context.fillRect(xPix - pxWidth / 2, 0, pxWidth, canvas.height);
      }

      const xTop = Math.round(canvas.height / scale) + buffer;
      for (let yi = 1; yi <= xTop; yi++) {
        const yPix = canvas.height - yi * scale;
        const pxHeight = calcLineWidth(yi) * scale;
        context.fillStyle = store.themeStore.theme.colors.base03.value;
        context.fillRect(0, yPix - pxHeight / 2, canvas.width, pxHeight);
      }
    });
};

const calcLineWidth = (i: number): number => {
  if (i === 0) return 0.005 * 3 ** 3;

  let eTry = 1;
  while (i % 5 ** eTry === 0) eTry++;
  return 0.005 * 3 ** (eTry - 1);
};

export const renderSystem: System = (store) => {
  backgroundRenderSystem(store);
  lineRenderSystem(store);
  traceRenderSystem(store);
  velocityRenderSystem(store);
  entityRenderSystem(store);
};
